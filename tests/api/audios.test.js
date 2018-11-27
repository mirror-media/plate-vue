process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch audios', async () => {
  const response = await request(app).get('/api/audios')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)

  expect(response.body['_items'][0]).toHaveProperty('audio')
})

test('Api: fetch audios with params', async () => {
  const response = await request(app).get('/api/audios?where={"tags":"59647e964bbe120f002a3281"}&max_results=12&page=2&sort=-createTime')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body).toHaveProperty('_meta')
  expect(response.body).toHaveProperty('_links')
  expect(response.body['_items']).toBeInstanceOf(Array)

  expect(response.body['_items'][0]['tags'][0]).toEqual('59647e964bbe120f002a3281')
  expect(response.body['_items']).toHaveProperty('length', 12)
  expect(response.body['_meta']).toHaveProperty('page', 2)
})
