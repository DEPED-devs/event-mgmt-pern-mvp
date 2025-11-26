// const pool = require('../config/db');

// exports.getAllEventDates = async (req, res) => {
//   try {
//     const dates = await db.event_dates.findAll();
//     res.json(dates);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getEventDateById = async (req, res) => {
//   try {
//     const date = await db.event_dates.findByPk(req.params.id);
//     if (!date) return res.status(404).json({ message: 'Event date not found' });
//     res.json(date);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createEventDate = async (req, res) => {
//   try {
//     const newDate = await db.event_dates.create(req.body);
//     res.status(201).json(newDate);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateEventDate = async (req, res) => {
//   try {
//     const date = await db.event_dates.findByPk(req.params.id);
//     if (!date) return res.status(404).json({ message: 'Event date not found' });
//     await date.update(req.body);
//     res.json(date);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteEventDate = async (req, res) => {
//   try {
//     const date = await db.event_dates.findByPk(req.params.id);
//     if (!date) return res.status(404).json({ message: 'Event date not found' });
//     await date.destroy();
//     res.json({ message: 'Event date deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// src/controllers/eventDates.controller.js
// src/controllers/eventDates.controller.js
const pool = require('../config/db');

// ---
// ## GET ALL EVENT DATES
exports.getAllEventDates = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, event_id, session_date FROM event_dates ORDER BY id ASC`
        );
        res.json(rows);
    } catch (err) {
        // Use next(err) for consistent error handling
        next(err); 
    }
};

// ---
// ## GET DATES BY EVENT ID (Already Correct)
exports.getDatesByEventId = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, event_id, session_date FROM event_dates WHERE event_id=$1 ORDER BY session_date ASC`,
            [req.params.eventId]
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// ---
// ## CREATE EVENT DATE (Already Correct)
exports.createEventDate = async (req, res, next) => {
    const { event_id, date } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO event_dates (event_id, session_date) VALUES ($1, $2) RETURNING *`,
            [event_id, date]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ---
// ## UPDATE EVENT DATE (FIXED)
exports.updateEventDate = async (req, res, next) => {
    const { id } = req.params;
    const { event_id, date } = req.body; // Assuming you might update both fields
    
    try {
        const { rows } = await pool.query(
            `UPDATE event_dates 
             SET event_id = $1, session_date = $2
             WHERE id = $3
             RETURNING id, event_id, session_date`,
            [event_id, date, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Event date not found' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ---
// ## DELETE EVENT DATE (Already Correct)
exports.deleteEventDate = async (req, res, next) => {
    try {
        const result = await pool.query(`DELETE FROM event_dates WHERE id=$1`, [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Event date not found' });
        res.json({ message: 'Event date deleted successfully' });
    } catch (err) {
        next(err);
    }
};