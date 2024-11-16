const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register); // Step 1: Send OTP
router.post('/register/verify', authController.verifyRegistrationOtp); // Step 2: Verify OTP

router.get('/google', authController.googleLogin); // Google OAuth login
router.get('/google/callback', authController.googleCallback); // Google OAuth callback

module.exports = router;
