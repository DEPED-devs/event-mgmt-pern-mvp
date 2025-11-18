-- init.sql: creates tables for the event mgmt system

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash TEXT,
  role VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  date DATE,
  start_time TIME,
  end_time TIME,
  venue VARCHAR(255),
  status VARCHAR(50) DEFAULT 'scheduled',
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_attendees (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id),
  name VARCHAR(255),
  email VARCHAR(255),
  has_submitted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS speakers (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id),
  name VARCHAR(255),
  topic VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS evaluation_forms (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id),
  title VARCHAR(255),
  is_locked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS evaluation_questions (
  id SERIAL PRIMARY KEY,
  form_id INT REFERENCES evaluation_forms(id),
  question_text TEXT,
  question_type VARCHAR(20),
  order_index INT
);

CREATE TABLE IF NOT EXISTS evaluation_responses (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id),
  attendee_id INT REFERENCES event_attendees(id),
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evaluation_answers (
  id SERIAL PRIMARY KEY,
  response_id INT REFERENCES evaluation_responses(id),
  question_id INT REFERENCES evaluation_questions(id),
  answer TEXT
);

-- Speaker-specific forms
CREATE TABLE IF NOT EXISTS speaker_evaluation_forms (
  id SERIAL PRIMARY KEY,
  speaker_id INT REFERENCES speakers(id)
);

CREATE TABLE IF NOT EXISTS speaker_evaluation_questions (
  id SERIAL PRIMARY KEY,
  form_id INT REFERENCES speaker_evaluation_forms(id),
  question_text TEXT,
  question_type VARCHAR(20),
  order_index INT
);

CREATE TABLE IF NOT EXISTS speaker_evaluation_responses (
  id SERIAL PRIMARY KEY,
  speaker_id INT REFERENCES speakers(id),
  attendee_id INT REFERENCES event_attendees(id),
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS speaker_evaluation_answers (
  id SERIAL PRIMARY KEY,
  response_id INT REFERENCES speaker_evaluation_responses(id),
  question_id INT REFERENCES speaker_evaluation_questions(id),
  answer TEXT
);
