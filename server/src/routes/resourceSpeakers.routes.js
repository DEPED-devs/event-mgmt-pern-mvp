// const express = require('express');
// const router = express.Router();
// const resourceSpeakersController = require('../controllers/resourceSpeakers.controller');
// const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

// router.get('/', authenticate, resourceSpeakersController.getAllSpeakers);
// router.get('/:id', authenticate, resourceSpeakersController.getSpeakerById);
// router.post('/', authenticate, authorizeAdmin, resourceSpeakersController.createSpeaker);
// router.put('/:id', authenticate, authorizeAdmin, resourceSpeakersController.updateSpeaker);
// router.delete('/:id', authenticate, authorizeAdmin, resourceSpeakersController.deleteSpeaker);

// module.exports = router;

const express = require('express');
const router = express.Router();
const speakersController = require('../controllers/resourceSpeaker.controller');
const { authenticate } = require('../middleware/auth.middleware');

// router.get('/', authenticate, speakersController.getAllSpeakers);
// router.get('/:id', authenticate, speakersController.getSpeakerById);
// router.post('/', authenticate, speakersController.createSpeaker);
// router.put('/:id', authenticate, speakersController.updateSpeaker);
// router.delete('/:id', authenticate, speakersController.deleteSpeaker);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/', speakersController.getAllResourceSpeakers);
router.get('/:id', speakersController.getResourceSpeakerById);
router.post('/', speakersController.createResourceSpeaker);
router.put('/:id', speakersController.updateResourceSpeaker);
router.delete('/:id', speakersController.deleteResourceSpeaker);

module.exports = router;
