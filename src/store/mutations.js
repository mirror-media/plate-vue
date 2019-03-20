import _ from 'lodash'
import Vue from 'vue'

export default {
  SET_AD_COVER_FLAG: (state, flag) => {
    state[ 'isTimeToShowAdCover' ] = flag
  },

  SET_ACTIVITIES: (state, { activities }) => {
    Vue.set(state, 'activities', activities)
  },

  SET_ARTICLES: (state, { articles }) => {
    Vue.set(state, 'articles', articles)
  },

  SET_ARTICLES_BY_UUID: (state, { articles, type, uuid }) => {
    Vue.set(state['articlesByUUID'][type], uuid, articles)
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
    const origAuthors = _.values(state.authors)
    _.map(_.get(articles, [ 'items' ]), (article) => {
      const { cameraMan, designers, engineers, photographers, writers } = article
      _.map(_.concat(cameraMan, designers, engineers, photographers, writers), (o) => {
        if (o) {
          authors.push(o)
        }
      })
    })
    authors = _.concat(origAuthors, authors)
    Vue.set(state, 'authors', _.uniqBy(authors, 'id'))
  },

  SET_COMMONDATA: (state, { commonData }) => {
    Vue.set(state, 'commonData', commonData)
    Vue.set(state, 'topics', commonData.topics)
    _.get(commonData, [ 'choices' ], false) ? Vue.set(state, 'editorChoice', _.get(commonData, [ 'choices' ])) : ''
  },

  SET_CONTACT: (state, { contact }) => {
    Vue.set(state, 'contact', contact)
  },

  SET_EDITORCHOICE: (state, { editorChoice }) => {
    Vue.set(state, 'editorChoice', editorChoice.endpoints.choices)
  },

  SET_EVENT: (state, { event }) => {
    const eventType = _.get(event, [ 'items', '0', 'eventType' ])
    switch (eventType) {
      case 'embedded':
        Vue.set(state, 'eventEmbedded', event)
        break
      case 'logo':
        Vue.set(state, 'eventLogo', event)
        break
      case 'mod':
        Vue.set(state, 'eventMod', event)
        break
    }
  },

  SET_EXTERNAL: (state, { external }) => {
    Vue.set(state['external'], _.get(external, 'items.0.name', ''), external.items[0])
  },

  SET_EXTERNALS: (state, { externals }) => {
    const items = _.get(externals, [ 'items' ])
    items.forEach((e) => {
      Vue.set(state['external'], e.name, e)
    })
    Vue.set(state, 'externals', externals)
  },

  SET_HIGHLIGHTNODES: (state, { nodes }) => {
    Vue.set(state, 'highlightNodes', nodes)
  },

  SET_IMAGE: (state, { image, type }) => {
    if (type === 'OG') {
      Vue.set(state, 'ogimage', image)
    } else {
      const origImages = _.values(state.images)
      origImages.push(image)
      Vue.set(state, 'images', origImages)
    }
  },

  SET_IMAGES: (state, { uuid, images }) => {
    Vue.set(state['images'], uuid, images)
  },

  SET_IMAGES_BY_ID: (state, { images }) => {
    state['imagesById'] = images
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
    Vue.set(state['playlist']['info'], id, playlist)
  },
  
  SET_OATH_VIDEO: (state, { id, video }) => {
    Vue.set(state.videos, id, video)
  },

  SET_OATH_VIDEO_BY_PLAYLIST: (state, { id, videos }) => {
    Vue.set(state.playlist, id, videos)
  },

  SET_POSTVUE: (state, { commonData }) => {
    Vue.set(state, 'latestArticles', _.get(commonData, [ 'postsVue' ]))
  },

  SET_PARTNERS: (state, { partners }) => {
    Vue.set(state['commonData'], 'partners', partners)
  },

  SET_SEARCH: (state, { searchResult }) => {
    Vue.set(state, 'searchResult', searchResult)
  },

  SET_TAG: (state, { tag }) => {
    Vue.set(state, 'tag', tag)
  },

  SET_TAGS: (state, articles) => {
    let _tags = []
    const origTags = _.values(state.tags)
    _.map(_.get(articles, [ 'items' ]), (article) => {
      const { tags } = article
      _.map(tags, (o) => {
        if (o) {
          _tags.push(o)
        }
      })
    })
    _tags = _.concat(origTags, _tags)
    Vue.set(state, 'tags', _.uniqBy(_tags, 'id'))
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
