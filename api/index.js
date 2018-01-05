const _ = require('lodash')
const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, API_DEADLINE } = require('./config')
const { REDIS_AUTH, REDIS_MAX_CLIENT, REDIS_READ_HOST, REDIS_READ_PORT, REDIS_WRITE_HOST, REDIS_WRITE_PORT, REDIS_TIMEOUT, REDIS_CONNECTION_TIMEOUT, REDIS_RECOMMEND_NEWS_HOST, REDIS_RECOMMEND_NEWS_PORT } = require('./config')
const { GCP_KEYFILE, GCP_PROJECT_ID, GCP_STACKDRIVER_LOG_NAME } = require('./config')
const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST, NEWSLETTER_PROTOCOL, NEWSLETTER_HOST, NEWSLETTER_PORT, SERVER_PROTOCOL, SERVER_HOST, QUESTIONNAIRE_HOST, QUESTIONNAIRE_PROTOCOL } = require('./config')
const { SEARCH_PROTOCOL, SEARCH_HOST, SEARCH_ENDPOINT, SEARCH_API_KEY, SEARCH_API_APPID, SEARCH_API_TIMEOUT, TWITTER_API } = require('./config')
const { YOUTUBE_PROTOCOL, YOUTUBE_HOST, YOUTUBE_PLAYLIST_ID, YOUTUBE_API_KEY, YOUTUBE_API_TIMEOUT } = require('./config')
const bodyParser = require('body-parser')
const express = require('express')
const isProd = process.env.NODE_ENV === 'production'
const RedisConnectionPool = require('redis-connection-pool')
const router = express.Router()
const superagent = require('superagent')
const Twitter = require('twitter')

const jsonParser = bodyParser.json()

const Logging = require('@google-cloud/logging');
const loggingClient = Logging({
  projectId: GCP_PROJECT_ID,
  keyFilename: GCP_KEYFILE
});
const consoleLogOnDev = ({ msg, showSplitLine }) => {
  if (!isProd) {
    showSplitLine && console.log('####################')
    console.log(msg)
    showSplitLine && console.log('####################')
  }
}

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT
const redisOpts = {
  auth_pass: REDIS_AUTH,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection')
    }
    if (options.error && options.error.code === 'ETIMEDOUT') {
      return new Error('Timeout occured while connecting to redis.')      
    }
    if (options.total_retry_time > 1000 * 5) {
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 0 || options.times_connected > 0) {
      // this means "dont do retry"
      return undefined
    }
    // reconnect after
    // wouldnt go this return way never
    return 100
  }  
}

const redisPoolRead = RedisConnectionPool('redisPoolRead', {
  host: REDIS_READ_HOST, // default
  port: REDIS_READ_PORT, //default
  max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50, // defalut
  perform_checks: false, // checks for needed push/pop functionality
  database: 0, // database number to use
  options: redisOpts //options for createClient of node-redis, optional
})
const redisPoolWrite = isProd ? RedisConnectionPool('redisPoolWrite', {
    host: REDIS_WRITE_HOST,
    port: REDIS_WRITE_PORT,
    max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50,
    perform_checks: false,
    database: 0,
    options: redisOpts
  }) : redisPoolRead
const redisPoolRecommendNews = isProd ? RedisConnectionPool('redisPoolRecommendNews', {
    host: REDIS_RECOMMEND_NEWS_HOST,
    port: REDIS_RECOMMEND_NEWS_PORT,
    max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50,
    perform_checks: false,
    database: 0,
    options: redisOpts
  }) : redisPoolRead

const redisFetchingByHash = (key, field, callback) => {
  let isResponded = false
  let timeout = REDIS_CONNECTION_TIMEOUT || 2000
  const checkTimeout = setInterval(() => {
    timeout -= 1000
    if (isResponded) {
      clearInterval(checkTimeout)
      return
    }
    if (timeout <= 0) {
      clearInterval(checkTimeout)
      callback && callback({ err: 'ERROR: Timeout occured while connecting to redis.', data: null })
    }
  }, 1000)
  redisPoolRecommendNews.send_command('HMGET', [ key, ...field ], function (err, data) {
    isResponded = true
    clearInterval(checkTimeout)
    if (timeout <= 0) { return }
    callback && callback({ err, data })
  })
}  

