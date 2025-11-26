// const express = require('express');
// const router = express.Router();
// const eventDatesController = require('../controllers/eventDates.controller');
// const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

// router.get('/', authenticate, eventDatesController.getAllEventDates);
// router.get('/:id', authenticate, eventDatesController.getEventDateById);
// router.post('/', authenticate, authorizeAdmin, eventDatesController.createEventDate);
// router.put('/:id', authenticate, authorizeAdmin, eventDatesController.updateEventDate);
// router.delete('/:id', authenticate, authorizeAdmin, eventDatesController.deleteEventDate);

// module.exports = router;

const express = require('express');
const router = express.Router();
const eventDatesController = require('../controllers/eventDates.controller');
const { authenticate } = require('../middleware/auth.middleware');

// router.get('/', authenticate, eventDatesController.getAllEventDates);
// router.get('/:id', authenticate, eventDatesController.getEventDateById);
// router.post('/', authenticate, eventDatesController.createEventDate);
// router.put('/:id', authenticate, eventDatesController.updateEventDate);
// router.delete('/:id', authenticate, eventDatesController.deleteEventDate);
//dont delete this comment IMPORTANT ROUTES!!!!

router.get('/', eventDatesController.getAllEventDates);
router.get('/:id', eventDatesController.getDatesByEventId);
router.post('/', eventDatesController.createEventDate);
router.put('/:id', eventDatesController.updateEventDate);
router.delete('/:id', eventDatesController.deleteEventDate);

module.exports = router;
