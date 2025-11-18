const pool = require('../config/db');

exports.addSpeaker = async (req, res, next) => {
  try {
    const { event_id, name, topic } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO speakers (event_id, name, topic) VALUES ($1,$2,$3) RETURNING *`,
      [event_id, name, topic]
    );

    // create speaker evaluation form
    await pool.query('INSERT INTO speaker_evaluation_forms (speaker_id) VALUES ($1)', [rows[0].id]);

    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.getSpeakersByEvent = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const { rows } = await pool.query('SELECT * FROM speakers WHERE event_id=$1', [event_id]);
    res.json(rows);
  } catch (err) { next(err); }
};
