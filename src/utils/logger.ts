import winston from "winston";
import "winston-daily-rotate-file";
import DailyRotateFile = require("winston-daily-rotate-file");
import path from "path";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "warn";
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Add colors to winston
winston.addColors(colors);

// Custom format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      format
    ),
  }),

  // File transport for errors
  new winston.transports.DailyRotateFile({
    filename: path.join("logs", "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
  }),

  // File transport for all logs
  new winston.transports.DailyRotateFile({
    filename: path.join("logs", "all-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// import logger from "pino";
// import dayjs from "dayjs";
// import config from "config";

// const level = config.get<string>("logLevel");

// const log = logger({
//   transport: {
//     target: "pino-pretty",
//   },
//   level,
//   base: {
//     pid: false,
//   },
//   timestamp: () => `,"time":"${dayjs().format()}"`,
// });

// export default log;
