process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch playlist', async () => {
  const response = await request(app).get('/api/playlist')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('items')
  expect(response.body).toHaveProperty('pageInfo')
  expect(response.body['items']).toBeInstanceOf(Array)
})

test('Api: fetch playlist with params', async () => {
  const response = await request(app).get('/api/playlist?maxResults=12&pageToken=CAUQAA')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('items')
  expect(response.body).toHaveProperty('pageInfo')
  expect(response.body['items']).toBeInstanceOf(Array)
  
  expect(response.body['items']).toHaveProperty('length', 12)
})
