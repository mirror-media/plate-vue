// this is aliased in webpack config based on server/client build
import { camelizeKeys } from 'humps'
import { getHost } from '../util/comm'
import _ from 'lodash'
import qs from 'qs'

const superagent = require('superagent')
const _host = getHost()

function buildQuery (params = {}) {
  let query = {}
  const whitelist = [ 'where', 'embedded', 'max_results', 'page', 'sort', 'related', 'clean', 'clientInfo', 'id', 'keyword', 'offset' ]
  whitelist.forEach((ele) => {
    if (params.hasOwnProperty(ele)) {
      if (ele === 'where' || ele === 'embedded') {
        query[ele] = JSON.stringify(params[ele])
      } else if (ele === 'id') {
        query[ele] = typeof params[ele] === 'string' ? params[ele] : params[ele].join(',')
      } else {
        query[ele] = params[ele]
      }
    }
  })
  query = qs.stringify(query)
  return query
}

function buildUrlWithQuery ({ endpoint, params = {} }) {
  let url = `${_host}/api/${endpoint}`
  const hasParams = params && Object.keys(params).length
  if (hasParams) {
    const query = buildQuery(params)
    url = `${url}?${query}`
  }
  return url
}

function convertTypeForQuery (type) {
  const typeList = {
    SECTION: 'sections',
    CATEGORY: 'categories',
    TAG: 'tags',
    TOPIC: 'topics'
  }
  return typeList[type]
}

function setupWhereInParam (type, value, params = {}) {
  const convertedType = convertTypeForQuery(type)
  params = params || {}
  value = Array.isArray(value) ? value : [ value ]
  const where = {}
  if (convertedType && value.length > 0) {
    _.merge(where, params.where, {
      [convertedType]: {
        '$in': value
      }
    })
  }
  params.where = where
  return params
}

async function doFetch (url) {
  return await superagent
    .get(url)
    .then(res => camelizeKeys(res.body))
}

export const fetchActivities = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'activities', params: params })
  return doFetch(url)
}

export const fetchArticles = (params = {}, preview) => {
  const endpoint = !preview ? 'posts' : 'drafts'
  const url = buildUrlWithQuery({ endpoint: endpoint, params: params })
  return doFetch(url)
}

export const fetchArticlesByUuid = (uuid = '', type = '', params = {}) => {
  params = setupWhereInParam(type, [ uuid ], params)
  params.related ? (params.useMetaEndpoint = true) : ''
  params.sort = params.sort || '-publishedDate'
  const endpoint = params.useMetaEndpoint ? 'meta' : 'listing'
  const url = buildUrlWithQuery({ endpoint: endpoint, params: params })
  return doFetch(url)
}

export const fetchArticlesGroupedList = () => {
  const apiHost = `${_host}/api/grouped`
  return doFetch(apiHost)
}

export const fetchArticlesPopList = () => {
  const url = `${_host}/api/poplist`
  return doFetch(url)
}

export const fetchAudios = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'audios', params: params })
  return doFetch(url)
}

export const fetchCommonData = (endpoints = []) => {
  const comboParams = endpoints.map(endpoint => `endpoint=${endpoint}`).join('&')
  let url = `${_host}/api/combo?`
  url = url + comboParams
  return doFetch(url).then(data => {
    Object.keys(_.get(data, 'endpoints', {})).map(endpoint => {
      if (endpoint === 'sections') { // get categories data from sections
        data.endpoints.categories = {}
        data.endpoints[endpoint].items.map(section => {
          section.categories.filter(category => category.name).map(category => {
            data.endpoints.categories[category.name] = category
          })
        })
      }
    })
    return data.endpoints
  })
}

export const fetchContacts = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'contacts', params: params })
  return doFetch(url)
}

export const fetchEditorChoice = () => {
  const url = `${_host}/api/combo?endpoint=choices`
  return doFetch(url)
}

export const fetchEvent = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'event', params: params })
  return doFetch(url)
}

export const fetchExternals = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'externals', params: params })
  return doFetch(url)
}

export const fetchImage = (uuid = '') => {
  const url = `${_host}/api/images/${uuid}`
  return doFetch(url)
}

export const fetchImages = (uuid = '', type = '', params = {}) => {
  params = setupWhereInParam(type, [ uuid ], params)
  const url = buildUrlWithQuery({ endpoint: 'images', params: params })
  return doFetch(url)
}

export const fetchImagesById = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'images', params: params })
  return doFetch(url)
}

export const fetchLatestArticle = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'listing', params: params })
  return doFetch(url)
}

export const fetchLatestNewsFromJson = () => {
  const url = `${_host}/api/latestNews`
  return doFetch(url)
}

export const fetchNodes = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'nodes', params: params })
  return doFetch(url)
}

export const fetchOathPlaylist = ({ id = '', params }) => {
  const url = buildUrlWithQuery({ endpoint: `playlistng/${id}`, params: params })
  return doFetch(url)
}

export const fetchOathVideo = ({ id = '', params = {} }) => {
  const url = buildUrlWithQuery({ endpoint: `video/${id}`, params: params })
  return doFetch(url)
}

export const fetchOathVideoByPlaylist = ({ id = '', params = {} }) => {
  const url = buildUrlWithQuery({ endpoint: `video/playlist/${id}`, params: params })
  return doFetch(url)
}

export const fetchPartners = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'partners', params: params })
  return doFetch(url)
}

export const fetchRecommendList = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'related_news', params: params })
  return doFetch(url)
}

export const fetchSearch = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'search', params: params })
  return doFetch(url)
}

export const fetchSectionList = () => {
  const url = `${_host}/api/combo?endpoint=sections`
  return doFetch(url)
}

export const fetchTag = (slug = '') => {
  const url = `${_host}/api/tags/${slug}`
  return doFetch(url)
}

export const fetchTimeline = (slug = '') => {
  const url = `${_host}/api/timeline/${slug}`
  return doFetch(url)
}

export const fetchTopic = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'topics', params: params })
  return doFetch(url)
}

export const fetchYoutubePlaylist = (limit = 12, pageToken = '') => {
  const url = `${_host}/api/playlist?maxResults=${limit}&pageToken=${pageToken}`
  return doFetch(url)
}

export const logClient = (params = {}) => {
  const url = buildUrlWithQuery({ endpoint: 'tracking', params: params })
  return doFetch(url)
}
