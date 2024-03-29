/**
 * @file /tests/prepare-data.test copy.js
 * @description This file contains the test suite for preparing test data. It imports necessary modules, connects to the database, and performs various tests to insert logs and models.
 * @version 2024-01-27 C2RLO - Initial
 */

import { faker } from '@faker-js/faker'
import '../src/utils/loadEnvironment.js'
import { MongoClient, ObjectId } from 'mongodb'

describe('prepare test data', () => {
  let connection
  let db
  let mockModel
  let mockLog

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI, {})
    db = connection.db(process.env.DBNAME)
  })

  afterAll(async () => {
    await connection.close()
  })

  // Create test models by mongo driver
  describe('create 3 logs', () => {
    it('should insert a log doc into collection logs', async () => {
      const attributesCategory = db.collection('attributesCategory')
      const attributesCategoryCursor = await attributesCategory.find({})
      expect(await attributesCategory.countDocuments({})).not.toBe(0)
      const attributesCategoryData = await attributesCategoryCursor.toArray()

      const components = db.collection('components')
      const componentsCursor = await components.find({ attributes: true })
      expect(await components.countDocuments({ attributes: true })).not.toBe(0)
      const componentsData = await componentsCursor.toArray()

      const attributesTypes = db.collection('attributesTypes')
      const attributesTypesCursor = await attributesTypes.find({})
      expect(await attributesTypes.countDocuments({})).not.toBe(0)
      const attributesTypesData = await attributesTypesCursor.toArray()

      for (let index = 0; index < 3; index++) {
        const logs = db.collection('logs')
        const currentDateLogs = new Date()
        const formattedDate = currentDateLogs
          .toISOString()
          .replace(/T/, ' ')
          .replace(/\..+/, '')
        mockModel = {
          name:
            faker.commerce.product() +
            ' ' +
            faker.color.human() +
            ' ' +
            faker.animal.type(),
          dimension: {
            width: faker.number.int({ min: 1, max: 10 }),
            height: faker.number.int({ min: 1, max: 10 }),
            depth: faker.number.int({ min: 1, max: 10 }),
          },
          texture: {
            front: '/assets/r710-2.5-nobezel__29341.png',
            back: '/assets/r710-2.5-nobezel__29341.png',
            side: '/assets/r710-2.5-nobezel__29341.png',
            top: '/assets/r710-2.5-nobezel__29341.png',
            botom: '/assets/r710-2.5-nobezel__29341.png',
          },
          type: faker.helpers.arrayElement(1).name,
          category: faker.helpers.arrayElement(1).name,
        }
        mockLog = {
          date: formattedDate,
          objectId: new ObjectId('659a4400672627600b093713'),
          operation: 'Create',
          component: 'Model',
          message: mockModel,
        }

        await logs.insertOne(mockLog)
        const insertedLog = await logs.findOne(mockLog)
        expect(insertedLog).toEqual(mockLog)
      }
    })
  })
})
