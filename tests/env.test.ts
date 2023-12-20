/*
 * File:        /tests/mongo.test copy.ts
 * Description: test set/use and config .env
 * Used by:
 * Dependency:  dotenv
 *
 * Date        By       Comments
 * ----------  -------  ------------------------------
 * 2023-11-29  C2RLO    Initial
 */

import * as db from "../src/services/mongoService"
import logger from "../src/utils/logger"

test("Call runQuery", () => {
  const data = db.runQuery("devices", {})
  logger.info("runQuery: " + data)
  expect(data).not.toBeNull()
  logger.info("runQuery: " + data)
})
