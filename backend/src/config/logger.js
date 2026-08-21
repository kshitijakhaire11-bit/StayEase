const { createLogger, format, transports } = require('winston');
const env = require('./env');

const logger = createLogger({
  level: env.logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    env.isProduction
      ? format.json()
      : format.combine(
          format.colorize(),
          format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level}]: ${stack || message}`;
          })
        )
  ),
  transports: [new transports.Console()],
  // Never log sensitive fields
  defaultMeta: { service: 'stayease-api' },
});

module.exports = logger;
