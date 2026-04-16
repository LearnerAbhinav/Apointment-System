const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const appointmentRoutes = require('./routes/appointment.routes');
const chatRoutes = require('./routes/chat.routes');
const errorHandler = require('./middleware/error');

const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI Appointment Booking API is running', status: 'healthy' });
});

app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);

// Static File Serving (Production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client', 'dist', 'index.html'));
  });
}

// Error Handling
app.use(errorHandler);

module.exports = app;
