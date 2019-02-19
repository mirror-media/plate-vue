process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch externals', async () => {
  const response = await request(app).get('/api/externals')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)
})

test('Api: fetch externals with params', async () => {
  const response = await request(app).get('/api/externals?where={"partner":"5b8e031b34cc3f100061b216"}&max_results=12&page=2&sort=-publishedDate')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)

  expect(response.body['_items']).toHaveProperty('length', 12)
  expect(response.body['_meta']).toHaveProperty('page', 2)
  expect(response.body['_items'][0]['partner']).toHaveProperty('_id', '5b8e031b34cc3f100061b216')
})
