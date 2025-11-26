// const pool=require('../config/db');

// exports.getAllQuestions = async (req, res) => {
//   try {
//     const questions = await db.evaluation_questions.findAll();
//     res.json(questions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getQuestionById = async (req, res) => {
//   try {
//     const question = await db.evaluation_questions.findByPk(req.params.id);
//     if (!question) return res.status(404).json({ message: 'Question not found' });
//     res.json(question);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createQuestion = async (req, res) => {
//   try {
//     const newQuestion = await db.evaluation_questions.create(req.body);
//     res.status(201).json(newQuestion);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateQuestion = async (req, res) => {
//   try {
//     const question = await db.evaluation_questions.findByPk(req.params.id);
//     if (!question) return res.status(404).json({ message: 'Question not found' });
//     await question.update(req.body);
//     res.json(question);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteQuestion = async (req, res) => {
//   try {
//     const question = await db.evaluation_questions.findByPk(req.params.id);
//     if (!question) return res.status(404).json({ message: 'Question not found' });
//     await question.destroy();
//     res.json({ message: 'Question deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// src/controllers/evaluationQuestions.controller.js
// src/controllers/evaluationQuestions.controller.js
const pool = require('../config/db');

// ---
// ## GET ALL QUESTIONS
exports.getAllQuestions = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, question_text, question_type FROM evaluation_questions ORDER BY id ASC`
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// ---
// ## GET QUESTION BY ID
exports.getQuestionById = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, question_text, question_type FROM evaluation_questions WHERE id = $1`,
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Evaluation question not found' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ---
// ## CREATE QUESTION
exports.createQuestion = async (req, res, next) => {
    const { question, type } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO evaluation_questions (question_text, question_type) VALUES ($1, $2) RETURNING *`,
            [question, type]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ---
// ## UPDATE QUESTION
exports.updateQuestion = async (req, res, next) => {
    const { id } = req.params;
    const { question, type } = req.body;
    
    try {
        const { rows } = await pool.query(
            `UPDATE evaluation_questions 
             SET question_text = $1, type = $2
             WHERE id = $3
             RETURNING id, question_text, question_type`,
            [question, type, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Evaluation question not found' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// ---
// ## DELETE QUESTION
exports.deleteQuestion = async (req, res, next) => {
    try {
        const result = await pool.query(
            `DELETE FROM evaluation_questions WHERE id = $1`, 
            [req.params.id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Evaluation question not found' });
        }

        res.json({ message: 'Evaluation question deleted successfully' });
    } catch (err) {
        next(err);
    }
};