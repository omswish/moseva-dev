// src/services/email.service.js
const logger = require('../utils/logger');

class EmailService {
  /**
   * Mock email sender for local development. Logs the verification link to terminal console.
   * @param {string} toEmail Recipient email
   * @param {string} userId User ID to verify
   */
  async sendVerificationEmail(toEmail, userId) {
    const token = `verify_${userId}_${Date.now()}`; // Sample verification token
    const verificationLink = `http://localhost:3000/verify-email?token=${token}&userId=${userId}`;

    logger.info('\n==================================================');
    logger.info('📧 MOCK EMAIL SERVICE (Local Development Mode)');
    logger.info(`To: ${toEmail}`);
    logger.info('Subject: Verify your email for Service Marketplace (Moseva)');
    logger.info('Body: Please verify your email by clicking the link below:');
    logger.info(`🔗 Link: ${verificationLink}`);
    logger.info('==================================================\n');
  }

  /**
   * Mock password reset email sender.
   * @param {string} toEmail Recipient email
   * @param {string} resetToken Reset password token
   */
  async sendPasswordResetEmail(toEmail, resetToken) {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    logger.info('\n==================================================');
    logger.info('📧 MOCK EMAIL SERVICE (Local Development Mode)');
    logger.info(`To: ${toEmail}`);
    logger.info('Subject: Reset your password for Service Marketplace (Moseva)');
    logger.info('Body: Please reset your password by clicking the link below:');
    logger.info(`🔗 Link: ${resetLink}`);
    logger.info('==================================================\n');
  }
}

module.exports = new EmailService();
