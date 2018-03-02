const _ = require('lodash')
const { fetchFromRedis, insertIntoRedis, redisFetching, redisFetchingRecommendNews, redisWriting } = require('./middle/redisHandler') 
const config = require('./config')
const bodyParser = require('body-parser')
const debug = require('debug')('PLATEVUE:api')
const express = require('express')
const isProd = process.env.NODE_ENV === 'production'
const RedisConnectionPool = require('redis-connection-pool')
const router = express.Router()
const superagent = require('superagent')
const Twitter = require('twitter')

const jsonParser = bodyParser.json()

const Logging = require('@google-cloud/logging');
const loggingClient = Logging({
  projectId: config.GCP_PROJECT_ID,
  keyFilename: config.GCP_KEYFILE
});

const apiHost = config.API_PROTOCOL + '://' + config.API_HOST + ':' + config.API_PORT

router.all('/', function(req, res, next) {
  next()
});

const fetchStaticJson = (req, res, next, jsonFileName) => {
  const url = `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}/json/${jsonFileName}.json`
  redisFetching(url, ({ err, data }) => {
    if (!err && data) {
      debug('Fetch static json file from Redis.', url)
      res.json(JSON.parse(data))
    } else {
      superagent
      .get(url)
      .end((e, response) => {
        debug('Fetch static json file from api.', url)
        if (!e && response) {
          redisWriting(url, response.text)
          res.json(JSON.parse(response.text))
        } else {
          const status = _.get(response, 'status') || _.get(e, 'status') || 500
          res.status(status).send('{\'error\':' + e + '}')
          console.error(`error during fetch data from ${jsonFileName} : ${url}`)
          console.error(e)  
        }
      })
    }
  })
}

router.use('/grouped', function(req, res, next) {
  debug('Abt to fetch grouped json file.')
  fetchStaticJson(req, res, next, 'grouped')
});

router.use('/hotwatches', function(req,res, next) {
  fetchStaticJson(req, res, next, 'popularwatches')
})

router.use('/poplist', function(req, res, next) {
  fetchStaticJson(req, res, next, 'popularlist')
});

router.get('/newsletter/:userEmail', function(req, res, next) {
  if (req && req.params && req.params.userEmail) {
    const url = `${config.NEWSLETTER_PROTOCOL}://${config.NEWSLETTER_HOST}:${config.NEWSLETTER_PORT}/user/${req.params.userEmail}`
    superagent
    .get(url)
    .end((err, response) => {
      if (!err && response) {
        return res.json(JSON.parse(response.text))
      } else {
        if (err.status === 404) {
          return res.status(404).json({ error: 'Not Found.' })
        }
        console.error(`error during fetch data from newsletter GET : ${url}`)
        console.error(err)  
        return res.status(500).json({ error: 'Error.' })
      }
    })
  } else {
    return res.status(404).json({ error: 'Not Found.' })
  }
})

router.post('/newsletter', jsonParser, function(req, res, next) {
  if (req && req.body && req.body.user && req.body.item) {
    const url = `${config.NEWSLETTER_PROTOCOL}://${config.NEWSLETTER_HOST}:${config.NEWSLETTER_PORT}/user`
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const userEmail = req.body.user
    if (re.test(userEmail)) {
      superagent
      .post(url)
      .send({ user: userEmail, item: req.body.item })
      .end((err, response) => {
        if (!err && response) {
          return res.status(200).json({ user: response.body.user, item: response.body.result })
        } else {
          console.error(`error during fetch data from newsletter post : ${url} ${userEmail}`)
          console.error(err)
          return res.status(500).json({ error: 'Error.' })
        }
      })
    } else {
      return res.status(404).json({ error: 'Not Found.' })
    }
  } else {
    return res.status(404).json({ error: 'Not Found.' })
  }
})

router.use('/playlist', function(req, res, next) {
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
      .end(function(err, response) {
        if (err) {
          res.status(500).send(err)
          // res.status(500).end('Internal Error 500')
          console.error(`error during fetch data from playlist : ${req.url}`)
          console.error(err)    
        } else {
          redisWriting(`${url}?${req.url}`, JSON.stringify(response.body))
          res.json(response.body)
        }
      })
    }
  })
});

