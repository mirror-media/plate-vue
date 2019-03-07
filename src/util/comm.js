import { SITE_DOMAIN, SITE_URL, SITE_PROJ_URL, } from '../constants'
import _ from 'lodash'
import Browser from 'bowser'
import Cookie from 'vue-cookie'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'
import uuidv4 from 'uuid/v4'

const debug = require('debug')('CLIENT:comm')

export function getArticleReadTime (paragraphs = []) { // deprecated
  const REGEX_ONLY_CHINESE = /[\u4E00-\u9FFF]+/g
  const REGEX_NOT_EN_AND_NUMBER = /([^A-Za-z0-9])/g

  const WPM_ENGLISH = 265
  const WPM_CHINESE = 250

  const textContents = Array.isArray(paragraphs) ? paragraphs : []
  const textContentsFiltered = textContents
    .filter(paragraph => paragraph.type === 'unstyled')
    .filter(paragraph => paragraph.content[0].trim())
    .map(paragraph => paragraph.content[0])
  
  let min = 0
  if (textContentsFiltered.length > 0) {
    const combined = textContentsFiltered.join(' ')
    const countChinese = combined.match(REGEX_ONLY_CHINESE).join('').length
    const countEnglishAndNumber = combined
      .replace(REGEX_ONLY_CHINESE, ' ')
      .replace(REGEX_NOT_EN_AND_NUMBER, ' ')
      .split(' ')
      .filter(word => word).length
    const readTime = Math.round((countChinese / WPM_CHINESE) + (countEnglishAndNumber / WPM_ENGLISH))
    min = readTime > 0 ? readTime : 1
  }
  return min
}

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

export function getBrief (article, count = 30, allowedTags = []) {
  const metaBrief =  _.get(article, 'brief')
  let brief = _.isString(metaBrief) ? metaBrief : (_.get(article, 'brief.html') || _.get(article, [ 'ogDescription' ]) || '')
  brief = sanitizeHtml(brief, { allowedTags: allowedTags })
  return truncate(brief, count)
}

export function getHref (relAritlcle = {}) {
  const { style = '', slug } = relAritlcle
  
  switch (style) {
    case 'campaign':
      return `/campaigns/${slug}`
    case 'projects':
      return `/projects/${slug}`
    default:
      // if (_.split(href, '/')[1] === 'topic') {
      //   return href
      // } else {
      return `/story/${slug}/`
      // }
  }
}

export function getHrefFull (relAritlcle = {}) {
  const { style = '', slug } = relAritlcle
  switch (style) {
    case 'campaign':
      return `${SITE_URL}/campaigns/${slug}`
    case 'projects':
      return `${SITE_URL}/projects/${slug}`
    case 'readr':
      return `${SITE_PROJ_URL}/project/${slug}`
    default:
      // if (_.split(href, '/')[1] === 'topic') {
      //   return href
      // } else {
      return `${SITE_URL}/story/${slug}/`
      // }
  }
}

export function getImage (article, size) {
  let image
  if (article.heroImage) {
    debug('get heroimage')
    image = article.heroImage.image ? _.get(article, [ 'heroImage', 'image', 'resizedTargets' ]) : _.get(article, 'heroImage')
  } else if (article.ogImage) {
    debug('get ogImage')
    image = _.get(article, [ 'ogImage', 'image', 'resizedTargets' ])
  } else if (article.heroVideo && article.heroVideo.coverPhoto && article.heroVideo.coverPhoto.image) {
    debug('get heroVideo img')
    image = _.get(article, [ 'heroVideo', 'coverPhoto', 'image', 'resizedTargets' ])
  }
  switch (size) {
    case 'desktop':
      return _.get(image, [ 'desktop', 'url' ], '/assets/mirrormedia/notImage.png')
    case 'mobile':
      return _.get(image, [ 'mobile', 'url' ], '/assets/mirrormedia/notImage.png')
    case 'tablet':
      return _.get(image, [ 'tablet', 'url' ], '/assets/mirrormedia/notImage.png')
    case 'tiny':
      return _.get(image, [ 'tiny', 'url' ], '/assets/mirrormedia/notImage.png')
    default:
      return _.get(image, [ 'desktop', 'url' ], '/assets/mirrormedia/notImage.png')
  }
}

