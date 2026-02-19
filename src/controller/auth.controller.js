// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
};

const sendOTP = async (req, res) => {
  try {
    const data = await authService.sendOTP(req.body.email);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const data = await authService.verifyOTP(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { register, login, sendOTP, verifyOTP };