const router = require('express').Router();
const controller = require('../controllers/evaluation.controller');

router.get('/event/form/:event_id', controller.getEventForm);
router.post('/event/submit', controller.submitEventEvaluation);

router.get('/speaker/form/:speaker_id', controller.getSpeakerForm);
router.post('/speaker/submit', controller.submitSpeakerEvaluation);

router.get('/analytics/event/:event_id', controller.getEventAnalytics);
router.get('/analytics/speaker/:speaker_id', controller.getSpeakerAnalytics);

module.exports = router;
