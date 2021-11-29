import { buildDevLogger } from "./dev-logger";
import { buildProdLogger } from "./prod-logger";

let logger = buildProdLogger();
if (process.env.NODE_ENV === "development") {
  logger = buildDevLogger();
} else if (process.env.NODE_ENV === "production") {
  logger = buildProdLogger();
}

export { logger };
