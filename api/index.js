const _ = require('lodash')
const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, API_DEADLINE, REDIS_AUTH, REDIS_MAX_CLIENT, REDIS_READ_HOST, REDIS_READ_PORT, REDIS_WRITE_HOST, REDIS_WRITE_PORT, REDIS_TIMEOUT, TWITTER_API } = require('./config')
const { GCP_KEYFILE, GCP_PROJECT_ID, GCP_STACKDRIVER_LOG_NAME } = require('./config')
const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST, SERVER_PROTOCOL, SERVER_HOST, QUESTIONNAIRE_HOST, QUESTIONNAIRE_PROTOCOL, VALID_PREVIEW_IP_ADD } = require('./config')
const { SEARCH_PROTOCOL, SEARCH_HOST, SEARCH_ENDPOINT, SEARCH_API_KEY, SEARCH_API_APPID, SEARCH_API_TIMEOUT } = require('./config')
const { YOUTUBE_PROTOCOL, YOUTUBE_HOST, YOUTUBE_PLAYLIST_ID, YOUTUBE_API_KEY, YOUTUBE_API_TIMEOUT } = require('./config')
const express = require('express')
const isProd = process.env.NODE_ENV === 'production'
// const redis = require('redis')
const RedisConnectionPool = require('redis-connection-pool')
const router = express.Router()
const superagent = require('superagent')
const Twitter = require('twitter')

const Logging = require('@google-cloud/logging');
const loggingClient = Logging({
  projectId: GCP_PROJECT_ID,
  keyFilename: GCP_KEYFILE
});

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT

const redisPoolRead = RedisConnectionPool('myRedisPoolRead', {
    host: REDIS_READ_HOST, // default
    port: REDIS_READ_PORT, //default
    max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50, // defalut
    perform_checks: false, // checks for needed push/pop functionality
    database: 0, // database number to use
    options: {
      auth_pass: REDIS_AUTH
    } //options for createClient of node-redis, optional
  })
const redisPoolWrite = isProd ? RedisConnectionPool('myRedisPoolWrite', {
    host: REDIS_WRITE_HOST, // default
    port: REDIS_WRITE_PORT, //default
    max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50, // defalut
    perform_checks: false, // checks for needed push/pop functionality
    database: 0, // database number to use
    options: {
      auth_pass: REDIS_AUTH
    } //options for createClient of node-redis, optional
  }) : redisPoolRead

router.all('/', function(req, res, next) {
    next()
});

router.use('/grouped', function(req, res, next) {
    let isErrorOccurred = false
    // const query = req.query
    superagent
        .get(`${SERVER_PROTOCOL}://${SERVER_HOST}/json/grouped.json`)
        .end((err, response) => {
            if (!err && response) {
                res.json(JSON.parse(response.text))
            } else {
                res.send('{\'error\':' + err + '}')
                // res.status(500).end('Internal Error 500')
                console.error(`error during fetch data from grouped : ${req.url}`)
                console.error(err)  
                isErrorOccurred = true
            }
        })
});

router.use('/playlist', function(req, res, next) {
    let isErrorOccurred = false
    let query = req.query
    let url = `${YOUTUBE_PROTOCOL}://${YOUTUBE_HOST}?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    superagent
        .get(url)
        .timeout(YOUTUBE_API_TIMEOUT)
        .query(query)
        .end(function(err, response) {
            if (err) {
                res.send(err)
                // res.status(500).end('Internal Error 500')
                console.error(`error during fetch data from playlist : ${req.url}`)
                console.error(err)    
                isErrorOccurred = true
            } else {
                res.json(response.body)
            }
        })

});

router.use('/poplist', function(req, res, next) {
    let isErrorOccurred = false
    // const query = req.query
    superagent
        .get(`${SERVER_PROTOCOL}://${SERVER_HOST}/json/popularlist.json`)
        .end((err, response) => {
            if (!err && response) {
                res.json(JSON.parse(response.text))
            } else {
                res.send('{\'error\':' + err + '}')
                // res.status(500).end('Internal Error 500')
                console.error(`error during fetch data from poplist : ${req.url}`)
                console.error(err) 
                isErrorOccurred = true  
            }
        })

});

