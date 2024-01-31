/**
 * @file /tests/logs.test.js
 * @module /tests
 * @description
 * @version 2024-01-28 C2RLO - Initial
**/

// import faker from "@faker-js/faker"
// import assert from "assert"
import request from 'supertest'
import app from '../index.js'

describe('GET /logs', () => {

  let response

  beforeAll(async () => {
    response = await request(app)
      .get('/logs')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  afterAll(async () => {
    await app.listen().close()
  })

  it('GET /logs => array of items', async () => {

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          date: expect.any(String),
          objectId: expect.any(String),
          operation: expect.any(String),
          component: expect.any(String),
          message: expect.any(Object),
        }),
      ])
    )
    // console.log('response.body: ' + JSON.stringify(response.body))
  })

  it('GET /logs/:id => item', async () => {
    const responseGetId = await request(app)
      .get('/logs/' + response.body[0]._id)
      .expect(200)

    expect(responseGetId.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        date: expect.any(String),
        objectId: expect.any(String),
        operation: expect.any(String),
        component: expect.any(String),
        message: expect.any(Object),
      }),
    )
  })
})
