const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Load Models
require('./models/Tenant');
require('./models/User');
require('./models/UsageLog');
require('./models/AnalyticsReport');

const app = express();

const passport = require('passport');
const tenantResolver = require('./middleware/tenantResolver');

// Middleware
app.use(cors());
app.use(express.json());
app.use(tenantResolver);
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tenant', require('./routes/tenantRoutes'));
app.use('/api/usage', require('./routes/usageRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Basic Route for Health Check
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
