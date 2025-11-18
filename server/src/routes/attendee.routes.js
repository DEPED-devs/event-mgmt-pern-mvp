const router = require('express').Router();
const controller = require('../controllers/attendee.controller');

router.post('/', controller.addAttendee);
router.get('/:event_id', controller.getEventAttendees);

module.exports = router;
