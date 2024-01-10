const winston = require("winston");
require("winston-daily-rotate-file");

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.simple()
  ),
});

module.exports = logger;
