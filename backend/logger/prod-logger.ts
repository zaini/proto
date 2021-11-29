import { createLogger, format, transports } from "winston";
const { combine, timestamp, errors, json } = format;

const buildProdLogger = () => {
  return createLogger({
    level: "verbose",
    format: combine(json(), timestamp(), errors({ stack: true })),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.Console(),
      new transports.File({ filename: "logs/combined.log" }),
    ],
  });
};

export { buildProdLogger };
