process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch nodes', async () => {
  const response = await request(app).get('/api/nodes')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)
})