/*eslint no-unused-vars: 0*/
import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import config from '../../api/config'
import moment from 'moment'
import { fetchActivities,
  fetchArticles,
  fetchArticlesByUuid,
  fetchArticlesGroupedList,
  fetchArticlesPopList,
  fetchRecommendList,
  fetchAudios,
  fetchCommonData,
  fetchContacts,
  fetchEditorChoice,
  fetchEvent,
  fetchExternals,
  fetchImage,
  fetchImages,
  fetchImagesById,
  fetchLatestArticle,
  fetchLatestNewsFromJson,
  fetchNodes,
  fetchOathPlaylist,
  fetchOathVideo,
  fetchOathVideoByPlaylist,
  fetchPartners,
  fetchSearch,
  fetchTag,
  fetchTimeline,
  fetchTopic,
  fetchYoutubePlaylist,
  logClient } from './api'
import { OATH_PLAYLIST } from '../constants'

Vue.use(Vuex)

const { DFPID, FB_APP_ID, FB_PAGES_ID } = config

export function createStore () {
  return new Vuex.Store({
    state: {
      activities: {},
      articles: {},
      articlesByUUID: {
        CATEGORY: {},
        SECTION: {},
        TAG: {},
        TOPIC: {}
      },
      articlesPopList: {},
      articlesRecommendList: {},
      articlesGroupedList: {},
      audios: {},
      authors: [],
      commonData: {},
      contact: {},
      dfpId: DFPID,
      editorChoice: {},
      eventEmbedded: {},
      eventLogo: {},
      eventMod: {},
      external: {},
      externals: {},
      fbAppId: FB_APP_ID,
      fbPagesId: FB_PAGES_ID,
      highlightNodes: {},
      images: {},
      imagesById: [],
      isTimeToShowAdCover: false,
      latestArticle: {},
      latestArticles: {},
      latestNewsFromJson: {},
      nodes: {},
      ogimage: {},
      playlist: {
        info: {}
      },
      searchResult: {},
      tag: {},
      tags: [],
      timeline: {},
      topic: {},
      topics: {},
      uuid: '',
      videos: {},
      viewport: {
        height: 0,
        width: 0
      },
    },

    actions: {
      LOG_CLIENT: ({ commit, state }, { params }) => {
        return logClient(params)
      },
      FETCH_ACTIVITIES: ({ commit, state }, { params }) => {
        return fetchActivities(params).then(activities => {
          commit('SET_ACTIVITIES', { activities })
        })
      },
      FETCH_ARTICLES: ({ commit, state }, { params, preview }) => {
        const orig = _.values(state.articles[ 'items' ])
        return fetchArticles(params, preview).then(articles => {
          articles[ 'items' ] = _.concat(orig, _.get(articles, [ 'items' ]))
          commit('SET_ARTICLES', { articles })
          commit('SET_AUTHORS', articles)
          commit('SET_TAGS', articles)
          return articles
        })
      },
      FETCH_ARTICLES_BY_UUID: ({ commit, state }, { uuid, type, params }) => {
        const orig = _.values(_.get(state, [ 'articlesByUUID', type, uuid, 'items' ]))
        if (state.articlesByUUID[type][uuid]) {
          if (state.uuid === uuid && params.page > 1) {
            return fetchArticlesByUuid(uuid, type, params).then(articles => {
              articles[ 'items' ] = _.concat(orig, _.get(articles, [ 'items' ]))
              commit('SET_ARTICLES_BY_UUID', { articles, type, uuid })
              commit('SET_TAGS', articles)
            })
          } else {
            commit('SET_UUID', { uuid })
            return Promise.resolve()
          }
        } else {
          return fetchArticlesByUuid(uuid, type, params).then(articles => {
            commit('SET_ARTICLES_BY_UUID', { articles, type, uuid })
            commit('SET_UUID', { uuid })
            commit('SET_TAGS', articles)
          })
        }
      },

      FETCH_ARTICLES_GROUPED_LIST: ({ commit, state }, { params = {}}) => {
        return fetchArticlesGroupedList(params).then(articlesGroupedList => commit('SET_ARTICLES_GROUPED_LIST', { articlesGroupedList }))
      },

      FETCH_ARTICLES_POP_LIST: ({ commit, state }, { params = {}}) => {
        return fetchArticlesPopList(params).then(articlesPopList => commit('SET_ARTICLES_POP_LIST', { articlesPopList }))
      },

      FETCH_ARTICLE_RECOMMEND_LIST: ({ commit, state }, { params = {}}) => {
        return fetchRecommendList(params).then(articlesRecommendList => commit('SET_ARTICLE_RECOMMEND_LIST', { articlesRecommendList }))
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
        const endpointsNeedFetch = endpoints.filter(endpoint => !state.commonData[endpoint])
        return endpointsNeedFetch.length < 1
          ? Promise.resolve(state.commonData)
          : fetchCommonData(endpointsNeedFetch).then(commonData => {
            const orig = state.commonData
            Object.keys(commonData).map(endpoint => orig[endpoint] = commonData[endpoint])
            _.get(state, 'latestArticles.items.length', 0) !== 0 ? null : commit('SET_POSTVUE', { commonData })
            const _latestArticles = _.get(commonData, 'postsVue')
            _latestArticles ? commit('SET_AUTHORS', _latestArticles) : null
            _latestArticles ? commit('SET_TAGS', _latestArticles) : null
            return commit('SET_COMMONDATA', { commonData: orig })
          })
      },

      FETCH_CONTACT: ({ commit, state }, { params }) => {
        return fetchContacts(params).then(contact => commit('SET_CONTACT', { contact }))
      },

      FETCH_EDITORCHOICE: ({ commit, state }, { params }) => {
        return state.editorChoice.items
          ? Promise.resolve(state.editorChoice)
          : fetchEditorChoice().then(editorChoice => commit('SET_EDITORCHOICE', { editorChoice }))
      },

      FETCH_EVENT: ({ commit, state }, { params }) => {
        return fetchEvent(params).then(event => {
          commit('SET_EVENT', { event })
        })
      },

      FETCH_EXTERNAL: ({ commit, state }, { params }) => {
        return state.external.slug ? Promise.resolve(state.external.slug)
          : fetchExternals(params).then(external => {
            commit('SET_EXTERNAL', { external })
          })
      },

      FETCH_EXTERNALS: ({ commit, state }, { params }) => {
        const orig = _.values(state.externals[ 'items' ])
        return state.externals.items && (params.page > 1)
          ? fetchExternals(params).then(externals => {
            externals[ 'items' ] = _.concat(orig, _.get(externals, [ 'items' ]))
            commit('SET_EXTERNALS', { externals })
          }) : fetchExternals(params).then(externals => {
            commit('SET_EXTERNALS', { externals })
          })
      },

      FETCH_IMAGE: ({ commit, state }, { uuid, type }) => {
        return fetchImage(uuid).then(image => {
          commit('SET_IMAGE', { image, type })
        })
      },

      FETCH_IMAGES: ({ commit, state }, { uuid, type, params }) => {
        if (params.page !== 1) {
          const orig = _.values(state.images.items)
          return fetchImages(uuid, type, params).then(images => {
            images.items = _.concat(orig, _.get(images, [ 'items' ]))
            commit('SET_IMAGES', { uuid, images })
          })
        }
        return fetchImages(uuid, type, params).then(images => {
          commit('SET_IMAGES', { uuid, images })
        })
      },

      FETCH_IMAGES_BY_ID: ({ commit }, { ids, max_results }) => {
        return fetchImagesById({ max_results: max_results, where: { _id: { $in: ids }}}).then(images => {
          commit('SET_IMAGES_BY_ID', { images: images.items })
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

      FETCH_LATEST_NEWS_FROM_JSON: ({ commit, state }) => {
        return state.latestNewsFromJson.latest && state.latestNewsFromJson.sections
        ? Promise.resolve(state.latestNewsFromJson)
        : fetchLatestNewsFromJson().then(latestNewsFromJson => commit('SET_LATEST_NEWS_FROM_JSON', { latestNewsFromJson }))
      },

      FETCH_NODES: ({ commit, state }, { params }) => {
        const orig = _.values(state.nodes[ 'items' ])
        if (_.get(params, [ 'where', 'isFeatured' ])) {
          return fetchNodes(params).then(nodes => {
            commit('SET_HIGHLIGHTNODES', { nodes })
          })
        }
        return fetchNodes(params).then(nodes => {
          nodes[ 'items' ] = _.sortBy(_.concat(orig, _.get(nodes, [ 'items' ])), [ function (o) {
            return moment(new Date(o.nodeDate))
          } ])
          commit('SET_NODES', { nodes })
        })
      },
      
      FETCH_OATH_PLAYLIST: ({ commit, state }, { id, params }) => {
        const playlistAmount = Object.keys(OATH_PLAYLIST).length || 0
        return fetchOathPlaylist({ id, params }).then(playlist => commit('SET_OATH_PLAYLIST', { id: id, playlist: playlist.data[0] }))
      },
      
      FETCH_OATH_VIDEO: ({ commit, state }, { id }) => {
        return state.videos.id
          ? Promise.resolve(state.videos[id])
          : fetchOathVideo({ id }).then(video => {
            commit('SET_OATH_VIDEO', { id, video: video[0] })
          })
      },

      FETCH_OATH_VIDEO_BY_PLAYLIST: ({ commit, state }, { id, params }) => {
        return fetchOathVideoByPlaylist({ id, params }).then(videos => {
          videos.map(video => {
            video.playlistId = id
            return video
          })
          if (params.offset) {
            const orig = _.values(state.playlist[id])
            videos = _.concat(orig, videos)
          }
          commit('SET_OATH_VIDEO_BY_PLAYLIST', { id, videos })
        })
      },

      FETCH_PARTNERS: ({ commit, state }, { params }) => {
        const orig = _.values(_.get(state, [ 'commonData', 'partners', 'items' ]))
        return orig && (params.page > 1)
          ? fetchPartners(params).then(partners => {
            partners[ 'items' ] = _.concat(orig, _.get(partners, [ 'items' ]))
            commit('SET_PARTNERS', { partners })
          }) : fetchPartners(params).then(partners => {
            commit('SET_PARTNERS', { partners })
          })
      },

      FETCH_SEARCH: async ({ commit, state }, { params }) => {
        const orig = _.values(state.searchResult[ 'items' ])
        const searchResult = await fetchSearch(params).catch(err => ({}))
        if (state.searchResult.items && (params.page > 1)) {
          searchResult.items = _.concat(orig, _.get(searchResult, 'hits.hits'))
          return commit('SET_SEARCH', { searchResult })
        } else {
          searchResult.items = _.get(searchResult, 'hits.hits')
          return commit('SET_SEARCH', { searchResult })
        }
      },

      FETCH_TAG: ({ commit, state }, { id }) => {
        return fetchTag(id).then(tag => {
          commit('SET_TAG', { tag })
        })
      },

      FETCH_TIMELINE: ({ commit, state }, { id }) => {
        return fetchTimeline(id).then(timeline => {
          commit('SET_TIMELINE', { timeline })
        })
      },

      FETCH_TOPIC_BY_UUID: ({ commit, state }, { params }) => {
        return fetchTopic(params).then(topic => {
          commit('SET_TOPIC_BY_UUID', { topic })
        })
      },

      FETCH_TOPICS: ({ commit, state }, { params }) => {
        const orig = _.values(state.topics.items)
        return fetchTopic(params).then(topics => {
          topics[ 'items' ] = _.concat(orig, _.get(topics, [ 'items' ]))
          commit('SET_TOPICS', { topics })
        })
      },

      FETCH_YOUTUBE_PLAY_LIST: ({ commit, state }, { limit, pageToken }) => {
        const orig = _.values(state.playlist[ 'items' ])
        return !pageToken ? fetchYoutubePlaylist(limit, pageToken).then(playlist => commit('SET_YOUTUBE_PLAY_LIST', { playlist }))
          : fetchYoutubePlaylist(limit, pageToken).then(playlist => {
            playlist[ 'items' ] = _.concat(orig, _.get(playlist, [ 'items' ]))
            commit('SET_YOUTUBE_PLAY_LIST', { playlist })
          })
      },

      RESET_AD_COVER: ({ commit }) => {
        return commit('SET_AD_COVER_FLAG', false)
      },
      SHOW_AD_COVER: ({ commit }) => {
        return commit('SET_AD_COVER_FLAG', true)
      },

      UPDATE_VIEWPORT: ({ commit }, viewport) => {
        commit('SET_VIEWPORT', viewport)
      },

    },

    mutations: {
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

      SET_USER: (state, { user }) => {
        Vue.set(state.users, user.id, user)
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

    },

    getters: {
      searchResultNormalized: state => {
        return _.map(state.searchResult.items, item => Object.assign({ id: _.get(item, 'id') }, _.get(item, 'source')))
      },
      searchResultTotalCount: state => {
        return _.get(state.searchResult, 'hits.total', 0)
      },
      topic: state => {
        return state.topic
      },
      topics: state => {
        return state.topics
      }
    }
  })
}

