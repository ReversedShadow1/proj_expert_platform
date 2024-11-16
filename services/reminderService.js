const cron = require('node-cron');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Cron job to remind admin about pending upgrade requests every 24 hours
cron.schedule('0 0 * * *', async () => {
    const pendingRequests = await User.find({ 'upgradeRequest.status': 'pending' });

    if (pendingRequests.length > 0) {
        await Notification.create({
            userId: null, // Admin user
            message: `There are ${pendingRequests.length} pending expert upgrade requests.`
        });

        console.log(`Admin reminded about ${pendingRequests.length} pending upgrade requests.`);
    }
});
