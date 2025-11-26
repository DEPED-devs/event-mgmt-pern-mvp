// const pool = require('../config/db');

// exports.getAllSpeakers = async (req, res) => {
//   try {
//     const speakers = await db.resource_speakers.findAll();
//     res.json(speakers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getSpeakerById = async (req, res) => {
//   try {
//     const speaker = await db.resource_speakers.findByPk(req.params.id);
//     if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
//     res.json(speaker);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createSpeaker = async (req, res) => {
//   try {
//     const newSpeaker = await db.resource_speakers.create(req.body);
//     res.status(201).json(newSpeaker);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateSpeaker = async (req, res) => {
//   try {
//     const speaker = await db.resource_speakers.findByPk(req.params.id);
//     if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
//     await speaker.update(req.body);
//     res.json(speaker);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteSpeaker = async (req, res) => {
//   try {
//     const speaker = await db.resource_speakers.findByPk(req.params.id);
//     if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
//     await speaker.destroy();
//     res.json({ message: 'Speaker deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// src/controllers/resourceSpeakers.controller.js
const pool = require('../config/db');

const SPEAKER_COLUMNS = `
    id,
    full_name,
    bio,
    email,
    organization,
    position,
    contact_info,
    created_at
`;

// ===============================
// GET ALL SPEAKERS
// ===============================
exports.getAllResourceSpeakers = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT ${SPEAKER_COLUMNS}
             FROM resource_speakers
             ORDER BY full_name ASC`
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// ===============================
// GET SPEAKER BY ID
// ===============================
exports.getResourceSpeakerById = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT ${SPEAKER_COLUMNS}
             FROM resource_speakers
             WHERE id = $1`,
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: 'Speaker not found' });

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ===============================
// CREATE SPEAKER
// ===============================
exports.createResourceSpeaker = async (req, res, next) => {
    const {
        full_name,
        bio,
        email,
        organization,
        position,
        contact_info
    } = req.body;

    try {
        const { rows } = await pool.query(
            `INSERT INTO resource_speakers 
                (full_name, bio, email, organization, position, contact_info)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING ${SPEAKER_COLUMNS}`,
            [
                full_name,
                bio || null,
                email || null,
                organization || null,
                position || null,
                contact_info || null
            ]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ===============================
// UPDATE SPEAKER
// ===============================
exports.updateResourceSpeaker = async (req, res, next) => {
    const { id } = req.params;

    const {
        full_name,
        bio,
        email,
        organization,
        position,
        contact_info
    } = req.body;

    try {
        const { rows } = await pool.query(
            `UPDATE resource_speakers 
             SET 
                full_name = COALESCE($1, full_name),
                bio = COALESCE($2, bio),
                email = COALESCE($3, email),
                organization = COALESCE($4, organization),
                position = COALESCE($5, position),
                contact_info = COALESCE($6, contact_info)
             WHERE id = $7
             RETURNING ${SPEAKER_COLUMNS}`,
            [
                full_name,
                bio,
                email,
                organization,
                position,
                contact_info,
                id
            ]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: 'Speaker not found' });

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ===============================
// DELETE SPEAKER
// ===============================
exports.deleteResourceSpeaker = async (req, res, next) => {
    try {
        const result = await pool.query(
            `DELETE FROM resource_speakers WHERE id = $1`,
            [req.params.id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ message: 'Speaker not found' });

        res.json({ message: 'Speaker deleted successfully' });
    } catch (err) {
        next(err);
    }
};
