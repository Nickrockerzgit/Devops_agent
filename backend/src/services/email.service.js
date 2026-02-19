// src/services/email.service.js
const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
  host: config.EMAIL.HOST,
  port: config.EMAIL.PORT,
  secure: false,
  auth: {
    user: config.EMAIL.USER,
    pass: config.EMAIL.PASS,
  },
});

const sendOTPEmail = async (to, otp, name) => {
  const mailOptions = {
    from: config.EMAIL.FROM,
    to,
    subject: "Your OTP for DevOps Agent Authentication",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name || 'User'},</h2>
        <p>Use this OTP to verify your account:</p>
        <h1 style="color: #4CAF50; letter-spacing: 10px; text-align: center;">${otp}</h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <small>DevOps Agent Hackathon Project</small>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

module.exports = { sendOTPEmail };