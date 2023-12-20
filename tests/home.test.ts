/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "request.**.expect"] }] */

import request from "supertest"
import app from "../src/index"

describe("GET /", () => {
  it("should return 200 OK", () => {
    return new Promise(resolve => {
      request(app).get("/").expect("Content-Type", /json/).expect(200, resolve)
    })
  })
})

describe("GET /doc", () => {
  it("should return 200 OK", () => {
    return new Promise(resolve => {
      request(app).get("/doc").expect("Content-Type", /json/).expect(200, resolve)
    })
  })
})
