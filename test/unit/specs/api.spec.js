import chai from 'chai'
import { fetchRelatedList } from 'src/store/api'

chai.should()
const assert = chai.assert

describe('Api: fetchRelatedList', () => {
  it('should get related news list from api', () => {
    // arrange
    const expected = 'string'

    // act
    const actual = fetchRelatedList()

    // assert
    assert.typeOf(actual, expected)
  })
})
