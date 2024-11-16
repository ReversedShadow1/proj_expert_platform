const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Configure SMTP settings here
});

async function sendEmailNotification(recipientEmail, subject, text) {
    try {
        await transporter.sendMail({
            from: '"Platform Name" <no-reply@example.com>',
            to: recipientEmail,
            subject,
            text
        });
        console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error.message);
    }
}

module.exports = {
    sendEmailNotification
};
