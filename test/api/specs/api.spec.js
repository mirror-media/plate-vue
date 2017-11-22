const supertest = require('supertest')

const api = supertest('http://localhost:8080')
const chai = require('chai')
const should = chai.should()

describe('Api: fetchRelatedList', () => {
  it('should get related news list from api', () => {
    api.get('/api/related_news?id=58fb0af65d01e70d00a33a0e')
    .end(function(err, res) {
      if (err) return console.log(err)
      // console.log('yoyo', res)
      // res.body.should.have.property('posts').and.be.instanceof(Array);
      // done();
    });
  })
})
