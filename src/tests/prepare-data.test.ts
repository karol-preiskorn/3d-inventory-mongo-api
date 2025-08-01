/**
 * @file        /tests/device.test.ts
 * @description create device in mongo DB /api/devices
 *              https://jestjs.io/docs/bypassing-module-mocks
 * @version     2023-12-26 C2RLO - Initial
 */

import '../utils/loadEnvironment'

import { Db, MongoClient } from 'mongodb'

import { faker } from '@faker-js/faker'

// Ensure Jest globals are available for TypeScript
// (If using tsconfig, make sure "types": ["jest"] is set in "compilerOptions")
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('prepare test data', () => {
  let connection: MongoClient

  let db: Db

  let mockModel

  let insertedModel

  let insertedLog

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI ?? '', {})
    db = connection.db(process.env.DBNAME)
  })

  afterAll(async () => {
    await connection.close()
  })

  describe('delete all data', () => {
    it('should delete all devices', async () => {
      const device = db.collection('devices')

      const mock = {}

      await device.deleteMany(mock)
      const inserted = await device.findOne(mock)

      expect(inserted).toBeNull()
    })
    it('should delete all models', async () => {
      const model = db.collection('models')

      const mock = {}

      await model.deleteMany(mock)
      const inserted = await model.findOne(mock)

      expect(inserted).toBeNull()
    })
    it('should delete all logs', async () => {
      const logs = db.collection('logs')

      const mock = {}

      await logs.deleteMany(mock)
      const inserted = await logs.findOne(mock)

      expect(inserted).toBeNull()
    })
  })

  // Create test models by mongo driver
  describe('create 3 models with 5 devices each', () => {
    it('should insert a model and logs doc into collection models', async () => {
      for (let index = 0; index < 3; index++) {
        const model = db.collection('models')

        mockModel = {
          name: faker.commerce.product() + ' ' + faker.color.human() + ' ' + faker.animal.type(),
          dimension: {
            width: faker.number.int({ min: 1, max: 10 }),
            height: faker.number.int({ min: 1, max: 10 }),
            depth: faker.number.int({ min: 1, max: 10 })
          },
          texture: {
            front: '/assets/r710-2.5-nobezel__29341.png',
            back: '/assets/r710-2.5-nobezel__29341.png',
            side: '/assets/r710-2.5-nobezel__29341.png',
            top: '/assets/r710-2.5-nobezel__29341.png',
            bottom: '/assets/r710-2.5-nobezel__29341.png'
          }
        }
        await model.insertOne(mockModel)
        insertedModel = await model.findOne(mockModel)
        expect(insertedModel).toEqual(mockModel)

        const logs = db.collection('logs')

        let currentDateLogs = new Date()

        let formattedDate = currentDateLogs.toISOString().replace(/T/, ' ').replace(/\..+/, '')

        let mockLog = {
          date: formattedDate,
          objectId: insertedModel ? insertedModel._id : null,
          operation: 'Create',
          component: 'Model',
          message: mockModel
        }

        await logs.insertOne(mockLog)
        insertedLog = await logs.findOne(mockLog)
        expect(insertedLog).toEqual(mockLog)

        const device = db.collection('devices')

        for (let index = 0; index < 5; index++) {
          const mockDevice = {
            name: faker.commerce.product() + ' ' + faker.color.human() + '-' + faker.animal.type(),
            modelId: insertedModel ? insertedModel._id : null,
            position: {
              x: faker.number.int({ min: 1, max: 100 }),
              y: faker.number.int({ min: 1, max: 100 }),
              h: faker.number.int({ min: 1, max: 10 })
            }
          }

          await device.insertOne(mockDevice)
          const insertedDevice = await device.findOne(mockDevice)

          expect(insertedDevice).toEqual(mockDevice)

          currentDateLogs = new Date()
          formattedDate = currentDateLogs.toISOString().replace(/T/, ' ').replace(/\..+/, '')

          mockLog = {
            date: formattedDate,
            objectId: insertedLog ? insertedLog._id : null,
            operation: 'Create',
            component: 'Device',
            message: {
              name: mockDevice.name,
              dimension: {
                width: 0,
                height: 0,
                depth: 0
              },
              texture: {
                front: '',
                back: '',
                side: '',
                top: '',
                bottom: ''
              }
            }
          }
          await logs.insertOne(mockLog)
          insertedLog = await logs.findOne(mockLog)
          expect(insertedLog).toEqual(mockLog)
        }
      }
    })
  })
})
