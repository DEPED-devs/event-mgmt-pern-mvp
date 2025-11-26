// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const routes = require('./routes'); // Import the index.js routes

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', message: 'API is running' });
// });

// // API routes
// app.use('/api', routes); // Mount all routes under /api

// // 404 handler
// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Not Found' });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Server Error', error: err.message });
// });

// module.exports = app;

const express = require('express');
const app = express();
const routes = require('./routes'); // index.js

app.use(express.json());
app.use('/api', routes);

module.exports = app;
