const pool = require('../config/db');

// Columns we consistently return
const RESPONSE_COLUMNS = `
    id,
    evaluation_id,
    question_id,
    response_text,
    created_at
`;

// =========================================
// GET ALL RESPONSES
// =========================================
exports.getAllResponses = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${RESPONSE_COLUMNS} 
       FROM user_evaluation_responses
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================================
// GET RESPONSE BY ID
// =========================================
exports.getResponseById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${RESPONSE_COLUMNS}
       FROM user_evaluation_responses
       WHERE id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================================
// CREATE RESPONSE
// =========================================
exports.createResponse = async (req, res) => {
  try {
    const { evaluation_id, question_id, response_text } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO user_evaluation_responses 
       (evaluation_id, question_id, response_text)
       VALUES ($1, $2, $3)
       RETURNING ${RESPONSE_COLUMNS}`,
      [evaluation_id, question_id, response_text]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================================
// UPDATE RESPONSE
// =========================================
exports.updateResponse = async (req, res) => {
  const { id } = req.params;
  const { evaluation_id, question_id, response_text } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE user_evaluation_responses
       SET evaluation_id = $1,
           question_id = $2,
           response_text = $3
       WHERE id = $4
       RETURNING ${RESPONSE_COLUMNS}`,
      [evaluation_id, question_id, response_text, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================================
// DELETE RESPONSE
// =========================================
exports.deleteResponse = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM user_evaluation_responses WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.json({ message: 'Response deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
