// controllers/authController.js
const authService = require('../services/authService');
const passport = require('passport');
const User = require('../models/User');
const validation = require('../utils/validation');

// Step 1: Register by generating OTP and sending it to the user's email
exports.register = async (req, res) => {
    const { email, name, surname, birthdate, password } = req.body;
    
    // Check email format
    if (!validation.isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    // Check Password strength
    if (!validation.isStrongPassword(password)) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long and include a number.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    try {
        // Send OTP to email
        await authService.sendOtp(email);
        res.json({ success: true, message: 'OTP sent to your email. Please verify to complete registration.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
    }
};

// Step 2: Verify OTP and complete registration
exports.verifyRegistrationOtp = async (req, res) => {
    const { email, otpCode, name, surname, birthdate, password } = req.body;

    try {
        // Verify OTP
        const isOtpValid = await authService.verifyOtp(email, otpCode);
        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Complete registration by saving user with hashed password
        const userData = { email, name, surname, birthdate, password, role: 'user' };
        await authService.registerUser(userData);

        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
};

// Local login with email and password
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Authenticate user and generate JWT
        const token = await authService.loginUser(email, password);
        res.json({ success: true, token });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
};

// Google OAuth login
exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google OAuth callback
exports.googleCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
});
