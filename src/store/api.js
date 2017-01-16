// this is aliased in webpack config based on server/client build
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
    .end(function(err, res) {
      if(err) {
        reject(err)
      } else {
        resolve(camelizeKeys(res.body))
      }
    })
  })
}

function loadArticles(params = {}) {
  const query = _buildQuery(params)
  let url = `/api/posts/`
  // let slug = typeof params[0] === 'string' ? params[0] : null
  // url = slug ? `${url}/${slug}` : url
  url = `${url}?${query}`
  return _doFetch(url)
}

function loadEvent () {
  let url = `http://localhost:8080/api/event`
  return _doFetch(url)
}

function loadQuestionnaire() {
  let apiHost = 'https://statics.mirrormedia.mg/questionnaire/tasduiiuah32hk2/tasduiiuah32hk2.json'
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

function loadSectionList () {
  let url = `http://localhost:8080/api/combo?endpoint=sections`
  return _doFetch(url)
}

function loadTopic () {
  let url = `http://localhost:8080/api/topics`
  return _doFetch(url)
}

// warm the front page cache every 15 min
// make sure to do this only once across all requests
if (api.onServer && !api.warmCacheStarted) {
  api.warmCacheStarted = true
  warmCache()
}

function warmCache () {
  fetchItems((api.cachedIds.top || []).slice(0, 30))
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

export function fetchItem (id) {
  return fetch(`item/${id}`)
}

export function fetchItems (ids) {
  return Promise.all(ids.map(id => fetchItem(id)))
}

export function fetchEvent () {
  return loadEvent()
}

export function fetchCommonData () {
  return Promise.all([ fetchEvent(), fetchSectionList(), fetchTopic() ])
          .then( (data) => {
            let commonData = {}
            commonData.event = data[0]
            commonData.sectionList = data[1]
            commonData.topic = data[2]
            return commonData
          } )
}

export function fetchQuestionnaire (id) {
  return loadQuestionnaire()
}

export function fetchSectionList () {
  return loadSectionList()
}

export function fetchTopic () {
  return loadTopic()
}

export function fetchArticles (params = {}) {
  return loadArticles(params)
}

export function fetchUser (id) {
  return fetch(`user/${id}`)
}

export function watchList (type, cb) {
  let first = true
  const ref = api.child(`${type}stories`)
  const handler = snapshot => {
    if (first) {
      first = false
    } else {
      cb(snapshot.val())
    }
  }
  ref.on('value', handler)
  return () => {
    ref.off('value', handler)
  }
}
