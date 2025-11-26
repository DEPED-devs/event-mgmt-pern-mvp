// const pool = require('../config/db');


// exports.getAllEventTypes = async (req, res) => {
//   try {
//     const types = await db.event_types.findAll();
//     res.json(types);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getEventTypeById = async (req, res) => {
//   try {
//     const type = await db.event_types.findByPk(req.params.id);
//     if (!type) return res.status(404).json({ message: 'Event type not found' });
//     res.json(type);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createEventType = async (req, res) => {
//   try {
//     const newType = await db.event_types.create(req.body);
//     res.status(201).json(newType);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateEventType = async (req, res) => {
//   try {
//     const type = await db.event_types.findByPk(req.params.id);
//     if (!type) return res.status(404).json({ message: 'Event type not found' });
//     await type.update(req.body);
//     res.json(type);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteEventType = async (req, res) => {
//   try {
//     const type = await db.event_types.findByPk(req.params.id);
//     if (!type) return res.status(404).json({ message: 'Event type not found' });
//     await type.destroy();
//     res.json({ message: 'Deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// src/controllers/eventTypes.controller.js
const pool = require('../config/db');

// ## GET ALL EVENT TYPES
exports.getAllEventTypes = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, name, description FROM event_types ORDER BY name ASC`
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// ## GET EVENT TYPE BY ID
exports.getEventTypeById = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, name, description FROM event_types WHERE id=$1`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Event type not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## CREATE EVENT TYPE
exports.createEventType = async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO event_types (name, description) VALUES ($1, $2) RETURNING *`,
            [name, description]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## UPDATE EVENT TYPE
exports.updateEventType = async (req, res, next) => {
    const { name, description } = req.body;
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            `UPDATE event_types SET name=$1, description=$2 WHERE id=$3 RETURNING *`,
            [name, description, id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Event type not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ## DELETE EVENT TYPE
exports.deleteEventType = async (req, res, next) => {
    try {
        const result = await pool.query(`DELETE FROM event_types WHERE id=$1`, [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Event type not found' });
        res.json({ message: 'Event type deleted successfully' });
    } catch (err) {
        next(err);
    }
};