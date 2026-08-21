const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri, {
      // Mongoose 8 defaults are sensible; override only if needed
    });

    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnect...');
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
