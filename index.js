'use strict'

const readFileSync = require('fs').readFileSync
const marked = require('marked')
const { send } = require('micro')
const resolveRequest = require('./lib/resolve-request')
const handleLogs = require('./lib/handle-logs')
const handleQueue = require('./lib/handle-queue')

module.exports = async (request, response) => {
  const query = await resolveRequest(request)

  if (!query.isValid && query.domain !== 'frontpage') {
    send(response, 401, query)
  } else {
    if (!query.domain === 'frontpage') {
      response.setHeader('Access-Control-Allow-Origin', '*')
    }
    try {
      if (query.domain === 'logs') {
        const result = await handleLogs(query)
        send(response, 200, result)
      } else if (query.domain === 'queue') {
        const result = await handleQueue(query)
        send(response, 200, result)
      } else {
        const readme = readFileSync('./README.md', 'utf-8')
        const html = marked(readme)
        send(response, 200, html)
      }
    } catch (error) {
      console.error(error)
      send(response, 500, error)
    }
  }
}
