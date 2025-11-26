// const express = require('express');
// const router = express.Router();
// const questionsController = require('../controllers/evaluationQuestions.controller');
// const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

// router.get('/', authenticate, questionsController.getAllQuestions);
// router.get('/:id', authenticate, questionsController.getQuestionById);
// router.post('/', authenticate, authorizeAdmin, questionsController.createQuestion);
// router.put('/:id', authenticate, authorizeAdmin, questionsController.updateQuestion);
// router.delete('/:id', authenticate, authorizeAdmin, questionsController.deleteQuestion);

// module.exports = router;

const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/evaluationQuestions.controller');
const { authenticate } = require('../middleware/auth.middleware');

// router.get('/', authenticate, questionsController.getAllQuestions);
// router.get('/:id', authenticate, questionsController.getQuestionById);
// router.post('/', authenticate, questionsController.createQuestion);
// router.put('/:id', authenticate, questionsController.updateQuestion);
// router.delete('/:id', authenticate, questionsController.deleteQuestion);
//dont delete this comment IMPORTANT ROUTES!!!!

router.get('/', questionsController.getAllQuestions);
router.get('/:id', questionsController.getQuestionById);
router.post('/', questionsController.createQuestion);
router.put('/:id', questionsController.updateQuestion);
router.delete('/:id', questionsController.deleteQuestion);

module.exports = router;
