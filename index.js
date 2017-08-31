'use strict'

// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const cors = require('cors')
const jwt = require('express-jwt')

// Utilities
const handlers = require('./lib/handlers')
const config = require('./config')

// Initialize a new router
const router = Router()

// CORS
router.use(cors())

// JWT
router.use(jwt({secret: config.JWT_SECRET}).unless({path: ['/']}))

router.get('/', handlers.frontpage)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}
