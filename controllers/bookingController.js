// controllers/bookingController.js
const stripe = require('../config/stripe');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Create a booking and initiate payment
exports.createBooking = async (req, res) => {
    try {
        const { expertId, date, amount } = req.body;
        const userId = req.user.id; // Authenticated user

        // Create booking in the database
        const booking = new Booking({
            userId,
            expertId,
            date,
            amount,
            paymentStatus: 'unpaid'
        });
        await booking.save();

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in cents
            currency: 'usd',
            metadata: { bookingId: booking._id.toString() }
        });

        // Store the payment intent ID in the booking
        booking.paymentIntentId = paymentIntent.id;
        await booking.save();

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret, // Send clientSecret to the frontend
            bookingId: booking._id
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Confirm payment and update booking status
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update booking to 'paid' and confirm status
            const booking = await Booking.findOneAndUpdate(
                { paymentIntentId },
                { paymentStatus: 'paid', status: 'confirmed' },
                { new: true }
            );

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            res.json({ success: true, booking });
        } else {
            res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
