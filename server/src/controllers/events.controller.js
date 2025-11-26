// src/controllers/events.controller.js
const pool = require('../config/db');

// Main event columns for SELECT statements (e.g., e.title)
// const BASE_EVENT_COLUMNS = `
//     e.id, e.title, e.description, e.location, e.is_published, 
//     e.event_type_id, e.created_at, e.updated_at
// `;
//DONT DELETE THIS commented schema it is used for upgrading the system.

const BASE_EVENT_COLUMNS = `
    e.id, e.title, e.description, e.location, 
    e.event_type_id, e.created_at, e.updated_at
`;


// ## 1. GET ALL EVENTS (READ ALL)
exports.getAllEvents = async (req, res, next) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                ${BASE_EVENT_COLUMNS},
                et.name AS event_type_name
            FROM events e
            JOIN event_types et ON e.event_type_id = et.id
            ORDER BY e.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// ## 2. GET EVENT BY ID (READ BY ID)
exports.getEventById = async (req, res, next) => {
    try {
        // Use JSON_AGG subqueries to pull related data (dates and speakers) without duplicating main event rows
        const query = `
            SELECT
                ${BASE_EVENT_COLUMNS},
                et.name AS event_type_name,
                (SELECT json_agg(ed.date) FROM event_dates ed WHERE ed.event_id = e.id) AS event_dates,
                (SELECT json_agg(json_build_object('id', rs.id, 'name', rs.name))
                 FROM event_resource_speakers ers 
                 JOIN resource_speakers rs ON ers.resource_speaker_id = rs.id 
                 WHERE ers.event_id = e.id) AS resource_speakers
            FROM events e
            JOIN event_types et ON e.event_type_id = et.id
            WHERE e.id = $1
        `;
        const { rows } = await pool.query(query, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## 3. CREATE EVENT (WRITE - TRANSACTION REQUIRED)
exports.createEvent = async (req, res, next) => {
    const { title, description, location, event_type_id, is_published, dates, speakers } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Start Transaction

        // 1. Insert into main events table
        const eventResult = await client.query(
            `INSERT INTO events (title, description, location, event_type_id, is_published)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, created_at, updated_at`,
            [title, description, location, event_type_id, is_published]
        );
        const eventId = eventResult.rows[0].id;
        
        // 2. Insert into event_dates
        if (dates && dates.length) {
            const dateQueries = dates.map(date => 
                client.query(`INSERT INTO event_dates (event_id, date) VALUES ($1, $2)`, [eventId, date])
            );
            await Promise.all(dateQueries);
        }

        // 3. Insert into event_resource_speakers (Join table)
        if (speakers && speakers.length) {
            const speakerQueries = speakers.map(speakerId => 
                client.query(`INSERT INTO event_resource_speakers (event_id, resource_speaker_id) VALUES ($1, $2)`, [eventId, speakerId])
            );
            await Promise.all(speakerQueries);
        }

        await client.query('COMMIT'); // Commit changes
        res.status(201).json({ id: eventId, ...req.body, ...eventResult.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback if error
        next(err);
    } finally {
        client.release(); // Release client
    }
};

// ## 4. UPDATE EVENT (WRITE - TRANSACTION REQUIRED)
exports.updateEvent = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, location, event_type_id, is_published, dates, speakers } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Start Transaction

        // 1. Update main events table
        const eventResult = await client.query(
            `UPDATE events
             SET title = $1, description = $2, location = $3, event_type_id = $4, is_published = $5, updated_at = NOW()
             WHERE id = $6
             RETURNING id`,
            [title, description, location, event_type_id, is_published, id]
        );

        if (eventResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // 2. Handle related tables (Delete existing and re-insert new ones)
        
        // Clear existing dates and insert new ones
        await client.query(`DELETE FROM event_dates WHERE event_id = $1`, [id]);
        if (dates && dates.length) {
            const dateQueries = dates.map(date => 
                client.query(`INSERT INTO event_dates (event_id, date) VALUES ($1, $2)`, [id, date])
            );
            await Promise.all(dateQueries);
        }

        // Clear existing speakers and insert new ones
        await client.query(`DELETE FROM event_resource_speakers WHERE event_id = $1`, [id]);
        if (speakers && speakers.length) {
            const speakerQueries = speakers.map(speakerId => 
                client.query(`INSERT INTO event_resource_speakers (event_id, resource_speaker_id) VALUES ($1, $2)`, [id, speakerId])
            );
            await Promise.all(speakerQueries);
        }

        await client.query('COMMIT'); // Commit changes
        res.json({ id, ...req.body }); // Return updated data
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback if error
        next(err);
    } finally {
        client.release(); // Release client
    }
};

// ## 5. DELETE EVENT (WRITE - TRANSACTION REQUIRED)
exports.deleteEvent = async (req, res, next) => {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Start Transaction

        // 1. Delete associated records from join tables first
        await client.query(`DELETE FROM event_resource_speakers WHERE event_id = $1`, [id]);
        await client.query(`DELETE FROM event_dates WHERE event_id = $1`, [id]);
        // Also consider deleting attendance and evaluation records related to this event
        await client.query(`DELETE FROM user_event_attendance WHERE event_id = $1`, [id]);
        await client.query(`DELETE FROM user_evaluations WHERE event_id = $1`, [id]);

        // 2. Delete main event record
        const result = await client.query(`DELETE FROM events WHERE id = $1`, [id]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Event not found' });
        }

        await client.query('COMMIT'); // Commit changes
        res.json({ message: 'Event and all associated records deleted successfully' });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback if error
        next(err);
    } finally {
        client.release(); // Release client
    }
};