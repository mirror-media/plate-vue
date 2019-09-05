import qs from 'qs'
import superagent from 'superagent'
import { camelizeKeys } from 'humps'
import { getHost } from '../../src/util/comm'

const HOST = getHost()
const WHITELIST = [ 'clean', 'where' ]

const getQuery = (property, params) => {
  const queryStrategies = {
    where: JSON.stringify(params[property]),
    default: params[property]
  }
  return queryStrategies[property] || queryStrategies.default
}

const buildQuery = (params = {}) => {
  let query = {}
  WHITELIST
    .filter(value => params.hasOwnProperty(value))
    .forEach(value => {
      query[value] = getQuery(value, params)
    })
  return qs.stringify(query)
}

const get = (url) => {
  return superagent
    .get(url)
    .then(res => camelizeKeys(res.body))
    .catch(err => Promise.reject(err))
}

export function fetchPosts (params = {}) {
  const query = buildQuery(params)
  const url = `${HOST}/api/getposts?${query}`
  return get(url)
}