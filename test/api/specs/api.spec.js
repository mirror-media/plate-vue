const chai = require('chai')
const should = chai.should()

const supertest = require('supertest')
const api = supertest('http://localhost:8080')

describe('Api: fetchRelatedList', () => {
  it('should get related news list from api', (done) => {
    api.get('/api/related_news?id=58fb0af65d01e70d00a33a0e')
    .end(function(err, res) {
      if (err) return console.log(err)
      res.body.should.be.an('object').and.have.property('related_news')
      done()
    });
  })
  it('should get related news list from api', (done) => {
    api.get('/api/related_news?id=5a162e8e1a53670d0048cb69')
    .end(function(err, res) {
      if (err) return console.log(err)
      res.body.should.be.an('object').and.have.property('related_news')
      done()
    });
  })
})
