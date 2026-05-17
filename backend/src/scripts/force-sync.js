// src/scripts/force-sync.js
const { sequelize } = require('../config/database');
const models = require('../models');

async function forceSync() {
  try {
    console.log(`Force-syncing database tables (alter: true) on host: ${sequelize.config.host}, database: ${sequelize.config.database}...`);
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('SUCCESS: Database tables synchronized successfully.');
    process.exit(0);
  } catch (err) {
    console.error('FAILED: Database sync failed:', err);
    process.exit(1);
  }
}

forceSync();
