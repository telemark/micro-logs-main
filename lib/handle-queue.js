'use strict'

const { send } = require('micro')
const config = require('../config')
const mongojs = require('mongojs')
const db = mongojs(config.DB)
const logs = db.collection('logs')
const logger = require('./logger')

module.exports.getNext = async (request, response) => {
  logger('info', ['handle-queue', 'getNext'])
  logs.find({isQueued: true}).sort({timeStamp: 1}).limit(1, (error, documents) => {
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
  const logId = mongojs.ObjectId(id)
  logger('info', ['handle-queue', 'deleteFromQueue', 'id', id])
  logs.update({'_id': logId}, {'$set': {isQueued: false}}, (error, documents) => {
    if (error) {
      logger('error', ['handle-queue', 'deleteFromQueue', 'id', id, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-queue', 'deleteFromQueue', 'id', id, 'deleted'])
      send(response, 200, documents)
    }
  })
}
