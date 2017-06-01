import { SITE_DOMAIN, SITE_URL } from '../constants'
import _ from 'lodash'
import moment from 'moment'
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

export function getImageCertain (image, size) {
  switch (size) {
    case 'desktop':
      return _.get(image, [ 'desktop', 'url' ], '/public/notImage.png')
    case 'mobile':
      return _.get(image, [ 'mobile', 'url' ], '/public/notImage.png')
    case 'tablet':
      return _.get(image, [ 'tablet', 'url' ], '/public/notImage.png')
    case 'tiny':
      return _.get(image, [ 'tiny', 'url' ], '/public/notImage.png')
    default:
      return _.get(image, [ 'desktop', 'url' ], '/public/notImage.png')
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
}

/*
 *  constructing and sending req to api to log client's behaviors through following functions:
 *    getClientOS()
 *    mmLog()
 *    _getUserIP()
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

export function mmLog ({ eventType, target, description }) {
  return _normalizeLog({ eventType, target, description })
}

function _getUserIP () {
  return new Promise((resolve) => {
    // compatibility for firefox and chrome
    const MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    const pc = new MyPeerConnection({
      iceServers: []
    })
    const noop = () => {}
    const localIPs = {}
    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

    const iterateIP = (ip) => {
      if (!localIPs[ip]) {
        resolve(ip)
        // return ip
      }
      localIPs[ip] = true
    }

    // create a bogus data channel
    pc.createDataChannel('')

    // create offer and set local description
    pc.createOffer().then(function (sdp) {
      sdp.sdp.split('\n').forEach(function (line) {
        if (line.indexOf('candidate') < 0) {
          return
        }
        line.match(ipRegex).forEach(iterateIP)
      })
      pc.setLocalDescription(sdp, noop, noop)
    }).catch(function (reason) {
          // An error occurred, so handle the failure to connect

    })

    // listen for candidate events
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) {
        return
      }
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
    }
  })
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

function _normalizeLog ({ eventType = 'click', target = {}, description = '', referrer }) {
  return new Promise((resolve) => {
    const targ = target

    const clientOs = getClientOS()
    const innerText = targ.innerText ? sanitizeHtml(targ.innerText, { allowedTags: [ '' ] }) : ''
    const isAlinkCheck = targ.tagName === 'A' ? { isAlink: true, href: targ.href } : _isAlinkDescendant(targ)

    const log = {
      'client-id': '',
      'client-os': clientOs,
      'curr-url': window.location.href,
      'datetime': moment(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
      'description': description,
      'event-type': eventType,
      'redirect-to': isAlinkCheck.href,
      'target-tag-name': targ.tagName,
      'target-tag-class': targ.className,
      'target-tag-id': targ.id,
      'target-text': truncate(innerText, 100),
      'target-window-size': {
        width: document.documentElement.clientWidth || document.body.clientWidth,
        height: document.documentElement.clientWidth || document.body.clientWidth
      }
    }
    if (window.mmClientId) {
      log['client-id'] = window.mmClientId
      log['referrer'] = referrer
      resolve(log)
    } else {
      return _getUserIP().then((ip) => {
        log['client-id'] = `mm-client-${Date.now()}-${ip}`
        log['referrer'] = document.referrer
        window.mmClientId = log['client-id']
        resolve(log)
      })
    }
  })
}
