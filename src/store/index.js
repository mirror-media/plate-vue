import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import config from '../../api/config'
import { fetchArticles, fetchArticlesByUuid, fetchArticlesGroupedList, fetchArticlesPopList, fetchAudios, fetchCommonData, fetchEditorChoice, fetchEvent, fetchLatestArticle, fetchImages, fetchQuestionnaire, fetchSearch, fetchTag, fetchTopic, fetchYoutubePlaylist } from './api'

Vue.use(Vuex)

const { DFPID, FB_APP_ID, FB_PAGES_ID } = config
const store = new Vuex.Store({
  state: {
    articles: {},
    articlesByUUID: {},
    articlesPopList: {},
    articlesGroupedList: {},
    audios: {},
    authors: [],
    commonData: {},
    dfpId: DFPID,
    editorChoice: {},
    event: {},
    fbAppId: FB_APP_ID,
    fbPagesId: FB_PAGES_ID,
    images: {},
    latestArticle: {},
    latestArticles: {},
    playlist: {},
    searchResult: {},
    tag: {},
    tags: [],
    topic: {},
    questionnaire: {}
  },

  actions: {
    FETCH_ARTICLES: ({ commit, state }, { params }) => {
      const orig = _.values(state.articles[ 'items' ])
      return fetchArticles(params).then(articles => {
        articles[ 'items' ] = _.concat(orig, _.get(articles, [ 'items' ]))
        commit('SET_ARTICLES', { articles })
        commit('SET_AUTHORS', articles)
        commit('SET_TAGS', articles)
      })
    },
    FETCH_ARTICLES_BY_UUID: ({ commit, state }, { uuid, type, params }) => {
      const orig = _.values(state.articlesByUUID[ 'items' ])
      return state.articlesByUUID.items && (params.page > 1)
        ? fetchArticlesByUuid(uuid, type, params).then(articles => {
          articles[ 'items' ] = _.concat(orig, _.get(articles, [ 'items' ]))
          commit('SET_ARTICLES_BY_UUID', { articles })
          commit('SET_AUTHORS', articles)
          commit('SET_TAGS', articles)
        }) : fetchArticlesByUuid(uuid, type, params).then(articles => {
          commit('SET_ARTICLES_BY_UUID', { articles })
          commit('SET_AUTHORS', articles)
          commit('SET_TAGS', articles)
        })
    },

    FETCH_ARTICLES_GROUPED_LIST: ({ commit, state }, { params = {}}) => {
      return fetchArticlesGroupedList(params).then(articlesGroupedList => commit('SET_ARTICLES_GROUPED_LIST', { articlesGroupedList }))
    },

    FETCH_ARTICLES_POP_LIST: ({ commit, state }, { params = {}}) => {
      return fetchArticlesPopList(params).then(articlesPopList => commit('SET_ARTICLES_POP_LIST', { articlesPopList }))
    },

    FETCH_AUDIOS: ({ commit, state }, { params }) => {
      const orig = _.values(state.audios[ 'items' ])
      return state.audios.items && (params.page > 1)
        ? fetchAudios(params).then(audios => {
          audios[ 'items' ] = _.concat(orig, _.get(audios, [ 'items' ]))
          commit('SET_AUDIOS', { audios })
        }) : fetchAudios(params).then(audios => {
          commit('SET_AUDIOS', { audios })
        })
    },

    FETCH_COMMONDATA: ({ commit, state }, { endpoints = [] }) => {
      return fetchCommonData(endpoints).then(commonData => {
        _.map(Object.keys(state.commonData), (e) => {
          commonData[ e ] = state.commonData[ e ]
        })
        commit('SET_COMMONDATA', { commonData })
        _.get(state, [ 'latestArticles', 'items', 'length' ], 0) !== 0 ? null : commit('SET_POSTVUE', { commonData })
        const _latestArticles = _.get(commonData, [ 'postsVue' ])
        _latestArticles ? commit('SET_AUTHORS', _latestArticles) : null
        _latestArticles ? commit('SET_TAGS', _latestArticles) : null
      })
    },

    FETCH_EDITORCHOICE: ({ commit, state }, {}) => {
      return state.editorChoice.items
        ? Promise.resolve(state.editorChoice)
        : fetchEditorChoice().then(editorChoice => commit('SET_EDITORCHOICE', { editorChoice }))
    },

    FETCH_EVENT: ({ commit, state }, { params }) => {
      return fetchEvent(params).then(event => {
        commit('SET_EVENT', { event })
      })
    },

    FETCH_IMAGES: ({ commit, state }, { uuid, type, params }) => {
      return fetchImages(uuid, type, params).then(images => {
        commit('SET_IMAGES', { images })
      })
    },

    FETCH_LATESTARTICLE: ({ commit, state }, { params }) => {
      return state.latestArticle.items && params.page < 2
        ? Promise.resolve(state.latestArticle)
        : fetchLatestArticle(params).then(latestArticle => {
          commit('SET_LATESTARTICLE', { latestArticle })
          commit('SET_AUTHORS', latestArticle)
          commit('SET_TAGS', latestArticle)
        })
    },
    // For Home Page
    FETCH_LATESTARTICLES: ({ commit, state }, { params }) => {
      const orig = _.values(state.latestArticles[ 'items' ])
      return state.latestArticles.items && params.page < 2
        ? Promise.resolve(state.latestArticles)
        : fetchLatestArticle(params).then(latestArticles => {
          latestArticles[ 'items' ] = _.concat(orig, _.get(latestArticles, [ 'items' ]))
          commit('SET_LATESTARTICLES', { latestArticles })
        })
    },

    FETCH_QUESTIONNAIRE: ({ commit, state }, { id }) => {
      return state.questionnaire[ id ]
        ? Promise.resolve(state.questionnaire[ id ])
        : fetchQuestionnaire(id).then(questionnaire => commit('SET_QUESTIONNAIRE', { questionnaire }))
    },

    FETCH_SEARCH: ({ commit, state }, { keyword, params }) => {
      const orig = _.values(state.searchResult[ 'items' ])
      return state.searchResult.items && (params.page > 1)
        ? fetchSearch(keyword, params).then(searchResult => {
          searchResult[ 'items' ] = _.concat(orig, _.get(searchResult, [ 'hits' ]))
          commit('SET_SEARCH', { searchResult })
        }) : fetchSearch(keyword, params).then(searchResult => {
          searchResult[ 'items' ] = _.get(searchResult, [ 'hits' ])
          commit('SET_SEARCH', { searchResult })
        })
    },

    FETCH_TAG: ({ commit, state }, { id }) => {
      return state.tag[ 'id' ]
        ? '' : fetchTag(id).then(tag => {
          commit('SET_TAG', { tag })
        })
    },

    FETCH_TOPIC_BY_UUID: ({ commit, state }, { params }) => {
      return fetchTopic(params).then(topic => {
        commit('SET_TOPIC_BY_UUID', { topic })
      })
    },

    FETCH_USER: ({ commit, state }, { id }) => {
      return state.users[ id ]
        ? Promise.resolve(state.users[ id ])
        : fetchUser(id).then(user => commit('SET_USER', { user }))
    },

    FETCH_YOUTUBE_PLAY_LIST: ({ commit, state }, { limit, pageToken }) => {
      const orig = _.values(state.playlist[ 'items' ])
      return !pageToken ? fetchYoutubePlaylist(limit, pageToken).then(playlist => commit('SET_YOUTUBE_PLAY_LIST', { playlist }))
        : fetchYoutubePlaylist(limit, pageToken).then(playlist => {
          playlist[ 'items' ] = _.concat(orig, _.get(playlist, [ 'items' ]))
          commit('SET_YOUTUBE_PLAY_LIST', { playlist })
        })
    }
  },

  mutations: {

    SET_ARTICLES: (state, { articles }) => {
      Vue.set(state, 'articles', articles)
    },

    SET_ARTICLES_BY_UUID: (state, { articles }) => {
      Vue.set(state, 'articlesByUUID', articles)
    },

    SET_ARTICLES_GROUPED_LIST: (state, { articlesGroupedList }) => {
      Vue.set(state, 'articlesGroupedList', articlesGroupedList)
    },

    SET_ARTICLES_POP_LIST: (state, { articlesPopList }) => {
      Vue.set(state, 'articlesPopList', articlesPopList)
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
      _.get(commonData, [ 'choices' ], false) ? Vue.set(state, 'editorChoice', _.get(commonData, [ 'choices' ])) : ''
    },

    SET_EDITORCHOICE: (state, { editorChoice }) => {
      Vue.set(state, 'editorChoice', editorChoice.endpoints.choices)
    },

    SET_EVENT: (state, { event }) => {
      Vue.set(state, 'event', event)
    },

    SET_IMAGES: (state, { images }) => {
      Vue.set(state, 'images', images)
    },

    SET_LATESTARTICLE: (state, { latestArticle }) => {
      Vue.set(state, 'latestArticle', latestArticle)
    },

    SET_LATESTARTICLES: (state, { latestArticles }) => {
      Vue.set(state, 'latestArticles', latestArticles)
    },

    SET_POSTVUE: (state, { commonData }) => {
      Vue.set(state, 'latestArticles', _.get(commonData, [ 'postsVue' ]))
    },

    SET_QUESTIONNAIRE: (state, { questionnaire }) => {
      Vue.set(state.questionnaire, questionnaire.id, questionnaire)
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

    SET_TOPIC_BY_UUID: (state, { topic }) => {
      Vue.set(state, 'topic', topic)
    },

    SET_USER: (state, { user }) => {
      Vue.set(state.users, user.id, user)
    },

    SET_YOUTUBE_PLAY_LIST: (state, { playlist }) => {
      Vue.set(state, 'playlist', playlist)
    }

  },

  getters: {

  }
})

export default store
