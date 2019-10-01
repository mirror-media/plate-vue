const isProd = process.env.NODE_ENV === 'production'

const Redis = require("ioredis")

const { 
  REDIS_AUTH,
  REDIS_READ_HOST,
  REDIS_READ_PORT,
  REDIS_WRITE_HOST,
  REDIS_WRITE_PORT,
  REDIS_RECOMMEND_AUTH,
  REDIS_RECOMMEND_NEWS_HOST,
  REDIS_RECOMMEND_NEWS_PORT,
  REDIS_CONNECTION_TIMEOUT,
  REDIS_TIMEOUT
} = require('../config')

const retryStrategy = (times) => {
  if (times > 200 * 3) {
    // End reconnecting after a specific timeout and flush all commands
    // with a individual error
    return new Error('Retry time exhausted')
  }
  return 100
}

const readClient = new Redis({
  port: REDIS_READ_PORT,
  host: REDIS_READ_HOST,
  password: REDIS_AUTH,
  retryStrategy
})

const writeClient = new Redis({
  port: REDIS_WRITE_PORT,
  host: REDIS_WRITE_HOST,
  password: REDIS_AUTH,
  retryStrategy
})

const recommendNewsClient = isProd ? new Redis({
  port: REDIS_RECOMMEND_NEWS_PORT,
  host: REDIS_RECOMMEND_NEWS_HOST,
  password: REDIS_RECOMMEND_AUTH || REDIS_AUTH,
  retryStrategy
}) : readClient

readClient.on('reconnecting', () => console.warn('[IOREDIS]Read client reconnecting...'))

writeClient.on('reconnecting', () => console.warn('[IOREDIS]Write client reconnecting...'))

recommendNewsClient.on('reconnecting', () => console.warn('[IOREDIS]Recommend news client reconnecting...'))

readClient.on('error', err => console.error('[IOREDIS]Read client error', err))

writeClient.on('error', err => console.error('[IOREDIS]Write client error', err))

recommendNewsClient.on('error', err => console.error('[IOREDIS]Recommend news client error', err))

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
  console.log('[IOREDIS]redisFetching url', url)
  let start = Date.now()
  let decodedUrl
  let afterGet
  let redisPoolReadError
  try {
    decodedUrl = decodeURIComponent(url)
  } catch (error) {
    console.error('[IOREDIS]Decoding url in fail while fetching data to Redis. URIError: URI malformed.', url)
    decodedUrl = url
  }
  let beforeGet = Date.now() - start
  
  promiseTimeout(readClient.get(decodedUrl))
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
        console.warn('[IOREDIS]Redis operating total:', `${timePeriod}ms`, 'before get: ', `${beforeGet}ms`, 'after get: ', `${afterGet}ms`, decodedUrl)
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
    console.error('[IOREDIS]Decoding url in fail while writing data to Redis. URIError: URI malformed.\n', url)
    decodedUrl = url
  }

  promiseTimeout(writeClient.set(decodedUrl, data, 'EX', redisTimeout))
    .then(() => callback && callback())
    .catch(err => console.error(`[IOREDIS]Set redis in fail. ${decodedUrl} Error:`, err))
}

const redisFetchingRecommendNews = (field, callback) => {
  promiseTimeout(recommendNewsClient.mget([ ...field ]))
    .then(data => callback && callback({ data }))
    .catch(err =>{
      console.error('[IOREDIS]Fetch recommend news ' + field + ' failed', 'Error: ', err)
      callback && callback({ err })
    })
}

const insertIntoRedis = (req, res) => {
  redisWriting(req.url, res.dataString, null, res.redisTTL)
}

const fetchFromRedis = (req, res, next) => {
  redisFetching(req.hostname + req.url, ({ error, data }) => {
    if (!error) {
      res.redis = data
      next()
    } else {
      console.log('[IOREDIS]Fetch data from Redis in fail with error.', error)
      next()
    }
  })
}

const fetchFromRedisForAPI = (req, res, next) => {
  redisFetching(req.url, ({ error, data }) => {
    if (!error && data) {
      res.header('Cache-Control', 'public, max-age=300')
      res.json(JSON.parse(data))
    } else {
      console.warn(`[IOREDIS]Fetch data from Redis in fail. ${req.url}`, 'Data: ', data, 'Error: ', error)
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
