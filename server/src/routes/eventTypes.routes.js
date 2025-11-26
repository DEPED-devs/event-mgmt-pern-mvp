const express = require('express');
const router = express.Router();
const eventTypesController = require('../controllers/eventTypes.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRole } = require('../middleware/role.middleware');

// router.get('/', authenticate, eventTypesController.getAllEventTypes);
// router.get('/:id', authenticate, eventTypesController.getEventTypeById);
// router.post('/', authenticate, authorizeRole(['admin']), eventTypesController.createEventType);
// router.put('/:id', authenticate, authorizeRole(['admin']), eventTypesController.updateEventType);
// router.delete('/:id', authenticate, authorizeRole(['admin']), eventTypesController.deleteEventType);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/', eventTypesController.getAllEventTypes);
router.get('/:id', eventTypesController.getEventTypeById);
router.post('/', eventTypesController.createEventType);
router.put('/:id', eventTypesController.updateEventType);
router.delete('/:id', eventTypesController.deleteEventType);
module.exports = router;
