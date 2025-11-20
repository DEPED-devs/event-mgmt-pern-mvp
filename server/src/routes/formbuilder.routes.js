const router = require('express').Router();
const ctrl = require('../controllers/formbuilder.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

router.get('/event/:eventId', ctrl.getEventQuestions);
router.post('/event/:eventId', authenticate, authorizeAdmin, ctrl.updateEventQuestions);

router.get('/speaker/:speakerId', ctrl.getSpeakerQuestions);
router.post('/speaker/:speakerId', authenticate, authorizeAdmin, ctrl.updateSpeakerQuestions);

module.exports = router;
