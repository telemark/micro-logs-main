'use strict'

const config = require('../config')
const mongojs = require('mongojs')
const db = mongojs(config.DB)
const logs = db.collection('logs')
const logger = require('./logger')

module.exports = query => {
  return new Promise((resolve, reject) => {
    if (query.action === 'add') {
      logger('info', ['handle-logs', 'action', 'add'])
      const data = query.data
      data.isQueued = true
      logs.save(data, (error, result) => {
        if (error) {
          logger('error', ['handle-logs', 'action', 'add', error])
          reject(error)
        } else {
          logger('info', ['handle-logs', 'action', 'add', 'success'])
          resolve(result)
        }
      })
    } else if (query.action === 'status') {
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
    } else if (query.action === 'find') {
      const id = mongojs.ObjectId(query.id)
      logger('info', ['handle-logs', 'action', 'find', 'id', query.id])
      logs.find({_id: id}, (error, documents) => {
        if (error) {
          logger('error', ['handle-logs', 'action', 'find', 'id', query.id, error])
          reject(error)
        } else {
          logger('info', ['handle-logs', 'action', 'find', 'success', 'id', query.id])
          resolve(documents)
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
