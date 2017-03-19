// this is aliased in webpack config based on server/client build
import { CATEGORY, SECTION, TAG, TOPIC } from '../constants/index'
import { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST, QUESTIONNAIRE_HOST, QUESTIONNAIRE_PROTOCOL } from '../../api/config'
import { camelizeKeys } from 'humps'
import { getHost } from '../utils/comm'
import _ from 'lodash'
import config from '../../api/config'
import qs from 'qs'

const superagent = require('superagent')
const _host = getHost()

function _buildQuery(params = {}) {
    let query = {}
    let whitelist = ['where', 'embedded', 'max_results', 'page', 'sort', 'related']
    whitelist.forEach((ele) => {
        if (params.hasOwnProperty(ele)) {
            if (ele === 'where' || ele === 'embedded') {
                query[ele] = JSON.stringify(params[ele])
            } else {
                query[ele] = params[ele]
            }
        }
    })
    query = qs.stringify(query)
    return query
}

function _doFetch(url) {
    return new Promise((resolve, reject) => {
        superagent
            .get(url)
            // .query('')
            .end(function(err, res) {
                if (err) {
                    console.log(url);
                    console.log(err);
                    reject(err)
                } else {
                    resolve(camelizeKeys(res.body))
                }
            })
    })
}

function _setupWhereInParam(key, value, params = {}) {
    params = params || {}
    value = Array.isArray(value) ? value : [value]
    let where = {}
    if (value.length > 0) {
        _.merge(where, params.where, {
            [key]: {
                '$in': value
            }
        })
    }
    params.where = where
    return params
}

function loadArticles(params = {}) {
    const query = _buildQuery(params)
    let url = `${_host}/api/posts`
        // let slug = typeof params[0] === 'string' ? params[0] : null
        // url = slug ? `${url}/${slug}` : url
    url = `${url}?${query}`
    return _doFetch(url)
}

function loadArticlesPopList(params = {}) {
    const { SERVER_PROTOCOL, SERVER_HOST } = config
    let url = `${_host}/api/poplist`
    return _doFetch(url)
}

function loadArticlesByUuid(uuid = '', type = '', params = {}, isOnlyMeta = true) {
    switch (type) {
        case SECTION:
            params = _setupWhereInParam('sections', [uuid], params)
            break
        case CATEGORY:
            params = _setupWhereInParam('categories', [uuid], params)
            break
        case TAG:
            params = _setupWhereInParam('tags', [uuid], params)
            break
        case TOPIC:
            params = _setupWhereInParam('topics', [uuid], params)
            break
        default:
            return Promise.resolve()
    }
    params.sort = params.sort || '-publishedDate'
    let query = _buildQuery(params)
    let url = `${_host}/api/meta`
    url = `${url}?${query}`
    return _doFetch(url)
}

function loadAudios(params = {}) {
    let query = _buildQuery(params)
    let url = `${_host}/api/audios`
    url = `${url}?${query}`
    return _doFetch(url)
}

function loadCommonData(endpoints = []) {
    let mapped = _.map(endpoints, (n) => { return 'endpoint=' + n })
    let combo_params = mapped.join('&')
    const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } = config
    let url = `${_host}/api/combo?endpoint=sections&endpoint=topics&`
    url = url + combo_params
    return _doFetch(url)
}

function loadDataByCombo(endpoints = []) {
    let mapped = _.map(endpoints, (n) => { return 'endpoint=' + n })
    let combo_params = mapped.join('&')
    const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } = config
    let url = `${_host}/api/combo?`
    url = url + combo_params
    return _doFetch(url)
}

function loadEditorChoice() {
    const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } = config
    let url = `${_host}/api/combo?endpoint=choices`
    return _doFetch(url)
}

function loadEvent(params = {}) {
    let query = _buildQuery(params)
    let url = `${_host}/api/event`
    url = `${url}?${query}`
    return _doFetch(url)
}

