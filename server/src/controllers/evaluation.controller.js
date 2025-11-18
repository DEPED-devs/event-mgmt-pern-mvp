const pool = require('../config/db');

exports.getEventForm = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const formRes = await pool.query('SELECT * FROM evaluation_forms WHERE event_id=$1', [event_id]);
    const form = formRes.rows[0];
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const qRes = await pool.query('SELECT * FROM evaluation_questions WHERE form_id=$1 ORDER BY order_index', [form.id]);
    res.json({ form, questions: qRes.rows });
  } catch (err) { next(err); }
};

exports.submitEventEvaluation = async (req, res, next) => {
  try {
    const { event_id, attendee_id, answers } = req.body;
    const rRes = await pool.query(
      'INSERT INTO evaluation_responses (event_id, attendee_id) VALUES ($1,$2) RETURNING *',
      [event_id, attendee_id || null]
    );
    const responseId = rRes.rows[0].id;

    for (const a of answers) {
      await pool.query(
        'INSERT INTO evaluation_answers (response_id, question_id, answer) VALUES ($1,$2,$3)',
        [responseId, a.question_id, String(a.answer)]
      );
    }

    if (attendee_id) {
      await pool.query('UPDATE event_attendees SET has_submitted=true WHERE id=$1', [attendee_id]);
    }

    res.json({ message: 'Submitted' });
  } catch (err) { next(err); }
};

exports.getSpeakerForm = async (req, res, next) => {
  try {
    const { speaker_id } = req.params;
    const spRes = await pool.query('SELECT * FROM speakers WHERE id=$1', [speaker_id]);
    const speaker = spRes.rows[0];
    if (!speaker) return res.status(404).json({ error: 'Speaker not found' });

    const fRes = await pool.query('SELECT * FROM speaker_evaluation_forms WHERE speaker_id=$1', [speaker_id]);
    const form = fRes.rows[0];
    const qRes = await pool.query('SELECT * FROM speaker_evaluation_questions WHERE form_id=$1 ORDER BY order_index', [form.id]);
    res.json({ speaker, form, questions: qRes.rows });
  } catch (err) { next(err); }
};

exports.submitSpeakerEvaluation = async (req, res, next) => {
  try {
    const { speaker_id, attendee_id, answers } = req.body;
    const rRes = await pool.query(
      'INSERT INTO speaker_evaluation_responses (speaker_id, attendee_id) VALUES ($1,$2) RETURNING *',
      [speaker_id, attendee_id || null]
    );
    const responseId = rRes.rows[0].id;

    for (const a of answers) {
      await pool.query(
        'INSERT INTO speaker_evaluation_answers (response_id, question_id, answer) VALUES ($1,$2,$3)',
        [responseId, a.question_id, String(a.answer)]
      );
    }

    res.json({ message: 'Submitted' });
  } catch (err) { next(err); }
};

exports.getEventAnalytics = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const total = await pool.query('SELECT COUNT(*)::int AS cnt FROM evaluation_responses WHERE event_id=$1', [event_id]);
    res.json({ total_responses: total.rows[0].cnt });
  } catch (err) { next(err); }
};

exports.getSpeakerAnalytics = async (req, res, next) => {
  try {
    const { speaker_id } = req.params;
    const total = await pool.query('SELECT COUNT(*)::int AS cnt FROM speaker_evaluation_responses WHERE speaker_id=$1', [speaker_id]);
    res.json({ total_responses: total.rows[0].cnt });
  } catch (err) { next(err); }
};
