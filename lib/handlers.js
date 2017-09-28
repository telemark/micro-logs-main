'use strict'

const readFileSync = require('fs').readFileSync
const md = require('markdown-it')()
const { send } = require('micro')
const logger = require('./logger')

exports.frontpage = (request, response) => {
  logger('info', ['handlers', 'frontpage'])
  const readme = readFileSync('./README.md', 'utf-8')
  send(response, 200, md.render(readme))
}
