'use strict'

const { json, send } = require('micro')
const config = require('../config')
const mongojs = require('mongojs')
const db = mongojs(config.DB)
const logs = db.collection('logs')
const logger = require('./logger')

module.exports.addLog = async (request, response) => {
  const data = await json(request)
  data.isQueued = true
  logs.save(data, (error, result) => {
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
  const logId = mongojs.ObjectId(id)
  logger('info', ['handle-logs', 'getLog', 'id', id])
  logs.find({_id: logId}, (error, documents) => {
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
  logger('info', ['handle-logs', 'getLatest'])
  logs.find({}).sort({timeStamp: -1}).limit(40, (error, documents) => {
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
  logger('info', ['handle-logs', 'searchLogs', 'data', JSON.stringify(data)])
  logs.find(data).sort({timeStamp: -1}, (error, documents) => {
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
  const logId = mongojs.ObjectId(id)
  const data = await json(request)
  const status = {
    status: data.status,
    timeStamp: new Date().getTime()
  }
  logger('info', ['handle-logs', 'updateStatus', 'logId', id])
  logs.update({'_id': logId}, {'$push': {documentStatus: status}}, (error, data) => {
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
  const logId = mongojs.ObjectId(id)
  const data = await json(request)
  logger('info', ['handle-logs', 'updateLog', 'id', id])
  logs.update({'_id': logId}, {'$set': data}, (error, document) => {
    if (error) {
      logger('error', ['handle-logs', 'updateLog', 'id', id, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-logs', 'updateLog', 'success', 'id', id])
      send(response, 200, document)
    }
  })
}
