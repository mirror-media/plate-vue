import { GA_ID } from '../constants/index'
import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

import NotFound from '../views/404.vue'
import Article from '../views/Article.vue'
import Home from '../views/Home.vue'
// import HomeB from '../views/HomeB.vue'
import List from '../views/List.vue'
import Questionnaire from '../views/Questionnaire.vue'
import Search from '../views/Search.vue'
import TimelineView from '../views/TimelineView.vue'
import Topic from '../views/Topic.vue'

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/author/:authorId/', component: List },
    { path: '/category/:title', component: List },
    {
      path: '/story/:slug',
      component: Article,
      children: [ {
        path: 'index.html',
        component: Article
      } ]
    },
    // { path: '/homeb', component: HomeB },
    { path: '/q/:questionnaireId/:resultId?', component: Questionnaire },
    { path: '/search/:keyword', component: Search },
    { path: '/section/:title', component: List },
    { path: '/timeline/:title', component: TimelineView },
    { path: '/tag/:tagId', component: List },
    { path: '/topic/:topicId', component: Topic },
    { path: '/404', component: NotFound },
    { path: '/', component: Home },
    { path: '*', redirect: '/404' }
  ]
})

if (process.env.VUE_ENV === 'client') {
  window.ga('create', GA_ID, 'auto')
}

router.afterEach(route => {
  if (process.env.VUE_ENV === 'client') {
    setTimeout(() => window.ga('send', 'pageview', route.path), 500)
  }
})

export default router
