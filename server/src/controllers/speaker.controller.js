// const pool = require('../config/db');

// exports.addSpeaker = async (req, res, next) => {
//   try {
//     const { event_id, name, topic } = req.body;
//     const { rows } = await pool.query(
//       `INSERT INTO speakers (event_id, name, topic) VALUES ($1,$2,$3) RETURNING *`,
//       [event_id, name, topic]
//     );

//     // create speaker evaluation form
//     await pool.query('INSERT INTO speaker_evaluation_forms (speaker_id) VALUES ($1)', [rows[0].id]);

//     res.status(201).json(rows[0]);
//   } catch (err) { next(err); }
// };

// exports.getSpeakersByEvent = async (req, res, next) => {
//   try {
//     const { event_id } = req.params;
//     const { rows } = await pool.query('SELECT * FROM speakers WHERE event_id=$1', [event_id]);
//     res.json(rows);
//   } catch (err) { next(err); }
// };


const pool = require('../config/db');

exports.addSpeakerToEvent = async (req, res, next) => {
  try {
    const { event_id, full_name, bio, email } = req.body;
    const sp = await pool.query('INSERT INTO resource_speakers (full_name, bio, email) VALUES ($1,$2,$3) RETURNING *', [full_name, bio || null, email || null]);
    await pool.query('INSERT INTO event_resource_speakers (event_id, resource_speaker_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [event_id, sp.rows[0].id]);
    res.status(201).json(sp.rows[0]);
  } catch (err) { next(err); }
};

exports.getSpeakersForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const q = `SELECT rs.* FROM resource_speakers rs JOIN event_resource_speakers ers ON ers.resource_speaker_id=rs.id WHERE ers.event_id=$1`;
    const { rows } = await pool.query(q, [eventId]);
    res.json(rows);
  } catch (err) { next(err); }
};
