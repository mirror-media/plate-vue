process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch poplist', async () => {
  const response = await request(app).get('/api/poplist')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('report')
  expect(response.body).toHaveProperty('generate_time')
  expect(response.body).toHaveProperty('start_date')
  expect(response.body).toHaveProperty('end_date')
  expect(response.body.report).toBeInstanceOf(Array)
})
