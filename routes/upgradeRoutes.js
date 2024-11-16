const express = require('express');
const upgradeController = require('../controllers/upgradeController');
const router = express.Router();

router.post('/request', upgradeController.requestUpgrade);
router.post('/approve', upgradeController.approveUpgrade);

module.exports = router;
