/*
 * File:        index.js
 * Description: Connect to MongoDB 3d-inventory claster
 * Used by:     testing connect to Mongo Atlas
 * Dependency:  .env (not push to git)
 *
 * Date        By     Comments
 * ----------  -----  ------------------------------
 * 2023-11-26  C2RLO  Add mongo test
 * 2023-11-20  C2RLO  Add logger
 * 2023-10-29  C2RLO  Init
 */

import { faker } from "@faker-js/faker"
import "../loadEnvironment.mjs"
import db from "../db/conn.mjs"
import { ObjectId } from "mongodb"

describe("Test Mongo Atlas DB connection and schema", () => {
  it("should insert a User doc into collection", async () => {
    const users = db.collection("users")
    const mockUser = {
      "name": faker.person.fullName(),
      "email": faker.internet.email(),
      "password": faker.internet.password({ length: 20 }),
      "rights": faker.helpers.arrayElements(["admin", "users", "models", "connections", "attributes"],1,3),
      "token": faker.internet.password({ length: 50 })
    }
    await users.insertOne(mockUser)
    const insertedUser = await users.findOne(mockUser)
    expect(insertedUser).toEqual(mockUser)
  })
})