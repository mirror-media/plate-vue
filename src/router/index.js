import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

import Article from '../views/Article.vue'
import Category from '../views/Category.vue'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import Questionnaire from '../views/Questionnaire.vue'
import Section from '../views/Section.vue'
import TimelineView from '../views/TimelineView.vue'


export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/category/:title', component: List },
    { path: '/post/:slug', component: Article },
    { path: '/q/:questionnaireId', component: Questionnaire },
    { path: '/search/:keyword', component: List },
    { path: '/section/:title', component: List },
    { path: '/timeline/:title', component: TimelineView },
    { path: '/topic/:topicId', component: List },
    { path: '/', component: Home }
  ]
})
