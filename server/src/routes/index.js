const express = require('express');
const router = express.Router();

// Import routes
const usersRoutes = require('./users.routes');
const rolesRoutes = require('./roles.routes');
const eventTypesRoutes = require('./eventTypes.routes');
const eventsRoutes = require('./events.routes');
const resourceSpeakersRoutes = require('./resourceSpeakers.routes');
const eventDatesRoutes = require('./eventDates.routes');
const userEventAttendanceRoutes = require('./userEventAttendance.routes');
const evaluationQuestionsRoutes = require('./evaluationQuestions.routes');
const userEvaluationsRoutes = require('./userEvaluations.routes');
const userEvaluationResponsesRoutes = require('./userEvaluationResponses.routes');

// Mount routes
router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/event-types', eventTypesRoutes);
router.use('/events', eventsRoutes);
router.use('/resource-speakers', resourceSpeakersRoutes);
router.use('/event-dates', eventDatesRoutes);
router.use('/attendance', userEventAttendanceRoutes);
router.use('/evaluation-questions', evaluationQuestionsRoutes);
router.use('/user-evaluations', userEvaluationsRoutes);
router.use('/evaluation-responses', userEvaluationResponsesRoutes);

module.exports = router;
