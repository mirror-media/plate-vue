const { API_PROTOCOL, API_HOST, API_PORT, REDIS_HOST, REDIS_PORT, REDIS_AUTH, TWITTER_API } = require('./config')
const { SEARCH_PROTOCOL, SEARCH_HOST, SEARCH_ENDPOINT, SEARCH_API_KEY, SEARCH_API_APPID, SEARCH_API_TIMEOUT } = require('./config')
const { YOUTUBE_PROTOCOL, YOUTUBE_HOST, YOUTUBE_PLAYLIST_ID, YOUTUBE_API_KEY, YOUTUBE_API_TIMEOUT } = require('./config')
const express = require('express')
const redis = require('redis')
const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST, { no_ready_check: true, password: REDIS_AUTH })
const router = express.Router()
const superagent = require('superagent')
const Twitter = require('twitter')

const apiHost = API_PROTOCOL+'://'+API_HOST+':'+API_PORT

redisClient.on('connect', function () {
  console.log('Connected to Redis', apiHost)
})

router.all('/', function(req, res, next) {
  next()
 });

router.use('/twitter', function(req, res, next) {
    const query = req.query
    let client = new Twitter(TWITTER_API)
    if( !('screen_name' in query) || query.screen_name === '') {
      res.send('empty screen_name')
    }else{
      client.get('statuses/user_timeline', query, function (err, data) {
        if (err) {
          res.send(err)
        } else {
          res.json(data)
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
    .end(function (err, response) {
      if (err) {
        res.send(err)
      } else {
        res.json(response.body)
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
  .end(function (err, response) {
    if (err) {
      res.send(err)
    } else {
      res.json(response.body)
    }
  })
});

router.get('*', (req, res) => {
  res.header('Cache-Control', 'public, max-age=300');
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  console.log(apiHost)
  console.log(decodeURIComponent(req.url))
  redisClient.get(decodeURIComponent(req.url), function (err, data) {
    try {
      if (!err && data) {
        // have data
        console.log('redis')
        res.json(JSON.parse(data))
      }else{
        // no data then http request
        superagent
        .get(apiHost + req.url)
        .end((err, response) => {
          res.send(JSON.parse(response.text))
          console.log('save to redis', decodeURIComponent(req.url))
          redisClient.set(decodeURIComponent(req.url), response.text, 'EX', 300)
        })
      }
    } catch(e)  {
      res.send(e)
    }
  })
})

module.exports = router