router.use('/questionnaire', function(req, res, next) {
  const query = req.query
  const url = `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}/questionnaire/${query.file}`
  if (!('file' in query) || query.file === '') {
    res.send('empty file')
  } else {
    redisFetching(url, ({ err, data }) => {
      if (!err && data) {
        res.json(JSON.parse(data))
      } else {
        superagent
        .get(url)
        .end((e, response) => {
          if (!e && response) {
            redisWriting(url, response.text)
            res.json(JSON.parse(response.text))
          } else {
            const status = _.get(response, 'status') || _.get(e, 'status') || 500
            res.status(status).send('{\'error\':' + e + '}')
            // res.status(500).end('Internal Error 500')
            console.error(`error during fetch data from questionnaire : ${req.url}`)
            console.error(e)   
          }
        })
      }
    })
  }

});

router.use('/search', function(req, res, next) {
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
      .end(function(e, response) {
        if (e) {
          const status = _.get(response, 'status') || _.get(e, 'status') || 500
          res.status(status).send('{\'error\':' + e + '}')
          // res.status(500).end('Internal Error 500')
          console.error(`error during fetch data from search : ${req.url}`)
          console.error(e)    
        } else {
          redisWriting(`${url}?${req.url}`, JSON.stringify(response.body))
          res.json(response.body)
        }
      })
    }
  })
});

router.use('/twitter', function(req, res, next) {
  const query = req.query
  let client = new Twitter(config.TWITTER_API)
  if (!('screen_name' in query) || query.screen_name === '') {
      res.send('empty screen_name')
  } else {
      client.get('statuses/user_timeline', query, function(err, data) {
        if (err) {
          res.status(500).send(err)
          // res.status(500).end('Internal Error 500')
          console.error(`error during fetch data from twitter : ${req.url}`)
          console.error(err) 
        } else {
          res.json(data)
        }
      })
  }

});

router.use('/tracking', function(req, res, next) {
  const query = req.query
  const log = loggingClient.log(config.GCP_STACKDRIVER_LOG_NAME)
  const metadata = { resource: { type: 'global' } }
  query['ip'] = req.clientIp

  const entry = log.entry(metadata, query)

  log.write(entry).then(() => {
    res.send({ msg: 'Logging successfully.' })
  })
  .catch((err) => {
    console.error('Client info logging error occurred:', err)
    res.status(500).send(err)
  }) 
})

router.use('/drafts', function(req, res, next) {
  next()
})

router.use('/related_news', function(req, res, next) {
  const query = req.query
  debug('/related_news', req.url)
  redisFetchingRecommendNews('news_dict', _.get(query, [ 'id' ], '').split(','), ({ err, data }) => {
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
        console.log('Error occurred when fetching data from related-newsredis.')
        console.log(err)
      }
      res.json({ count: 0, result: [] })
    }
  })
})

router.get('*', fetchFromRedis, (req, res, next) => {
  if (res.redis) {
    debug('Fetch data from Redis.')
    debug(req.url)
    const resData = JSON.parse(res.redis)
    res.json(resData)
  } else {
    debug('Fetch data from Api.')
    debug(req.url)
    res.header('Cache-Control', 'public, max-age=300');
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    console.log(apiHost)
    console.log(decodeURIComponent(req.url)) 
    superagent
      .get(apiHost + req.url)
      .timeout(
        {
          response: config.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
          deadline: config.API_DEADLINE ? config.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
        }
      ).end((error, response) => {
        if (!error && response) {
          let res_data
          try {
            res_data = JSON.parse(response.text)
          } catch (e) {
            res.send(e)
            console.error(`>>> Got bad data from api.`)
            console.error(`>>> ${req.url}`)
            console.error(e) 
            return 
          }
          const res_num = _.get(res_data, [ '_meta', 'total' ])
          if (res_num && res_num > 0) {
            res.dataString = response.text
            next()
          }
          res.send(res_data)
        } else {
          const status = _.get(response, 'status') || _.get(error, 'status') || 500
          res.header('Cache-Control', 'no-cache')
          res.status(status).send(error)
          if (status !== 404) {
            console.error(`>>> Error occurred during fetching data from api.`)
            console.error(`>>> ${req.url}`)
            console.error(error)  
          } else {
            console.error(`Not Found: ${req.url}`)
          }
        }
      })
  }
}, insertIntoRedis)

module.exports = router
