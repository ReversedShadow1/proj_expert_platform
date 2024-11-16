const express = require('express');
const ratingController = require('../controllers/ratingController');
const router = express.Router();

router.post('/add', ratingController.addRating);

module.exports = router;
