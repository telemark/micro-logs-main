'use strict'

module.exports = data => {
  const list = data.pathname.split('/').filter(line => line !== '')
  let result = {
    domain: 'frontpage',
    method: data.method,
    action: ''
  }
  if (list.includes('logs')) {
    result.domain = 'logs'
    if (data.method === 'GET' && list.includes('latest')) {
      result.action = 'latest'
    } else if (data.method === 'GET') {
      result.action = 'find'
      result.id = list[1]
    } else if (data.method === 'PUT') {
      result.action = 'add'
    } else if (data.method === 'POST' && list.includes('status')) {
      result.action = 'status'
      result.id = list[1]
    } else if (data.method === 'POST' && list.includes('resultat')) {
      result.action = 'resultat'
      result.id = list[1]
    } else if (data.method === 'POST' && list.includes('search')) {
      result.action = 'search'
    }
  } else if (list.includes('queue')) {
    result.domain = 'queue'
    if (data.method === 'GET') {
      if (list.includes('next')) {
        result.action = 'next'
      }
    } else if (data.method === 'DELETE') {
      result.action = 'delete'
      result.id = list[1]
    }
  }
  return result
}
