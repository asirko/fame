import { createLogger, format, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';

let LOG_PATH = process.env.LOG_PATH || (__dirname + '/logs/');
if (/[^\/\\]$/.test(LOG_PATH)) {
  LOG_PATH += '/';
}

if (!existsSync(LOG_PATH)) {
  mkdirSync(LOG_PATH);
}

const fameLogFormat = format.combine(
  format.label({ label: 'FAME' }),
  format.timestamp(),
  format.printf(info => {
    const {timestamp, label, level, message, ...data} = info;
    return `${timestamp} [${label}] ${level}: ${message} ${JSON.stringify(data)}`;
  }),
);

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fameLogFormat,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: LOG_PATH + 'error.log', level: 'error' }),
    new transports.File({ filename: LOG_PATH + 'combined.log' }),
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({ format: fameLogFormat }));
}
