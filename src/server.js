const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const { setupCustomStatusCodes } = require('./utils/statusCodes');
const { seedData } = require('./utils/seedData');

// Import routes
const voterRoutes = require('./routes/voterRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');
const resultRoutes = require('./routes/resultRoutes');
const ballotRoutes = require('./routes/ballotRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Setup custom status codes
setupCustomStatusCodes();

// Routes
app.use('/api/voters', voterRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/ballots', ballotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audits', auditRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`🗳️  Voting System API running on port ${PORT}`);
  console.log(`📊 Using Map-based fast lookup for optimal performance`);
  
  // Seed data in development mode
  if (config.env === 'development' && process.env.SEED_DATA === 'true') {
    console.log('\n🌱 Development mode: Seeding with sample data...');
    seedData();
  }
});

module.exports = app;
