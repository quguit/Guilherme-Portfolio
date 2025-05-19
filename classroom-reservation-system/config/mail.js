// This file is responsible for configuring the email service using nodemailer.
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // provedor SMTP
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS 
    }

});

module.exports = transporter;