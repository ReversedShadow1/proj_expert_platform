// controllers/ratingController.js
const Rating = require('../models/Rating');
const Booking = require('../models/Booking');

// Add a rating after a completed service
exports.addRating = async (req, res) => {
    const { expertId, bookingId, score, comment } = req.body;
    const userId = req.user.id;

    // Check if the booking is completed and belongs to the user
    const booking = await Booking.findOne({ _id: bookingId, userId, expertId, status: 'completed' });
    if (!booking) {
        return res.status(400).json({ success: false, message: 'Invalid or incomplete booking' });
    }

    // Create and save rating
    const rating = new Rating({ userId, expertId, score, comment });
    await rating.save();

    res.json({ success: true, rating });
};
