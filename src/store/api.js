// this is aliased in webpack config based on server/client build
import { CATEGORY, SECTION, TAG, TOPIC } from '../constants/index'
import { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } from '../../api/config'
import { camelizeKeys } from 'humps'
import _ from 'lodash'
import api from 'create-api'
import config from '../../api/config'
import qs from 'qs'

const superagent = require('superagent')

function _buildQuery(params = {}) {
  let query = {}
  let whitelist = [ 'where', 'embedded', 'max_results', 'page', 'sort', 'related' ]
  whitelist.forEach((ele) => {
    if (params.hasOwnProperty(ele)) {
      if (ele === 'where' || ele === 'embedded') {
        query[ ele ] = JSON.stringify(params[ ele ])
      } else {
        query[ ele ] = params[ ele ]
      }
    }
  })
  query = qs.stringify(query)
  return query
}

function _doFetch(url) {
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    // .query('')
    .end(function(err, res) {
      if(err) {
        console.log(url);
        console.log(err);
        reject(err)
      } else {
        resolve(camelizeKeys(res.body))
      }
    })
  })
}

function _setupWhereInParam(key, value, params={}) {
  params = params || {}
  value = Array.isArray(value) ? value : [ value ]
  let where = {}
  if (value.length > 0) {
    _.merge(where, params.where, {
      [key]: {
        '$in': value
      }
    })
  }
  params.where = where
  return params
}

function loadArticles(params = {}) {
  const query = _buildQuery(params)
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/posts`
  // let slug = typeof params[0] === 'string' ? params[0] : null
  // url = slug ? `${url}/${slug}` : url
  url = `${url}?${query}`
  return _doFetch(url)
}
function loadArticlesPopList(params = {}) {
  const { SERVER_PROTOCOL, SERVER_HOST } = config
  let url = `${SERVER_PROTOCOL}://${SERVER_HOST}/story/json/popularlist.json`
  return _doFetch(url)
}

function loadArticlesByUuid(uuid = '', type = '', params = {}, isOnlyMeta = true) {
  switch (type) {
    case SECTION:
      params = _setupWhereInParam('sections', [ uuid ], params)
      break
    case CATEGORY:
      params = _setupWhereInParam('categories', [ uuid ], params)
      break
    case TAG:
      params = _setupWhereInParam('tags', [ uuid ], params)
      break
    case TOPIC:
      params = _setupWhereInParam('topics', [ uuid ], params)
      break
    default:
      return Promise.resolve()
  }
  params.sort = params.sort || '-publishedDate'
  let query = _buildQuery(params)
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/meta`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadCommonData (endpoints = []) {
  let mapped = _.map(endpoints, (n) => { return 'endpoint=' + n })
  let combo_params = mapped.join('&')
  const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } = config
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/combo?endpoint=sections&endpoint=topics&endpoint=projects&`
  url = url + combo_params
  return _doFetch(url)
}

function loadEditorChoice () {
  const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } = config
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/combo?endpoint=choices`
  return _doFetch(url)
}

function loadEvent () {
  const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } = config
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/event`
  return _doFetch(url)
}

function loadImages (uuid = '', type = '', params = {}) {
  switch (type) {
    case SECTION:
      params = _setupWhereInParam('sections', [ uuid ], params)
      break
    case CATEGORY:
      params = _setupWhereInParam('categories', [ uuid ], params)
      break
    case TAG:
      params = _setupWhereInParam('tags', [ uuid ], params)
      break
    case TOPIC:
      params = _setupWhereInParam('topics', [ uuid ], params)
      break
    default:
      return Promise.resolve()
  }

  const query = _buildQuery(params)
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/images`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadLatestArticle (params = {}) {
  let query = _buildQuery(params)
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/posts`
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadQuestionnaire() {
  const { QUESTIONNAIRE_HOST } = config
  let apiHost = `${QUESTIONNAIRE_PROTOCOL}://${QUESTIONNAIRE_HOST}/questionnaire/tasduiiuah32hk2/tasduiiuah32hk2.json`
  return new Promise(resolve => {
    superagent
    .get(apiHost)
    .end((err, response) => {
      if (!err && response) {
        resolve(JSON.parse(response.text))
      } else {
        resolve('{\'error\':' + err + '}')
      }
    })
  })
}

function loadSearch (keyword = '', params = {}) {
  let query = params.query
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/search`
  url = `${url}?query=${encodeURIComponent(keyword)}&hitsPerPage=${params.max_results}&page=${params.page - 1}`
  return _doFetch(url)
}

function loadSectionList () {
  const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } = config
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/combo?endpoint=sections`
  return _doFetch(url)
}

function loadTopic ( params = {}) {
  const query = _buildQuery(params)
  let url = `${LOCAL_PROTOCOL}://${LOCAL_HOST}:${LOCAL_PORT}/api/topics`
  url = `${url}?${query}`
  return _doFetch(url)
}

// warm the front page cache every 15 min
// make sure to do this only once across all requests
if (api.onServer && !api.warmCacheStarted) {
  api.warmCacheStarted = true
  warmCache()
}

function warmCache () {
  setTimeout(warmCache, 1000 * 60 * 15)
}

function fetch (child) {
  const cache = api.cachedItems
  if (cache && cache.has(child)) {
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      api.child(child).once('value', snapshot => {
        const val = snapshot.val()
        // mark the timestamp when this item is cached
        if (val) val.__lastUpdated = Date.now()
        cache && cache.set(child, val)
        resolve(val)
      }, reject)
    })
  }
}

export function fetchIdsByType (type) {
  return api.cachedIds && api.cachedIds[type]
    ? Promise.resolve(api.cachedIds[type])
    : fetch(`${type}stories`)
}


export function fetchCommonData (endpoints = []) {
  return Promise.all([ loadCommonData(endpoints) ])
          .then( (data) => {
            let commonData = {}
            _.map( Object.keys( _.get(data[0], ['endpoints']) ), (e) => {
              commonData[e] = _.get(data[0], ['endpoints', e ])
              if (e == 'sections' ) {
                _.forEach( _.get(data[0], ['endpoints', e, 'items' ]), (s) => {
                  _.forEach(s.categories, (c) => {
                    _.set(commonData, ['categories', c.name], c)
                  })
                })
              }
            })
            return commonData
          } )
}

export function fetchEditorChoice () {
  return loadEditorChoice()
}

export function fetchEvent () {
  return loadEvent()
}

export function fetchLatestArticle (params = {}) {
  return loadLatestArticle(params)
}

export function fetchQuestionnaire (id) {
  return loadQuestionnaire()
}

export function fetchSearch (keyword = '', params = {}) {
  return loadSearch(keyword, params)
}

export function fetchSectionList () {
  return loadSectionList()
}

export function fetchTopic (params = {}) {
  return loadTopic(params)
}

export function fetchArticles (params = {}) {
  return loadArticles(params)
}

export function fetchArticlesByUuid (uuid = '', type = '', params = {}, isOnlyMeta = true) {
  return loadArticlesByUuid(uuid, type, params, isOnlyMeta)
}

export function fetchArticlesPopList (params = {}) {
  return loadArticlesPopList(params)
}

export function fetchImages (uuid = '', type = '', params = {}) {
  return loadImages(uuid, type, params)
}
