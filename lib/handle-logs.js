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

module.exports = query => {
  return new Promise((resolve, reject) => {
    if (query.action === 'status') {
      const id = mongojs.ObjectId(query.id)
      const status = {
        status: query.data.status,
        timeStamp: new Date().getTime()
      }
      logger('info', ['handle-logs', 'action', 'status', 'id', query.id])
      logs.update({'_id': id}, {'$push': {documentStatus: status}}, (error, data) => {
        if (error) {
          logger('error', ['handle-logs', 'action', 'status', 'id', query.id, error])
          reject(error)
        } else {
          logger('info', ['handle-logs', 'action', 'status', 'success', 'id', query.id])
          resolve(data)
        }
      })
    } else if (query.action === 'resultat') {
      const id = mongojs.ObjectId(query.id)
      const resultat = query.data.resultat
      logger('info', ['handle-logs', 'action', 'resultat', 'id', query.id])
      logs.update({'_id': id}, {'$set': resultat}, (error, data) => {
        if (error) {
          logger('error', ['handle-logs', 'action', 'status', 'id', query.id, error])
          reject(error)
        } else {
          logger('info', ['handle-logs', 'action', 'status', 'success', 'id', query.id])
          resolve(data)
        }
      })
    } else if (query.action === 'search') {
      logger('info', ['handle-logs', 'action', 'search', 'data', query.data])
      logs.find(query.data).sort({timeStamp: -1}, (error, documents) => {
        if (error) {
          logger('error', ['handle-logs', 'action', 'search', 'data', query.data, error])
          reject(error)
        } else {
          logger('info', ['handle-logs', 'action', 'search', 'data', query.data, 'success'])
          resolve(documents)
        }
      })
    } else if (query.action === 'latest') {
      logger('info', ['handle-logs', 'action', 'latest'])
      logs.find({}).sort({timeStamp: -1}).limit(40, (error, documents) => {
        if (error) {
          logger('error', ['handle-logs', 'action', 'latest', error])
          reject(error)
        } else {
          logger('info', ['handle-logs', 'action', 'latest', 'success'])
          resolve(documents)
        }
      })
    } else {
      logger('warn', ['handle-logs', 'action', 'unknown action', query.action])
      resolve(query)
    }
  })
}
