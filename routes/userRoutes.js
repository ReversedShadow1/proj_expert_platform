const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes
const router = express.Router();

router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);
router.put('/expert', authMiddleware, userController.updateExpertProfile);

module.exports = router;
