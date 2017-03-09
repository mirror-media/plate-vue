import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

import Article from '../views/Article.vue'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import Questionnaire from '../views/Questionnaire.vue'
import TimelineView from '../views/TimelineView.vue'

export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        { path: '/author/:authorId/:authorName?', component: List },
        { path: '/category/:title', component: List },
        { path: '/story/:slug', component: Article },
        { path: '/q/:questionnaireId/:resultId?', component: Questionnaire },
        { path: '/search/:keyword', component: List },
        { path: '/section/:title', component: List },
        { path: '/timeline/:title', component: TimelineView },
        { path: '/tag/:tagId/:tagName?', component: List },
        { path: '/topic/:topicId', component: List },
        { path: '/', component: Home }
    ]
})