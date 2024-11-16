const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const passport = require('./auth/googleStrategy'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const upgradeRoutes = require('./routes/upgradeRoutes');

const app = express();

connectDB();

app.use(express.json()); // For parsing JSON request bodies

// Session middleware (required for Passport sessions)
app.use(session({
    secret: process.env.SESSION_SECRET, // Secure session secret
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);        // Authentication routes
app.use('/api/user', userRoutes);        // User-related routes
app.use('/api/bookings', bookingRoutes); // Booking-related routes
app.use('/api/admin', adminRoutes);      // Admin-specific routes
app.use('/api/ratings', ratingRoutes);   // Rating and reviews
app.use('/api/upgrades', upgradeRoutes); // Expert upgrade requests

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

module.exports = app;
