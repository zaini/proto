import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, colorize, errors } = format;

const buildDevLogger = () => {
  const logFormat = printf(({ level, message, timestamp, stack, meta }) => {
    return `${timestamp} ${level}: ${message} ${stack ? `\n${stack}` : ""} ${
      meta ? "META: " + meta : ""
    }`;
  });

  return createLogger({
    level: "debug",
    format: combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [new transports.Console()],
  });
};

export { buildDevLogger };
