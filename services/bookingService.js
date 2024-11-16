const Booking = require('../models/Booking');

// Check expert's availability for a given date and time
exports.isAvailable = async (expertId, date) => {
    const existingBooking = await Booking.findOne({ expertId, date, status: 'confirmed' });
    return !existingBooking; // If no booking is found, expert is available
};

// Create a new booking
exports.createBooking = async (userId, expertId, date, title, details) => {
    const booking = new Booking({
        userId,
        expertId,
        date,
        title,
        details,
        status: 'pending'
    });
    await booking.save();
    return booking;
};

// Update booking status
exports.updateBookingStatus = async (bookingId, status) => {
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    return booking;
};
