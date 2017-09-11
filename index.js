'use strict'

// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const cors = require('cors')
const jwt = require('express-jwt')

// Utilities
const handlers = require('./lib/handlers')
const handleLogs = require('./lib/handle-logs')
const handleQueue = require('./lib/handle-queue')
const config = require('./config')
const handleUnauthorized = require('./lib/handle-unauthorized')

// Initialize a new router
const router = Router()

// CORS
router.use(cors())

// JWT
router.use(jwt({secret: config.JWT_SECRET}).unless({path: ['/']}))
router.use(handleUnauthorized)

// ROUTES
router.get('/', handlers.frontpage)
router.put('/logs', handleLogs.addLog)
router.get('/logs/:id', handleLogs.getLog)
router.get('/logs/latest', handleLogs.getLatest)
router.get('/logs/latest/:limit', handleLogs.getLatest)
router.post('/logs/search', handleLogs.searchLogs)
router.post('/logs/:id/status', handleLogs.updateStatus)
router.post('/logs/:id', handleLogs.updateLog)
router.get('/queue/next', handleQueue.getNext)
router.delete('/queue/:id', handleQueue.deleteFromQueue)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}
