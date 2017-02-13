import _ from 'lodash'
import truncate from 'truncate'

export function getValue(o = {}, p = [], d = '') {
 return _.get(o, p, d);
}

export function getTruncatedVal(oVal, count) {
  return truncate(oVal, count)
}

export function getHref(relAritlcle = {}) {
  const { style = '', slug } = _.get(relAritlcle, [], '')
  switch(style) {
    case "projects":
      return `/projects/${slug}`
    case "article":
    default:
      return `/post/${slug}`
  }
}
