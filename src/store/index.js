import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import config from '../../api/config'
import { fetchArticles, fetchArticlesByUuid, fetchArticlesPopList, fetchCommonData, fetchEditorChoice, fetchEvent, fetchLatestArticle, fetchImages, fetchQuestionnaire, fetchSearch, fetchSectionList, fetchTag, fetchTopic } from './api'

Vue.use(Vuex)

const { DFPID, FB_APP_ID, FB_PAGES_ID } = config
const store = new Vuex.Store({
    state: {
        articles: {},
        articlesByUUID: {},
        articlesPopList: {},
        authors: [],
        commonData: {},
        dfpId: DFPID,
        editorChoice: {},
        fbAppId: FB_APP_ID,
        fbPagesId: FB_PAGES_ID,
        latestArticle: {},
        images: {},
        searchResult: {},
        tag: {},
        tags: [],
        topic: {},
        questionnaire: {},
    },

    actions: {
        FETCH_ARTICLES: ({ commit, state }, { params }) => {
            let orig = _.values(state.articles['items'])
            return fetchArticles(params).then(articles => {
                articles['items'] = _.concat(orig, _.get(articles, ['items']))
                commit('SET_ARTICLES', { articles })
                commit('SET_AUTHORS', articles)
                commit('SET_TAGS', articles)
            })
        },
        FETCH_ARTICLES_BY_UUID: ({ commit, state }, { uuid, type, params }) => {
            let orig = _.values(state.articlesByUUID['items'])
            return fetchArticlesByUuid(uuid, type, params).then(articles => {
                articles['items'] = _.concat(orig, _.get(articles, ['items']))
                commit('SET_ARTICLES_BY_UUID', { articles })
                commit('SET_AUTHORS', articles)
                commit('SET_TAGS', articles)
            })
        },
        FETCH_ARTICLES_POP_LIST: ({ commit, state }, { params = {} }) => {
            return fetchArticlesPopList(params).then(articlesPopList => commit('SET_ARTICLES_POP_LIST', { articlesPopList }))
        },

        FETCH_COMMONDATA: ({ commit, state }, { endpoints = [] }) => {
            return state.commonData.event ?
                Promise.resolve(state.commonData) :
                fetchCommonData(endpoints).then(commonData => {
                    commit('SET_COMMONDATA', { commonData })
                    const _latestArticles = _.get(commonData, ['postsVue'])
                    _latestArticles ? commit('SET_AUTHORS', _latestArticles) : null
                    _latestArticles ? commit('SET_TAGS', _latestArticles) : null
                })
        },

        FETCH_EDITORCHOICE: ({ commit, state }, {}) => {
            return state.editorChoice.items ?
                Promise.resolve(state.editorChoice) :
                fetchEditorChoice().then(editorChoice => commit('SET_EDITORCHOICE', { editorChoice }))
        },

        FETCH_IMAGES: ({ commit, state }, { uuid, type, params }) => {
            return fetchImages(uuid, type, params).then(images => {
                commit('SET_IMAGES', { images })
            })
        },

        FETCH_LATESTARTICLE: ({ commit, state }, { params }) => {
            let orig = _.values(state.latestArticle['items'])
            return state.latestArticle.items && params.page < 2 ?
                Promise.resolve(state.latestArticle) :
                fetchLatestArticle(params).then(latestArticle => {
                    latestArticle['items'] = _.concat(orig, _.get(latestArticle, ['items']))
                    commit('SET_LATESTARTICLE', { latestArticle })
                    commit('SET_AUTHORS', latestArticle)
                    commit('SET_TAGS', latestArticle)
                })
        },

        FETCH_QUESTIONNAIRE: ({ commit, state }, { id }) => {
            return state.questionnaire[id] ?
                Promise.resolve(state.questionnaire[id]) :
                fetchQuestionnaire(id).then(questionnaire => commit('SET_QUESTIONNAIRE', { questionnaire }))
        },

        FETCH_SEARCH: ({ commit, state }, { keyword, params }) => {
            let orig = _.values(state.searchResult['items'])
            return state.searchResult.items && (params.page > 1) ?
                    fetchSearch(keyword, params).then(searchResult => {
                        searchResult['items'] = _.concat(orig, _.get(searchResult, ['hits']))
                        commit('SET_SEARCH', { searchResult })
                    }) : fetchSearch(keyword, params).then(searchResult => {
                        searchResult['items'] = _.get(searchResult, ['hits'])
                        commit('SET_SEARCH', { searchResult })
                    })
        },

        FETCH_TAG: ({ commit, state }, { id }) => {
            return state.tag['id'] && (params.page > 1) ?
                    '' : fetchTag(id).then(tag => {
                        commit('SET_TAG', { tag })
                    })
        },

        FETCH_TOPIC_BY_UUID: ({ commit, state }, { params }) => {
            return fetchTopic(params).then(topic => {
                commit('SET_TOPIC_BY_UUID', { topic })
            })
        },

        FETCH_USER: ({ commit, state }, { id }) => {
            return state.users[id] ?
                Promise.resolve(state.users[id]) :
                fetchUser(id).then(user => commit('SET_USER', { user }))
        }
    },

    mutations: {
        SET_ARTICLES: (state, { articles }) => {
            Vue.set(state, 'articles', articles)
        },

        SET_ARTICLES_BY_UUID: (state, { articles }) => {
            Vue.set(state, 'articlesByUUID', articles)
        },

        SET_ARTICLES_POP_LIST: (state, { articlesPopList }) => {
            Vue.set(state, 'articlesPopList', articlesPopList)
        },

        SET_AUTHORS: (state, articles) => {
            let authors = []
            let origAuthors = _.values(state.authors)
            _.map(_.get(articles, ['items']), (article) => {
                const { cameraMan, designers, engineers, photographers, writers } = article
                _.map(_.concat(cameraMan, designers, engineers, photographers, writers), (o) => {
                    if (o) {
                        authors.push(o)
                    }
                })
            })
            authors = _.concat(origAuthors, authors)
            Vue.set(state, 'authors', _.uniqBy(authors, 'id'))
        },
        

        SET_COMMONDATA: (state, { commonData }) => {
            Vue.set(state, 'commonData', commonData)
            _.get(commonData, ['postsVue']) ? Vue.set(state, 'latestArticle', _.get(commonData, ['postsVue'])) : ''
            _.get(commonData, ['choices']) ? Vue.set(state, 'editorChoice', _.get(commonData, ['choices'])) : ''
        },

        SET_EDITORCHOICE: (state, { editorChoice }) => {
            Vue.set(state, 'editorChoice', editorChoice.endpoints.choices)
        },

        SET_IMAGES: (state, { images }) => {
            Vue.set(state, 'images', images)
        },

        SET_LATESTARTICLE: (state, { latestArticle }) => {
            Vue.set(state, 'latestArticle', latestArticle)
        },

        SET_QUESTIONNAIRE: (state, { questionnaire }) => {
            Vue.set(state.questionnaire, questionnaire.id, questionnaire)
        },

        SET_SEARCH: (state, { searchResult }) => {
            Vue.set(state, 'searchResult', searchResult)
        },

        SET_TAG: (state, { tag }) => {
           Vue.set(state, 'tag', tag)
        },

        SET_TAGS: (state, articles) => {
            let _tags = []
            let origTags = _.values(state.tags)
            _.map(_.get(articles, ['items']), (article) => {
                const { tags } = article
                _.map(tags, (o) => {
                    if (o) {
                        _tags.push(o)
                    }
                })
            })
            _tags = _.concat(origTags, _tags)
            Vue.set(state, 'tags', _.uniqBy(_tags, 'id'))
        },

        SET_TOPIC_BY_UUID: (state, { topic }) => {
            Vue.set(state, 'topic', topic)
        },

        SET_USER: (state, { user }) => {
            Vue.set(state.users, user.id, user)
        }
    },

    getters: {

    }
})

export default store