const redisFetching = (url, callback) => {
  let isResponded = false
  let timeout = REDIS_CONNECTION_TIMEOUT || 2000
  const checkTimeout = setInterval(() => {
    timeout -= 1000
    if (isResponded) {
      clearInterval(checkTimeout)
      return
    }
    if (timeout <= 0) {
      clearInterval(checkTimeout)
      callback && callback({ err: 'ERROR: Timeout occured while connecting to redis.', data: null })
    }
  }, 1000)
  redisPoolRead.get(decodeURIComponent(url), function (err, data) {
    isResponded = true
    clearInterval(checkTimeout)
    redisPoolRead.ttl(decodeURIComponent(url), (_err, _data) => {
      if (!_err && _data) {
        if (_data === -1) {
          redisPoolWrite.del(decodeURIComponent(url), (_e, _d) => {
            if (_e) {
              console.log('deleting key ', decodeURIComponent(url), 'from redis in fail ', _e)
            }
          })
        }
      } else {
        console.log('fetching ttl in fail ', _err)
      }
    })
    if (timeout <= 0) { return }
    callback && callback({ err, data })
  })
}
const redisWriting = (url, data, callback) => {
  let isResponded = false
  let timeout = REDIS_CONNECTION_TIMEOUT || 2000
  const checkTimeout = setInterval(() => {
    timeout -= 1000
    if (isResponded) {
      clearInterval(checkTimeout)
      return
    }
    if (timeout <= 0) {
      clearInterval(checkTimeout)
      const errMsg = 'ERROR: Timeout occured while connecting to redis.'
      console.log('Failed to writing data to redis while trying to reach redis server.', errMsg)
      callback && callback({ err: errMsg, data: null })
    }
  }, 1000)
  redisPoolWrite.set(decodeURIComponent(url), data, function (err) {
    isResponded = true
    clearInterval(checkTimeout)
    if(err) {
      console.log('redis writing in fail. ', decodeURIComponent(url), err)
    } else {
      redisPoolWrite.expire(decodeURIComponent(url), REDIS_TIMEOUT, function(error, d) {
        if(error) {
          console.log('failed to set redis expire time. ', decodeURIComponent(url), err)
        }
      })
    }
  })
}

router.all('/', function(req, res, next) {
  next()
});

const fetchStaticJson = (req, res, next, jsonFileName) => {
  const url = `${SERVER_PROTOCOL}://${SERVER_HOST}/json/${jsonFileName}.json`
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
          res.status(response.status).send('{\'error\':' + e + '}')
          // res.status(500).end('Internal Error 500')
          console.error(`error during fetch data from ${jsonFileName} : ${url}`)
          console.error(e)  
        }
      })
    }
  })
}

router.use('/grouped', function(req, res, next) {
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
    const url = `${NEWSLETTER_PROTOCOL}://${NEWSLETTER_HOST}:${NEWSLETTER_PORT}/user/${req.params.userEmail}`
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
    const url = `${NEWSLETTER_PROTOCOL}://${NEWSLETTER_HOST}:${NEWSLETTER_PORT}/user`
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
  let url = `${YOUTUBE_PROTOCOL}://${YOUTUBE_HOST}?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
  redisFetching(`${url}?${req.url}`, ({ err, data }) => {
    if (!err && data) {
      res.json(JSON.parse(data))
    } else {
      superagent
      .get(url)
      .timeout(YOUTUBE_API_TIMEOUT)
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
  const url = `${SERVER_PROTOCOL}://${SERVER_HOST}/questionnaire/${query.file}`
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
            res.status(response.status).send('{\'error\':' + e + '}')
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
  let url = `${SEARCH_PROTOCOL}://${SEARCH_HOST}${SEARCH_ENDPOINT}`
  redisFetching(`${url}?${req.url}`, ({ err, data }) => {
    if (!err && data) {
      res.json(JSON.parse(data))
    } else {
      superagent
      .get(url)
      .timeout(SEARCH_API_TIMEOUT)
      .set('X-Algolia-API-Key', SEARCH_API_KEY)
      .set('X-Algolia-Application-Id', SEARCH_API_APPID)
      .query(query)
      .end(function(e, response) {
        if (e) {
          res.status(response.status).send(e)
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
  let client = new Twitter(TWITTER_API)
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
  const log = loggingClient.log(GCP_STACKDRIVER_LOG_NAME)
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
  consoleLogOnDev({ showSplitLine: true, msg: '/related_news' + req.url })
  redisFetchingByHash('news_dict', _.get(query, [ 'id' ], '').split(','), ({ err, data }) => {
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

router.get('*', (req, res) => {
    res.header('Cache-Control', 'public, max-age=300');
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    console.log(apiHost)
    console.log(decodeURIComponent(req.url)) 
    try {
      redisFetching(req.url, ({ err, data }) => {
        if (!err && data) {
          // consoleLogOnDev({ msg: `GOT DATA FROM REDIS: \n${decodeURIComponent(req.url)}`, showSplitLine: true })
          res.json(JSON.parse(data))
        } else {
          if (err) {
            console.log('Error occurred when fetching data from redis. Instead, going to fetch data from api.')
            console.log(err)
          }
          superagent
          .get(apiHost + req.url)
          .timeout(
            {
              response: API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
              deadline: API_DEADLINE ? API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
            }
          ).end((error, response) => {
            if (!error && response) {
              let res_data
              try {
                res_data = JSON.parse(response.text)
              } catch (e) {
                res.send(e)
                console.error(`got bad data from: ${req.url}`)
                console.error(e) 
                return 
              }
              const res_num = _.get(res_data, [ '_meta', 'total' ])
              if (res_num && res_num > 0) {
                redisWriting(req.url, response.text)
              }
              res.send(res_data)
            } else {
              res.status(response.status).send(error)
              console.error(`error during fetch data : ${req.url}`)
              console.error(error)  
            }
          })
        }
      })
    } catch (e) {
      res.status(500).send(e)
      console.error(`error during fetch data from api : ${req.url}`)
      console.error(e)
    }
})

module.exports = router