router.use('/questionnaire', function(req, res, next) {
  let isErrorOccurred = false
  const query = req.query
  if (!('file' in query) || query.file === '') {
      res.send('empty file')
  } else {
      superagent
          .get(`${SERVER_PROTOCOL}://${SERVER_HOST}/questionnaire/${query.file}`)
          .end((err, response) => {
              if (!err && response) {
                  res.json(JSON.parse(response.text))
              } else {
                  res.send('{\'error\':' + err + '}')
                  // res.status(500).end('Internal Error 500')
                  console.error(`error during fetch data from questionnaire : ${req.url}`)
                  console.error(err)   
                  isErrorOccurred = true
              }
          })
  }

});

router.use('/search', function(req, res, next) {
  let isErrorOccurred = false
  let query = req.query
  let url = `${SEARCH_PROTOCOL}://${SEARCH_HOST}${SEARCH_ENDPOINT}`
  superagent
      .get(url)
      .timeout(SEARCH_API_TIMEOUT)
      .set('X-Algolia-API-Key', SEARCH_API_KEY)
      .set('X-Algolia-Application-Id', SEARCH_API_APPID)
      .query(query)
      .end(function(err, response) {
          if (err) {
              res.send(err)
              // res.status(500).end('Internal Error 500')
              console.error(`error during fetch data from search : ${req.url}`)
              console.error(err)    
              isErrorOccurred = true
          } else {
              res.json(response.body)
          }
      })

});

router.use('/twitter', function(req, res, next) {
  const query = req.query
  let client = new Twitter(TWITTER_API)
  let isErrorOccurred = false
  if (!('screen_name' in query) || query.screen_name === '') {
      res.send('empty screen_name')
  } else {
      client.get('statuses/user_timeline', query, function(err, data) {
          if (err) {
              res.send(err)
              // res.status(500).end('Internal Error 500')
              console.error(`error during fetch data from twitter : ${req.url}`)
              console.error(err) 
              isErrorOccurred = true             
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
  const isValidReq = _.filter(VALID_PREVIEW_IP_ADD, (i) => (req.clientIp.indexOf(i) > -1)).length > 0
  if (isValidReq) {
    next()
  } else {
    res.status(403).end('Forbidden')
  }
})

router.get('*', (req, res) => {
    let isErrorOccurred = false;
    res.header('Cache-Control', 'public, max-age=300');
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    console.log(apiHost)
    console.log(decodeURIComponent(req.url))
    redisPoolRead.get(decodeURIComponent(req.url), function (err, data) {
        try {
            if (!err && data) {
                // have data
                // console.log('##########', 'GOT DATA FROM REDIS', '##########')
                // console.log(decodeURIComponent(req.url))
                // console.log('##########', 'GOT DATA FROM REDIS', '##########')
                redisPoolRead.ttl(decodeURIComponent(req.url), (_err, _data) => {
                  if (!_err && _data) {
                    if (_data === -1) {
                      redisPoolWrite.del(decodeURIComponent(req.url), (_e, _d) => {
                        if (_e) {
                          console.log('deleting key ', decodeURIComponent(req.url), 'from redis in fail ', _err)
                        }
                      })
                    }
                  } else {
                    console.log('fetching ttl in fail ', _err)
                  }
                })
                
                res.json(JSON.parse(data))
            } else {
                // no data then http request
                superagent
                    .get(apiHost + req.url)
                    .timeout(
                        {
                            response: API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
                            deadline: API_DEADLINE ? API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
                        }
                    )
                    .end((err, response) => {
                        if (!err && response) {
                            // console.log('##########', 'GOT DATA FROM API', '##########')
                            // console.log(decodeURIComponent(req.url))
                            // console.log('##########', 'GOT DATA FROM API', '##########')                          
                            const res_data = JSON.parse(response.text)
                            const res_num = _.get(res_data, [ '_meta', 'total' ])
                            if (res_num && res_num > 0) {
                              res.send(res_data)
                              redisPoolWrite.set(decodeURIComponent(req.url), response.text, function (err) {
                                  if(err) {
                                      console.log('redis writing in fail. ', decodeURIComponent(req.url), err)
                                  } else {
                                      redisPoolWrite.expire(decodeURIComponent(req.url), REDIS_TIMEOUT, function(error, d) {
                                          if(error) {
                                              console.log('failed to set redis expire time. ', decodeURIComponent(req.url), err)
                                          }
                                      })
                                  }
                              })
                            } else {
                              res.send(res_data)
                            }
                        } else {
                            res.send(err)
                            console.error(`error during fetch data : ${req.url}`)
                            console.error(err)  
                            isErrorOccurred = true
                        }
                    })
            }
        } catch (e) {
            res.send(e)
            console.error(`error during fetch data from api : ${req.url}`)
            console.error(e)
            isErrorOccurred = true
        }
    });

    
})

module.exports = router
