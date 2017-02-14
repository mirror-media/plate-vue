import _ from 'lodash'
import truncate from 'truncate'

export function getValue(o = {}, p = [], d = '') {
 return _.get(o, p, d);
}

export function getTruncatedVal(oVal, count) {
  return truncate(oVal, count)
}

export function getHref(relAritlcle = {}) {
  const { style = '', slug } = relAritlcle
  switch(style) {
    case "projects":
      return `/projects/${slug}`
    default:
      return `/post/${slug}`
  }
}
