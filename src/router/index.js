import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

import { createListView } from '../views/CreateListView'
import Article from '../views/Article.vue'
import Home from '../views/Home.vue'
import Questionnaire from '../views/Questionnaire.vue'
import Section from '../views/Section.vue'
import TimelineView from '../views/TimelineView.vue'

import ItemView from '../views/ItemView.vue'
import UserView from '../views/UserView.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/top/:page(\\d+)?', component: createListView('top') },
    { path: '/new/:page(\\d+)?', component: createListView('new') },
    { path: '/show/:page(\\d+)?', component: createListView('show') },
    { path: '/ask/:page(\\d+)?', component: createListView('ask') },
    { path: '/job/:page(\\d+)?', component: createListView('job') },
    { path: '/item/:id(\\d+)', component: ItemView },
    { path: '/user/:id', component: UserView },
    { path: '/timeline/:title', component: TimelineView },
    { path: '/q/:questionnaireId', component: Questionnaire },
    { path: '/section/:title', component: Section },
    { path: '/post/:slug', component: Article },
    { path: '/', component: Home }
  ]
})
