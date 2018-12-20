process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

test('Api: fetch grouped', async () => {
  const response = await request(app).get('/api/grouped')
  expect(response.body).toBeInstanceOf(Object)
  expect(response.body).toHaveProperty('grouped')
  expect(response.body).toHaveProperty('choices')
  expect(response.body).toHaveProperty('latest')
  expect(response.body.grouped).toBeInstanceOf(Array)
  expect(response.body.choices).toBeInstanceOf(Array)
  expect(response.body.latest).toBeInstanceOf(Array)
})
