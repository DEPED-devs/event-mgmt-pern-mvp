const router = require('express').Router();
const controller = require('../controllers/speaker.controller');

router.post('/', controller.addSpeaker);
router.get('/event/:event_id', controller.getSpeakersByEvent);

module.exports = router;
