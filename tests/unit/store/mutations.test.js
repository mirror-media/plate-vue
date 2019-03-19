import mutations from '../../../src/store/mutations.js'

const {
  SET_ACTIVITIES,
  SET_AD_COVER_FLAG,
  SET_ARTICLE_RECOMMEND_LIST,
  SET_ARTICLES,
  SET_ARTICLES_BY_UUID,
  SET_ARTICLES_GROUPED_LIST,
  SET_ARTICLES_POP_LIST,
  SET_AUDIOS,
  SET_AUTHORS,
  SET_COMMONDATA,
  SET_CONTACT,
  SET_EDITORCHOICE,
  SET_EVENT,
  SET_EXTERNAL,
  SET_EXTERNALS,
  SET_HIGHLIGHTNODES,
  SET_IMAGE,
} = mutations

describe('mutations', () => {
  test('SET_ACTIVITIES', () => {
    const state = { activities: {} }
    SET_ACTIVITIES(state, { activities: { items: [] }})
    expect(state.activities).toContainKey('items')
  })

  test('SET_AD_COVER_FLAG', () => {
    const state = { isTimeToShowAdCover: false }
    SET_AD_COVER_FLAG(state, true)
    expect(state.isTimeToShowAdCover).toEqual(true)
  })

  test('SET_ARTICLE_RECOMMEND_LIST', () => {
    const state = { articlesRecommendList: {} }
    SET_ARTICLE_RECOMMEND_LIST(state, { articlesRecommendList: { items: [] }})
    expect(state.articlesRecommendList).toContainKey('items')
  })

  test('SET_ARTICLES', () => {
    const state = { articles: {} }
    SET_ARTICLES(state, { articles: { items: [] }})
    expect(state.articles).toContainKey('items')
  })

  test('SET_ARTICLES_BY_UUID', () => {
    const state = {
      articlesByUUID: {
        CATEGORY: {},
        SECTION: {},
        TAG: {},
        TOPIC: {}
      }
    }
    SET_ARTICLES_BY_UUID(state, { articles: { items: [] }, type: 'SECTION', uuid: '20190227edi004' })
    expect(state.articlesByUUID['SECTION']['20190227edi004']).toContainKey('items')
    expect(state.articlesByUUID['CATEGORY']).toBeEmpty()
    expect(state.articlesByUUID['TAG']).toBeEmpty()
    expect(state.articlesByUUID['TOPIC']).toBeEmpty()
  })

  test('SET_ARTICLES_GROUPED_LIST', () => {
    const state = { articlesGroupedList: {} }
    SET_ARTICLES_GROUPED_LIST(state, { articlesGroupedList: { items: [] }})
    expect(state.articlesGroupedList).toContainKey('items')
  })

  test('SET_ARTICLES_POP_LIST', () => {
    const state = { articlesPopList: {} }
    SET_ARTICLES_POP_LIST(state, { articlesPopList: { items: [] }})
    expect(state.articlesPopList).toContainKey('items')
  })

  test('SET_AUDIOS', () => {
    const state = { audios: {} }
    SET_AUDIOS(state, { audios: { items: [] }})
    expect(state.audios).toContainKey('items')
  })

  test('SET_AUTHORS', () => {
    const state = { authors: [] }
    const articles = { items: [
      { writers: [ { name: '編務組', id: 1 } ], photographers: [ { name: '攝影組', id: 2 } ] },
      { writers: [ { name: '編務組2', id: 3 } ] }
    ] }
    SET_AUTHORS(state, articles)
    expect(state.authors.length).toEqual(3)
  })

  test('SET_COMMONDATA', () => {
    const state = { commonData: {}, topics: {}, editorChoice: {} }
    SET_COMMONDATA(state, {
      commonData: {
        sections: { items: [] },
        topics: { items: [] },
        choices: { items: [] }
      }
    })
    expect(state.commonData).toContainKey('sections')
    expect(state.commonData).toContainKey('topics')
    expect(state.commonData).toContainKey('choices')
    expect(state.topics).toContainKey('items')
    expect(state.editorChoice).toContainKey('items')
  })

  test('SET_CONTACT', () => {
    const state = { contact: {} }
    SET_CONTACT(state, { contact: { items: [] }})
    expect(state.contact).toContainKey('items')
  })

  test('SET_EDITORCHOICE', () => {
    const state = { editorChoice: {} }
    SET_EDITORCHOICE(state, { editorChoice: { endpoints: { choices: { items: [] }}}})
    expect(state.editorChoice).toContainKey('items')
  })

  test('SET_EVENT', () => {
    const state = { eventEmbedded: {}, eventLogo: {}, eventMod: {} }
    SET_EVENT(state, { event: { items: [ { eventType: 'mod' } ] }})
    SET_EVENT(state, { event: { items: [ { eventType: 'embedded' } ] }})
    SET_EVENT(state, { event: { items: [ { eventType: 'logo' } ] }})
    expect(state.eventMod).toContainKey('items')
    expect(state.eventEmbedded).toContainKey('items')
    expect(state.eventLogo).toContainKey('items')
  })

  test('SET_EXTERNAL', () => {
    const state = { external: {} }
    SET_EXTERNAL(state, { external: { items: [ { name: '20190227edi004' } ] } })
    expect(state.external).toContainKey('20190227edi004')
  })

  test('SET_EXTERNALS', () => {
    const state = { external: {}, externals: {} }
    SET_EXTERNALS(state, { externals: { items: [ { name: '20190227edi004' }, { name: '20190227edi005' } ] } })
    expect(state.external).toContainKey('20190227edi004')
    expect(state.external).toContainKey('20190227edi005')
    expect(state.externals).toContainKey('items')
  })
  
  test('SET_HIGHLIGHTNODES', () => {
    const state = { highlightNodes: {} }
    SET_HIGHLIGHTNODES(state, { nodes: { items: [] } })
    expect(state.highlightNodes).toContainKey('items')
  })

  test('SET_IMAGE ogimage', () => {
    const state = { images: {}, ogimage: {} }
    SET_IMAGE(state, { image: { items: [] }, type: 'OG' })
    expect(state.ogimage).toContainKey('items')
  })

  test('SET_IMAGE images', () => {
    const state = { images: {}, ogimage: {} }
    SET_IMAGE(state, { image: { items: [] } })
    expect(state.images.length).toEqual(1)
  })

})