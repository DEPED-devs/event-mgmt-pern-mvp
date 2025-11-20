const pool = require('../config/db');

exports.eventAnalytics = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const q = `
      SELECT q.id AS question_id, q.question_text,
        COUNT(r.response_text) AS responses,
        AVG(NULLIF(r.response_text,'' )::numeric) FILTER (WHERE q.question_type='rating') AS avg_rating
      FROM evaluation_questions q
      JOIN employee_evaluation_responses r ON r.question_id = q.id
      JOIN employee_evaluations ev ON ev.id = r.evaluation_id
      WHERE (ev.event_id = $1 OR ev.event_date_id IN (SELECT id FROM event_dates WHERE event_id = $1))
      GROUP BY q.id, q.question_text
      ORDER BY q.sort_order;
    `;
    const { rows } = await pool.query(q, [eventId]);
    res.json({ eventId, stats: rows });
  } catch (err) { next(err); }
};

exports.speakerAnalytics = async (req, res, next) => {
  try {
    const { speakerId } = req.params;
    const q = `
      SELECT q.id AS question_id, q.question_text,
        COUNT(r.response_text) AS responses,
        AVG(NULLIF(r.response_text,'' )::numeric) FILTER (WHERE q.question_type='rating') AS avg_rating
      FROM evaluation_questions q
      JOIN employee_evaluation_responses r ON r.question_id = q.id
      JOIN employee_evaluations ev ON ev.id = r.evaluation_id
      WHERE ev.resource_speaker_id = $1
      GROUP BY q.id, q.question_text
      ORDER BY q.sort_order;
    `;
    const { rows } = await pool.query(q, [speakerId]);
    res.json({ speakerId, stats: rows });
  } catch (err) { next(err); }
};

exports.exportEventCSV = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const q = `
      SELECT ev.id as evaluation_id, ev.employee_id, ev.event_id, ev.event_date_id, ev.resource_speaker_id,
             r.question_id, r.response_text
      FROM employee_evaluations ev
      JOIN employee_evaluation_responses r ON r.evaluation_id = ev.id
      WHERE (ev.event_id = $1 OR ev.event_date_id IN (SELECT id FROM event_dates WHERE event_id = $1))
      ORDER BY ev.id;
    `;
    const { rows } = await pool.query(q, [eventId]);

    const header = 'evaluation_id,employee_id,event_id,event_date_id,resource_speaker_id,question_id,response_text\n';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="event_${eventId}_responses.csv"`);

    res.write(header);
    for (const r of rows) {
      const line = [
        r.evaluation_id, r.employee_id || '', r.event_id || '', r.event_date_id || '', r.resource_speaker_id || '', r.question_id, (r.response_text||'').replace(/"/g,'""')
      ].map(v => `"${v}"`).join(',') + '\n';
      res.write(line);
    }
    res.end();
  } catch (err) { next(err); }
};

exports.exportSpeakerCSV = async (req, res, next) => {
  try {
    const { speakerId } = req.params;
    const q = `
      SELECT ev.id as evaluation_id, ev.employee_id, ev.event_id, ev.event_date_id, ev.resource_speaker_id,
             r.question_id, r.response_text
      FROM employee_evaluations ev
      JOIN employee_evaluation_responses r ON r.evaluation_id = ev.id
      WHERE ev.resource_speaker_id = $1
      ORDER BY ev.id;
    `;
    const { rows } = await pool.query(q, [speakerId]);

    const header = 'evaluation_id,employee_id,event_id,event_date_id,resource_speaker_id,question_id,response_text\n';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="speaker_${speakerId}_responses.csv"`);

    res.write(header);
    for (const r of rows) {
      const line = [
        r.evaluation_id, r.employee_id || '', r.event_id || '', r.event_date_id || '', r.resource_speaker_id || '', r.question_id, (r.response_text||'').replace(/"/g,'""')
      ].map(v => `"${v}"`).join(',') + '\n';
      res.write(line);
    }
    res.end();
  } catch (err) { next(err); }
};
