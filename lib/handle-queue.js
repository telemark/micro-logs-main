'use strict'

const { ObjectId } = require('mongodb')
const { send } = require('micro')
const mongo = require('./mongo')
const logger = require('./logger')

module.exports.getNext = async (request, response) => {
  logger('info', ['handle-queue', 'getNext'])
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logs.find({ isQueued: true }).sort({ timeStamp: 1 }).limit(1).toArray((error, documents) => {
    if (error) {
      logger('error', ['handle-queue', 'getNext', error])
      send(response, 500, error)
    } else {
      if (documents.length === 1) {
        logger('info', ['handle-queue', 'getNext', 'success', documents[0]._id])
      } else {
        logger('info', ['handle-queue', 'getNext', 'success', 'no documents in queue'])
      }
      send(response, 200, documents)
    }
  })
}

module.exports.deleteFromQueue = async (request, response) => {
  const { id } = request.params
  const logId = ObjectId(id)
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-queue', 'deleteFromQueue', 'id', id])
  logs.updateOne({ '_id': logId }, { '$set': { isQueued: false } }, (error, documents) => {
    if (error) {
      logger('error', ['handle-queue', 'deleteFromQueue', 'id', id, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-queue', 'deleteFromQueue', 'id', id, 'deleted'])
      send(response, 200, documents)
    }
  })
}
