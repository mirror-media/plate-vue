import { GA_ID, GA_TEST_ID, OATH_PLAYLIST } from '../constants/index'
import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import VueLazyload from 'vue-lazyload'
import { mmLog } from '../util/comm.js'
import { logClient } from '../store/api'

Vue.use(Router)
Vue.use(Meta)
Vue.use(VueLazyload, {
  lazyComponent: true,
  preLoad: 1.3,
  error: '/assets/mirrormedia/notImage.png',
  loading: '/assets/mirrormedia/icon/loading.gif',
  attempt: 1
})

const Activity = () => import('../views/Activity.vue')
const Article = () => import('../views/Article.vue')
const ArticleM = () => import('../views/ArticleM.vue')
const External = () => import('../views/External.vue')
const Headline = () => import('../views/Headline.vue')
const Home = () => import('../views/Home.vue')
const List = () => import('../views/List.vue')
const NotFound = () => import('../views/404.vue')
const Project = () => import('../views/Project.vue')
const Search = () => import('../views/Search.vue')
const Topic = () => import('../views/Topic.vue')
const Video = () => import('../views/Video.vue')
const Watch = () => import('../views/Watch.vue')

const oathCategories = Object.values(OATH_PLAYLIST).map(item => `/category/${item.categoryName}`)

export function createRouter () {
  if (process.env.VUE_ENV === 'client') {
    const gaId = location.hostname.match(/(www|m).mirrormedia.mg/) ? GA_ID : GA_TEST_ID
    window.ga && !window.gaData && window.ga('create', gaId, 'auto')
  }
  const router = new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/activity/:activityId/', component: Activity },
      { path: '/activity/:activityId/:topicId', component: Activity },
      { path: '/author/:authorId/', component: List },
      // { path: '/category/:title', component: List },
      { path: '/external/:name', component: External },
      // { path: '/externals/:name', component: List },
      {
        path: '/story/:slug',
        component: Article,
        children: [{
          path: 'index.html',
          component: Article
        }]
      },
      { path: '/app/:slug', component: ArticleM },
      { path: '/headlinenews', component: Headline }, // 禾多推播用頁面
      { path: '/project-list/:style?', component: Project },
      // { path: '/homeb', component: HomeB },
      { name: 'search', path: '/search/:keyword', component: Search },
      { path: '/section/videohub', component: Video, alias: [...oathCategories, '/video/:slug'] },
      { path: '/section/:title', component: List, alias: ['/category/:title', '/externals/:title'] },
      { path: '/tag/:tagId', component: List },
      { path: '/topic/:topicId', component: Topic },
      { path: '/watch/:name', component: Watch },
      { path: '/404', component: NotFound },
      { path: '/', component: Home }
    ]
  })

  router.beforeEach((to, from, next) => {
    const payload = {
      category: 'whole-site',
      description: '',
      eventType: 'pageview'
    }
    if (to.name === 'search') {
      payload.keyword = createSearchKeywordValue()
    }
    mmLog(payload).then(log => {
      return logClient({
        clientInfo: log
      })
    }).catch(err => {
      console.log(err)
    })
    next()

    function createSearchKeywordValue () {
      const keyword = to.params.keyword
      return keyword.split(',')
    }
  })

  return router
}
