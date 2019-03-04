import {
  getArticleReadTime,
} from '../../../src/util/comm.js'

describe('getArticleReadTime', () => {
  test('should return 0 min', () => {
    const paragraphs = [ { type: 'audio', content: [ '測試用字串' ] } ]
    const paragraphs_2 = [ { type: 'unstyled', content: [ '' ] } ]
    const paragraphs_3 = [ { type: 'unstyled', content: [ ' ' ] } ]
    const paragraphs_4 = [ 5 ]
    const paragraphs_5 = null
    expect(getArticleReadTime()).toBe(0)
    expect(getArticleReadTime([])).toBe(0)
    expect(getArticleReadTime(paragraphs)).toBe(0)
    expect(getArticleReadTime(paragraphs_2)).toBe(0)
    expect(getArticleReadTime(paragraphs_3)).toBe(0)
    expect(getArticleReadTime(paragraphs_4)).toBe(0)
    expect(getArticleReadTime(paragraphs_5)).toBe(0)
  })
  test('should return 1 min', () => {
    const paragraphs = [ { type: 'unstyled', content: [ '測試用字串' ] } ]
    expect(getArticleReadTime(paragraphs)).toBe(1)
  })
  test('should return 2 min', () => {
    const paragraphs = [ { type: 'unstyled', content: [ `測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串` ] } ]
    expect(getArticleReadTime(paragraphs)).toBe(2)
  })
})
