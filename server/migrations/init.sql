-- -- init.sql: creates tables for the event mgmt system

-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255),
--   email VARCHAR(255) UNIQUE,
--   password_hash TEXT,
--   role VARCHAR(20),
--   created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS events (
--   id SERIAL PRIMARY KEY,
--   title VARCHAR(255),
--   description TEXT,
--   date DATE,
--   start_time TIME,
--   end_time TIME,
--   venue VARCHAR(255),
--   status VARCHAR(50) DEFAULT 'scheduled',
--   created_by INT REFERENCES users(id),
--   created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS event_attendees (
--   id SERIAL PRIMARY KEY,
--   event_id INT REFERENCES events(id),
--   name VARCHAR(255),
--   email VARCHAR(255),
--   has_submitted BOOLEAN DEFAULT FALSE
-- );

-- CREATE TABLE IF NOT EXISTS speakers (
--   id SERIAL PRIMARY KEY,
--   event_id INT REFERENCES events(id),
--   name VARCHAR(255),
--   topic VARCHAR(255)
-- );

-- CREATE TABLE IF NOT EXISTS evaluation_forms (
--   id SERIAL PRIMARY KEY,
--   event_id INT REFERENCES events(id),
--   title VARCHAR(255),
--   is_locked BOOLEAN DEFAULT FALSE
-- );

-- CREATE TABLE IF NOT EXISTS evaluation_questions (
--   id SERIAL PRIMARY KEY,
--   form_id INT REFERENCES evaluation_forms(id),
--   question_text TEXT,
--   question_type VARCHAR(20),
--   order_index INT
-- );

-- CREATE TABLE IF NOT EXISTS evaluation_responses (
--   id SERIAL PRIMARY KEY,
--   event_id INT REFERENCES events(id),
--   attendee_id INT REFERENCES event_attendees(id),
--   submitted_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS evaluation_answers (
--   id SERIAL PRIMARY KEY,
--   response_id INT REFERENCES evaluation_responses(id),
--   question_id INT REFERENCES evaluation_questions(id),
--   answer TEXT
-- );

-- -- Speaker-specific forms
-- CREATE TABLE IF NOT EXISTS speaker_evaluation_forms (
--   id SERIAL PRIMARY KEY,
--   speaker_id INT REFERENCES speakers(id)
-- );

-- CREATE TABLE IF NOT EXISTS speaker_evaluation_questions (
--   id SERIAL PRIMARY KEY,
--   form_id INT REFERENCES speaker_evaluation_forms(id),
--   question_text TEXT,
--   question_type VARCHAR(20),
--   order_index INT
-- );

-- CREATE TABLE IF NOT EXISTS speaker_evaluation_responses (
--   id SERIAL PRIMARY KEY,
--   speaker_id INT REFERENCES speakers(id),
--   attendee_id INT REFERENCES event_attendees(id),
--   submitted_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS speaker_evaluation_answers (
--   id SERIAL PRIMARY KEY,
--   response_id INT REFERENCES speaker_evaluation_responses(id),
--   question_id INT REFERENCES speaker_evaluation_questions(id),
--   answer TEXT
-- );

-- fixed_schema.sql
-- Event Manager Database Schema — corrected for API compatibility
-- migration_full_compat.sql
-- Run this migration in a single transaction on your existing DB

BEGIN;

-- Ensure pgcrypto is available for hashing (optional)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create roles table if not exists
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- 2. Ensure employees table has password_hash and created_at
ALTER TABLE employees
  RENAME COLUMN IF EXISTS password TO password_hash;

ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. Ensure resource_speakers table exists (create if missing)
CREATE TABLE IF NOT EXISTS resource_speakers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    email VARCHAR(255),
    position VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ensure event_types exists
CREATE TABLE IF NOT EXISTS event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 5. Ensure events table exists and has event_type foreign key
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type_id INT NOT NULL,
    organizer VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='events' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='event_type_id'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT fk_events_event_types FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- 6. Ensure event_dates exists
CREATE TABLE IF NOT EXISTS event_dates (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(255),
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='event_dates' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='event_id'
  ) THEN
    ALTER TABLE event_dates ADD CONSTRAINT fk_event_dates_events FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 7. Ensure event_resource_speakers exists
CREATE TABLE IF NOT EXISTS event_resource_speakers (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    resource_speaker_id INT NOT NULL,
    CONSTRAINT uq_event_resource_speaker UNIQUE (event_id, resource_speaker_id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='event_resource_speakers' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='event_id'
  ) THEN
    ALTER TABLE event_resource_speakers ADD CONSTRAINT fk_event_rs_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
    ALTER TABLE event_resource_speakers ADD CONSTRAINT fk_event_rs_speaker FOREIGN KEY (resource_speaker_id) REFERENCES resource_speakers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 8. Attendance
CREATE TABLE IF NOT EXISTS employee_event_attendance (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    event_date_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'present',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_attendance UNIQUE (employee_id, event_date_id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='employee_event_attendance' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='employee_id'
  ) THEN
    ALTER TABLE employee_event_attendance ADD CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;
    ALTER TABLE employee_event_attendance ADD CONSTRAINT fk_attendance_event_date FOREIGN KEY (event_date_id) REFERENCES event_dates(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 9. Evaluation questions (add event_id if not exists)
CREATE TABLE IF NOT EXISTS evaluation_questions (
    id SERIAL PRIMARY KEY,
    event_type_id INT NULL,
    event_id INT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL DEFAULT 'rating',
    is_for_resource_speaker BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='evaluation_questions' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='event_type_id'
  ) THEN
    ALTER TABLE evaluation_questions ADD CONSTRAINT fk_eval_questions_event_type FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='evaluation_questions' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='event_id'
  ) THEN
    ALTER TABLE evaluation_questions ADD CONSTRAINT fk_eval_questions_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 10. employee_evaluations (add event_id column if not exists)
CREATE TABLE IF NOT EXISTS employee_evaluations (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    event_id INT NULL,
    event_date_id INT NULL,
    resource_speaker_id INT NULL,
    overall_rating INT,
    general_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='employee_evaluations' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='employee_id'
  ) THEN
    ALTER TABLE employee_evaluations ADD CONSTRAINT fk_eval_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;
    ALTER TABLE employee_evaluations ADD CONSTRAINT fk_eval_event_date FOREIGN KEY (event_date_id) REFERENCES event_dates(id) ON DELETE CASCADE;
    ALTER TABLE employee_evaluations ADD CONSTRAINT fk_eval_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
    ALTER TABLE employee_evaluations ADD CONSTRAINT fk_eval_resource_speaker FOREIGN KEY (resource_speaker_id) REFERENCES resource_speakers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 11. Unique partial indexes for evaluations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='uq_eval_employee_event') THEN
    CREATE UNIQUE INDEX uq_eval_employee_event
      ON employee_evaluations(employee_id, event_id)
      WHERE event_id IS NOT NULL AND resource_speaker_id IS NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='uq_eval_employee_eventdate') THEN
    CREATE UNIQUE INDEX uq_eval_employee_eventdate
      ON employee_evaluations(employee_id, event_date_id)
      WHERE event_date_id IS NOT NULL AND resource_speaker_id IS NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='uq_eval_employee_eventdate_speaker') THEN
    CREATE UNIQUE INDEX uq_eval_employee_eventdate_speaker
      ON employee_evaluations(employee_id, event_date_id, resource_speaker_id)
      WHERE event_date_id IS NOT NULL AND resource_speaker_id IS NOT NULL;
  END IF;
END $$;

-- 12. Responses
CREATE TABLE IF NOT EXISTS employee_evaluation_responses (
    id SERIAL PRIMARY KEY,
    evaluation_id INT NOT NULL,
    question_id INT NOT NULL,
    response_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='employee_evaluation_responses' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='evaluation_id'
  ) THEN
    ALTER TABLE employee_evaluation_responses ADD CONSTRAINT fk_eval_responses_eval FOREIGN KEY (evaluation_id) REFERENCES employee_evaluations(id) ON DELETE CASCADE;
    ALTER TABLE employee_evaluation_responses ADD CONSTRAINT fk_eval_responses_question FOREIGN KEY (question_id) REFERENCES evaluation_questions(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 13. Users table for auth
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    employee_id INT NULL,
    role_id INT NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='users' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='employee_id'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT fk_users_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name='users' AND tc.constraint_type = 'FOREIGN KEY' AND ccu.column_name='role_id'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- 14. Indexes
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type_id);
CREATE INDEX IF NOT EXISTS idx_event_dates_event ON event_dates(event_id);
CREATE INDEX IF NOT EXISTS idx_eval_q_event ON evaluation_questions(event_id);
CREATE INDEX IF NOT EXISTS idx_eval_q_event_type ON evaluation_questions(event_type_id);

-- 15. Seed minimal roles if empty
INSERT INTO roles (name, description)
SELECT 'admin', 'Admin role with full privileges'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='admin');

INSERT INTO roles (name, description)
SELECT 'organizer', 'Event organizer role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='organizer');

INSERT INTO roles (name, description)
SELECT 'employee', 'Employee / attendee role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='employee');

COMMIT;
