import { GA_ID } from '../constants/index'
import Vue from 'vue'
import Router from 'vue-router'
import VueLazyload from 'vue-lazyload'

Vue.use(Router)
Vue.use(VueLazyload)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})

import NotFound from '../views/404.vue'
// import Activity from '../views/Activity.vue'
import ActivityB from '../views/ActivityB.vue'
import Article from '../views/Article.vue'
import Home from '../views/Home.vue'
import HomeB from '../views/HomeB.vue'
import List from '../views/List.vue'
import Project from '../views/Project.vue'
import Questionnaire from '../views/Questionnaire.vue'
import Search from '../views/Search.vue'
import TimelineView from '../views/TimelineView.vue'
import Topic from '../views/Topic.vue'

export function createRouter () {
  if (process.env.VUE_ENV === 'client') {
    window.ga('create', GA_ID, 'auto')
  }
  return new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/activity/:activityId/', component: ActivityB },
      { path: '/activity/:activityId/:topicId', component: ActivityB },
      { path: '/author/:authorId/', component: List },
      { path: '/category/:title', component: List },
      {
        path: '/story/:slug',
        component: Article
        // children: [ {
        //   path: 'index.html',
        //   component: Article
        // } ]
      },
      { path: '/project-list', component: Project },
      { path: '/homeb', component: HomeB },
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
}
// const router = new Router({
//   mode: 'history',
//   scrollBehavior: () => ({ y: 0 }),
//   routes: [
//     { path: '/activity/:activityId/', component: Activity },
//     { path: '/author/:authorId/', component: List },
//     { path: '/category/:title', component: List },
//     {
//       path: '/story/:slug',
//       component: Article
//       // children: [ {
//       //   path: 'index.html',
//       //   component: Article
//       // } ]
//     },
//     { path: '/project-list', component: Project },
//     { path: '/homeb', component: HomeB },
//     { path: '/q/:questionnaireId/:resultId?', component: Questionnaire },
//     { path: '/search/:keyword', component: Search },
//     { path: '/section/:title', component: List },
//     { path: '/timeline/:title', component: TimelineView },
//     { path: '/tag/:tagId', component: List },
//     { path: '/topic/:topicId', component: Topic },
//     { path: '/404', component: NotFound },
//     { path: '/', component: Home },
//     { path: '*', redirect: '/404' }
//   ]
// })

// if (process.env.VUE_ENV === 'client') {
//   window.ga('create', GA_ID, 'auto')
// }

// export default router
