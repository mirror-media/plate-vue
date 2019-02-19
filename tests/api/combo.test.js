process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

// const server = app.listen(8080, () => {
//   console.log(`------- server started at localhost: 8080 -------`)
// })

// afterAll(() => {
//   server.close()
// })

describe('Single endpoint', () => {
  test('Api: fetch combo choices', async () => {
    const response = await request(app).get('/api/combo?endpoint=choices')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('choices')
  })

  test('Api: fetch combo posts-vue', async () => {
    const response = await request(app).get('/api/combo?endpoint=posts-vue')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('posts-vue')
  })

  test('Api: fetch combo projects', async () => {
    const response = await request(app).get('/api/combo?endpoint=projects')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('projects')
  })

  test('Api: fetch combo sectionfeatured', async () => {
    const response = await request(app).get('/api/combo?endpoint=sectionfeatured')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('sectionfeatured')
  })

  test('Api: fetch combo sections', async () => {
    const response = await request(app).get('/api/combo?endpoint=sections')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('sections')
  })

  test('Api: fetch combo topics', async () => {
    const response = await request(app).get('/api/combo?endpoint=topics')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('topics')
  })

})

describe('Multiple endpoint', () => {

  // Article.vue, ArticleM.vue
  test('Api: fetch combo sections and topics', async () => {
    const response = await request(app).get('/api/combo?endpoint=sections&endpoint=topics')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('sections')
    expect(response.body['_endpoints']).toHaveProperty('topics')
  })

  // Timeline.vue
  test('Api: fetch combo sectionfeatured and sections', async () => {
    const response = await request(app).get('/api/combo?endpoint=sectionfeatured&endpoint=sections')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('sectionfeatured')
    expect(response.body['_endpoints']).toHaveProperty('sections')
  })

  // Headline.vue, List.vue
  test('Api: fetch combo sectionfeatured, sections and topics', async () => {
    const response = await request(app).get('/api/combo?endpoint=sectionfeatured&endpoint=sections&endpoint=topics')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('sectionfeatured')
    expect(response.body['_endpoints']).toHaveProperty('sections')
    expect(response.body['_endpoints']).toHaveProperty('topics')
  })

  // Home.vue
  test('Api: fetch combo posts-vue, projects and topics', async () => {
    const response = await request(app).get('/api/combo?endpoint=posts-vue&endpoint=projects&endpoint=topics')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('posts-vue')
    expect(response.body['_endpoints']).toHaveProperty('projects')
    expect(response.body['_endpoints']).toHaveProperty('topics')
  })

  // Topic.vue
  test('Api: fetch combo sections, projects and topics', async () => {
    const response = await request(app).get('/api/combo?endpoint=sections&endpoint=projects&endpoint=topics')
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('_endpoints')
    expect(response.body['_endpoints']).toHaveProperty('sections')
    expect(response.body['_endpoints']).toHaveProperty('projects')
    expect(response.body['_endpoints']).toHaveProperty('topics')
  })

})
