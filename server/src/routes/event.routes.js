const router = require('express').Router();
const controller = require('../controllers/event.controller');

router.get('/', controller.getEvents);
router.get('/:id', controller.getEventById);
router.post('/', controller.createEvent);

module.exports = router;
