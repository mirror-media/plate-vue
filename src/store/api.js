// this is aliased in webpack config based on server/client build
import api from 'create-api'
import config from '../../api/config'

const superagent = require('superagent')

let apiHost = 'https://statics.mirrormedia.mg/questionnaire/tasduiiuah32hk2/tasduiiuah32hk2.json'

function loadSectionList () {
  return new Promise((resolve, reject) => {
    //const query = req.query
    const { API_PROTOCOL, API_PORT, API_HOST } = config
    let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/sections`
    superagent
    .get(url)
    //.timeout(constants.timeout)
    //.query(query)
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res.body)
      }
    })
  })
}


function loadQuestionnaire(){
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

export function fetchSectionList (id) {
  return loadSectionList()
}

export function fetchQuestionnaire (id) {
  return loadQuestionnaire()
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
