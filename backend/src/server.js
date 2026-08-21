const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const connectDatabase = require('./config/database');

const startServer = async () => {
  // Connect to MongoDB
  await connectDatabase();

  // Start Express server
  const server = app.listen(env.port, () => {
    logger.info(`StayEase API server running on port ${env.port} [${env.nodeEnv}]`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Unhandled errors
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });
};

startServer();
