const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, REDIS_READ_HOST, REDIS_READ_PORT, REDIS_WRITE_HOST, REDIS_WRITE_PORT, REDIS_AUTH, REDIS_TIMEOUT, TWITTER_API } = require('./config')
const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST, SERVER_PROTOCOL, SERVER_HOST, QUESTIONNAIRE_HOST, QUESTIONNAIRE_PROTOCOL } = require('./config')
const { SEARCH_PROTOCOL, SEARCH_HOST, SEARCH_ENDPOINT, SEARCH_API_KEY, SEARCH_API_APPID, SEARCH_API_TIMEOUT } = require('./config')
const { YOUTUBE_PROTOCOL, YOUTUBE_HOST, YOUTUBE_PLAYLIST_ID, YOUTUBE_API_KEY, YOUTUBE_API_TIMEOUT } = require('./config')
const express = require('express')
const isProd = process.env.NODE_ENV === 'production'
// const redis = require('redis')
const RedisConnectionPool = require('redis-connection-pool')
const router = express.Router()
const superagent = require('superagent')
const Twitter = require('twitter')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT

const redisPoolRead = RedisConnectionPool('myRedisPool', {
    host: REDIS_READ_HOST, // default
    port: REDIS_READ_PORT, //default
    max_clients: 30, // defalut
    perform_checks: false, // checks for needed push/pop functionality
    database: 0, // database number to use
    options: {
      auth_pass: REDIS_AUTH
    } //options for createClient of node-redis, optional
  })
const redisPoolWrite = isProd ? RedisConnectionPool('myRedisPool', {
    host: REDIS_WRITE_HOST, // default
    port: REDIS_WRITE_PORT, //default
    max_clients: 30, // defalut
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
            }
        })
});

router.use('/playlist', function(req, res, next) {
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
            } else {
                res.json(response.body)
            }
        })
});

router.use('/poplist', function(req, res, next) {
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
            }
        })
});

router.use('/questionnaire', function(req, res, next) {
    const query = req.query
    if (!('file' in query) || query.file === '') {
        res.send('empty file')
    } else {
        superagent
            .get(`${QUESTIONNAIRE_PROTOCOL}://${QUESTIONNAIRE_HOST}/questionnaire/${query.file}`)
            .end((err, response) => {
                if (!err && response) {
                    res.json(JSON.parse(response.text))
                } else {
                    res.send('{\'error\':' + err + '}')
                    // res.status(500).end('Internal Error 500')
                    console.error(`error during fetch data from questionnaire : ${req.url}`)
                    console.error(err)    
                }
            })
    }
});

router.use('/search', function(req, res, next) {
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
            } else {
                res.json(response.body)
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
                res.send(err)
                // res.status(500).end('Internal Error 500')
                console.error(`error during fetch data from twitter : ${req.url}`)
                console.error(err)                
            } else {
                res.json(data)
            }
        })
    }
});

router.get('*', (req, res) => {
    res.header('Cache-Control', 'public, max-age=300');
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    // console.log(apiHost)
    // console.log(decodeURIComponent(req.url))
    
    redisPoolRead.get(decodeURIComponent(req.url), function (err, data) {
        try {
            if (!err && data) {
                // have data
                console.log('got data from redis.', decodeURIComponent(req.url))
                res.json(JSON.parse(data))
            } else {
                // no data then http request
                superagent
                    .get(apiHost + req.url)
                    .timeout(API_TIMEOUT)
                    .end((err, response) => {
                        if (!err && response) {
                            console.log('got data from api.', decodeURIComponent(req.url))
                            res.send(JSON.parse(response.text))
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
                            res.send(err)
                            console.error(`error during fetch data : ${req.url}`)
                            console.error(err)  
                        }
                    })
            }
        } catch (e) {
            res.send(e)
            // res.status(500).end('Internal Error 500')
            console.error(`error during fetch data from api : ${req.url}`)
            console.error(e)
        }
    });

    
})

module.exports = router
