// const pool = require('../config/db');

// exports.addAttendee = async (req, res, next) => {
//   try {
//     const { event_id, name, email } = req.body;
//     const { rows } = await pool.query(
//       `INSERT INTO event_attendees (event_id, name, email)
//        VALUES ($1,$2,$3) RETURNING *`,
//       [event_id, name, email]
//     );
//     res.status(201).json(rows[0]);
//   } catch (err) { next(err); }
// };

// exports.getEventAttendees = async (req, res, next) => {
//   try {
//     const { event_id } = req.params;
//     const { rows } = await pool.query('SELECT * FROM event_attendees WHERE event_id=$1', [event_id]);
//     res.json(rows);
//   } catch (err) { next(err); }
// };


const pool = require('../config/db');

exports.addAttendee = async (req, res, next) => {
  try {
    const { event_date_id, employee_id } = req.body;
    const { rows } = await pool.query('INSERT INTO user_event_attendance (employee_id, event_date_id) VALUES ($1,$2) RETURNING *', [employee_id, event_date_id]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};
exports.getAttendeesForSession = async (req, res, next) => {
  try {
    const { event_date_id } = req.params;

    const { rows } = await pool.query(`
      SELECT a.*, e.full_name, e.department
      FROM user_event_attendance a
      JOIN employees e ON e.id = a.employee_id
      WHERE a.event_date_id = $1
    `, [event_date_id]);

    res.json(rows);
  } catch (err) {
    next(err);
  }
};
