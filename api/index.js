const { API_PROTOCOL, API_HOST, API_PORT, REDIS_HOST, REDIS_PORT, REDIS_AUTH, TWITTER_API } = require('./config')
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

router.get('*', (req, res) => {
  res.header('Cache-Control', 'public, max-age=300');
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  console.log(apiHost)
  console.log(decodeURIComponent(req.url))
  redisClient.get(decodeURIComponent(req.url), function (err, data) {
    try {
      if (!err && data) {
        res.json(JSON.parse(data))
      }else{
        superagent
        .get(apiHost + req.url)
        .end((err, response) => {
          res.send(JSON.parse(response.text))
        })
      }
    } catch(e)  {
      res.send('catch')
    }
  })
})

module.exports = router
