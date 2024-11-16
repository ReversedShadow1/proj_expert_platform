const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to check if user is an admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
    next();
};

// Get all pending upgrade requests
router.get('/pending-upgrades', authMiddleware, adminMiddleware, adminController.getPendingUpgradeRequests);

// Approve or reject an upgrade request
router.post('/process-upgrade', authMiddleware, adminMiddleware, adminController.processUpgradeRequest);

module.exports = router;