export function getSection (article) {
  switch (_.get(article, [ 'style' ])) {
    case 'article':
      return _.get(article, 'sections[0].name') || ''
    case 'projects':
      return 'projects'
    default:
      return 'other'
  }
}

export function shareLine ({ title, route }) {
  window.open(`https://line.naver.jp/R/msg/text/?${encodeURIComponent(title)}%0D%0A${encodeURIComponent(SITE_URL + route)}`)
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

export function consoleLogOnDev ({ msg }) {
  if (currEnv() === 'dev') {
    console.log(msg)
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

export function enableScroll () {
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', preventDefault, false)
  }
  window.onmousewheel = document.onmousewheel = null
  window.onwheel = null
  window.ontouchmove = null
  document.onkeydown = null
}
function preventDefault (e) {
  e = e || window.event
  if (e.preventDefault) {
    e.preventDefault()
  }
  e.returnValue = false
}

/*
 *  constructing and sending req to api to log client's behaviors through following functions:
 *    getClientOS()
 *    mmLog()
 *    _isAlinkDescendant()
 *    _normalizeLog()
 */

export function getClientOS () {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = [ 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K' ]
  const windowsPlatforms = [ 'Win32', 'Win64', 'Windows', 'WinCE' ]
  const iosPlatforms = [ 'iPhone', 'iPad', 'iPod' ]
  let os = null

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }
  return os
}

export function mmLog ({ category, eventType, target, description, referrer, ...rest }) {
  return _normalizeLog({ category, eventType, target, description, referrer, ...rest })
}

export function isEleFixed (ele) {
  let node = ele
  
  while (node !== null && node !== undefined && node !== document) {
    const position = node.currentStyle ? node.currentStyle.position : window.getComputedStyle(node, null).position
    if (position === 'fixed') {
      return true
    }
    node = node.parentNode
  }
  return false  
}

export function isDescendant (child, { classname = 'none' }) {
  let node = child.parentNode
  while (node !== null && node !== undefined) {
    if (node.className && node.className.indexOf(classname) > -1) {
      return true
    }
    node = node.parentNode
  }
  return false
}

function _isAlinkDescendant (child) {
  let node = child.parentNode
  while (node !== null && node !== undefined) {
    if (node.tagName === 'A') {
      return { isAlink: true, href: node.href }
    }
    node = node.parentNode
  }
  return { isAlink: false, href: '' }
}

function _normalizeLog ({ eventType = 'click', category = '', target = {}, description = '', referrer, ...rest }) {
  return new Promise((resolve) => {
    const cookieId = Cookie.get('mmid')
    const targ = target

    const clientOs = getClientOS()
    const innerText = targ.innerText ? sanitizeHtml(targ.innerText, { allowedTags: [ '' ] }) : ''
    const isAlinkCheck = targ.tagName === 'A' ? { isAlink: true, href: targ.href } : _isAlinkDescendant(targ)

    const exp_related = /^related/g
    const exp_recoommend = /^recommend/g

    const log = {
      'browser': {
        name: Browser.name,
        version: Browser.version
      },
      'category': category,
      'client-id': '',
      'client-os': {
        name: clientOs,
        version: Browser.osversion
      },
      'curr-url': window.location.href,
      'datetime': moment(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
      'description': description,
      'event-type': eventType,
      'redirect-to': isAlinkCheck.isAlink ? isAlinkCheck.href : undefined,
      'referrer': referrer || (isAlinkCheck.isAlink ? location.href : undefined),
      'rref': isAlinkCheck.isAlink ? exp_related.test(target.id) ? 'related' : exp_recoommend.test(target.id) ? 'recommend' : undefined : undefined,
      'target-tag-name': targ.tagName,
      'target-tag-class': targ.className,
      'target-tag-id': targ.id,
      'target-text': truncate(innerText, 100),
      'target-window-size': {
        width: document.documentElement.clientWidth || document.body.clientWidth,
        height: document.documentElement.clientWidth || document.body.clientWidth
      },
      ...rest
    }
    if (!cookieId) {
      const dt = Date.now()
      const thisId = setMmCookie()
      log['client-id'] = thisId
      log['current-runtime-id'] = thisId
      log['current-runtime-start'] = moment(dt).format('YYYY.MM.DD HH:mm:ss')
      window.mmThisRuntimeClientId = thisId
      window.mmThisRuntimeDatetimeStart = moment(dt).format('YYYY.MM.DD HH:mm:ss')
      resolve(log)
    } else {
      const dt = Date.now()
      log['client-id'] = cookieId
      if (!window.mmThisRuntimeClientId) {
        window.mmThisRuntimeClientId = uuidv4()
        window.mmThisRuntimeDatetimeStart = moment(dt).format('YYYY.MM.DD HH:mm:ss')
      }
      log['current-runtime-id'] = window.mmThisRuntimeClientId
      log['current-runtime-start'] = window.mmThisRuntimeDatetimeStart
      resolve(log)
    }
  })
}

export function setMmCookie () {
  const uuid = uuidv4()
  Cookie.set('mmid', uuid, { expires: (10 * 365 * 24) + 'h' })
  return uuid
}

export async function insertMicroAd ({ adId, currEnv, vm }) {
  if (process.env.VUE_ENV === 'client' && !vm.microAdLoded) {
    const _lgy_lw = document.createElement('script')
    _lgy_lw.onload = () => {
      currEnv === 'dev' && console.log('microad', adId, 'loaded')
      vm.microAdLoded = true
    }
    _lgy_lw.type = 'text/javascript'
    _lgy_lw.charset = 'UTF-8'
    _lgy_lw.async = true
    _lgy_lw.src = ((document.location.protocol === 'https:') ? 'https://' : 'http://') + `nt.compass-fit.jp/lift_widget.js?adspot_id=${adId}`
    const _lgy_lw_0 = document.getElementsByTagName('script')[0]
    _lgy_lw_0.parentNode.insertBefore(_lgy_lw, _lgy_lw_0)
  }
}

// Vpon ad is abandoned 20180810 BY KC
// export function insertVponAdSDK ({ isVponSDKLoaded = false }) {
//   if (process.env.VUE_ENV === 'client' && isVponSDKLoaded === false) {
//     const script = document.createElement('script')
//     script.type = 'text/javascript'
//     script.src = '//m.vpon.com/sdk/vpadn-sdk.js'
//     document.body.appendChild(script)
//   }
//   return true
// }

export function trim (str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}

export function addClass (ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className += ' ' + cls
  }
  ele.className = trim(ele.className)
}

export function hasClass (ele, cls) {
  if (ele.className) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  } else {
    ele.className = cls
    return true
  }
}

export function removeClass (ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
  ele.className = trim(ele.className)
}
// Vpon ad is abandoned 20180810 BY KC
// export function vponHtml () {
//   const mode = _.get(VPON_CONFIG, [ 'vpon_ad_test' ], '1')
//   const key = _.get(VPON_CONFIG, [ 'vpon_ad_licensy_key' ], '')
//   const format = _.get(VPON_CONFIG, [ 'vpon_ad_format' ], 'mi')
//   const debug = _.get(VPON_CONFIG, [ 'debug' ], true)
//   return `<vpon vpon_ad_test="${mode}" vpon_ad_licensy_key="${key}" vpon_ad_format="${format}" debug="${debug}"></vpon>`
// }

export function updateCookie ({ currEnv }) {
  return new Promise(resolve => {
    const cookie = Cookie.get('visited')    
    if (currEnv === 'prod' && !cookie) {
      // Cookie.set('visited', 'true', { expires: '3m' })
    }
    resolve(cookie === 'true')
  })
}

export function sendAdCoverGA (label) {
  window && window.ga && window.ga('send', 'event', 'mobile-ad', 'visible', label, {
    location: document.location.href,
    nonInteraction: true
  })
}

export function extractSlugFromreferrer (referrer = '') {
  const filteredReferrer = referrer.replace(/^https?:\/\//, '').replace(/\?[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*$/, '')
  const referrerArr = filteredReferrer.split('/')
  if ((referrerArr[ 0 ].indexOf(SITE_DOMAIN) > -1 || referrerArr[ 0 ].indexOf('localhost') > -1) && referrerArr[ 1 ] === 'story') {
    return referrerArr[ 2 ]
  } else {
    return 'N/A'
  }
}
