import Vue from 'vue'
import { concat, get, uniqBy, values } from 'lodash'

export default {
  SET_AD_COVER_FLAG: (state, flag) => {
    state.isTimeToShowAdCover = flag
  },

  SET_ACTIVITIES: (state, { activities }) => {
    Vue.set(state, 'activities', activities)
  },

  SET_ARTICLES: (state, { articles }) => {
    Vue.set(state, 'articles', articles)
  },

  SET_ARTICLES_BY_UUID: (state, { articles, type, uuid }) => {
    Vue.set(state.articlesByUUID[type], uuid, articles)
  },

  SET_ARTICLES_GROUPED_LIST: (state, { articlesGroupedList }) => {
    Vue.set(state, 'articlesGroupedList', articlesGroupedList)
  },

  SET_ARTICLES_POP_LIST: (state, { articlesPopList }) => {
    Vue.set(state, 'articlesPopList', articlesPopList)
  },

  SET_ARTICLE_RECOMMEND_LIST: (state, { articlesRecommendList }) => {
    Vue.set(state, 'articlesRecommendList', articlesRecommendList)
  },

  SET_AUDIOS: (state, { audios }) => {
    Vue.set(state, 'audios', audios)
  },

  SET_AUTHORS: (state, articles) => {
    let authors = []
    const origAuthors = values(state.authors)
    const items = get(articles, 'items') || []
    items.map(article => {
      const { cameraMan, designers, engineers, photographers, writers } = article
      const concatAuthors = concat(cameraMan, designers, engineers, photographers, writers)
      concatAuthors.filter(author => author).map(author => {
        authors.push(author)
      })
    })
    authors = concat(origAuthors, authors)
    Vue.set(state, 'authors', uniqBy(authors, 'id'))
  },

  SET_COMMONDATA: (state, { commonData }) => {
    Vue.set(state, 'commonData', commonData)
    Vue.set(state, 'topics', commonData.topics)
    commonData.choices ? Vue.set(state, 'editorChoice', commonData.choices) : ''
  },

  SET_CONTACT: (state, { contact }) => {
    Vue.set(state, 'contact', contact)
  },

  SET_EDITORCHOICE: (state, { editorChoice }) => {
    Vue.set(state, 'editorChoice', editorChoice.endpoints.choices)
  },

  SET_EVENT: (state, { event }) => {
    const eventType = get(event, 'items.0.eventType')
    eventType ? Vue.set(state.event, eventType, event) : ''
  },

  SET_EXTERNAL: (state, { external }) => {
    Vue.set(state.external, get(external, 'items.0.name', ''), external.items[0])
  },

  SET_EXTERNALS: (state, { externals }) => {
    const items = get(externals, 'items') || []
    Vue.set(state, 'externals', externals)
    items.filter(item => item.name).forEach(item => {
      Vue.set(state.external, item.name, item)
    })
  },

  SET_HIGHLIGHTNODES: (state, { nodes }) => {
    Vue.set(state, 'highlightNodes', nodes)
  },

  SET_IMAGE: (state, { image, type }) => {
    if (type === 'OG') {
      Vue.set(state, 'ogimage', image)
    } else {
      const origImages = values(state.images)
      origImages.push(image)
      Vue.set(state, 'images', origImages)
    }
  },

  SET_IMAGES: (state, { uuid, images }) => {
    Vue.set(state.images, uuid, images)
  },

  SET_IMAGES_BY_ID: (state, { images }) => {
    state.imagesById = images
  },

  SET_LATESTARTICLE: (state, { latestArticle }) => {
    Vue.set(state, 'latestArticle', latestArticle)
  },

  SET_LATESTARTICLES: (state, { latestArticles }) => {
    Vue.set(state, 'latestArticles', latestArticles)
  },

  SET_LATEST_NEWS_FROM_JSON: (state, { latestNewsFromJson }) => {
    Vue.set(state, 'latestNewsFromJson', latestNewsFromJson)
  },

  SET_NODES: (state, { nodes }) => {
    Vue.set(state, 'nodes', nodes)
  },

  SET_OATH_PLAYLIST: (state, { id, playlist }) => {
    Vue.set(state.playlist.info, id, playlist)
  },
  
  SET_OATH_VIDEO: (state, { id, video }) => {
    Vue.set(state.videos, id, video)
  },

  SET_OATH_VIDEO_BY_PLAYLIST: (state, { id, videos }) => {
    Vue.set(state.playlist, id, videos)
  },

  SET_POSTVUE: (state, { commonData }) => {
    Vue.set(state, 'latestArticles', get(commonData, 'postsVue'))
  },

  SET_PARTNERS: (state, { partners }) => {
    Vue.set(state.commonData, 'partners', partners)
  },

  SET_SEARCH: (state, { searchResult }) => {
    Vue.set(state, 'searchResult', searchResult)
  },

  SET_TAG: (state, { tag }) => {
    Vue.set(state, 'tag', tag)
  },

  SET_TAGS: (state, articles) => {
    let _tags = []
    const origTags = values(state.tags)
    const items = get(articles, 'items') || []
    items.map(article => {
      const { tags = [] } = article
      tags.filter(tag => tag).map(tag => {
        _tags.push(tag)
      })
    })
    _tags = concat(origTags, _tags)
    Vue.set(state, 'tags', uniqBy(_tags, 'id'))
  },

  SET_TIMELINE: (state, { timeline }) => {
    Vue.set(state, 'timeline', timeline)
  },

  SET_TOPIC_BY_UUID: (state, { topic }) => {
    Vue.set(state, 'topic', topic)
  },

  SET_TOPICS: (state, { topics }) => {
    Vue.set(state, 'topics', topics)
  },

  SET_UUID: (state, { uuid }) => {
    Vue.set(state, 'uuid', uuid)
  },

  SET_VIEWPORT: (state, viewport) => {
    Vue.set(state, 'viewport', viewport)
  },

  SET_YOUTUBE_PLAY_LIST: (state, { playlist }) => {
    Vue.set(state, 'playlist', playlist)
  },
}
