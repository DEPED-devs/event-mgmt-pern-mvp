-- seed.sql: sample data

INSERT INTO users (name, email, role) VALUES ('Admin User','admin@example.com','admin');

INSERT INTO events (title, description, date, start_time, end_time, venue, created_by)
VALUES ('Intro to PERN','A short intro to PERN stack','2025-12-01','09:00:00','12:00:00','Main Hall',1);

-- attach default evaluation form for the event
INSERT INTO evaluation_forms (event_id, title) VALUES (1, 'Event Evaluation');

-- default event questions
INSERT INTO evaluation_questions (form_id, question_text, question_type, order_index) VALUES
(1, 'How would you rate the venue and facilities?', 'rating', 1),
(1, 'How satisfied are you with the overall event?', 'rating', 2),
(1, 'Any comments or suggestions?', 'text', 3);

-- add speakers
INSERT INTO speakers (event_id, name, topic) VALUES (1, 'Alice Santos', 'PERN Basics');
INSERT INTO speakers (event_id, name, topic) VALUES (1, 'Ramon Cruz', 'Advanced React');

-- create speaker forms
INSERT INTO speaker_evaluation_forms (speaker_id) VALUES (1);
INSERT INTO speaker_evaluation_forms (speaker_id) VALUES (2);

-- speaker questions
INSERT INTO speaker_evaluation_questions (form_id, question_text, question_type, order_index) VALUES
(1, 'Rate speaker clarity', 'rating', 1),
(1, 'How engaging was the speaker?', 'rating', 2),
(1, 'Comments for the speaker', 'text', 3),
(2, 'Rate speaker clarity', 'rating', 1),
(2, 'How engaging was the speaker?', 'rating', 2),
(2, 'Comments for the speaker', 'text', 3);

-- sample attendees
INSERT INTO event_attendees (event_id, name, email) VALUES (1, 'Juan dela Cruz', 'juan@example.com');
INSERT INTO event_attendees (event_id, name, email) VALUES (1, 'Maria Clara', 'maria@example.com');
