/**
 * @file /tests/models.test.js
 * @description test models api operatio
 * @version 2024-02-01 C2RLO - Add test for post device
 */

import '../utils/loadEnvironment'

import { Db, MongoClient } from 'mongodb'
import request, { Response } from 'supertest'

import app from '../index'

describe('GET /logs/object/:id', () => {
  let connection: MongoClient
  let db: Db

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI || '', {})
    db = connection.db(process.env.DBNAME)
  })

  afterAll(async () => {
    await connection.close()
    app.listen().close()
  })

  it('GET /logs/object/:id => ', async () => {
    const response = await request(app)
      .get('/logs/object/65cbd2d6e73505044b5f3aea')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect((response as Response).body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String) as string,
          name: expect.any(String) as string,
          deviceIdTo: expect.any(String) as string,
          deviceIdFrom: expect.any(String) as string,
        }),
      ]),
    )
  })
})
