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
  SET_IMAGES,
  SET_IMAGES_BY_ID,
  SET_LATEST_NEWS_FROM_JSON,
  SET_LATESTARTICLE,
  SET_LATESTARTICLES,
  SET_NODES,
  SET_OATH_PLAYLIST,
  SET_OATH_VIDEO,
  SET_OATH_VIDEO_BY_PLAYLIST,
  SET_POSTVUE,
  SET_PARTNERS,
  SET_SEARCH,
  SET_TAG,
  SET_TAGS,
  SET_TIMELINE,
  SET_TOPIC_BY_UUID,
  SET_TOPICS,
  SET_UUID,
  SET_VIEWPORT,
  SET_YOUTUBE_PLAY_LIST,
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

  test('SET_IMAGES', () => {
    const state = { images: {} }
    SET_IMAGES(state, { uuid: '20190227edi004', images: { items: [] } })
    expect(state.images).toContainKey('20190227edi004')
    expect(state.images['20190227edi004']).toContainKey('items')
  })

  test('SET_IMAGES_BY_ID', () => {
    const state = { imagesById: [] }
    SET_IMAGES_BY_ID(state, { images: [
      { id: '1' },
      { id: '2' }
    ] })
    expect(state.imagesById.length).toEqual(2)
  })

  test('SET_LATEST_NEWS_FROM_JSON', () => {
    const state = { latestNewsFromJson: {} }
    SET_LATEST_NEWS_FROM_JSON(state, { latestNewsFromJson: { items: [] } })
    expect(state.latestNewsFromJson).toContainKey('items')
  })

  test('SET_LATESTARTICLE', () => {
    const state = { latestArticle: {} }
    SET_LATESTARTICLE(state, { latestArticle: { items: [] } })
    expect(state.latestArticle).toContainKey('items')
  })

  test('SET_LATESTARTICLES', () => {
    const state = { latestArticles: {} }
    SET_LATESTARTICLES(state, { latestArticles: { items: [] } })
    expect(state.latestArticles).toContainKey('items')
  })

  test('SET_NODES', () => {
    const state = { nodes: {} }
    SET_NODES(state, { nodes: { items: [] } })
    expect(state.nodes).toContainKey('items')
  })

  test('SET_OATH_PLAYLIST', () => {
    const state = { playlist: { info: {} } }
    SET_OATH_PLAYLIST(state, { id: '20190227edi004', playlist: { items: [] } })
    expect(state.playlist.info).toContainKey('20190227edi004')
    expect(state.playlist.info['20190227edi004']).toContainKey('items')
  })

  test('SET_OATH_VIDEO', () => {
    const state = { videos: {} }
    SET_OATH_VIDEO(state, { id: '20190227edi004', video: { items: [] } })
    expect(state.videos).toContainKey('20190227edi004')
    expect(state.videos['20190227edi004']).toContainKey('items')
  })

  test('SET_OATH_VIDEO_BY_PLAYLIST', () => {
    const state = { playlist: { info: {} } }
    SET_OATH_VIDEO_BY_PLAYLIST(state, { id: '20190227edi004', videos: { items: [] } })
    expect(state.playlist).toContainKey('20190227edi004')
    expect(state.playlist['20190227edi004']).toContainKey('items')
  })

  test('SET_POSTVUE', () => {
    const state = { latestArticles: {} }
    SET_POSTVUE(state, { commonData: { postsVue: { items: [] }}})
    expect(state.latestArticles).toContainKey('items')
  })

  test('SET_PARTNERS', () => {
    const state = { commonData: {} }
    SET_PARTNERS(state, { partners: { items: [] }})
    expect(state.commonData.partners).toContainKey('items')
  })

  test('SET_SEARCH', () => {
    const state = { searchResult: {} }
    SET_SEARCH(state, { searchResult: { items: [] }})
    expect(state.searchResult).toContainKey('items')
  })

  test('SET_TAG', () => {
    const state = { tag: {} }
    SET_TAG(state, { tag: { items: [] }})
    expect(state.tag).toContainKey('items')
  })

  test('SET_TAGS', () => {
    const state = { tags: [] }
    SET_TAGS(state, { items: [
      { tags: [ { id: '5c418d9f315ec510009058fe' }, { id: '58084765aa39ed0d00bfd131' } ] },
      { tags: [ { id: '587c3dd13c1f950d00ce3b0b' } ] }
    ] })
    expect(state.tags.length).toEqual(3)
  })

  test('SET_TIMELINE', () => {
    const state = { timeline: {} }
    SET_TIMELINE(state, { timeline: { items: [] }})
    expect(state.timeline).toContainKey('items')
  })

  test('SET_TOPIC_BY_UUID', () => {
    const state = { topic: {} }
    SET_TOPIC_BY_UUID(state, { topic: { items: [] }})
    expect(state.topic).toContainKey('items')
  })

  test('SET_TOPICS', () => {
    const state = { topics: {} }
    SET_TOPICS(state, { topics: { items: [] }})
    expect(state.topics).toContainKey('items')
  })

  test('SET_UUID', () => {
    const state = { uuid: '' }
    SET_UUID(state, { uuid: '20190227edi004' })
    expect(state.uuid).toEqual('20190227edi004')
  })

  test('SET_VIEWPORT', () => {
    const state = { viewport: { height: 0, width: 0 }}
    SET_VIEWPORT(state, { height: 10, width: 20 })
    expect(state.viewport.width).toEqual(20)
    expect(state.viewport.height).toEqual(10)
  })

  test('SET_YOUTUBE_PLAY_LIST', () => {
    const state = { playlist: {} }
    SET_YOUTUBE_PLAY_LIST(state, { playlist: { items: [] } })
    expect(state.playlist).toContainKey('items')
  })

})