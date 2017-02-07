import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

import Article from '../views/Article.vue'
import Home from '../views/Home.vue'
import Questionnaire from '../views/Questionnaire.vue'
import Section from '../views/Section.vue'
import TimelineView from '../views/TimelineView.vue'


export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/timeline/:title', component: TimelineView },
    { path: '/q/:questionnaireId', component: Questionnaire },
    { path: '/section/:title', component: Section },
    { path: '/post/:slug', component: Article },
    { path: '/', component: Home }
  ]
})
