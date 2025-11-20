// const pool = require('../config/db');

// exports.getEventForm = async (req, res, next) => {
//   try {
//     const { event_id } = req.params;
//     const formRes = await pool.query('SELECT * FROM evaluation_forms WHERE event_id=$1', [event_id]);
//     const form = formRes.rows[0];
//     if (!form) return res.status(404).json({ error: 'Form not found' });

//     const qRes = await pool.query('SELECT * FROM evaluation_questions WHERE form_id=$1 ORDER BY order_index', [form.id]);
//     res.json({ form, questions: qRes.rows });
//   } catch (err) { next(err); }
// };

// exports.submitEventEvaluation = async (req, res, next) => {
//   try {
//     const { event_id, attendee_id, answers } = req.body;
//     const rRes = await pool.query(
//       'INSERT INTO evaluation_responses (event_id, attendee_id) VALUES ($1,$2) RETURNING *',
//       [event_id, attendee_id || null]
//     );
//     const responseId = rRes.rows[0].id;

//     for (const a of answers) {
//       await pool.query(
//         'INSERT INTO evaluation_answers (response_id, question_id, answer) VALUES ($1,$2,$3)',
//         [responseId, a.question_id, String(a.answer)]
//       );
//     }

//     if (attendee_id) {
//       await pool.query('UPDATE event_attendees SET has_submitted=true WHERE id=$1', [attendee_id]);
//     }

//     res.json({ message: 'Submitted' });
//   } catch (err) { next(err); }
// };

// exports.getSpeakerForm = async (req, res, next) => {
//   try {
//     const { speaker_id } = req.params;
//     const spRes = await pool.query('SELECT * FROM speakers WHERE id=$1', [speaker_id]);
//     const speaker = spRes.rows[0];
//     if (!speaker) return res.status(404).json({ error: 'Speaker not found' });

//     const fRes = await pool.query('SELECT * FROM speaker_evaluation_forms WHERE speaker_id=$1', [speaker_id]);
//     const form = fRes.rows[0];
//     const qRes = await pool.query('SELECT * FROM speaker_evaluation_questions WHERE form_id=$1 ORDER BY order_index', [form.id]);
//     res.json({ speaker, form, questions: qRes.rows });
//   } catch (err) { next(err); }
// };

// exports.submitSpeakerEvaluation = async (req, res, next) => {
//   try {
//     const { speaker_id, attendee_id, answers } = req.body;
//     const rRes = await pool.query(
//       'INSERT INTO speaker_evaluation_responses (speaker_id, attendee_id) VALUES ($1,$2) RETURNING *',
//       [speaker_id, attendee_id || null]
//     );
//     const responseId = rRes.rows[0].id;

//     for (const a of answers) {
//       await pool.query(
//         'INSERT INTO speaker_evaluation_answers (response_id, question_id, answer) VALUES ($1,$2,$3)',
//         [responseId, a.question_id, String(a.answer)]
//       );
//     }

//     res.json({ message: 'Submitted' });
//   } catch (err) { next(err); }
// };

// exports.getEventAnalytics = async (req, res, next) => {
//   try {
//     const { event_id } = req.params;
//     const total = await pool.query('SELECT COUNT(*)::int AS cnt FROM evaluation_responses WHERE event_id=$1', [event_id]);
//     res.json({ total_responses: total.rows[0].cnt });
//   } catch (err) { next(err); }
// };

// exports.getSpeakerAnalytics = async (req, res, next) => {
//   try {
//     const { speaker_id } = req.params;
//     const total = await pool.query('SELECT COUNT(*)::int AS cnt FROM speaker_evaluation_responses WHERE speaker_id=$1', [speaker_id]);
//     res.json({ total_responses: total.rows[0].cnt });
//   } catch (err) { next(err); }
// };


const pool = require('../config/db');

exports.getEventForm = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const evQ = await pool.query('SELECT * FROM evaluation_questions WHERE event_id=$1 ORDER BY sort_order', [eventId]);
    if (evQ.rows.length > 0) return res.json({ source: 'event', questions: evQ.rows });

    const etRes = await pool.query('SELECT event_type_id FROM events WHERE id=$1', [eventId]);
    if (etRes.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    const etId = etRes.rows[0].event_type_id;
    const typeQ = await pool.query('SELECT * FROM evaluation_questions WHERE event_type_id=$1 ORDER BY sort_order', [etId]);
    res.json({ source: 'event_type', questions: typeQ.rows });
  } catch (err) { next(err); }
};

exports.submitEventEvaluation = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { employee_id, event_date_id, answers, overall_rating, general_comment } = req.body;
    const r = await pool.query(
      `INSERT INTO employee_evaluations (employee_id, event_id, event_date_id, overall_rating, general_comment)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`, [employee_id, eventId, event_date_id || null, overall_rating || null, general_comment || null]
    );
    const evalId = r.rows[0].id;
    for (const a of answers) {
      await pool.query('INSERT INTO employee_evaluation_responses (evaluation_id, question_id, response_text) VALUES ($1,$2,$3)', [evalId, a.question_id, String(a.answer)]);
    }
    res.json({ message: 'Evaluation submitted', evaluation_id: evalId });
  } catch (err) { next(err); }
};

exports.getSpeakerForm = async (req, res, next) => {
  try {
    const { speakerId } = req.params;
    const sp = await pool.query('SELECT * FROM resource_speakers WHERE id=$1', [speakerId]);
    if (sp.rows.length === 0) return res.status(404).json({ error: 'Speaker not found' });
    const qRes = await pool.query('SELECT * FROM evaluation_questions WHERE is_for_resource_speaker=TRUE ORDER BY sort_order');
    res.json({ speaker: sp.rows[0], questions: qRes.rows });
  } catch (err) { next(err); }
};

exports.submitSpeakerEvaluation = async (req, res, next) => {
  try {
    const { speakerId } = req.params;
    const { employee_id, event_id, event_date_id, answers, overall_rating, general_comment } = req.body;
    const r = await pool.query(
      `INSERT INTO employee_evaluations (employee_id, event_id, event_date_id, resource_speaker_id, overall_rating, general_comment)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`, [employee_id, event_id || null, event_date_id || null, speakerId, overall_rating || null, general_comment || null]
    );
    const evalId = r.rows[0].id;
    for (const a of answers) {
      await pool.query('INSERT INTO employee_evaluation_responses (evaluation_id, question_id, response_text) VALUES ($1,$2,$3)', [evalId, a.question_id, String(a.answer)]);
    }
    res.json({ message: 'Speaker evaluation submitted', evaluation_id: evalId });
  } catch (err) { next(err); }
};
