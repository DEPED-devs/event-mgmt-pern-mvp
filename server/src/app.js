const express = require('express');
const cors = require('cors');

const eventRoutes = require('./routes/event.routes');
const attendeeRoutes = require('./routes/attendee.routes');
const evaluationRoutes = require('./routes/evaluation.routes');
const speakerRoutes = require('./routes/speaker.routes');
const authRoutes = require('./routes/auth.routes');
const formbuilderRoutes = require('./routes/formbuilder.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
app.use(cors());
app.use(express.json());


// ... other routes
app.use('/api/auth', authRoutes);
app.use('/api/formbuilder', formbuilderRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use('/api/events', eventRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/speakers', speakerRoutes);

app.get('/', (req, res) => res.json({ message: 'Event mgmt API' }));

// simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

module.exports = app;
