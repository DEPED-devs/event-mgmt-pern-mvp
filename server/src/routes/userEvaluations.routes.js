// const express = require('express');
// const router = express.Router();
// const evaluationsController = require('../controllers/userEvaluations.controller');
// const { authenticate } = require('../middleware/auth.middleware');

// router.get('/', authenticate, evaluationsController.getAllEvaluations);
// router.get('/:id', authenticate, evaluationsController.getEvaluationById);
// router.post('/', authenticate, evaluationsController.createEvaluation);
// router.put('/:id', authenticate, evaluationsController.updateEvaluation);
// router.delete('/:id', authenticate, evaluationsController.deleteEvaluation);

// module.exports = router;

const express = require('express');
const router = express.Router();
const evaluationsController = require('../controllers/userEvaluations.controller');
const { authenticate } = require('../middleware/auth.middleware');

// router.get('/', authenticate, evaluationsController.getAllEvaluations);
// router.get('/:id', authenticate, evaluationsController.getEvaluationById);
// router.post('/', authenticate, evaluationsController.createEvaluation);
// router.put('/:id', authenticate, evaluationsController.updateEvaluation);
// router.delete('/:id', authenticate, evaluationsController.deleteEvaluation);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/', evaluationsController.getAllEvaluations);
router.get('/:id', evaluationsController.getEvaluationById);
router.post('/', evaluationsController.createEvaluation);
router.put('/:id', evaluationsController.updateEvaluation);
router.delete('/:id', evaluationsController.deleteEvaluation);
module.exports = router;

