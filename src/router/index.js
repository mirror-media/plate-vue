import { GA_ID } from '../constants/index'
import Vue from 'vue'
import Router from 'vue-router'
import VueLazyload from 'vue-lazyload'

Vue.use(Router)
Vue.use(VueLazyload, {
  lazyComponent: true,
  preLoad: 1.3,
  error: '/public/notImage.png',
  loading: '/public/icon/loading.gif',
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
const Questionnaire = () => import('../views/Questionnaire.vue')
const Search = () => import('../views/Search.vue')
const TimelineView = () => import('../views/TimelineView.vue')
const Topic = () => import('../views/Topic.vue')

export function createRouter () {
  if (process.env.VUE_ENV === 'client') {
    window.ga('create', GA_ID, 'auto')
  }
  return new Router({
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
        component: Article
        // children: [ {
        //   path: 'index.html',
        //   component: Article
        // } ]
      },
      { path: '/app/:slug', component: ArticleM },
      { path: '/headlinenews', component: Headline },
      { path: '/project-list/:style?', component: Project },
      // { path: '/homeb', component: HomeB },
      { path: '/q/:questionnaireId/:resultId?', component: Questionnaire },
      { path: '/search/:keyword', component: Search },
      { path: '/section/:title', component: List, alias: [ '/category/:title', '/externals/:title' ] },
      { path: '/timeline/:title', component: TimelineView },
      { path: '/tag/:tagId', component: List },
      { path: '/topic/:topicId', component: Topic },
      { path: '/404', component: NotFound },
      { path: '/', component: Home },
    ]
  })
}

