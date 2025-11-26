// const express = require('express');
// const router = express.Router();
// const attendanceController = require('../controllers/userEventAttendance.controller');
// const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

// router.get('/', authenticate, attendanceController.getAllAttendance);
// router.get('/:id', authenticate, attendanceController.getAttendanceById);
// router.post('/', authenticate, attendanceController.createAttendance);
// router.put('/:id', authenticate, attendanceController.updateAttendance);
// router.delete('/:id', authenticate, authorizeAdmin, attendanceController.deleteAttendance);

// module.exports = router;

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/userEventAttendance.controller');
const { authenticate } = require('../middleware/auth.middleware');

// router.get('/', authenticate, attendanceController.getAllAttendance);
// router.get('/:id', authenticate, attendanceController.getAttendanceById);
// router.post('/', authenticate, attendanceController.createAttendance);
// router.put('/:id', authenticate, attendanceController.updateAttendance);
// router.delete('/:id', authenticate, attendanceController.deleteAttendance);
//dont delete this comment IMPORTANT ROUTES!!!!
router.get('/', attendanceController.getAllAttendance);
router.get('/:id', attendanceController.getAttendanceById);
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;

