BEGIN;

-- Required for bcrypt-style hashes
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--------------------------------------------------------
-- 1. ROLES
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

--------------------------------------------------------
-- 2. USERS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    department VARCHAR(255),
    position VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FK: users.role_id → roles.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_role'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;
    END IF;
END $$;

--------------------------------------------------------
-- 3. RESOURCE SPEAKERS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS resource_speakers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    email VARCHAR(255),
    organization TEXT,
    position VARCHAR(255),
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--------------------------------------------------------
-- 4. EVENT TYPES
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

--------------------------------------------------------
-- 5. EVENTS
--------------------------------------------------------
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

-- FK: events.event_type_id → event_types.id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_events_event_types') THEN
        ALTER TABLE events
        ADD CONSTRAINT fk_events_event_types
        FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE RESTRICT;
    END IF;
END $$;

--------------------------------------------------------
-- 6. EVENT DATES
--------------------------------------------------------
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

-- FK: event_dates.event_id → events.id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_event_dates_events') THEN
        ALTER TABLE event_dates
        ADD CONSTRAINT fk_event_dates_events
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
    END IF;
END $$;

--------------------------------------------------------
-- 7. EVENT_RESOURCE_SPEAKERS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_resource_speakers (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    resource_speaker_id INT NOT NULL,
    CONSTRAINT uq_event_resource_speaker UNIQUE (event_id, resource_speaker_id)
);

-- FK: event_resource_speakers.event_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_event_rs_event') THEN
        ALTER TABLE event_resource_speakers
        ADD CONSTRAINT fk_event_rs_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
    END IF;
END $$;

-- FK: event_resource_speakers.resource_speaker_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_event_rs_speaker') THEN
        ALTER TABLE event_resource_speakers
        ADD CONSTRAINT fk_event_rs_speaker
        FOREIGN KEY (resource_speaker_id) REFERENCES resource_speakers(id) ON DELETE CASCADE;
    END IF;
END $$;

--------------------------------------------------------
-- 8. ATTENDANCE
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_event_attendance (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    event_date_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'present',
    attended_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_attendance UNIQUE (user_id, event_date_id)
);

-- FK: attendance.user_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_attendance_user') THEN
        ALTER TABLE user_event_attendance
        ADD CONSTRAINT fk_attendance_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- FK: attendance.event_date_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_attendance_event_date') THEN
        ALTER TABLE user_event_attendance
        ADD CONSTRAINT fk_attendance_event_date
        FOREIGN KEY (event_date_id) REFERENCES event_dates(id) ON DELETE CASCADE;
    END IF;
END $$;

--------------------------------------------------------
-- 9. EVALUATION QUESTIONS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS evaluation_questions (
    id SERIAL PRIMARY KEY,
    event_type_id INT NULL,
    event_id INT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL DEFAULT 'rating',
    is_for_resource_speaker BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

-- FK: eval.event_type_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_eval_questions_event_type') THEN
        ALTER TABLE evaluation_questions
        ADD CONSTRAINT fk_eval_questions_event_type
        FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE SET NULL;
    END IF;
END $$;

-- FK: eval.event_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_eval_questions_event') THEN
        ALTER TABLE evaluation_questions
        ADD CONSTRAINT fk_eval_questions_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
    END IF;
END $$;

--------------------------------------------------------
-- 10. USER EVALUATIONS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_evaluations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NULL,
    event_date_id INT NULL,
    resource_speaker_id INT NULL,
    overall_rating INT,
    general_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Constraints added individually (better idempotency)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_eval_user') THEN
        ALTER TABLE user_evaluations
        ADD CONSTRAINT fk_eval_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_eval_event') THEN
        ALTER TABLE user_evaluations
        ADD CONSTRAINT fk_eval_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_eval_event_date') THEN
        ALTER TABLE user_evaluations
        ADD CONSTRAINT fk_eval_event_date FOREIGN KEY (event_date_id) REFERENCES event_dates(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_eval_resource_speaker') THEN
        ALTER TABLE user_evaluations
        ADD CONSTRAINT fk_eval_resource_speaker FOREIGN KEY (resource_speaker_id) REFERENCES resource_speakers(id) ON DELETE SET NULL;
    END IF;
END $$;

--------------------------------------------------------
-- 11. UNIQUE PARTIAL INDEXES
--------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='uq_eval_user_event') THEN
        CREATE UNIQUE INDEX uq_eval_user_event
            ON user_evaluations(user_id, event_id)
            WHERE event_id IS NOT NULL AND resource_speaker_id IS NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='uq_eval_user_eventdate') THEN
        CREATE UNIQUE INDEX uq_eval_user_eventdate
            ON user_evaluations(user_id, event_date_id)
            WHERE event_date_id IS NOT NULL AND resource_speaker_id IS NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='uq_eval_user_eventdate_speaker') THEN
        CREATE UNIQUE INDEX uq_eval_user_eventdate_speaker
            ON user_evaluations(user_id, event_date_id, resource_speaker_id)
            WHERE event_date_id IS NOT NULL AND resource_speaker_id IS NOT NULL;
    END IF;
END $$;

--------------------------------------------------------
-- 12. USER EVALUATION RESPONSES
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_evaluation_responses (
    id SERIAL PRIMARY KEY,
    evaluation_id INT NOT NULL,
    question_id INT NOT NULL,
    response_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FKs (independent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_eval_responses_eval') THEN
        ALTER TABLE user_evaluation_responses
            ADD CONSTRAINT fk_eval_responses_eval
            FOREIGN KEY (evaluation_id) REFERENCES user_evaluations(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_eval_responses_question') THEN
        ALTER TABLE user_evaluation_responses
            ADD CONSTRAINT fk_eval_responses_question
            FOREIGN KEY (question_id) REFERENCES evaluation_questions(id) ON DELETE CASCADE;
    END IF;
END $$;

--------------------------------------------------------
-- 13. INDEXES
--------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type_id);
CREATE INDEX IF NOT EXISTS idx_event_dates_event ON event_dates(event_id);
CREATE INDEX IF NOT EXISTS idx_eval_q_event ON evaluation_questions(event_id);
CREATE INDEX IF NOT EXISTS idx_eval_q_event_type ON evaluation_questions(event_type_id);

--------------------------------------------------------
-- 14. SEED ROLES
--------------------------------------------------------
INSERT INTO roles (name, description)
SELECT 'admin', 'Full system access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='admin');

INSERT INTO roles (name, description)
SELECT 'organizer', 'Event organizer role'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='organizer');

INSERT INTO roles (name, description)
SELECT 'user', 'Regular attendee user'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='user');

COMMIT;
