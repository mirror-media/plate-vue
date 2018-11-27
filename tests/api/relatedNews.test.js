process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch related_news', async () => {
  const response = await request(app).get('/api/related_news?id=5a162e8e1a53670d0048cb69')
  expect(response.body).toBeInstanceOf(Object)
  // expect(response.body).toHaveProperty('related_news')
  // expect(response.body['related_news']).toBeInstanceOf(Array)
})
