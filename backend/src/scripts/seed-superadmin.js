require('dotenv').config();
const { User } = require('../models');

async function seedSuperAdmin() {
  const email = 'superadmin@moseva.com';
  const username = 'superadmin';
  const password = 'BlackSmith@17';

  try {
    // Check if superadmin already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      console.log('Superadmin user already exists. Updating password and ensuring superadmin role...');
      user.passwordHash = password; // will be hashed by beforeUpdate hook
      user.role = 'superadmin';
      user.isActive = true;
      user.isVerified = true;
      await user.save();
    } else {
      console.log('Creating new Superadmin user...');
      user = await User.create({
        username,
        email,
        passwordHash: password, // will be hashed by beforeCreate hook
        role: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        isVerified: true,
        isActive: true
      });
    }

    console.log('\n======================================================');
    console.log('SUPERADMIN USER SUCCESSFULLY CONFIGURED');
    console.log(`Email:    ${email}`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${user.role}`);
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed Superadmin:', err);
    process.exit(1);
  }
}

seedSuperAdmin();
