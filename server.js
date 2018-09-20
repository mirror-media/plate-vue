const _ = require('lodash')
const Cookies = require( "cookies" )
const LRU = require('lru-cache')
const compression = require('compression')
const express = require('express')
const favicon = require('serve-favicon')
const fs = require('fs')
const maxMemUsageLimit = 1000 * 1024 * 1024
const memwatch = require('memwatch-next')
const moment = require('moment')
const microcache = require('route-cache')
const path = require('path')
const requestIp = require('request-ip')
const resolve = file => path.resolve(__dirname, file)
const uuidv4 = require('uuid/v4')
const { VALID_PREVIEW_IP_ADD } = require('./api/config')
const { createBundleRenderer } = require('vue-server-renderer')
const { fetchFromRedis, redisWriting } = require('./api/middle/redisHandler') 


const formatMem = (bytes) => {
  return (bytes / 1024 / 1024).toFixed(2) + ' Mb'
}

const isProd = process.env.NODE_ENV === 'production'
// const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()
const debug = require('debug')('PLATEVUE:server')
const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8')

function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    template,
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }))
}

app.use(requestIp.mw())
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

let renderer
let readyPromise
if (isProd) {
  // In production: create server renderer using built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
app.use(favicon('./public/favicon-48x48.png'))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))

 // since this app has no user-specific content, every page is micro-cacheable.
  // if your app involves user-specific content, you need to implement custom
  // logic to determine whether a request is cacheable based on its url and
  // headers.
  // 1-second microcache.
  // https://www.nginx.com/blog/benefits-of-microcaching-nginx/
  // app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))
 

function render (req, res, next) {
  const rendererEjsCB = function (err, html) { 
    if (!err) {
      res.status(rendererEjsCB.code).send(html)
      isProd && redisWriting(req.url, rendererEjsCB.code || 500, null, 300)
    } else {
      console.error('ERROR OCCURRED WHEN RENDERING EJS. \n', err)
      res.status(500).send('Internal Server Error')
    }
  }

  const s = Date.now()
  let isPageNotFound = false
  let isErrorOccurred = false  

  const isPreview = req.url.indexOf('preview=true') > -1
  if (!isPreview) {
    res.setHeader('Cache-Control', 'public, max-age=3600')
  } else {
    console.info('Is there any preview permission limit?', _.get(VALID_PREVIEW_IP_ADD, 'length', 0) > 0)
    const isValidReq = _.filter(VALID_PREVIEW_IP_ADD, (i) => (req.clientIp.indexOf(i) > -1)).length > 0
    res.header("Cache-Control", "no-cache, no-store, must-revalidate")
    res.header("Pragma", "no-cache")
    res.header("Expires", "0")
    if (!isValidReq) {
      res.status(403).send('Forbidden')
      console.info('Attempted to access draft in fail: 403 Forbidden')
      return
    }
  }
  console.info('request ip:', req.clientIp)
  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const cookies = new Cookies( req, res, {} )
  const mmid = cookies.get('mmid')
  if (!mmid) {
    cookies.set('mmid', uuidv4(), { httpOnly: false, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) })
  }
  
  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err && err.code == 404) {
      isPageNotFound = true
      rendererEjsCB.code = 404
      res.render('404', rendererEjsCB)

      console.error(`##########REQUEST URL(404)############\n`,
        `ERROR OCCURRED WHEN RUNNING renderToString()\n`,
        `REQUEST URL: ${req.url}\n`,
        `REQUEST IP: ${req.clientIp}\n`,
        `REFERER: ${req.headers.referer}\n`,
        `${err}\n`, '######################')

      return
    } else {
      console.error(`ERROR OCCURRED WHEN RUNNING renderToString()\n`,
        `REQUEST URL: ${req.url}\n`,
        `REQUEST IP: ${req.clientIp}\n`,
        `REFERER: ${req.headers.referer}\n`,
        `${err}`)

      isErrorOccurred = true
      err.status = err.status || 500

      if ('403' == err.status) {
        res.status(403).send('403 | Forbidden')
        return
      } else if ('404' == err.status) {
        rendererEjsCB.code = 404
        res.render('404', rendererEjsCB)
        return
      } else {
        rendererEjsCB.code = 500
        res.render('500', { err, timestamp: (new Date).toString() }, rendererEjsCB)
        return
      }
    } 
  }

  const context = {
    title: '',
    meta: '',    
    url: req.url,
    link: '',
    adTrace: '',
  }

  res.on('finish', function () {
    const mem = process.memoryUsage()
    console.error('MEMORY STAT(heapUsed):', formatMem(mem.heapUsed), `${moment().format('YYYY-MM-DD HH:mm:SS')}`)
    if (mem.heapUsed > maxMemUsageLimit) {
      for (let i = 0; i < 10; i += 1) {
        console.error('MEMORY WAS WUNNING OUT')
      } 
      console.error(`KILLING PROCESS IN 1 SECOND(At ${moment().format('YYYY-MM-DD HH:mm:SS')})`)
      process.exit(1)
    }
    if (isPageNotFound || isErrorOccurred) {
      try {
        global.gc()
      } catch (e) {
        // process.exit(1)
      }
    }
  })

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
    !isProd && console.info(`whole request: ${Date.now() - s}ms`)

    isProd && redisWriting(req.url, html, null, 300)
  })
}
app.use('/story/amp', require('./api/middle/story/index.amp'))

