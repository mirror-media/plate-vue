process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch contacts', async () => {
  const response = await request(app).get('/api/contacts')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)

  expect(response.body['_items'][0]).toHaveProperty('homepage')
  expect(response.body['_items'][0]).toHaveProperty('email')
  expect(response.body['_items'][0]).toHaveProperty('twitter')
  expect(response.body['_items'][0]).toHaveProperty('instantgram')
  expect(response.body['_items'][0]).toHaveProperty('facebook')
  expect(response.body['_items'][0]).toHaveProperty('bio')
})

test('Api: fetch contacts with params', async () => {
  const response = await request(app).get('/api/contacts?where={"_id":"57e8e03b35bef50e009a0ffb"}')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)

  expect(response.body['_items']).toHaveProperty('length', 1)
  expect(response.body['_items'][0]).toHaveProperty('_id', '57e8e03b35bef50e009a0ffb')
})