require('dotenv').config();
const dns = require('dns');

// Use Google DNS to prevent MongoDB Atlas SRV resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize the application
const app = express();

// Connect to MongoDB
// Only connect if URI is provided, to prevent crash if not fully configured yet
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.log('MongoDB URI not found in .env, skipping database connection');
}

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));

// Comprehensive health check route
app.get('/', (req, res) => {
  const mongoose = require('mongoose');
  const bulkEmailController = require('./controllers/bulkEmailController');
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    99: 'Uninitialized'
  };

  const healthData = {
    status: 'OK',
    message: 'Wiswora API is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100} MB`,
    },
    database: {
      state: dbState,
      status: dbStatusMap[dbState] || 'Unknown'
    },
    emailProgress: bulkEmailController.getProgress()
  };

  res.status(200).json(healthData);
});

// Protect sensitive API routes
app.use('/api', (req, res, next) => {
  // Allow CORS preflight requests to pass through
  if (req.method === 'OPTIONS') return next();
  
  const publicPostRoutes = ['/users/login', '/users/setup', '/registrations', '/payments', '/inboxs'];
  const isPublicPost = req.method === 'POST' && publicPostRoutes.some(r => req.path.startsWith(r));
  if (isPublicPost) return next();
  
  const sensitiveGetRoutes = ['/users', '/settings', '/inboxs', '/failedpayments', '/stats', '/emailtemplates'];
  const isSensitiveGet = req.method === 'GET' && sensitiveGetRoutes.some(r => req.path.startsWith(r));

  if (req.method !== 'GET' || isSensitiveGet) {
    return require('./middleware/auth.middleware')(req, res, next);
  }
  
  next();
});

// Mount routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/teammembers', require('./routes/teammember.routes'));
app.use('/api/eventdates', require('./routes/eventdate.routes'));
app.use('/api/venues', require('./routes/venue.routes'));
app.use('/api/speakers', require('./routes/speaker.routes'));
app.use('/api/schedules', require('./routes/schedule.routes'));
app.use('/api/topics', require('./routes/topic.routes'));
app.use('/api/sponsors', require('./routes/sponsor.routes'));
app.use('/api/abstracts', require('./routes/abstract.routes'));
app.use('/api/registrations', require('./routes/registration.routes'));
app.use('/api/inboxs', require('./routes/inbox.routes'));
app.use('/api/emailtemplates', require('./routes/emailtemplate.routes'));
app.use('/api/pricings', require('./routes/pricing.routes'));
app.use('/api/settings', require('./routes/setting.routes'));
app.use('/api/brochures', require('./routes/brochure.routes'));
app.use('/api/failedpayments', require('./routes/failedpayment.routes'));
app.use('/api/organizers', require('./routes/organizer.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/faqs', require('./routes/faq.routes'));
app.use('/api/testimonials', require('./routes/testimonial.routes'));
app.use('/api/sitecontent', require('./routes/sitecontent.routes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/venue-galleries', require('./routes/venueGallery.routes'));
// app.use('/api/mail', require('./routes/mailRoutes'));
app.use('/api/bulk-emails', require('./routes/bulkEmailRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Restart triggered
});
