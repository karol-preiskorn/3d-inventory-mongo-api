/**
 * @file /routers/users.ts
 * @description
 * @version 2024-03-06 C2RLO - add _id to schema
 * @version 2024-01-30 C2RLO - Initial
 */

import express, { RequestHandler } from 'express'
import { Collection, Db, InsertOneResult, ObjectId } from 'mongodb'
import '../utils/loadEnvironment'
import { connectToCluster, connectToDb, connectionClose } from '../db/conn'

export type User = {
  _id: ObjectId
  name: string
  email: string
  password: string
  token: string
  rigths: Array<string> // Fix: Replace Array<Object> with Array<object>
}

export type Users = User[]

const collectionName: string = 'attributes'
const router = express.Router()

router.get('/', (async (req, res) => {
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const results: object[] = await collection.find({}).limit(10).toArray()
  if (!results) {
    res.status(404).send('Not found')
  } else {
    res.status(200).send(results)
  }
  await connectionClose(client)
}) as RequestHandler)

router.get('/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { _id: new ObjectId(req.params.id) }
  const result = await collection.findOne(query)
  if (!result) res.sendStatus(404)
  else res.status(200).send(result)
  await connectionClose(client)
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
    res.status(200).send(result)
  }
  await connectionClose(client)
}) as RequestHandler)

router.get('/user/:id', (async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { _id: new ObjectId(req.params.id) }
  const result = await collection.find(query).toArray()
  if (!result) {
    res.sendStatus(404)
  } else {
    res.status(200).send(result)
  }
  await connectionClose(client)
}) as RequestHandler)

router.get('/rights/:name', (async (req, res) => {
  if (!ObjectId.isValid(req.params.name)) {
    res.sendStatus(404)
  }
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const query = { rights: [req.params.name] }
  const result = await collection.find(query).toArray()
  if (!result) {
    res.sendStatus(404)
  } else {
    res.status(200).send(result)
  }
  await connectionClose(client)
}) as RequestHandler)

router.post('/', (async (req, res) => {
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const newDocument: Users = req.body as Users // Fix: Explicitly define the type of newDocument
  const results: InsertOneResult<Document> = await collection.insertOne(newDocument)
  if (!results) res.sendStatus(404)
  else res.status(200).send(results)
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
  if (!result) {
    res.status(404).send('Not found models to delete')
  } else {
    res.status(200).send(result)
  }
  await connectionClose(client)
}) as RequestHandler)

router.delete('/', (async (req, res) => {
  const query = {}
  const client = await connectToCluster()
  const db: Db = connectToDb(client)
  const collection: Collection = db.collection(collectionName)
  const result = await collection.deleteMany(query)
  if (!result) {
    res.status(404).send('Not found models to delete')
  } else {
    res.status(200).send(result)
  }
  await connectionClose(client)
}) as RequestHandler)

router.delete('/user/:id/right/:name', (async (req, res) => {
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
    res.status(200).send(result)
  }
  await connectionClose(client)
}) as RequestHandler)

export default router
