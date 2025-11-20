const pool = require('../config/db');

exports.getEventQuestions = async (req, res, next) => {
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

exports.updateEventQuestions = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { questions } = req.body; // array of {question_text, question_type, sort_order, is_for_resource_speaker}
    await pool.query('DELETE FROM evaluation_questions WHERE event_id=$1', [eventId]);
    const insertText = 'INSERT INTO evaluation_questions (event_id, question_text, question_type, is_for_resource_speaker, sort_order) VALUES ($1,$2,$3,$4,$5)';
    for (const q of questions) {
      await pool.query(insertText, [eventId, q.question_text, q.question_type || 'rating', q.is_for_resource_speaker || false, q.sort_order || 0]);
    }
    res.json({ message: 'Event questions updated' });
  } catch (err) { next(err); }
};

exports.getSpeakerQuestions = async (req, res, next) => {
  try {
    const qRes = await pool.query('SELECT * FROM evaluation_questions WHERE is_for_resource_speaker=TRUE ORDER BY sort_order');
    res.json({ questions: qRes.rows });
  } catch (err) { next(err); }
};

exports.updateSpeakerQuestions = async (req, res, next) => {
  try {
    const { questions } = req.body;
    await pool.query('DELETE FROM evaluation_questions WHERE is_for_resource_speaker=TRUE AND event_id IS NULL AND event_type_id IS NULL');
    const insertText = 'INSERT INTO evaluation_questions (question_text, question_type, is_for_resource_speaker, sort_order) VALUES ($1,$2,$3,$4)';
    for (const q of questions) {
      await pool.query(insertText, [q.question_text, q.question_type || 'rating', true, q.sort_order || 0]);
    }
    res.json({ message: 'Speaker questions updated (global)' });
  } catch (err) { next(err); }
};
