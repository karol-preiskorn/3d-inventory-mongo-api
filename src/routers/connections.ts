/**
 * @file /routers/connections.js
 * @module /routers
 * @description connections router for the API
 * @version 2024-01-25 C2RLO - add new way to connect to DB
 */

import express, { RequestHandler } from 'express'
import { Collection, Db, InsertOneResult, ObjectId } from 'mongodb'
import { connectToCluster, connectToDb, connectionClose } from '../db/conn'
import '../utils/loadEnvironment'

type Connection = {
  _id: ObjectId
  name: string
  deviceIdFrom: ObjectId
  deviceIdTo: ObjectId
}

const collectionName: string = 'connections'
const router = express.Router()

router.get('/', (async (_req, res) => {
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const results: object[] = await collection.find({}).limit(256).toArray()
  if (!results) res.status(404).send('Not found any connection')
  else res.status(200).send(results)
  await connectionClose(client)
}) as RequestHandler)

router.get('/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(404).send('Not provide valid id')
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { _id: new ObjectId(req.params.id) }
  const result = await collection.findOne(query)
  if (!result) res.status(404).send('Not found')
  else res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

router.put('/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(404).send('Not provide valid id')
  }
  const query = { _id: new ObjectId(req.params.id) }
  const c: Connection = req.body as Connection
  const updates = {
    $set: {
      name: c.name,
      deviceIdFrom: c.deviceIdFrom,
      deviceIdTo: c.deviceIdTo,
    },
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.updateOne(query, updates)
  if (!result) res.status(404).send('Not found devices to update')
  res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

router.get('/from/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { deviceIdFrom: new ObjectId(req.params.id) }
  const result = await collection.findOne(query)
  if (!result) res.status(404).send('Not found')
  else res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

router.get('/to/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { deviceIdTo: new ObjectId(req.params.id) }
  const result = await collection.findOne(query)
  if (!result) res.status(404).send('Not found')
  else res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

router.get('/from/:idFrom/to/:idTo', (async (req, res) => {
  if (!ObjectId.isValid(req.params.idFrom) || !ObjectId.isValid(req.params.idTo)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = {
    deviceIdFrom: new ObjectId(req.params.idFrom),
    deviceIdTo: new ObjectId(req.params.idTo),
  }
  const result = await collection.findOne(query)
  if (!result) res.status(404).send('Not found')
  else res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

router.post('/', (async (req, res) => {
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const newDocument: Connection = req.body as Connection
  const results: InsertOneResult<Document> = await collection.insertOne(newDocument)
  res.status(200).send(results)
  await connectionClose(client)
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
  res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

router.delete('/', (async (req, res) => {
  const query = {}
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.deleteMany(query)
  res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

router.delete('/from/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const query = { deviceIdFrom: new ObjectId(req.params.id) }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.deleteMany(query)
  res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

router.delete('/to/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const query = { deviceIdTo: new ObjectId(req.params.id) }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.deleteMany(query)
  res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

// delete all devices with specific :id model
router.delete('/from/:idFrom/to/:idTo', (async (req, res) => {
  if (!ObjectId.isValid(req.params.idFrom) || !ObjectId.isValid(req.params.idTo)) {
    res.sendStatus(404)
  }
  const query = {
    deviceIdFrom: new ObjectId(req.params.idFrom),
    deviceIdTo: new ObjectId(req.params.idTo),
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.deleteMany(query)
  res.status(200).send(result)
  await connectionClose(client)
}) as RequestHandler)

export default router
