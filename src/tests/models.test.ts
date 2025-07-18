/**
 * @file /tests/models.test.js
 * @description test models api operatio
 * @version 2024-02-01 C2RLO - Add test for post device
 */

import '../utils/loadEnvironment'

import { Db, MongoClient } from 'mongodb'
import request, { Response } from 'supertest'

import app from '../main'

describe('GET /models', () => {
  let connection: MongoClient
  let db: Db

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI ?? '', {})
    db = connection.db(process.env.DBNAME)
  })

  afterAll(async () => {
    await connection.close()
    app.listen().close()
  })

  it('GET /models => array of models', async () => {
    const response = await request(app).get('/models').set('Accept', 'application/json; charset=utf-8').expect(200)
    const components = db.collection('components')
    // const componentsCursor = components.find({ attributes: true })
    expect(await components.countDocuments({ attributes: true })).not.toBe(0)

    const attributesTypes = db.collection('attributesTypes')
    /*   const attributesTypesCursor = attributesTypes.find({
      component: 'Devices',
    }) */
    expect(await attributesTypes.countDocuments({})).not.toBe(0)

    expect((response as Response).body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String) as string,
          name: expect.any(String) as string,
          type: expect.any(String) as string,
          dimension: {
            depth: expect.any(Number) as number,
            height: expect.any(Number) as number,
            width: expect.any(Number) as number,
          },
          texture: {
            back: expect.any(String) as string,
            bottom: expect.any(String) as string,
            front: expect.any(String) as string,
            side: expect.any(String) as string,
            top: expect.any(String) as string,
          },
        }),
      ]),
    )

    // Assuming the response body is an array of objects with an _id property
    interface ModelResponse {
      _id: string
      // other properties...
    }

    const requestBody = (response as Response).body as ModelResponse[]

    if (requestBody.length > 0) {
      const responseGetId = await request(app)
        .get('/models/' + requestBody[0]._id)
        .expect(200)

      expect(responseGetId.body).toEqual(
        expect.objectContaining({
          _id: expect.any(String) as string,
          name: expect.any(String) as string,
          type: expect.any(String) as string,
          dimension: {
            width: expect.any(Number) as number,
            height: expect.any(Number) as number,
            depth: expect.any(Number) as number,
          },
          texture: {
            front: expect.any(String) as string,
            back: expect.any(String) as string,
          },
        }),
      )
    }
  })
})
