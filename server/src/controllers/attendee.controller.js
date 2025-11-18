const pool = require('../config/db');

exports.addAttendee = async (req, res, next) => {
  try {
    const { event_id, name, email } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO event_attendees (event_id, name, email)
       VALUES ($1,$2,$3) RETURNING *`,
      [event_id, name, email]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.getEventAttendees = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const { rows } = await pool.query('SELECT * FROM event_attendees WHERE event_id=$1', [event_id]);
    res.json(rows);
  } catch (err) { next(err); }
};
