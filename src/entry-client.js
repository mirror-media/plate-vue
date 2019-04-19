import ProgressBar from './components/ProgressBar.vue'
import Vue from 'vue'
import 'es6-promise/auto'
import { SITE_MOBILE_URL } from './constants'
import { UserAgent } from 'express-useragent'
import { createApp } from './app'
const debug = require('debug')('ENTRY-CLIENT')

const exp_dev = /dev|localhost/
const exp_moblie_site = new RegExp('m.mirrormedia.mg')
const useragent = new UserAgent().parse(navigator.userAgent)
debug('STAGE:', exp_dev.test(location.host) ? 'DEV' : 'PROD')
debug('CURR PATH:', location.host, location.pathname, location.search)
debug('useragent.isMobile', useragent.isMobile)
debug('useragent.isTablet', useragent.isTablet)

if (!exp_dev.test(location.host)) {
  debug('CURR DEVICE:', useragent.platform, useragent.browser)
  if (SITE_MOBILE_URL) {
    if (!location.host.match(exp_moblie_site) && (useragent.isMobile || useragent.isTablet)) {
      /** Redirect to Mobile version */
      debug('GOING TO', `${SITE_MOBILE_URL}${location.pathname}${location.search}`)
      location.replace(`${SITE_MOBILE_URL}${location.pathname}${location.search}`)
    } else {
      debug('WELL, DO NOTHING!')
    }
  }
}

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

const { app, router, store } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    bar.start()
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
    .then(() => {
      bar.finish()
      next()
    })
    .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})

// service worker
const debugSW = require('debug')('CLIENT:SERVICE-WORKER')
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
  .then(() => {
    debugSW('REGISTERING SW SUCCESSFULLY.')
  })
  .catch(() => {
    debugSW('REGISTERING SW IN FAIL.')
  })
  navigator.serviceWorker.addEventListener('message', event => debugSW('Got Msg from dervice-worker!' + event.data))
}
