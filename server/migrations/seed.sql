-- -- seed.sql: sample data

-- INSERT INTO employees (name, email, role) VALUES ('Admin User','admin@example.com','admin');

-- INSERT INTO events (title, description, date, start_time, end_time, venue, created_by)
-- VALUES ('Intro to PERN','A short intro to PERN stack','2025-12-01','09:00:00','12:00:00','Main Hall',1);

-- -- attach default evaluation form for the event
-- INSERT INTO evaluation_forms (event_id, title) VALUES (1, 'Event Evaluation');

-- -- default event questions
-- INSERT INTO evaluation_questions (form_id, question_text, question_type, order_index) VALUES
-- (1, 'How would you rate the venue and facilities?', 'rating', 1),
-- (1, 'How satisfied are you with the overall event?', 'rating', 2),
-- (1, 'Any comments or suggestions?', 'text', 3);

-- -- add speakers
-- INSERT INTO speakers (event_id, name, topic) VALUES (1, 'Alice Santos', 'PERN Basics');
-- INSERT INTO speakers (event_id, name, topic) VALUES (1, 'Ramon Cruz', 'Advanced React');

-- -- create speaker forms
-- INSERT INTO speaker_evaluation_forms (speaker_id) VALUES (1);
-- INSERT INTO speaker_evaluation_forms (speaker_id) VALUES (2);

-- -- speaker questions
-- INSERT INTO speaker_evaluation_questions (form_id, question_text, question_type, order_index) VALUES
-- (1, 'Rate speaker clarity', 'rating', 1),
-- (1, 'How engaging was the speaker?', 'rating', 2),
-- (1, 'Comments for the speaker', 'text', 3),
-- (2, 'Rate speaker clarity', 'rating', 1),
-- (2, 'How engaging was the speaker?', 'rating', 2),
-- (2, 'Comments for the speaker', 'text', 3);

-- -- sample attendees
-- INSERT INTO event_attendees (event_id, name, email) VALUES (1, 'Juan dela Cruz', 'juan@example.com');
-- INSERT INTO event_attendees (event_id, name, email) VALUES (1, 'Maria Clara', 'maria@example.com');

-- seed_with_pgcrypto.sql
BEGIN;

-- Ensure extension (if not present)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- roles
INSERT INTO roles (name, description) SELECT 'admin', 'Admin role' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='admin');
INSERT INTO roles (name, description) SELECT 'organizer', 'Organizer' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='organizer');
INSERT INTO roles (name, description) SELECT 'employee', 'Employee' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name='employee');

-- sample employees
INSERT INTO employees (employee_no, full_name, position, department, email, password_hash)
SELECT 'EMP001', 'Juan Dela Cruz', 'Staff', 'Training', 'juan@example.com', crypt('EmployeePass123!', gen_salt('bf'))
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_no='EMP001');

-- admin user (password = AdminPass123!)
INSERT INTO users (username, password_hash, email, role_id)
SELECT 'admin', crypt('AdminPass123!', gen_salt('bf')), 'admin@example.com', (SELECT id FROM roles WHERE name='admin')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin');

-- sample event type, event, date
INSERT INTO event_types (name, description) SELECT 'training', 'Training events' WHERE NOT EXISTS (SELECT 1 FROM event_types WHERE name='training');

INSERT INTO events (title, description, event_type_id, organizer, location)
SELECT 'Intro to PERN', 'A short intro', (SELECT id FROM event_types WHERE name='training'), 'L&D', 'Main Hall'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title='Intro to PERN');

INSERT INTO event_dates (event_id, session_date, start_time, end_time, venue)
SELECT (SELECT id FROM events WHERE title='Intro to PERN'), '2025-12-01', '09:00:00', '12:00:00', 'Main Hall'
WHERE NOT EXISTS (SELECT 1 FROM event_dates WHERE event_id=(SELECT id FROM events WHERE title='Intro to PERN') AND session_date='2025-12-01');

-- sample speakers
INSERT INTO resource_speakers (full_name, bio, email) SELECT 'Alice Santos', 'PERN basics', 'alice@example.com' WHERE NOT EXISTS (SELECT 1 FROM resource_speakers WHERE full_name='Alice Santos');
INSERT INTO resource_speakers (full_name, bio, email) SELECT 'Ramon Cruz', 'Advanced React', 'ramon@example.com' WHERE NOT EXISTS (SELECT 1 FROM resource_speakers WHERE full_name='Ramon Cruz');

-- map speakers to event
INSERT INTO event_resource_speakers (event_id, resource_speaker_id)
SELECT (SELECT id FROM events WHERE title='Intro to PERN'), (SELECT id FROM resource_speakers WHERE full_name='Alice Santos')
WHERE NOT EXISTS (SELECT 1 FROM event_resource_speakers WHERE event_id=(SELECT id FROM events WHERE title='Intro to PERN') AND resource_speaker_id=(SELECT id FROM resource_speakers WHERE full_name='Alice Santos'));

INSERT INTO event_resource_speakers (event_id, resource_speaker_id)
SELECT (SELECT id FROM events WHERE title='Intro to PERN'), (SELECT id FROM resource_speakers WHERE full_name='Ramon Cruz')
WHERE NOT EXISTS (SELECT 1 FROM event_resource_speakers WHERE event_id=(SELECT id FROM events WHERE title='Intro to PERN') AND resource_speaker_id=(SELECT id FROM resource_speakers WHERE full_name='Ramon Cruz'));

-- default questions for event type
INSERT INTO evaluation_questions (event_type_id, question_text, question_type, is_for_resource_speaker, sort_order)
SELECT (SELECT id FROM event_types WHERE name='training'), 'How would you rate the venue and facilities?', 'rating', FALSE, 1
WHERE NOT EXISTS (SELECT 1 FROM evaluation_questions WHERE question_text LIKE 'How would you rate the venue%');

INSERT INTO evaluation_questions (event_type_id, question_text, question_type, is_for_resource_speaker, sort_order)
SELECT (SELECT id FROM event_types WHERE name='training'), 'How satisfied are you with the overall event?', 'rating', FALSE, 2
WHERE NOT EXISTS (SELECT 1 FROM evaluation_questions WHERE question_text LIKE 'How satisfied are you with the overall event%');

INSERT INTO evaluation_questions (event_type_id, question_text, question_type, is_for_resource_speaker, sort_order)
SELECT (SELECT id FROM event_types WHERE name='training'), 'Any comments or suggestions?', 'text', FALSE, 3
WHERE NOT EXISTS (SELECT 1 FROM evaluation_questions WHERE question_text LIKE 'Any comments or suggestions%');

COMMIT;
