const pool = require('../config/db');

// Columns list (keeps SELECT clauses clean)
const EVAL_COLS = `
    id,
    user_id,
    event_id,
    event_date_id,
    resource_speaker_id,
    overall_rating,
    general_comment,
    created_at
`;

// --------------------------------------------------
// GET ALL EVALUATIONS
// --------------------------------------------------
exports.getAllEvaluations = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT ${EVAL_COLS}
             FROM user_evaluations 
             ORDER BY id DESC`
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// --------------------------------------------------
// GET EVALUATION BY ID
// --------------------------------------------------
exports.getEvaluationById = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT ${EVAL_COLS}
             FROM user_evaluations 
             WHERE id = $1`,
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: "Evaluation not found" });

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// --------------------------------------------------
// CREATE EVALUATION
// --------------------------------------------------
exports.createEvaluation = async (req, res, next) => {
    try {
        const {
            user_id,
            event_id,
            event_date_id,
            resource_speaker_id,
            overall_rating,
            general_comment
        } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO user_evaluations 
                (user_id, event_id, event_date_id, resource_speaker_id, overall_rating, general_comment)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING ${EVAL_COLS}`,
            [
                user_id,
                event_id || null,
                event_date_id || null,
                resource_speaker_id || null,
                overall_rating || null,
                general_comment || null
            ]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        // Unique constraints (user + event, user + event_date, etc.)
        if (err.code === "23505") {
            return res.status(400).json({
                error: "A unique evaluation already exists for this user/event combination."
            });
        }
        next(err);
    }
};

// --------------------------------------------------
// UPDATE EVALUATION
// --------------------------------------------------
exports.updateEvaluation = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Check existence first
        const existing = await pool.query(
            `SELECT id FROM user_evaluations WHERE id = $1`,
            [id]
        );

        if (existing.rows.length === 0)
            return res.status(404).json({ message: "Evaluation not found" });

        const {
            user_id,
            event_id,
            event_date_id,
            resource_speaker_id,
            overall_rating,
            general_comment
        } = req.body;

        const { rows } = await pool.query(
            `UPDATE user_evaluations
             SET user_id=$1,
                 event_id=$2,
                 event_date_id=$3,
                 resource_speaker_id=$4,
                 overall_rating=$5,
                 general_comment=$6
             WHERE id=$7
             RETURNING ${EVAL_COLS}`,
            [
                user_id,
                event_id || null,
                event_date_id || null,
                resource_speaker_id || null,
                overall_rating || null,
                general_comment || null,
                id
            ]
        );

        res.json(rows[0]);
    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({
                error: "Duplicate evaluation detected (unique constraint)."
            });
        }
        next(err);
    }
};

// --------------------------------------------------
// DELETE EVALUATION
// --------------------------------------------------
exports.deleteEvaluation = async (req, res, next) => {
    try {
        const result = await pool.query(
            `DELETE FROM user_evaluations WHERE id=$1`,
            [req.params.id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ message: "Evaluation not found" });

        res.json({ message: "Evaluation deleted successfully" });
    } catch (err) {
        next(err);
    }
};
