import { SITE_DOMAIN, SITE_URL } from '../constants'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export function getAuthor (article, option = '', delimiter = '｜') {
  const writers = (_.get(article, [ 'writers', 'length' ], 0) > 0)
    ? `文${delimiter}` + _.map(article.writers, (n) => { return '<a href="' + getAuthorHref(n) + '" id="author-' + n.id + '">' + _.get(n, [ 'name' ], null) + '</a>' }).join('、') : ''
  const photographers = (_.get(article, [ 'photographers', 'length' ], 0) > 0)
    ? `<br>攝影${delimiter}` + _.map(article.photographers, (n) => { return _.get(n, [ 'name' ], null) }).join('、') : ''
  const designers = (_.get(article, [ 'designers', 'length' ], 0) > 0)
    ? `<br>設計${delimiter}` + _.map(article.designers, (n) => { return _.get(n, [ 'name' ], null) }).join('、') : ''
  const engineers = (_.get(article, [ 'engineers', 'length' ], 0) > 0)
    ? `<br>工程${delimiter}` + _.map(article.engineers, (n) => { return _.get(n, [ 'name' ], null) }).join('、') : ''
  const external = '<br>' + _.get(article, 'extendByline', '')
  switch (option) {
    case 'writers':
      return writers
    default:
      return (writers + photographers + designers + engineers + external)
  }
}

export function getAuthorHref (author = {}) {
  return '/author/' + author.id
}

export function getBrief (article, count = 30, allowed_tags = '') {
  let brief
  if (_.split(_.get(article, [ 'href' ]), '/')[1] === 'topic') {
    brief = _.get(article, [ 'ogDescription' ])
  } else {
    brief = sanitizeHtml(_.get(article, [ 'brief', 'html' ], ''), { allowedTags: [ allowed_tags ] })
  }
  return truncate(brief, count)
}

export function getHref (relAritlcle = {}) {
  const { href, style = '', slug } = relAritlcle
  switch (style) {
    case 'projects':
      return `/projects/${slug}`
    default:
      if (_.split(href, '/')[1] === 'topic') {
        return href
      } else {
        return `/story/${slug}/`
      }
  }
}

export function getImage (article, size) {
  let image
  if (article.heroImage && article.heroImage.image) {
    image = article.heroImage
  } else {
    image = article.ogImage
  }
  switch (size) {
    case 'desktop':
      return _.get(image, [ 'image', 'resizedTargets', 'desktop', 'url' ], '/public/notImage.png')
    case 'mobile':
      return _.get(image, [ 'image', 'resizedTargets', 'mobile', 'url' ], '/public/notImage.png')
    case 'tablet':
      return _.get(image, [ 'image', 'resizedTargets', 'tablet', 'url' ], '/public/notImage.png')
    case 'tiny':
      return _.get(image, [ 'image', 'resizedTargets', 'tiny', 'url' ], '/public/notImage.png')
    default:
      return _.get(image, [ 'image', 'resizedTargets', 'desktop', 'url' ], '/public/notImage.png')
  }
}

export function getName (article) {
  return _.get(article, [ 'name' ])
}

export function getSection (article) {
  switch (_.get(article, [ 'style' ])) {
    case 'article':
      return _.get(article, 'sections[0].name') ? _.get(article, 'sections[0].name') : ''
    case 'projects':
      return 'projects'
    default:
      return 'other'
  }
}

export function shareGooglePlus ({ route, shared }) {
  window.open(`https://plus.google.com/share?url=${SITE_URL}${route}`)
  shared && shared()
}

export function shareLine ({ title, route, shared }) {
  window.open(`https://line.naver.jp/R/msg/text/?${encodeURIComponent(title)}%0D%0A${encodeURIComponent(SITE_URL + route)}`)
  shared && shared()
}

export function shareFacebook ({ route, shared }) {
  window.open(`https://www.facebook.com/share.php?u=${SITE_URL}${route}`)
  shared && shared()
}

export function getTitle (article, count = 30) {
  return truncate(_.get(article, [ 'title' ]), count)
}

export function getTruncatedVal (oVal, count) {
  return truncate(oVal, count)
}

export function getValue (o = {}, p = [], d = '') {
  return _.get(o, p, d)
}

export function getHost () {
  const browser = typeof window !== 'undefined'
  if (browser) {
    return `//${location.host}`
  } else {
    const host = process.env.HOST || 'localhost'
    const port = parseInt(process.env.PORT) || 8080
    return `${host}:${port}`
  }
}

export function lockJS () {
  if (process.env.VUE_ENV === 'client') {
    document.oncontextmenu = function () { return false }
    document.onkeydown = function (event) { if (event.keyCode === 67) { return false } }
    document.ondragstart = function () { return false }
    document.onselectstart = function () { return false }
  }
}

export function unLockJS () {
  if (process.env.VUE_ENV === 'client') {
    document.oncontextmenu = function () { return true }
    document.onkeydown = function (event) { if (event.keyCode === 67) { return true } }
    document.ondragstart = function () { return true }
    document.onselectstart = function () { return true }
  }
}

export function currEnv () {
  if (process.env.VUE_ENV === 'client') {
    if (location.host.indexOf(SITE_DOMAIN) === 0 || location.host.indexOf(`www.${SITE_DOMAIN}`) === 0) {
      return 'prod'
    } else {
      return 'dev'
    }
  }
}

export function disableScroll () {
  if (window.addEventListener) { // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false)
  }
  window.onwheel = preventDefault // modern standard
  window.onmousewheel = preventDefault // older browsers, IE
  document.onmousewheel = preventDefault // older browsers, IE
  window.ontouchmove = preventDefault // mobile
  document.onkeydown = preventDefaultForScrollKeys
}
export function enableScroll () {
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', preventDefault, false)
  }
  window.onmousewheel = document.onmousewheel = null
  window.onwheel = null
  window.ontouchmove = null
  document.onkeydown = null
}
function keys () {
  return { 37: 1, 38: 1, 39: 1, 40: 1 }
}
function preventDefault (e) {
  e = e || window.event
  if (e.preventDefault) {
    e.preventDefault()
  }
  e.returnValue = false
}
function preventDefaultForScrollKeys (e) {
  // doesn't work
  if (keys[e.keyCode]) {
    preventDefault(e)
    return false
  }
}
