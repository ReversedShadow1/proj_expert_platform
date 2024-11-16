// controllers/adminController.js
const User = require('../models/User');

// Get all pending upgrade requests
exports.getPendingUpgradeRequests = async (req, res) => {
    try {
        const pendingRequests = await User.find({ 'upgradeRequest.status': 'pending' });
        res.json({ success: true, pendingRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve pending requests', error: error.message });
    }
};

// Approve or reject an upgrade request
exports.processUpgradeRequest = async (req, res) => {
    const { userId, approval } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (approval) {
            user.role = 'expert';
            user.upgradeRequest.status = 'approved';
        } else {
            user.upgradeRequest.status = 'rejected';
        }
        await user.save();

        res.json({ success: true, message: `Upgrade request ${approval ? 'approved' : 'rejected'}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process request', error: error.message });
    }
};
