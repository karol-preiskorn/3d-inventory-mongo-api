/**
 * @file /routers/logs copy.js
 * @description attributes.js, is a module that sets up routes for a server using the Express.js framework. It's designed to interact with a MongoDB database, specifically with a collection named 'attributes'.
 * @module routers
 */

import express, { RequestHandler } from 'express'
import { Collection, Db, ObjectId } from 'mongodb'

import { closeConnection, connectToCluster, connectToDb } from '../utils/db'

export interface Attributes {
  _id: ObjectId
  attributeDictionaryId: ObjectId | null
  connectionId: ObjectId | null
  deviceId: ObjectId | null
  modelId: ObjectId | null
  name: string
  value: string
}

const collectionName = 'attributes'
const router: express.Router = express.Router()

router.get('/', (async (_req, res) => {
  let client
  try {
    client = await connectToCluster()
    const db: Db = connectToDb(client)
    const collection: Collection = db.collection(collectionName)
    const results: object[] = await collection.find({}).limit(100).toArray()
    if (!results) {
      res.status(404).send('Not found any attributes')
    } else {
      res.status(200).json(results)
    }
  } catch (error) {
    console.error('Error fetching attributes:', error)
    res.status(500).send('Internal server error while fetching attributes')
  } finally {
    if (client) {
      await closeConnection(client)
    }
  }
}) as RequestHandler)

router.get('/:id', (async (req, res) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    return res.sendStatus(400)
  }

  const client = await connectToCluster()
  try {
    const db: Db = connectToDb(client)
    const collection: Collection = db.collection(collectionName)
    const result = await collection.findOne({ _id: new ObjectId(id) })

    if (!result) {
      res.sendStatus(404)
    } else {
      res.status(200).json(result)
    }
  } catch (error) {
    res.status(500).send('Internal server error' + (error instanceof Error ? error.message : String(error)))
  } finally {
    await closeConnection(client)
  }
}) as RequestHandler)

router.get('/model/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { modelId: new ObjectId(req.params.id) }
  const result = await collection.find(query).toArray()
  if (!result) {
    res.sendStatus(404)
  } else {
    res.status(200).json(result)
  }
  await closeConnection(client)
}) as RequestHandler)

router.get('/device/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { deviceId: new ObjectId(req.params.id) }
  const result = await collection.find(query).toArray()
  if (!result) {
    res.sendStatus(404)
  } else {
    res.status(200).json(result)
  }
  await closeConnection(client)
}) as RequestHandler)

router.get('/connection/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { connectionId: new ObjectId(req.params.id) }
  const result = await collection.find(query).toArray()
  if (!result) {
    res.sendStatus(404)
  } else {
    res.status(200).json(result)
  }
  await closeConnection(client)
}) as RequestHandler)

router.put('/:id', (async (req, res) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    return res.status(400).send('Invalid attribute ID')
  }

  // Remove _id from req.body if present
  const updateBody = { ...req.body }
  if ('_id' in updateBody) {
    delete updateBody._id
  }

  const updates = {
    $set: {
      attributeDictionaryId: req.body.attributeDictionaryId || null,
      connectionId: req.body.connectionId || null,
      deviceId: req.body.deviceId || null,
      modelId: req.body.modelId || null,
      name: req.body.name,
      value: req.body.value
    }
  }
  const query = { _id: new ObjectId(id) }

  let client
  try {
    client = await connectToCluster()
    const db: Db = connectToDb(client)
    const collection: Collection = db.collection(collectionName)
    const result = await collection.updateOne(query, updates)
    if (result.matchedCount === 0) {
      return res.status(404).send(`Attribute ${id} not found`)
    }
    res.status(200).json({ updatedCount: result.modifiedCount })
  } catch (error) {
    console.error('Error updating attribute:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    res.status(500).send('Internal server error during update attributes: ' + errorMessage)
  } finally {
    if (client) {
      await closeConnection(client)
    }
  }
}) as RequestHandler)

router.delete('/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const query = { _id: new ObjectId(req.params.id) }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.deleteOne(query)
  if (!result) {
    res.status(404).send('Not found models to delete')
  } else {
    res.status(200).json(result)
  }
  await closeConnection(client)
}) as RequestHandler)

router.delete('/', (async (_req, res) => {
  const query = {}
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.deleteMany(query)
  if (!result) {
    res.status(404).send('Not found models to delete')
  } else {
    res.status(200).json(result)
  }
  await closeConnection(client)
}) as RequestHandler)

router.delete('/model/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const query = { modelId: new ObjectId(req.params.id) }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.deleteMany(query)
  if (!result) {
    res.status(404).send('Not found models to delete')
  } else {
    res.status(200).json(result)
  }
  await closeConnection(client)
}) as RequestHandler)

export default router
