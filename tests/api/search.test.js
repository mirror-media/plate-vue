process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch search', async () => {
  const response = await request(app).get('/api/search')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('hits')
  expect(response.body).toHaveProperty('query')
  expect(response.body).toHaveProperty('params')
  expect(response.body['hits']).toBeInstanceOf(Array)
})

test('Api: fetch search with params', async () => {
  const response = await request(app).get('/api/search?query="%E6%9F%AF%E6%96%87%E5%93%B2"&hitsPerPage=12&page=0')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('hits')
  expect(response.body).toHaveProperty('query')
  expect(response.body).toHaveProperty('params')
  expect(response.body['hits']).toBeInstanceOf(Array)
})
