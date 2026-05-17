require('dotenv').config();
const { User } = require('../models');

async function makeAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.log('Usage: node make-admin.js <user-email>');
    process.exit(1);
  }
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`User not found with email: ${email}`);
      process.exit(1);
    }
    
    user.role = 'admin';
    await user.save();
    console.log(`Success! User ${email} has been promoted to Admin.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to update user:', err);
    process.exit(1);
  }
}

makeAdmin();
