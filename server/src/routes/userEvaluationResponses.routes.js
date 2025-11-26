const express = require('express');
const router = express.Router();
const responsesController = require('../controllers/userEvaluationResponses.controller');
const { authenticate } = require('../middleware/auth.middleware');

// router.get('/', authenticate, responsesController.getAllResponses);
// router.get('/:id', authenticate, responsesController.getResponseById);
// router.post('/', authenticate, responsesController.createResponse);
// router.put('/:id', authenticate, responsesController.updateResponse);
// router.delete('/:id', authenticate, responsesController.deleteResponse);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/', responsesController.getAllResponses);
router.get('/:id', responsesController.getResponseById);
router.post('/', responsesController.createResponse);
router.put('/:id', responsesController.updateResponse);
router.delete('/:id', responsesController.deleteResponse);

module.exports = router;
