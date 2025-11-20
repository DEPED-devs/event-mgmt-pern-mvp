// const pool = require('../config/db');

// exports.getEvents = async (req, res, next) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM events ORDER BY date ASC, start_time ASC');
//     res.json(rows);
//   } catch (err) { next(err); }
// };

// exports.getEventById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { rows } = await pool.query('SELECT * FROM events WHERE id=$1', [id]);
//     res.json(rows[0]);
//   } catch (err) { next(err); }
// };

// exports.createEvent = async (req, res, next) => {
//   try {
//     const { title, description, date, start_time, end_time, venue, created_by } = req.body;
//     const { rows } = await pool.query(
//       `INSERT INTO events (title, description, date, start_time, end_time, venue, created_by)
//        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
//       [title, description, date, start_time, end_time, venue, created_by]
//     );

//     // auto-create event evaluation form
//     await pool.query('INSERT INTO evaluation_forms (event_id, title) VALUES ($1,$2)', [rows[0].id, 'Event Evaluation']);

//     res.status(201).json(rows[0]);
//   } catch (err) { next(err); }
// };


const pool = require('../config/db');

exports.getEvents = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT e.*, t.name as event_type FROM events e LEFT JOIN event_types t ON t.id=e.event_type_id ORDER BY e.created_at'
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT e.*, t.name as event_type FROM events e LEFT JOIN event_types t ON t.id=e.event_type_id WHERE e.id=$1',
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });

    const event = rows[0];
    const dates = await pool.query(
      'SELECT * FROM event_dates WHERE event_id=$1 ORDER BY session_date',
      [id]
    );

    res.json({ event, dates: dates.rows });
  } catch (err) { next(err); }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, event_type_id, organizer, location, status } = req.body;
    const { rows } = await pool.query('INSERT INTO events (title, description, event_type_id, organizer, location, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [title, description, event_type_id, organizer, location, status || 'planned']);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};
