// const express = require('express');
// const router = express.Router();
// const eventsController = require('../controllers/events.controller');
// const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

// router.get('/', authenticate, eventsController.getAllEvents);
// router.get('/:id', authenticate, eventsController.getEventById);
// router.post('/', authenticate, authorizeAdmin, eventsController.createEvent);
// router.put('/:id', authenticate, authorizeAdmin, eventsController.updateEvent);
// router.delete('/:id', authenticate, authorizeAdmin, eventsController.deleteEvent);

// module.exports = router;

const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const { authenticate } = require('../middleware/auth.middleware');

// router.get('/', authenticate, eventsController.getAllEvents);
// router.get('/:id', authenticate, eventsController.getEventById);
// router.post('/', authenticate, eventsController.createEvent);
// router.put('/:id', authenticate, eventsController.updateEvent);
// router.delete('/:id', authenticate, eventsController.deleteEvent);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/', eventsController.getAllEvents);
router.get('/:id', eventsController.getEventById);
router.post('/', eventsController.createEvent);
router.put('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);
module.exports = router;

