import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import config from '../../api/config'
import { fetchArticles, fetchArticlesPopList, fetchCommonData, fetchEditorChoice, fetchEvent, fetchLatestArticle, fetchQuestionnaire, fetchSectionList, fetchTopic } from './api'

Vue.use(Vuex)

const { DFPID, FB_APP_ID, FB_PAGES_ID } = config
const store = new Vuex.Store({
  state: {
    articles: {},
    articlesPopList: {},
    commonData: {},
    dfpId: DFPID,
    editorChoice: {},
    fbAppId: FB_APP_ID,
    fbPagesId: FB_PAGES_ID,
    latestArticle: {},
    questionnaire: {},
  },

  actions: {
    FETCH_ARTICLES: ({ commit, state }, { params }) => {
      return fetchArticles(params).then(articles => commit('SET_ARTICLES', { articles }))
    },
    FETCH_ARTICLES_POP_LIST: ({ commit, state }, { params = {} }) => {
      return fetchArticlesPopList(params).then(articlesPopList => commit('SET_ARTICLES_POP_LIST', { articlesPopList }))
    },
    
    FETCH_COMMONDATA: ({ commit, state }, { endpoints = [] }) => {
      return state.commonData.event
        ? Promise.resolve(state.commonData)
        : fetchCommonData(endpoints).then(commonData => commit('SET_COMMONDATA', { commonData }))
    },

    FETCH_EDITORCHOICE: ({ commit, state }, { }) => {
      return state.editorChoice.items
        ? Promise.resolve(state.editorChoice)
        : fetchEditorChoice().then(editorChoice => commit('SET_EDITORCHOICE', { editorChoice }))
    },

    FETCH_LATESTARTICLE: ({ commit, state }, { params }) => {
      let orig = _.values(state.latestArticle['items'])
      return state.latestArticle.items && params.page < 2
        ? Promise.resolve(state.latestArticle)
        : fetchLatestArticle(params).then(latestArticle => {
            latestArticle['items'] = _.concat(orig, _.get(latestArticle, ['items']))
            commit('SET_LATESTARTICLE', { latestArticle })
          })
    },

    FETCH_QUESTIONNAIRE: ({ commit, state }, { id }) => {
      return state.questionnaire[ id ]
        ? Promise.resolve(state.questionnaire[ id ])
        : fetchQuestionnaire(id).then(questionnaire => commit('SET_QUESTIONNAIRE', { questionnaire }))
    },

    FETCH_USER: ({ commit, state }, { id }) => {
      return state.users[id]
        ? Promise.resolve(state.users[id])
        : fetchUser(id).then(user => commit('SET_USER', { user }))
    }
  },

  mutations: {
    SET_ARTICLES: (state, { articles }) => {
      Vue.set(state, 'articles', articles)
    },

    SET_ARTICLES_POP_LIST: (state, { articlesPopList }) => {
      Vue.set(state, 'articlesPopList', articlesPopList)
    },

    SET_COMMONDATA: (state, { commonData }) => {
      Vue.set(state, 'commonData', commonData)
      _.get(commonData, ['postsVue']) ? Vue.set(state, 'latestArticle', _.get(commonData, ['postsVue'])) : ''
      _.get(commonData, ['choices']) ? Vue.set(state, 'editorChoice', _.get(commonData, ['choices'])) : ''
    },

    SET_EDITORCHOICE: (state, { editorChoice }) => {
      Vue.set(state, 'editorChoice', editorChoice.endpoints.choices)
    },

    SET_LATESTARTICLE: (state, { latestArticle }) => {
      Vue.set(state, 'latestArticle', latestArticle)
    },

    SET_QUESTIONNAIRE: (state, { questionnaire }) => {
      Vue.set(state.questionnaire, questionnaire.id, questionnaire)
    },

    SET_USER: (state, { user }) => {
      Vue.set(state.users, user.id, user)
    }
  },

  getters: {
    
  }
})

export default store
