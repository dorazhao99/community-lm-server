import winston from 'winston';

const level = process.env.LOG_LEVEL || 'debug';

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  );


const transports = [
    // Allow the use the console to print the messages
    new winston.transports.Console(),
    // Allow to print all the error level messages inside the error.log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Allow to print all the error message inside the all.log file
    // (also the error log that are also printed inside the error.log(
    new winston.transports.File({ filename: 'logs/all.log' }),
  ]

const customLevels = {
  levels: {
    error: 0,
    warn: 1, 
    info: 2, 
    http: 3,
    verbose: 4, 
    debug: 5, 
    silly: 6
  },
  colors: {
    error: 'red',
    warn: 'yellow', 
    info: 'blue', 
    http: 'green',
    verbose: 'gray', 
    debug: 'magenta', 
    silly: 'black'
  }
};
 

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: logFormat,
  transports: transports
});

winston.addColors(customLevels.colors);

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export {
  logger
}