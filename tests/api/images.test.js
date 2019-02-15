process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

describe('Multiple images', () => {
  test('Api: fetch images', async () => {
    const response = await request(app).get('/api/images')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_items')
    expect(response.body).toHaveProperty('_meta')
    expect(response.body).toHaveProperty('_links')
    expect(response.body['_items']).toBeInstanceOf(Array)
  })
  
  test('Api: fetch images', async () => {
    const response = await request(app).get('/api/images?where={"topics":{"$in":["5948a49fe28c300d0035971a"]}}&max_results=25&page=1')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_items')
    expect(response.body).toHaveProperty('_meta')
    expect(response.body).toHaveProperty('_links')
    expect(response.body['_items']).toBeInstanceOf(Array)
  
    expect(response.body['_items'][0]).toHaveProperty('topics', '5948a49fe28c300d0035971a')
  })
})

describe('Single image', () => {
  test('Api: fetch image', async () => {
    const response = await request(app).get('/api/images/599a9862d6bb5b0e00cd623e')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_id', '599a9862d6bb5b0e00cd623e')
    expect(response.body).toHaveProperty('image')
  })
  
})


