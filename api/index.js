const { get, map, isString, toNumber, concat, compact } = require('lodash')
const { fetchFromRedisForAPI, insertIntoRedis, redisFetching, redisFetchingRecommendNews, redisWriting } = require('./middle/redisHandler') 
const { handlerError } = require('./comm')
const config = require('./config')
const bodyParser = require('body-parser')
const debug = require('debug')('PLATEVUE:api')
const express = require('express')
// const isProd = process.env.NODE_ENV === 'production'
const router = express.Router()
const superagent = require('./agent')
const Twitter = require('twitter')

const jsonParser = bodyParser.json()

const { Logging } = require('@google-cloud/logging')
const loggingClient = new Logging({
  projectId: config.GCP_PROJECT_ID,
  keyFilename: config.GCP_KEYFILE
})

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const UrlForRedisStoreOneMonth = [
    '/combo?endpoint=sections&endpoint=topics',
    '/combo?endpoint=sectionfeatured&endpoint=sections&endpoint=topics',
    '/combo?endpoint=sections',
    '/combo?endpoint=projects'
  ]

router.all('/', (req, res, next) => {
  next()
});

const fetchStaticJson = (req, res, fileName) => {
  debug(`Abt to fetch ${fileName} json file.`)
  const url = `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}/json/${fileName}.json`
  redisFetching(url, ({ err, data }) => {
    if (!err && data) {
      debug('Fetch static json file from Redis.', url)
      res.json(JSON.parse(data))
    } else {
      superagent
      .get(url)
      .timeout(
        {
          response: 1000, //config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
          deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
        }
      )
      .then(response => {
        debug('Fetch static json file from api.', url)
        if (response) {
          redisWriting(url, response.text)
          res.header('Cache-Control', 'public, max-age=600')
          res.json(JSON.parse(response.text))
        } else {
          res.header('Cache-Control', 'no-cache')
          res.status(500).send(response)
        }
      })
      .catch(error => {
        const errWrapped = handlerError(error)
        res.header('Cache-Control', 'no-cache')
        res.status(errWrapped.status).send({
          status: errWrapped.status,
          text: errWrapped.text
        })
        console.error(`error during fetch data from ${fileName} : ${url}\n${error}`)
      })
    }
  })
}

router.use('/grouped', (req, res) => {
  fetchStaticJson(req, res, 'grouped')
})

router.use('/poplist', (req, res) => {
  fetchStaticJson(req, res, 'popularlist')
})

// deprecated
router.get('/latestNews', (req, res) => {
  fetchStaticJson(req, res, 'latest_news')
})

router.get('/newsletter/:userEmail', async (req, res) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const url = `${config.NEWSLETTER_PROTOCOL}://${config.NEWSLETTER_HOST}:${config.NEWSLETTER_PORT}/user/${req.params.userEmail}`
  try {
    if (!regex.test(String(req.params.userEmail).toLowerCase())) {
      throw { status: 400, response: { text: "{\"_error\": {\"code\": 400, \"message\": \"email format error.\"}}" }}
    }
    const response = await superagent
      .get(url)
      .timeout(
        {
          response: config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
          deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
        }
      )
    res.json(JSON.parse(response.text))
  } catch (error) {
    console.error(`[ERROR] GET newsletter api.`, url, `${error}`)
    const status = get(error, 'status') || 500
    const info = JSON.parse(get(error, 'response.text')) || error
    res.header('Cache-Control', 'no-cache')
    res.status(status).send(info)
  }
})

router.post('/newsletter', jsonParser, async (req, res) => {
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const url = `${config.NEWSLETTER_PROTOCOL}://${config.NEWSLETTER_HOST}:${config.NEWSLETTER_PORT}/user`
  try {
    if (req && req.body && req.body.user && req.body.item) {
      if (!regex.test(req.body.user)) {
        throw { status: 400, response: { text: "{\"_error\": {\"code\": 400, \"message\": \"Bad request.\"}}" }}
      }
      const response = await superagent
        .post(url)
        .send({ user: req.body.user, item: req.body.item })
        .timeout(
          {
            response: config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
            deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
          }
        )
      res.status(200).json({ user: response.body.user, item: response.body.result })
    } else {
      throw { status: 400, response: { text: "{\"_error\": {\"code\": 400, \"message\": \"Bad request.\"}}" }}
    }
  } catch (error) {
    console.error(`[ERROR] POST newsletter api.`, url, { user: req.body.user, item: req.body.item }, `${error}`)
    const status = get(error, 'status') || 500
    const info = JSON.parse(get(error, 'response.text')) || error
    res.header('Cache-Control', 'no-cache')
    res.status(status).send(info)
  }
})

