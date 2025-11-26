--------------------------------------------------------
-- SEED: ROLES (already seeded in init.sql)
--------------------------------------------------------

--------------------------------------------------------
-- SEED: USERS
--------------------------------------------------------
INSERT INTO users (full_name, username, email, password_hash, role_id, department, position)
SELECT 'Admin User', 'admin', 'admin@example.com', crypt('admin123', gen_salt('bf')), 
       (SELECT id FROM roles WHERE name='admin'), 'IT', 'System Administrator'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin');

INSERT INTO users (full_name, username, email, password_hash, role_id, department, position)
SELECT 'Event Organizer', 'organizer1', 'organizer1@example.com', crypt('organizer123', gen_salt('bf')),
       (SELECT id FROM roles WHERE name='organizer'), 'Planning', 'Event Organizer'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='organizer1');

INSERT INTO users (full_name, username, email, password_hash, role_id, department, position)
SELECT 'John Doe', 'john', 'john@example.com', crypt('password123', gen_salt('bf')),
       (SELECT id FROM roles WHERE name='user'), 'Science', 'Teacher'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='john');

INSERT INTO users (full_name, username, email, password_hash, role_id, department, position)
SELECT 'Maria Santos', 'maria', 'maria@example.com', crypt('password123', gen_salt('bf')),
       (SELECT id FROM roles WHERE name='user'), 'Math', 'Teacher'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='maria');

--------------------------------------------------------
-- SEED: RESOURCE SPEAKERS
--------------------------------------------------------
INSERT INTO resource_speakers (full_name, bio, email, organization, position, contact_info)
SELECT 'Dr. Ramon Velasco', 'Expert in Educational Leadership', 'ramon.velasco@example.com', 'don bosco elementary school', 'Professor', '0942325345436'
WHERE NOT EXISTS (SELECT 1 FROM resource_speakers WHERE full_name='Dr. Ramon Velasco');

INSERT INTO resource_speakers (full_name, bio, email, organization, position, contact_info)
SELECT 'Engr. Liza Domingo', 'STEM and Robotics Specialist', 'liza.domingo@example.com', 'gabaldon elementary school of engineering', 'Engineer', '0965464565745'
WHERE NOT EXISTS (SELECT 1 FROM resource_speakers WHERE full_name='Engr. Liza Domingo');

--------------------------------------------------------
-- SEED: EVENT TYPES
--------------------------------------------------------
INSERT INTO event_types (name, description)
SELECT 'Seminar', 'General seminars and orientation events'
WHERE NOT EXISTS (SELECT 1 FROM event_types WHERE name='Seminar');

INSERT INTO event_types (name, description)
SELECT 'Training', 'Hands-on skill training programs'
WHERE NOT EXISTS (SELECT 1 FROM event_types WHERE name='Training');

INSERT INTO event_types (name, description)
SELECT 'Workshop', 'Practical workshops'
WHERE NOT EXISTS (SELECT 1 FROM event_types WHERE name='Workshop');

--------------------------------------------------------
-- SEED: EVENTS
--------------------------------------------------------
INSERT INTO events (title, description, event_type_id, organizer, location)
SELECT 'STEM Enhancement Seminar', 'A seminar focused on enhancing STEM methodologies.',
       (SELECT id FROM event_types WHERE name='Seminar'),
       'DepEd Division Office', 'Conference Hall'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title='STEM Enhancement Seminar');

INSERT INTO events (title, description, event_type_id, organizer, location)
SELECT 'Robotics Teacher Training', 'Hands-on robotics training for educators.',
       (SELECT id FROM event_types WHERE name='Training'),
       'DepEd Training Unit', 'Tech Room 3'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title='Robotics Teacher Training');

--------------------------------------------------------
-- SEED: EVENT DATES
--------------------------------------------------------
INSERT INTO event_dates (event_id, session_date, start_time, end_time, venue, capacity)
SELECT e.id, '2025-02-10', '08:00', '12:00', 'Conference Hall', 150
FROM events e
WHERE e.title='STEM Enhancement Seminar'
AND NOT EXISTS (
    SELECT 1 FROM event_dates WHERE event_id=e.id AND session_date='2025-02-10'
);

