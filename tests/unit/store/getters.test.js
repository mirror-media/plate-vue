import getters from '../../../src/store/getters.js'

const {
  searchResultNormalized,
  searchResultTotalCount,
  topic,
  topics
} = getters

describe('getters', () => {
  test('searchResultNormalized', () => {
    const state = { searchResult: {
      items: [
        { id: '5a220d150c5bc40f006d682a', source: { title: "「每年都會寫信」歐陽娜娜深信世界上有耶誕老人" }},
        { id: '597870b4e531830d00e32f48', source: { title: "【攝影筆記】人與神之間的約定" }}
      ]
    }}
    expect(searchResultNormalized(state)).toEqual([
      { id: '5a220d150c5bc40f006d682a', title: "「每年都會寫信」歐陽娜娜深信世界上有耶誕老人" },
      { id: '597870b4e531830d00e32f48', title: "【攝影筆記】人與神之間的約定" }
    ])
  })

  test('searchResultTotalCount', () => {
    const state = { searchResult: { hits: { total: 10 }}}
    expect(searchResultTotalCount(state)).toEqual(10)
  })

  test('topic', () => {
    const state = { topic: { items: [] }}
    expect(topic(state)).toEqual({ items: [] })
  })

  test('topics', () => {
    const state = { topics: { items: [] }}
    expect(topics(state)).toEqual({ items: [] })
  })

})