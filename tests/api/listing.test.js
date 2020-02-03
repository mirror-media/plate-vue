process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch listing', async () => {
  const response = await request(app).get('/api/listing')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)

  expect(response.body['_items'][0]['og_description']).toBeUndefined()
  expect(response.body['_items'][0]['writers']).toBeUndefined()
  expect(response.body['_items'][0]['relateds']).toBeUndefined()
  expect(response.body['_items'][0]['tags']).toBeUndefined()
})

test('Api: fetch listing with params', async () => {
  const response = await request(app).get('/api/listing?where={"sections":{"$in":["57e1e0e5ee85930e00cad4e9"]}}&max_results=12&page=2&sort=-publishedDate')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)

  expect(response.body['_items']).toHaveProperty('length', 12)
  expect(response.body['_meta']).toHaveProperty('page', 2)
})
