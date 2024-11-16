const OTP = require('../models/OTP');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate and send OTP for email verification
exports.sendOtp = async (email) => {
    const otpCode = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Store OTP in the database
    await OTP.create({ email, otp: otpCode, expiresAt: otpExpiry });

    // Send OTP to user's email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otpCode}. It expires in 10 minutes.`
    });
};

// Verify OTP 
exports.verifyOtp = async (email, otpCode) => {
    const otpRecord = await OTP.findOne({ email, otp: otpCode });
    if (!otpRecord) return false;

    await OTP.deleteOne({ email, otp: otpCode }); // Delete OTP after successful verification
    return true;
};

// Register user 
exports.registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({ ...userData, password: hashedPassword });
    await user.save();
    return user;
};

// Login user and generate JWT
exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};
