const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// Create a booking and initialize payment
router.post('/create', bookingController.createBooking);

// Confirm payment and update booking status
router.post('/confirm', bookingController.confirmPayment);

module.exports = router;
