// src/config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    });

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Dynamically require models to register relationships and sync tables
    const models = require('../models');
    
    // Auto-sync tables only in development to prevent destructive changes in production
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database tables synchronized successfully.');
    } else {
      console.log('Production mode: skipping automatic table sync.');
    }

    // Seed default categories if none exist
    const categoryCount = await models.Category.count();
    if (categoryCount === 0) {
      console.log('Seeding default categories...');
      
      const defaultCategories = [
        { name: 'Home Repair', slug: 'home-repair', description: 'Plumbing, electrical, carpentry, and handyperson services' },
        { name: 'Cleaning', slug: 'cleaning', description: 'Residential, deep clean, and move-out support' },
        { name: 'Tech & Remote', slug: 'tech-remote', description: 'Web development, graphic design, and online tutoring' },
        { name: 'Logistics', slug: 'logistics', description: 'Local courier, moving assistance, and packing support' }
      ];

      for (const cat of defaultCategories) {
        await models.Category.create(cat);
      }
      console.log('Default categories seeded successfully.');
    }

  } catch (err) {
    console.error('Unable to connect to the database:', err);
    throw err;
  }
}

module.exports = { sequelize, connectDatabase };
