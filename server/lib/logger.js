const winston = require("winston");
const { format, config } = winston;



const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      level: "info",
      format: format.combine(format.colorize({
        all: true
      })),
    }),
    new winston.transports.File({
      filename: "logs/db.log",
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      level: "info",
    }),
  ],
});

winston.exceptions.handle(
  new winston.transports.Console({ format: winston.format.simple() }),
  new winston.transports.File({ filename: "logs/exceptions.log" })
);

module.exports = logger;