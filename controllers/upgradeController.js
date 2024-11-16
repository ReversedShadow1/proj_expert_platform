// controllers/upgradeController.js
const User = require('../models/User');
const Notification = require('../models/Notification');

// Request to become an expert
exports.requestUpgrade = async (req, res) => {
    const { professionalCard } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(userId, {
        upgradeRequest: {
            status: 'pending',
            professionalCard
        }
    });
    
    // Notify admin of the request
    await Notification.create({
        userId: null, // Admin
        message: `User ${user.name} has requested to become an expert.`
    });

    res.json({ success: true, message: 'Upgrade request submitted' });
};

// Admin action: approve or reject upgrade
exports.approveUpgrade = async (req, res) => {
    const { userId, approval } = req.body;

    const user = await User.findById(userId);
    if (approval) {
        user.role = 'expert';
    }
    user.upgradeRequest.status = approval ? 'approved' : 'rejected';
    await user.save();

    res.json({ success: true, message: `Upgrade request ${approval ? 'approved' : 'rejected'}` });
};
