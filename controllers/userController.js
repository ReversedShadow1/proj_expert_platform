// controllers/userController.js
const User = require('../models/User');

// Get user profile by user ID
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve user profile', error: error.message });
    }
};

// Update user profile (name, surname, birthdate, photo)
exports.updateUserProfile = async (req, res) => {
    const { name, surname, birthdate, photo } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, surname, birthdate, photo },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password in response

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
};

// Update expert-specific details (skills, description, availability)
exports.updateExpertProfile = async (req, res) => {
    const { skills, description, location, availability } = req.body;

    try {
        // Ensure the user has expert privileges
        const user = await User.findById(req.user.id);
        if (user.role !== 'expert') {
            return res.status(403).json({ success: false, message: 'Access denied. Only experts can update this information.' });
        }

        // Update expert-specific details
        user.skills = skills || user.skills;
        user.description = description || user.description;
        user.location = location || user.location;
        user.availability = availability ?? user.availability;

        await user.save();

        res.json({ success: true, message: 'Expert profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update expert profile', error: error.message });
    }
};
