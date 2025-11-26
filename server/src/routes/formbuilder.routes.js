const router = require('express').Router();
const ctrl = require('../controllers/formbuilder.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRole } = require('../middleware/role.middleware');

// router.get('/event/:eventId', ctrl.getEventQuestions);
// router.post('/event/:eventId', authenticate, authorizeRole(['admin']), ctrl.updateEventQuestions);

// router.get('/speaker/:speakerId', ctrl.getSpeakerQuestions);
// router.post('/speaker/:speakerId', authenticate, authorizeRole(['admin']), ctrl.updateSpeakerQuestions);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/event/:eventId', ctrl.getEventQuestions);
router.post('/event/:eventId', ctrl.updateEventQuestions);

router.get('/speaker/:speakerId', ctrl.getSpeakerQuestions);
router.post('/speaker/:speakerId', ctrl.updateSpeakerQuestions);

module.exports = router;