router.get('/video/:id', fetchFromRedisForAPI, async (req, res, next) => {
  if (res.redis) {
    const resData = JSON.parse(res.redis)
    res.header('Cache-Control', 'public, max-age=600')
    res.json(resData)
  } else {
    const url = `${config.OATH_PROTOCOL}://${config.OATH_HOST}/${config.OATH_COMPANY_KEY}/video/${req.params.id}`
    try {
      const response = await superagent
        .get(url)
        .timeout(config.API_TIMEOUT)
        .query({ show_transcript: false, show_renditions: false, show_number_of_videos: true })
      res.dataString = response.text
      res.json(JSON.parse(response.text))
      next()
    } catch (error) {
      const status = error.status || error.statusCode || 500
      let message = get(error, 'response.text')
      message = message ? get(JSON.parse(message), 'failureCause.message') : error
      res.status(status).send(message)
      console.error(`[ERROR] GET oath api.`, url, `${error}`)
    }
  }
}, insertIntoRedis)

router.get('/video/playlist/:playlistId', fetchFromRedisForAPI, async (req, res, next) => {
  if (res.redis) {
    const resData = JSON.parse(res.redis)
    res.header('Cache-Control', 'public, max-age=300')
    res.json(resData)
  } else {
    const limit = req.query.max_results || 4
    const offset = req.query.offset || 0
    const url = `${config.OATH_PROTOCOL}://${config.OATH_HOST}/${config.OATH_COMPANY_KEY}/${req.params.playlistId}`
    try {
      const response = await superagent
        .get(url)
        .timeout(config.API_TIMEOUT)
        .query({ limit: limit, offset: offset, show_transcript: false, show_renditions: false, show_number_of_videos: true })
      res.dataString = response.text
      res.json(JSON.parse(response.text))
      next()
    } catch (error) {
      const status = error.status || error.statusCode || 500
      let message = get(error, 'response.text')
      message = message ? get(JSON.parse(message), 'failureCause.message') : error
      res.status(status).send(message)
      console.error(`\n[ERROR] GET oath api.`, url, `\n${error}\n`)
    }
  }
}, insertIntoRedis)

router.get('/playlistng/:ids', fetchFromRedisForAPI, async (req, res, next) => {
  if (res.redis) {
    const resData = JSON.parse(res.redis)
    res.header('Cache-Control', 'public, max-age=300')
    res.json(resData)
  } else {
    const limit = req.query.max_results || 10
    const url = `${config.OATH_PROTOCOL}://${config.OATH_HOST}/${config.OATH_COMPANY_KEY}/playlistng/${req.params.ids}`
    try {
      const response = await superagent
        .get(url)
        .timeout(config.API_TIMEOUT)
        .query({ limit: limit })
      res.dataString = response.text
      res.json(JSON.parse(response.text))
      next()
    } catch (error) {
      const status = error.status || error.statusCode || 500
      let message = get(error, 'response.text')
      message = message ? get(JSON.parse(message), 'failureCause.message') : error
      res.status(status).send(message)
      console.error(`\n[ERROR] GET oath api.`, url, `${error}`)
    }
  }
}, insertIntoRedis)

router.use('/search', (req, res) => {
  const esSearch_url = `${config.SEARCH_PROTOCOL}://${config.SEARCH_HOST}:${config.SEARCH_PORT || 9200}${config.SEARCH_ENDPOINT}`
  redisFetching(`/search${req.url}`, ({ err, data }) => {
    if (!err && data) {
      res.json(JSON.parse(data))
    } else {
      console.warn(`\n[WARN] Fetch data from Redis in fail ${err}.`, `/search${req.url}`)
      const keywords = get(req, 'query.keyword', '').split(',')
      const mustKeywords = map(keywords, k => ({
        'multi_match' : {
          'query': k,
          'type': 'phrase',
          'fields': [ 'title^2', 'brief', 'content', 'writers.name' ]
        }
      }))

      let where = {}
      try {
        where = JSON.parse(get(req, 'query.where', '{}'))
      } catch (error) {
        console.error('\n[ERROR] parsing "where" query in search api', `\nwhere query: ${JSON.stringify(get(req, 'query.where', '{}'))}`)
      }
      const section = get(where, 'section', '')
      const category = get(where, 'category', '')
      const mustScopeSection = section !== '' && { 'match' : { 'sections._id': section } }
      const mustScopeCategory = category !== '' && { 'match' : { 'categories._id': category } }
      const mustScope = compact([ mustScopeSection, mustScopeCategory ])
      const must = mustScope.length !== 0 ? concat(mustKeywords, mustScope) : mustKeywords
      const test = {
        'from': (toNumber(get(req, 'query.page', 1)) - 1) * toNumber(get(req, 'query.max_results', 12)),
        'size': toNumber(get(req, 'query.max_results', 12)),
        'query': {
          'bool': {
            'must': must
          }
        },
        'sort' : {
          'publishedDate': { 'order': 'desc' }
        }
      }

      console.log(`Perform esSearc \n${must}`)
      superagent
      .post(esSearch_url)
      .timeout({ response: config.SEARCH_TIMEOUT, deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, })
      .set('Content-Type', 'application/json')
      .send(test)
      .then(response => {
        redisWriting(`/search${req.url}`, JSON.stringify(response.body))
        res.json(response.body)
      })
      .catch(error => {
        const errWrapped = handlerError(error)
        res.status(errWrapped.status).send({
          status: errWrapped.status,
          text: errWrapped.text
        })
        console.error(`[ERROR] POST elastic search api: ${error}`, esSearch_url)
      })
    }
  })
})

