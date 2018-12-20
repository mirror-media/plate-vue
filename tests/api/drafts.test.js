process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch drafts', async () => {
  const response = await request(app).get('/api/drafts')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
})

test('Api: fetch drafts', async () => {
  const response = await request(app).get('/api/drafts?where={"slug":{"$in":["20180807fin003"]}}')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
})

test('Api: fetch drafts with clean=content', async () => {
  const response = await request(app).get('/api/drafts?where={"slug":{"$in":["20180807fin003"]}}&clean=content')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  // clean=content not work
  // expect(response.body['_items'][0]['brief']['html']).toBeUndefined()
  // expect(response.body['_items'][0]['content']['html']).toBeUndefined()
})
