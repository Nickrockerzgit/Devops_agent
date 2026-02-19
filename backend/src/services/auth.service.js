// src/services/auth.service.js
const bcrypt = require('bcryptjs');
const { generateOTP } = require('../utils/otp.util');
const { generateToken } = require('../utils/jwt.util');
const { sendOTPEmail } = require('./email.service');

// Prisma ko shared instance se import karo (best practice)
const prisma = require('../../prisma/client');  // ← Yeh line important hai

// Agar upar wala file nahi bana to yeh temporary fix daal sakta hai (lekin shared better hai):
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

class AuthService {
  async register({ email, password, name, teamName }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        teamName,
      },
    });

    // Auto send OTP after registration
    await this.sendOTP(email);

    return { message: "User created, OTP sent" };
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Send OTP instead of token
    await this.sendOTP(email);

    return { message: "OTP sent for login" };
  }

  async sendOTP(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const otp = generateOTP();

    // OTP store kar rahe ho (schema mein otp aur otpCreatedAt field hone chahiye)
    await prisma.user.update({
      where: { email },
      data: {
        otp: otp,
        otpCreatedAt: new Date(),
      },
    });

    const sent = await sendOTPEmail(email, otp, user.name);
    if (!sent) throw new Error("Failed to send OTP");

    return { message: "OTP sent successfully" };
  }

  async verifyOTP({ email, otp }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otp || !user.otpCreatedAt) {
      throw new Error("No OTP request found");
    }

    // Expiry check
    const config = require('../config');
    const expiryTime = new Date(user.otpCreatedAt).getTime() + config.OTP_EXPIRES_IN;
    if (Date.now() > expiryTime) {
      throw new Error("OTP expired");
    }

    if (user.otp !== otp) throw new Error("Invalid OTP");

    // Clear OTP after success
    await prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpCreatedAt: null,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      teamName: user.teamName,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        teamName: user.teamName,
      },
    };
  }
}

module.exports = new AuthService();