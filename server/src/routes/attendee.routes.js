const router = require('express').Router();
const controller = require('../controllers/attendee.controller');

router.post('/', controller.addAttendee);
router.get('/:event_date_id', controller.getAttendeesForSession);

module.exports = router;
