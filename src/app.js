import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import ZHTW from './locale/zh-tw.js'
import * as filters from './filters'

Vue.use(VueI18n)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const messages = { zh_tw: ZHTW }
const i18n = new VueI18n({
  locale: 'zh_tw',
  messages
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  })
  const meta = app.$meta()

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store, meta }
}
