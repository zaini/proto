import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, colorize, errors } = format;

const buildTestLogger = () => {
  return createLogger({
    silent: true,
  });
};

export { buildTestLogger };
