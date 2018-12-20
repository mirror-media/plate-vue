process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch posts', async () => {
  const response = await request(app).get('/api/posts')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
})

test('Api: fetch posts', async () => {
  const response = await request(app).get('/api/posts?where={"slug":{"$in":["20180807fin003"]}}')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
})

test('Api: fetch posts with clean=content', async () => {
  const response = await request(app).get('/api/posts?where={"slug":{"$in":["20180807fin003"]}}&clean=content')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body['_items'][0]['brief']['html']).toBeUndefined()
  expect(response.body['_items'][0]['content']['html']).toBeUndefined()
})

test('Api: fetch posts author', async () => {
  const response = await request(app).get(`/api/posts?where={"$or":[{"writers":"58788d093c1f950d00ce3973"},{"photographers":"58788d093c1f950d00ce3973"},{"camera_man":"58788d093c1f950d00ce3973"},{"designers":"58788d093c1f950d00ce3973"},{"engineers":"58788d093c1f950d00ce3973"}]}&max_results=12&page=1&sort=-publishedDate`)
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('_items')
  expect(response.body['_items']).toBeInstanceOf(Array)
})
