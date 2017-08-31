'use strict'

const readFileSync = require('fs').readFileSync
const marked = require('marked')
const { send } = require('micro')
const logger = require('./logger')

exports.frontpage = (request, response) => {
  logger('info', ['handlers', 'frontpage'])
  const readme = readFileSync('./README.md', 'utf-8')
  const html = marked(readme)
  send(response, 200, html)
}
