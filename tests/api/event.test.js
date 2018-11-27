process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch event', async () => {
  const response = await request(app).get('/api/event')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
})

test('Api: fetch embedded event', async () => {
  const response = await request(app).get('/api/event?where={"isFeatured":true,"eventType":"embedded"}&max_results=1')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
})

test('Api: fetch logo event', async () => {
  const response = await request(app).get('/api/event?where={"isFeatured":true,"eventType":"logo"}&max_results=1')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
})

test('Api: fetch mod event', async () => {
  const response = await request(app).get('/api/event?where={"isFeatured":true,"eventType":"mod"}&max_results=1')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
})
