const { get } = require('lodash')
const { fetchFromRedis, insertIntoRedis, redisFetching, redisFetchingRecommendNews, redisWriting } = require('./middle/redisHandler') 
const config = require('./config')
const bodyParser = require('body-parser')
const debug = require('debug')('PLATEVUE:api')
const express = require('express')
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
    const status = get(error, 'status') || 500
    const info = JSON.parse(get(error, 'response.text')) || error
    console.error(`error during fetch data from newsletter GET : ${url}`)
    console.error(error)
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
    const status = get(error, 'status') || 500
    const info = JSON.parse(get(error, 'response.text')) || error
    console.error(`error during fetch data from newsletter POST : ${url}`)
    console.error(error)
    res.header('Cache-Control', 'no-cache')
    res.status(status).send(info)
  }
})

router.use('/playlist', (req, res) => {
  let query = req.query
  let url = `${config.YOUTUBE_PROTOCOL}://${config.YOUTUBE_HOST}?part=snippet&playlistId=${config.YOUTUBE_PLAYLIST_ID}&key=${config.YOUTUBE_API_KEY}`
  redisFetching(`${url}?${req.url}`, ({ err, data }) => {
    if (!err && data) {
      res.json(JSON.parse(data))
    } else {
      superagent
      .get(url)
      .timeout(config.YOUTUBE_API_TIMEOUT)
      .query(query)
      .then(response => {
        redisWriting(`${url}?${req.url}`, JSON.stringify(response.body))
        res.json(response.body)
      })
      .catch(error => {
        const status = get(error, 'status') || 500
        const info = JSON.parse(get(error, 'response.text')) || error
        res.header('Cache-Control', 'no-cache')
        res.status(status).send(info)
        console.error(`error during fetch data from playlist : ${req.url}`)
        console.error(err)
      })
    }
  })
})

router.use('/search', (req, res) => {
  let query = req.query
  let url = `${config.SEARCH_PROTOCOL}://${config.SEARCH_HOST}${config.SEARCH_ENDPOINT}`
  redisFetching(`${url}?${req.url}`, ({ err, data }) => {
    if (!err && data) {
      res.json(JSON.parse(data))
    } else {
      superagent
      .get(url)
      .timeout(config.SEARCH_API_TIMEOUT)
      .set('X-Algolia-API-Key', config.SEARCH_API_KEY)
      .set('X-Algolia-Application-Id', config.SEARCH_API_APPID)
      .query(query)
      .then(response => {
        redisWriting(`${url}?${req.url}`, JSON.stringify(response.body))
        res.json(response.body)
      })
      .catch(error => {
        const status = get(error, 'status') || 500
        const info = JSON.parse(get(error, 'response.text')) || error
        res.header('Cache-Control', 'no-cache')
        res.status(status).send(info)
        console.error(`error during fetch data from playlist : ${req.url}`)
        console.error(err)
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
        res.status(500).send(err)
        console.error(`error during fetch data from twitter : ${req.url}`)
        console.error(err) 
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
    console.error('Client info logging error occurred:', error)
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
        console.error('Error occurred when fetching data from related-newsredis.')
        console.error(err)
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
}, fetchFromRedis, async (req, res, next) => {
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
    console.log('Fetch data from Api.',
      `${Date.now() - req.startTime}ms ${dataAmount}\n`,
      `${decodeURIComponent(req.url)}\n`)
    
    if ((data._items || data._endpoints) && dataAmount >= 0) {
      res.dataString = response.text
      next()
    }

    res.header('Cache-Control', 'public, max-age=300')
    res.send(data)
  } catch (error) {
    const status = get(error, 'status') || 500
    const info = JSON.parse(get(error, 'response.text')) || error
    if (status !== 404) {
      console.error(`>>> Error occurred during fetching data from api.\n`, `>>> ${req.url}\n`, info)
    } else {
      console.error(`Not Found: ${req.url}`)
    }

    res.header('Cache-Control', 'no-cache')
    res.status(status).send(info)
  }
}, insertIntoRedis)

module.exports = router
