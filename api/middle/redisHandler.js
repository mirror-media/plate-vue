const debug = require('debug')('PLATEVUE:redis')
const isProd = process.env.NODE_ENV === 'production'
// const isTest = process.env.NODE_ENV === 'test'
const RedisConnectionPool = require('redis-connection-pool')

const { 
  REDIS_AUTH,
  REDIS_MAX_CLIENT,
  REDIS_READ_HOST,
  REDIS_READ_PORT,
  REDIS_WRITE_HOST,
  REDIS_WRITE_PORT,
  REDIS_RECOMMEND_NEWS_HOST,
  REDIS_RECOMMEND_NEWS_PORT,
  REDIS_CONNECTION_TIMEOUT,
  REDIS_TIMEOUT } = require('../config')

const REDIS_OPTIONS = {
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

const redisPoolRead = RedisConnectionPool('myRedisPoolRead', {
  host: REDIS_READ_HOST,
  port: REDIS_READ_PORT,
  max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50,
  perform_checks: false,
  database: 0,
  options: REDIS_OPTIONS
})

const redisPoolWrite = isProd ? RedisConnectionPool('myRedisPoolWrite', {
  host: REDIS_WRITE_HOST,
  port: REDIS_WRITE_PORT,
  max_clients: 5,
  perform_checks: false,
  database: 0,
  options: REDIS_OPTIONS
}) : redisPoolRead

const redisPoolRecommendNews = isProd ? RedisConnectionPool('redisPoolRecommendNews', {
  host: REDIS_RECOMMEND_NEWS_HOST,
  port: REDIS_RECOMMEND_NEWS_PORT,
  max_clients: REDIS_MAX_CLIENT ? REDIS_MAX_CLIENT : 50,
  perform_checks: false,
  database: 0,
  options: REDIS_OPTIONS
}) : redisPoolRead

class TimeoutHandler {
  constructor (callback) {
    this.isResponded = false
    this.timeout = REDIS_CONNECTION_TIMEOUT || 200 // 0.2s

    this.destroy = this.destroy.bind(this)
    this.init = this.init.bind(this)
    this.init(callback)
  }
  init (callback) {
    this.timeoutHandler = setInterval(() => {
      this.timeout -= 100
      if (this.isResponded) {
        this.destroy()
        return
      }
      if (this.timeout <= 0) {
        this.destroy()
        callback && callback({ error: 'Timeout occured while accessing data from redis.', data: null })
      }
    }, 100)
  }
  destroy () {
    clearInterval(this.timeoutHandler)
  }
}

const redisFetching = (url, callback) => {
  let start = Date.now()
  let timeoutHandler = new TimeoutHandler(callback)
  let decodedUrl
  try {
    decodedUrl = decodeURIComponent(url)
  } catch (error) {
    console.error('[ERROR] Decoding url in fail while fetching data to Redis. URIError: URI malformed.', url)
    decodedUrl = url
  }
  let beforeGet = Date.now() - start
  redisPoolRead.get(decodedUrl, (error, data) => {
    let redisPoolReadError
    if (data === null) {
      redisPoolReadError = 'Key does not exist.'
    } else if (error) {
      redisPoolReadError = error
    }
    let afterGet = Date.now() - start

    timeoutHandler.isResponded = true
    timeoutHandler.destroy()
    
    redisPoolRead.ttl(decodedUrl, (err, dt) => {
      if (!err && (dt === -1)) { // if the key exists but has no associated expire.
        redisPoolWrite.del(decodedUrl, (e, d) => {
          if (e) {
            console.warn('[WARN] deleting key ', decodedUrl, 'from redis in fail ', e)
          }
        })
      } else if (err) {
        console.warn(`[WARN] fetching ttl in fail. ${decodedUrl} ${err}`)
      }
    })
    
    if (timeoutHandler.timeout <= 0) { return }

    callback && callback({ error: redisPoolReadError, data })
    let timePeriod = Date.now() - start
    if (timePeriod > 300) {
	  console.log('[WARN]Redis operating total:', `${timePeriod}ms`, 'before get: ', `${beforeGet}ms`, 'after get: ', `${afterGet}ms`, decodedUrl)
    }
    timeoutHandler = null
  })
}
const redisWriting = (url, data, callback, timeout) => {
  let timeoutHandler = new TimeoutHandler(callback)
  let decodedUrl
  try {
    decodedUrl = decodeURIComponent(url)
  } catch (error) {
    console.error('[ERROR] Decoding url in fail while writing data to Redis. URIError: URI malformed.\n', url)
    decodedUrl = url
  }
  debug('Going to Writing things to redis...')
  redisPoolWrite.set(decodedUrl, data, (err) => {
    timeoutHandler.isResponded = true
    timeoutHandler.destroy()
    if(err) {
      console.error(`[ERROR] Write data to Redis in fail. ${decodedUrl} Error: ${err}`)
    } else {
      debug('Set timeout as:', timeout || REDIS_TIMEOUT)
      redisPoolWrite.expire(decodedUrl, timeout || REDIS_TIMEOUT || 5000, function(error, d) {
        if(error) {
          console.error(`[ERROR] Set redis expire time in fail. ${decodedUrl} Error: ${err}`)
        } else {
          callback && callback()
        }
      })
    }
    timeoutHandler = null
  })
}
const redisFetchingRecommendNews = (field, callback) => {
  let timeoutHandler = new TimeoutHandler(callback)
  redisPoolRecommendNews.send_command('MGET', [ ...field ], function (err, data) {
    timeoutHandler.isResponded = true
    timeoutHandler.destroy()
    if (timeoutHandler.timeout <= 0) { return }
	console.info('>>> Fetch recommend news ' + field + ' failed')
    callback && callback({ err, data })
    timeoutHandler = null
  })
}

const insertIntoRedis = (req, res, next) => {
  redisWriting(req.url, res.dataString, () => {
    // next()
  }, res.redisTTL)
}

const fetchFromRedis = (req, res, next) => {
  debug('Trying to fetching data from redis...', req.url)
  redisFetching(req.url, ({ error, data }) => {
    if (!error) {
      res.redis = data
      next()
    } else {
      console.error('>>> Fetch data from Redis in fail with error.', `\n${error}`)
      next()
    }
  })
}

const fetchFromRedisForAPI = (req, res, next) => {
  debug('Trying to fetching data from redis...', req.url)
  let start = Date.now()
  redisFetching(req.url, ({ error, data }) => {
    if (!error && data) {
      let timePeriod = Date.now() - start
      if (timePeriod > 500) {
        console.log('[WARN]Fetch data from Redis.', `${timePeriod}ms`, req.url)
      }
      res.header('Cache-Control', 'public, max-age=300')
      res.json(JSON.parse(data))
    } else {
      console.warn(`[WARN] Fetch data from Redis in fail. ${req.url} 、\nError: ${error} \nData: ${data}`)
      next()
    }
  })
}

module.exports = {
  fetchFromRedis,
  fetchFromRedisForAPI,
  insertIntoRedis,
  redisFetching,
  redisFetchingRecommendNews,
  redisWriting
}
