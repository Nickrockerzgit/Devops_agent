// src/utils/otp.util.js
const otpGenerator = require('otp-generator');

const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

const isOTPExpired = (createdAt) => {
  const expiryTime = new Date(createdAt).getTime() + require('../config').OTP_EXPIRES_IN;
  return Date.now() > expiryTime;
};

module.exports = { generateOTP, isOTPExpired };