INSERT INTO event_dates (event_id, session_date, start_time, end_time, venue, capacity)
SELECT e.id, '2025-02-11', '13:00', '17:00', 'Tech Room 3', 40
FROM events e
WHERE e.title='Robotics Teacher Training'
AND NOT EXISTS (
    SELECT 1 FROM event_dates WHERE event_id=e.id AND session_date='2025-02-11'
);

--------------------------------------------------------
-- SEED: EVENT RESOURCE SPEAKERS
--------------------------------------------------------
INSERT INTO event_resource_speakers (event_id, resource_speaker_id)
SELECT e.id, s.id
FROM events e, resource_speakers s
WHERE e.title='STEM Enhancement Seminar'
  AND s.full_name='Dr. Ramon Velasco'
  AND NOT EXISTS (
        SELECT 1 FROM event_resource_speakers
        WHERE event_id=e.id AND resource_speaker_id=s.id
  );

INSERT INTO event_resource_speakers (event_id, resource_speaker_id)
SELECT e.id, s.id
FROM events e, resource_speakers s
WHERE e.title='Robotics Teacher Training'
  AND s.full_name='Engr. Liza Domingo'
  AND NOT EXISTS (
        SELECT 1 FROM event_resource_speakers
        WHERE event_id=e.id AND resource_speaker_id=s.id
  );

--------------------------------------------------------
-- SEED: ATTENDANCE
--------------------------------------------------------
INSERT INTO user_event_attendance (user_id, event_date_id, status)
SELECT (SELECT id FROM users WHERE username='john'),
       (SELECT id FROM event_dates LIMIT 1),
       'present'
WHERE NOT EXISTS (
    SELECT 1 FROM user_event_attendance 
    WHERE user_id=(SELECT id FROM users WHERE username='john')
);

INSERT INTO user_event_attendance (user_id, event_date_id, status)
SELECT (SELECT id FROM users WHERE username='maria'),
       (SELECT id FROM event_dates LIMIT 1),
       'present'
WHERE NOT EXISTS (
    SELECT 1 FROM user_event_attendance 
    WHERE user_id=(SELECT id FROM users WHERE username='maria')
);

--------------------------------------------------------
-- SEED: EVALUATION QUESTIONS
--------------------------------------------------------
INSERT INTO evaluation_questions (event_type_id, question_text, question_type, sort_order)
SELECT (SELECT id FROM event_types WHERE name='Seminar'),
       'Rate the speaker’s clarity.',
       'rating', 1
WHERE NOT EXISTS (SELECT 1 FROM evaluation_questions WHERE question_text='Rate the speaker’s clarity.');

INSERT INTO evaluation_questions (event_type_id, question_text, question_type, sort_order)
SELECT (SELECT id FROM event_types WHERE name='Seminar'),
       'Was the venue comfortable?',
       'rating', 2
WHERE NOT EXISTS (SELECT 1 FROM evaluation_questions WHERE question_text='Was the venue comfortable?');

--------------------------------------------------------
-- SEED: USER EVALUATIONS
--------------------------------------------------------
INSERT INTO user_evaluations (user_id, event_id, event_date_id, overall_rating, general_comment)
SELECT
    (SELECT id FROM users WHERE username='john'),
    (SELECT id FROM events WHERE title='STEM Enhancement Seminar'),
    (SELECT id FROM event_dates WHERE session_date='2025-02-10'),
    5,
    'Very informative seminar!'
WHERE NOT EXISTS (
    SELECT 1 FROM user_evaluations 
    WHERE user_id=(SELECT id FROM users WHERE username='john')
    AND event_id=(SELECT id FROM events WHERE title='STEM Enhancement Seminar')
);

--------------------------------------------------------
-- SEED: USER EVALUATION RESPONSES
--------------------------------------------------------
INSERT INTO user_evaluation_responses (evaluation_id, question_id, response_text)
SELECT 
    (SELECT id FROM user_evaluations 
        WHERE user_id=(SELECT id FROM users WHERE username='john')
        AND event_id=(SELECT id FROM events WHERE title='STEM Enhancement Seminar')),
    q.id,
    '5'
FROM evaluation_questions q
WHERE q.question_text='Rate the speaker’s clarity.'
AND NOT EXISTS (
    SELECT 1 FROM user_evaluation_responses WHERE question_id=q.id
);
