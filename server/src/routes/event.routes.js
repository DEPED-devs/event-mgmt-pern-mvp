const router = require('express').Router();
const controller = require('../controllers/event.controller');

router.get('/', controller.getEvents);
router.get('/events/:id', controller.getEventById);
router.post('/events/createEvent', controller.createEvent);

module.exports = router;