app.use('/api/', require('./api/index'))
app.use('/', (req, res, next) => {
  req.s = Date.now()
  next()
}, fetchFromRedis, (req, res, next) => {
  if (res.redis) {
    console.log('Fetch page from Redis.', `${Date.now() - req.s}ms\n`, decodeURIComponent(req.url))
    if (res.redis.length > 3) {
      res.status(200).send(res.redis)
    } else {
      res.status(res.redis).render(res.redis)
    }
  } else {
    debug('Didnt see any html data.', req.url)
    next()
  }
})
app.get('*', isProd ? render : (req, res, next) => {
  readyPromise.then(() => render(req, res, next))
})

const port = process.env.PORT || 8080
const server = app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}

memwatch.on('leak', function(info) {
  const growth = formatMem(info.growth)
  const mem = process.memoryUsage()
  console.error('GETING MEMORY LEAK:', [ 'growth ' + growth, 'reason ' + info.reason ].join(', '))
  console.error('MEMORY STAT(heapUsed):', formatMem(mem.heapUsed), `${moment().format('YYYY-MM-DD HH:mm:SS')}`)
})
memwatch.on('stats', function(stats) {
  const estBase = formatMem(stats.estimated_base)
  const currBase = formatMem(stats.current_base)
  const min = formatMem(stats.min)
  const max = formatMem(stats.max)

  console.info(`=======================================\n`,
    `GC STATs(${moment().format('YYYY-MM-DD HH:mm:SS')}):\n`, [
    'num_full_gc ' + stats.num_full_gc,
    'num_inc_gc ' + stats.num_inc_gc,
    'heap_compactions ' + stats.heap_compactions,
    'usage_trend ' + stats.usage_trend,
    'estimated_base ' + estBase,
    'current_base ' + currBase,
    'min ' + min,
    'max ' + max
  ].join(', '), `\n=======================================`)

  if (stats.current_base > maxMemUsageLimit) {
    for (let i = 0; i < 10; i += 1) {
      console.error('MEMORY WAS WUNNING OUT')
    } 
    /**
     * kill this process gracefully
     */
    const killTimer = setTimeout(() => {
      process.exit(1)
    }, 1000)
    killTimer.unref()
    server.close()
    console.error(`GOING TO KILL PROCESS IN 1 SECOND(At ${moment().format('YYYY-MM-DD HH:mm:SS')})`)
  }
})