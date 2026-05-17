// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service'); // placeholder, can be a noop for now

class AuthService {
  // Helper to generate access token
  generateAccessToken(user) {
    return jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
    );
  }

  // Helper to generate raw refresh token
  generateRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(userData) {
    const existing = await User.findOne({ where: { email: userData.email } });
    if (existing) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'Email already registered');
    }
    const existingUsername = await User.findOne({ where: { username: userData.username } });
    if (existingUsername) {
      throw new ApiError(409, 'USERNAME_EXISTS', 'Username is already taken');
    }
    const user = await User.create({
      ...userData,
      passwordHash: userData.password // will be hashed by model hook
    });
    const tokens = await this.generateTokens(user);
    // Send verification email (noop in local dev)
    if (emailService && typeof emailService.sendVerificationEmail === 'function') {
      await emailService.sendVerificationEmail(user.email, user.userId);
    }
    return { user, ...tokens };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    if (!user.isActive) {
      throw new ApiError(403, 'USER_INACTIVE', 'Account is deactivated');
    }
    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  async generateTokens(user) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await RefreshToken.create({
      userId: user.userId,
      tokenHash: hashed,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdIp: null // optional
    });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(400, 'NO_REFRESH_TOKEN', 'Refresh token is required');
    }
    const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenRecord = await RefreshToken.findOne({
      where: { 
        tokenHash: hashed, 
        isRevoked: false, 
        expiresAt: { [require('sequelize').Op.gt]: new Date() } 
      },
      include: [{ model: User, as: 'user' }]
    });
    if (!tokenRecord || !tokenRecord.user) {
      throw new ApiError(401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }
    const accessToken = this.generateAccessToken(tokenRecord.user);
    return { accessToken };
  }

  async logout(refreshToken) {
    if (!refreshToken) return;
    const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await RefreshToken.update({ isRevoked: true }, { where: { tokenHash: hashed } });
  }
}

module.exports = new AuthService();
