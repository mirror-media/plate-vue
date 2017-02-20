import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export function getBrief(article, count = 30) {
  let brief = sanitizeHtml( _.get(article, [ 'brief','html' ], ''), { allowedTags: [ ] })
  return truncate(brief, count)
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

export function getImage(article, size) {
  switch(size) {
    case 'desktop':
      return _.get(article, ['heroImage', 'image', 'resizedTargets', 'desktop', 'url'])
    case 'mobile':
      return  _.get(article, ['heroImage', 'image', 'resizedTargets', 'mobile', 'url'])
    case 'tablet':
      return _.get(article, ['heroImage', 'image', 'resizedTargets', 'tablet', 'url'])
    case 'tiny':
      return _.get(article, ['heroImage', 'image', 'resizedTargets', 'tiny', 'url'])
    default:
      return _.get(article, ['heroImage', 'image', 'resizedTargets', 'desktop', 'url'])
  }
}

export function getSection(article) {
  switch( _.get(article, ['style']) ) {
    case 'article':
      return _.get(article, 'sections[0].name') ? _.get(article, 'sections[0].name') : ''
    case 'projects':
      return 'projects'
    default:
      return 'other'
  } 
}

export function getTitle(article, count = 30) {
 return truncate( _.get(article, ['title']), count )
}

export function getValue(o = {}, p = [], d = '') {
 return _.get(o, p, d);
}

export function currentYPosition() {
  // Firefox, Chrome, Opera, Safari
  if (self.pageYOffset) return self.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
      return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

export function elmYPosition(eID) {
    let elm = document.querySelector(eID);
    let y = elm.offsetTop;
    let node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    }
    return y;
}

export function getTruncatedVal(oVal, count) {
  return truncate(oVal, count)
}
