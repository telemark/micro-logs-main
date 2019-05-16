'use strict'

const { ObjectId } = require('mongodb')
const { json, send } = require('micro')
const mongo = require('./mongo')
const logger = require('./logger')

module.exports.addLog = async (request, response) => {
  const data = await json(request)
  data.isQueued = true
  data.timeStamp = new Date().getTime()
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-logs', 'addLog', 'start'])
  logs.insertOne(data, (error, result) => {
    if (error) {
      logger('error', ['handle-logs', 'addLog', error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-logs', 'addLog', 'success'])
      send(response, 200, result)
    }
  })
}

module.exports.getLog = async (request, response) => {
  const { id } = request.params
  const logId = ObjectId(id)
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-logs', 'getLog', 'id', id])
  logs.find({ _id: logId }).toArray((error, documents) => {
    if (error) {
      logger('error', ['handle-logs', 'getLog', 'id', id, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-logs', 'getLog', 'id', id, 'success'])
      send(response, 200, documents)
    }
  })
}

module.exports.getLatest = async (request, response) => {
  const { limit } = request.params
  const count = limit ? parseInt(limit, 10) : 40
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-logs', 'getLatest'])
  logs.find({}).sort({ timeStamp: -1 }).limit(count).toArray((error, documents) => {
    if (error) {
      logger('error', ['handle-logs', 'getLatest', error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-logs', 'getLatest', 'success', 'documents', documents.length])
      send(response, 200, documents)
    }
  })
}

module.exports.searchLogs = async (request, response) => {
  const data = await json(request)
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-logs', 'searchLogs', 'data', JSON.stringify(data)])
  logs.find(data).sort({ timeStamp: -1 }).toArray((error, documents) => {
    if (error) {
      logger('error', ['handle-logs', 'searchLogs', 'data', data, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-logs', 'searchLogs', 'data', data, 'success'])
      send(response, 200, documents)
    }
  })
}

module.exports.updateStatus = async (request, response) => {
  const { id } = request.params
  const logId = ObjectId(id)
  const data = await json(request)
  const status = {
    status: data.status,
    timeStamp: new Date().getTime()
  }
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-logs', 'updateStatus', 'logId', id])
  logs.updateOne({ '_id': logId }, { '$push': { documentStatus: status } }, (error, data) => {
    if (error) {
      logger('error', ['handle-logs', 'updateStatus', 'id', id, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-logs', 'updateStatus', 'success', 'id', id])
      send(response, 200, data)
    }
  })
}

module.exports.updateLog = async (request, response) => {
  const { id } = request.params
  const logId = ObjectId(id)
  const data = await json(request)
  const db = await mongo()
  const logs = db.collection(process.env.MONGODB_COLLECTION)
  logger('info', ['handle-logs', 'updateLog', 'id', id])
  logs.updateOne({ '_id': logId }, { '$set': data }, (error, document) => {
    if (error) {
      logger('error', ['handle-logs', 'updateLog', 'id', id, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-logs', 'updateLog', 'success', 'id', id])
      send(response, 200, document)
    }
  })
}
