/*eslint no-unused-vars: 0*/

import _ from 'lodash'
import moment from 'moment'
import { OATH_PLAYLIST } from '../constants'
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

export default {
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
}
