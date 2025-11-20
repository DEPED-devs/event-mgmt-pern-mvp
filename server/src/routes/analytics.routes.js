const router = require('express').Router();
const ctrl = require('../controllers/analytics.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

router.get('/event/:eventId', authenticate, ctrl.eventAnalytics);
router.get('/event/:eventId/csv', authenticate, authorizeAdmin, ctrl.exportEventCSV);

router.get('/speaker/:speakerId', authenticate, ctrl.speakerAnalytics);
router.get('/speaker/:speakerId/csv', authenticate, authorizeAdmin, ctrl.exportSpeakerCSV);

module.exports = router;
