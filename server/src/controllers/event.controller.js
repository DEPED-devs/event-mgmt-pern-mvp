const pool = require('../config/db');

exports.getEvents = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events ORDER BY date ASC, start_time ASC');
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM events WHERE id=$1', [id]);
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, start_time, end_time, venue, created_by } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO events (title, description, date, start_time, end_time, venue, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description, date, start_time, end_time, venue, created_by]
    );

    // auto-create event evaluation form
    await pool.query('INSERT INTO evaluation_forms (event_id, title) VALUES ($1,$2)', [rows[0].id, 'Event Evaluation']);

    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};
