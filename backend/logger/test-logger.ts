import { createLogger } from "winston";

const buildTestLogger = () => {
  return createLogger({
    silent: true,
  });
};

export { buildTestLogger };
