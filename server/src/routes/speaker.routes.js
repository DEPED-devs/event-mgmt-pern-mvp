// const router = require('express').Router();
// const controller = require('../controllers/speaker.controller');

// router.post('/', controller.addSpeaker);
// router.get('/event/:event_id', controller.getSpeakersByEvent);

// module.exports = router;

const router = require('express').Router();
const controller = require('../controllers/speaker.controller');

// ADD SPEAKER TO EVENT
router.post('/', controller.addSpeakerToEvent);

// GET SPEAKERS FOR EVENT
router.get('/event/:eventId', controller.getSpeakersForEvent);

module.exports = router;
