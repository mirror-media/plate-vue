const debug = require('debug')('PLATEVUE:redis')
const isProd = process.env.NODE_ENV === 'production'

const redis = require('./redis')
const { promisify } = require('util')

const { 
  REDIS_AUTH,
  REDIS_READ_HOST,
  REDIS_READ_PORT,
  REDIS_WRITE_HOST,
  REDIS_WRITE_PORT,
  REDIS_RECOMMEND_NEWS_HOST,
  REDIS_RECOMMEND_NEWS_PORT,
  REDIS_CONNECTION_TIMEOUT,
  REDIS_TIMEOUT
} = require('../config')

const retryStrategy = (options) => {
  if (options.error && options.error.code === 'ECONNREFUSED') {
    // End reconnecting on a specific error and flush all commands with
    // a individual error
    return new Error('The server refused the connection')
  }
  if (options.error && options.error.code === 'ETIMEDOUT') {
    return new Error('Timeout occured while connecting to redis.')      
  }
  if (options.total_retry_time > 200 * 3) {
    // End reconnecting after a specific timeout and flush all commands
    // with a individual error
    return new Error('Retry time exhausted')
  }
  if (options.attempt > 0 || options.times_connected > 0) {
    // End reconnecting with built in error
    return undefined
  }
  // reconnect after
  return 100
}

const readClient = redis.createClient(REDIS_READ_PORT, REDIS_READ_HOST, {
  password: REDIS_AUTH,
  retry_strategy: retryStrategy
})

const writeClient = redis.createClient(REDIS_WRITE_PORT, REDIS_WRITE_HOST, {
  password: REDIS_AUTH,
  retry_strategy: retryStrategy
})

const recommendNewsClient = isProd ? redis.createClient(REDIS_RECOMMEND_NEWS_PORT, REDIS_RECOMMEND_NEWS_HOST, {
  password: REDIS_AUTH,
  retry_strategy: retryStrategy
}) : readClient

const getAsync = promisify(readClient.get).bind(readClient)
const setexAsync = promisify(writeClient.setex).bind(writeClient)
const mgetAsync = promisify(recommendNewsClient.mget).bind(recommendNewsClient)

readClient.on('reconnecting', () => console.warn('[REDIS]Read client reconnecting...'))

writeClient.on('reconnecting', () => console.warn('[REDIS]Write client reconnecting...'))

recommendNewsClient.on('reconnecting', () => console.warn('[REDIS]Recommend news client reconnecting...'))

readClient.on('error', err => console.error('[REDIS]Read client error', err))

writeClient.on('error', err => console.error('[REDIS]Write client error', err))

recommendNewsClient.on('error', err => console.error('[REDIS]Recommend news client error', err))

const promiseTimeout = (promise) => {
  const time = REDIS_CONNECTION_TIMEOUT || 200
  let timeout = new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      clearTimeout(timer)
      reject('Timed out in '+ time + 'ms.')
    }, time)
  })
  return Promise.race([
    promise,
    timeout
  ])
}

const redisFetching = (url, callback) => {
  let start = Date.now()
  let decodedUrl
  let afterGet
  let redisPoolReadError
  try {
    decodedUrl = decodeURIComponent(url)
  } catch (error) {
    console.error('[REDIS]Decoding url in fail while fetching data to Redis. URIError: URI malformed.', url)
    decodedUrl = url
  }
  let beforeGet = Date.now() - start
  
  promiseTimeout(getAsync(decodedUrl))
    .then(data => {
      afterGet = Date.now() - start
      if (data === null) {
        redisPoolReadError = 'Key does not exist.'
      }
      return data
    })
    .catch(error => {
      afterGet = Date.now() - start
      redisPoolReadError = error
    })
    .then(data => {
      let timePeriod = Date.now() - start
      if (afterGet > REDIS_CONNECTION_TIMEOUT) {
        console.warn('[REDIS]Redis operating total:', `${timePeriod}ms`, 'before get: ', `${beforeGet}ms`, 'after get: ', `${afterGet}ms`, decodedUrl)
      }
      callback && callback({ error: redisPoolReadError, data })
    })
}

const redisWriting = (url, data, callback, timeout) => {
  const redisTimeout = timeout || REDIS_TIMEOUT || 5000
  let decodedUrl
  try {
    decodedUrl = decodeURIComponent(url)
  } catch (error) {
    console.error('[REDIS]Decoding url in fail while writing data to Redis. URIError: URI malformed.\n', url)
    decodedUrl = url
  }
  debug('Going to Writing things to redis...')

  promiseTimeout(setexAsync(decodedUrl, redisTimeout, data))
    .then(() => callback && callback())
    .catch(err => console.error(`[REDIS]Set redis in fail. ${decodedUrl} Error: ${err}`))
}

const redisFetchingRecommendNews = (field, callback) => {
  promiseTimeout(mgetAsync([ ...field ]))
    .then(data => callback && callback({ data }))
    .catch(err =>{
      console.error('[REDIS]Fetch recommend news ' + field + ' failed', 'Error: ', err)
      callback && callback({ err })
    })
}

const insertIntoRedis = (req, res, next) => {
  redisWriting(req.url, res.dataString, () => {
    next()
  }, res.redisTTL)
}

const fetchFromRedis = (req, res, next) => {
  debug('Trying to fetching data from redis...', req.url)
  redisFetching(req.hostname + req.url, ({ error, data }) => {
    if (!error) {
      res.redis = data
      next()
    } else {
      console.log('[REDIS]Fetch data from Redis in fail with error.', error)
      next()
    }
  })
}

const fetchFromRedisForAPI = (req, res, next) => {
  debug('Trying to fetching data from redis...', req.url)
  redisFetching(req.url, ({ error, data }) => {
    if (!error && data) {
      res.header('Cache-Control', 'public, max-age=300')
      res.json(JSON.parse(data))
    } else {
      console.warn(`[REDIS]Fetch data from Redis in fail. ${req.url}`, 'Data: ', data, 'Error: ', error)
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
