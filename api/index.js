const { get, map, isString, toNumber } = require('lodash')
const { fetchFromRedisForAPI, insertIntoRedis, redisFetching, redisFetchingRecommendNews, redisWriting } = require('./middle/redisHandler') 
const config = require('./config')
const bodyParser = require('body-parser')
const debug = require('debug')('PLATEVUE:api')
const express = require('express')
// const isProd = process.env.NODE_ENV === 'production'
const router = express.Router()
const superagent = require('superagent')
const Twitter = require('twitter')

const jsonParser = bodyParser.json()

const { Logging } = require('@google-cloud/logging')
const loggingClient = new Logging({
  projectId: config.GCP_PROJECT_ID,
  keyFilename: config.GCP_KEYFILE
})

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

const isValidJSONString = str => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
const handlerError = (err, res) => {
  const text = get(res, 'text') || get(err, 'message', '{}')
  return {
    status: (typeof(get(res, 'status')) === 'number' && get(res, 'status')) || get(err, 'status') || 500,
    text: !isValidJSONString(text)
      ? isString(text)
      ? `{message:${text}}`
      : `{}`
      : text
  }
}

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
          response: config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
          deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
        }
      )
      .then(response => {
        debug('Fetch static json file from api.', url)
        if (response) {
          redisWriting(url, response.text)
          res.header('Cache-Control', 'public, max-age=300')
          res.json(JSON.parse(response.text))
        } else {
          res.header('Cache-Control', 'no-cache')
          res.status(500).send(response)
        }
      })
      .catch(error => {
        const status = get(error, 'status') || 500
        const info = JSON.parse(get(error, 'response.text')) || error
        console.error(`error during fetch data from ${fileName} : ${url}`)
        console.error(error)
        res.header('Cache-Control', 'no-cache')
        res.status(status).send(info)
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
    console.error(`\n[ERROR] GET newsletter api.`, url)
    console.error(`${error}\n`)
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
    console.error(`\n[ERROR] POST newsletter api.`, url, { user: req.body.user, item: req.body.item })
    console.error(`${error}\n`)
    const status = get(error, 'status') || 500
    const info = JSON.parse(get(error, 'response.text')) || error
    res.header('Cache-Control', 'no-cache')
    res.status(status).send(info)
  }
})

router.get('/video/:id', fetchFromRedisForAPI, async (req, res, next) => {
  if (res.redis) {
    const resData = JSON.parse(res.redis)
    res.header('Cache-Control', 'public, max-age=300')
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
      console.error(`\n[ERROR] GET oath api.`, url)
      console.error(`${error}\n`)
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
      console.error(`\n[ERROR] GET oath api.`, url)
      console.error(`${error}\n`)
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
      console.error(`\n[ERROR] GET oath api.`, url)
      console.error(`${error}\n`)
    }
  }
}, insertIntoRedis)

// deprecated
router.get('/playlist', (req, res) => {
  let query = req.query
  let url = `${config.YOUTUBE_PROTOCOL}://${config.YOUTUBE_HOST}?part=snippet&playlistId=${config.YOUTUBE_PLAYLIST_ID}&key=${config.YOUTUBE_API_KEY}`
  redisFetching(`${url}?${req.url}`, ({ err, data }) => {
    if (!err && data) {
      res.json(JSON.parse(data))
    } else {
      console.error(`\n[ERROR] Fetch data from Redis in fail.`, `${url}?${req.url}`)
      console.error(`${err}\n`)
      superagent
      .get(url)
      .timeout(config.YOUTUBE_API_TIMEOUT)
      .query(query)
      .then(response => {
        redisWriting(`${url}?${req.url}`, JSON.stringify(response.body))
        res.json(response.body)
      })
      .catch(error => {
        console.error(`\n[ERROR] GET youtube api.`, url)
        console.error(`${error}\n`)
        const status = get(error, 'status') || 500
        const info = JSON.parse(get(error, 'response.text')) || error
        res.header('Cache-Control', 'no-cache')
        res.status(status).send(info)
      })
    }
  })
})

router.use('/search', (req, res) => {
  const esSearch_url = `${config.SEARCH_PROTOCOL}://${config.SEARCH_HOST}:${config.SEARCH_PORT || 9200}${config.SEARCH_ENDPOINT}`
  redisFetching(`/search${req.url}`, ({ err, data }) => {
    if (!err && data) {
      res.json(JSON.parse(data))
    } else {
      console.error(`\n[ERROR] Fetch data from Redis in fail.`, `/search${req.url}`)
      console.error(`${err}\n`)
      const keywords = get(req, 'query.keyword', '').split(',')
      const test = {
        'from': (toNumber(get(req, 'query.page', 1)) - 1) * toNumber(get(req, 'query.max_results', 12)),
        'size': toNumber(get(req, 'query.max_results', 12)),
        'query': {
          'bool': {
            'must': map(keywords, k => ({
              'multi_match' : {
                'query': k,
                'type': 'phrase',
                'fields': [ 'title', 'brief' ]
              }
            }))
          }
        },
        'sort' : {
          'publishedDate': { 'order': 'desc' }
        }
      }
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
        console.error(`\n[ERROR] POST elastic search api`, esSearch_url)
        console.error(test)
        console.error(`${error}\n`)
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
        console.error(`\n[ERROR] GET twitter api.`, req.url)
        console.error(`${err}\n`)
        res.status(500).send(err)
      } else {
        res.json(data)
      }
    })
  }
})

router.use('/tracking', async (req, res) => {
  try {
    const query = req.query
    const log = loggingClient.log(config.GCP_STACKDRIVER_LOG_NAME)
    const metadata = { resource: { type: 'global' } }
    query['ip'] = req.clientIp
    const entry = log.entry(metadata, query)
    await log.write(entry)
    res.send({ msg: 'Logging successfully.' })
  } catch (error) {
    console.error(`\n[ERROR] Client info logging error occurred.`)
    console.error(`${error}\n`)
    res.status(500).send(error)
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
        console.error(`\n[ERROR] Fetch data from related-newsredis.`)
        console.error(`${err}\n`)
      }
      res.json({ count: 0, result: [] })
    }
  })
})

router.get('*', (req, res, next) => {
  req.startTime = Date.now()
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
}, fetchFromRedisForAPI, async (req, res, next) => {
  try {
    const response = await superagent
      .get(apiHost + req.url)
      .timeout(
        {
          response: config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
          deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
        }
      )
    const data = JSON.parse(response.text)
    const dataAmount = get(data, '_meta.total')
    console.log(`\n[LOG] Fetch data from Api. Time: ${Date.now() - req.startTime}ms. Amount: ${dataAmount}`)
    console.log(`${decodeURIComponent(req.url)}\n`)
    if ((data._items || data._endpoints) && dataAmount >= 0) {
      res.dataString = response.text
      next()
    }
    res.header('Cache-Control', 'public, max-age=300')
    res.send(data)
  } catch (error) {
    const errWrapped = handlerError(error)
    if (errWrapped.status !== 404) {
      console.error(`\n[ERROR] Fetch data from from api.`, req.url)
      console.error(`${errWrapped.text}\n`)
    } else {
      console.error(`\n[ERROR] Not Found.`, req.url)
    }

    res.header('Cache-Control', 'no-cache')
    res.status(errWrapped.status).send({
      status: errWrapped.status,
      text: errWrapped.text
    })
  }
}, insertIntoRedis)

module.exports = router
