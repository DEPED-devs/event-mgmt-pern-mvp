// const router = require('express').Router();
// const controller = require('../controllers/evaluation.controller');

// router.get('/event/form/:event_id', controller.getEventForm);
// router.post('/event/submit', controller.submitEventEvaluation);

// router.get('/speaker/form/:speaker_id', controller.getSpeakerForm);
// router.post('/speaker/submit', controller.submitSpeakerEvaluation);

// router.get('/analytics/event/:event_id', controller.getEventAnalytics);
// router.get('/analytics/speaker/:speaker_id', controller.getSpeakerAnalytics);

// module.exports = router;


const router = require('express').Router();
const ctrl = require('../controllers/evaluationQuestions.controller');
const { authenticate } = require('../middleware/auth.middleware');

// router.get('/event/form/:eventId', ctrl.getEventForm);
// router.post('/event/:eventId', authenticate, ctrl.submitEventEvaluation);

// router.get('/speaker/form/:speakerId', ctrl.getSpeakerForm);
// router.post('/speaker/:speakerId', authenticate, ctrl.submitSpeakerEvaluation);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/event/form/:eventId', ctrl.getEventForm);
router.post('/event/:eventId', ctrl.submitEventEvaluation);

router.get('/speaker/form/:speakerId', ctrl.getSpeakerForm);
router.post('/speaker/:speakerId', ctrl.submitSpeakerEvaluation);

module.exports = router;