function loadImages(uuid = '', type = '', params = {}) {
    switch (type) {
        case SECTION:
            params = _setupWhereInParam('sections', [uuid], params)
            break
        case CATEGORY:
            params = _setupWhereInParam('categories', [uuid], params)
            break
        case TAG:
            params = _setupWhereInParam('tags', [uuid], params)
            break
        case TOPIC:
            params = _setupWhereInParam('topics', [uuid], params)
            break
        default:
            return Promise.resolve()
    }

    const query = _buildQuery(params)
    let url = `${_host}/api/images`
    url = `${url}?${query}`
    return _doFetch(url)
}

function loadLatestArticle(params = {}) {
    let query = _buildQuery(params)
    let url = `${_host}/api/meta`
    url = `${url}?${query}`
    return _doFetch(url)
}

function loadQuestionnaire(id) {
    let apiHost = `${_host}/api/questionnaire?file=${id}/${id}.json`
    return _doFetch(apiHost)
}

function loadSearch(keyword = '', params = {}) {
    let query = params.query
    let url = `${_host}/api/search`
    url = `${url}?query=${encodeURIComponent(keyword)}&hitsPerPage=${params.max_results}&page=${params.page - 1}`
    return _doFetch(url)
}

function loadSectionList() {
    const { LOCAL_PROTOCOL, LOCAL_PORT, LOCAL_HOST } = config
    let url = `${_host}/api/combo?endpoint=sections`
    return _doFetch(url)
}

function loadTag(slug = '') {
    let url = `${_host}/api/tags/${slug}`
    return _doFetch(url)
}

function loadTopic(params = {}) {
    const query = _buildQuery(params)
    let url = `${_host}/api/topics`
    url = `${url}?${query}`
    return _doFetch(url)
}

function loadYoutubePlaylist(limit = 12, pageToken = '') {
    let url = `${_host}/api/playlist?maxResults=${limit}&pageToken=${pageToken}`
    return _doFetch(url)
}

export function fetchArticles(params = {}) {
    return loadArticles(params)
}

export function fetchArticlesByUuid(uuid = '', type = '', params = {}, isOnlyMeta = true) {
    return loadArticlesByUuid(uuid, type, params, isOnlyMeta)
}

export function fetchArticlesPopList(params = {}) {
    return loadArticlesPopList(params)
}

export function fetchAudios(params = {}) {
    return loadAudios(params)
}

export function fetchCommonData(endpoints = []) {
    return Promise.all([loadCommonData(endpoints)])
        .then((data) => {
            let commonData = {}
            _.map(Object.keys(_.get(data[0], ['endpoints'])), (e) => {
                commonData[e] = _.get(data[0], ['endpoints', e])
                if (e == 'sections') {
                    _.forEach(_.get(data[0], ['endpoints', e, 'items']), (s) => {
                        _.forEach(s.categories, (c) => {
                            _.set(commonData, ['categories', c.name], c)
                        })
                    })
                }
            })
            return commonData
        })
}

export function fetchDataByCombo(endpoints = []) {
    return Promise.all([loadDataByCombo(endpoints)])
        .then((data) => {
            let _data = {}
            _.map(Object.keys(_.get(data[0], ['endpoints'])), (e) => {
                _data[e] = _.get(data[0], ['endpoints', e])
                if (e == 'sections') {
                    _.forEach(_.get(data[0], ['endpoints', e, 'items']), (s) => {
                        _.forEach(s.categories, (c) => {
                            _.set(_data, ['categories', c.name], c)
                        })
                    })
                }
            })
            return _data
        })
}

export function fetchEditorChoice() {
    return loadEditorChoice()
}

export function fetchEvent(params = {}) {
    return loadEvent(params)
}

export function fetchImages(uuid = '', type = '', params = {}) {
    return loadImages(uuid, type, params)
}

export function fetchLatestArticle(params = {}) {
    return loadLatestArticle(params)
}

export function fetchQuestionnaire(id) {
    return loadQuestionnaire(id)
}

export function fetchSearch(keyword = '', params = {}) {
    return loadSearch(keyword, params)
}

export function fetchSectionList() {
    return loadSectionList()
}

export function fetchTag(slug = '') {
    return loadTag(slug)
}

export function fetchTopic(params = {}) {
    return loadTopic(params)
}

export function fetchYoutubePlaylist(limit = {}, pageToken = '') {
    return loadYoutubePlaylist(limit, pageToken)
}