router.use('/twitter', (req, res) => {
  const query = req.query
  const client = new Twitter(config.TWITTER_API)

  if (!('screen_name' in query) || query.screen_name === '') {
    res.status(400).send('empty screen_name')
  } else {
    client.get('statuses/user_timeline', query, (err, data) => {
      if (err) {
        console.error(`\n[ERROR] GET twitter api: ${err}.`, req.url)
        res.status(500).send(err)
      } else {
        res.json(data)
      }
    })
  }
})

router.use('/tracking', (req, res) => {
  try {
    res.send({ msg: 'Received.' })
    const query = req.query
    const log = loggingClient.log(config.GCP_STACKDRIVER_LOG_NAME)
    const metadata = { resource: { type: 'global' } }
    query['ip'] = req.clientIp
    const entry = log.entry(metadata, query)
    log.write(entry)
  } catch (error) {
    console.error(`[ERROR] Client info logging error occurred: ${error}.`)
  }
})

router.use('/related_news', (req, res) => {
  const query = req.query
  debug('/related_news', req.url)
  redisFetchingRecommendNews( get(query, 'id', '').split(',').map( id => 'related-news-v2-' + id ), ({ err, data }) => {
    if (!err && data) {
      let parsed
      try {
        parsed = JSON.parse(data)
      } catch (e) {
        parsed = { err: e, result: [], data }
      }
      res.json(parsed)
    } else {
      if (err) {
        console.error(`[ERROR] Fetch data from related-newsredis: ${err}.`)
      }
      res.json({ count: 0, result: [] })
    }
  })
})

router.get('*', (req, res, next) => {
  req.startTime = Date.now()
  const maxResults = req.query.max_results
  const maxResultsLimit = config.MAX_RESULTS_LIMIT || 25
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  if (maxResults && maxResults > maxResultsLimit) {
    return res.status(403).send()
  }
  next()
}, fetchFromRedisForAPI, async (req, res, next) => {
  try {
    const response = await superagent
      .get(apiHost + req.url)
      .timeout(
        {
          response: 1000, //config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
          deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
        }
      )
    const data = JSON.parse(response.text)
    const dataAmount = get(data, '_meta.total')
    let timePeriod = Date.now() - req.startTime
    if (timePeriod < 1000) {
      console.log(`[LOG] Fetch data from Api ${decodeURIComponent(req.url)}. Time: ${timePeriod}ms. Amount: ${dataAmount}`)
    } else {
      console.warn(`[WARN] Fetch data from Api ${decodeURIComponent(req.url)}. Time: ${timePeriod}ms. Amount: ${dataAmount}`)
    }
    if ((data._items || data._endpoints) && dataAmount >= 0) {
      res.dataString = response.text

      /**
       * If req target is post, have the redis ttl be 7 days.
       */
      const exp_post_query = /^\/getposts\?[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*/
      dataAmount > 0 && exp_post_query.test(req.url) && (res.redisTTL = 60 * 60 * 24 * 7)
      // redis ttl be 30 days.
      req.headers.host.match(/www.mirrormedia.mg/g)
      ? UrlForRedisStoreOneMonth.filter(url => url === req.url).length > 0 && (res.redisTTL = 60 * 60 * 24 * 30)
      : ''
      next()
    }
    res.header('Cache-Control', 'public, max-age=600')
    res.send(data)
  } catch (error) {
    const errWrapped = handlerError(error)
    if (errWrapped.status !== 404) {
      console.error(`[ERROR] Fetch data from from api.`, req.url, `${errWrapped.text}`)
    } else {
      console.error(`[ERROR] Not Found.`, req.url)
    }

    res.header('Cache-Control', 'no-cache')
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
  }
})

module.exports = router
