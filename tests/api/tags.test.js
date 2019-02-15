process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch tags', async () => {
  const response = await request(app).get('/api/tags')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)
})

test('Api: fetch tag', async () => {
  const response = await request(app).get('/api/tags/57f2115aa89ee20d00cc48a3')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_id', '57f2115aa89ee20d00cc48a3')
  expect(response.body).toHaveProperty('name')
})
