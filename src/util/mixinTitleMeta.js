import _ from 'lodash'
import { alexa, autoAdsAsyncSrc, autoAdsScript, dableScript, fb_sdk, gtm_mirrormedia, gtm_likr, scorecardresearch } from './dynamicScript'

const debug = require('debug')('CLIENT:mixinTitleMeta')
let isScriptLoaded = false
let isWindowLoadedHandlerSetup = false

function getMetaSet (vm) {
  const { metaSet } = vm.$options
  if (metaSet) {
    return typeof metaSet === 'function'
      ? metaSet.call(vm)
      : metaSet
  }
  return undefined
}

const serverTitleMetaMixin = {
  created () {
    const metaSet = getMetaSet(this)
    if (!metaSet) { return }
    const link = metaSet.link
    const meta = metaSet.meta
    const title = metaSet.title
    const url = metaSet.url
    const adTrace = metaSet.adTrace
    this.$ssrContext.custom = metaSet.custom || ''
    if (title) {
      this.$ssrContext.title = title
    }
    if (meta) {
      this.$ssrContext.meta = meta
    }
    if (link) {
      this.$ssrContext.link = link
    }
    if (url) {
      this.$ssrContext.url = url
    }
    if (adTrace) {
      this.$ssrContext.adTrace = adTrace
    }
  }
}

const updateMeta = metaInfo => {
  const { title, meta, url, adTrace } = metaInfo
  const adTraceScripts = [ ...document.querySelectorAll('*[data-name="ad-trace"]') ]
  adTraceScripts.map(node => node.remove())
  
  if (title) {
    document.querySelector('title').innerHTML = title
  }
  if (url) {
    const alternate = document.head.querySelector(`link[rel='alternate']`)
    alternate && (alternate.href = url)
  }
  if (adTrace) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(adTrace, "text/html")
    const scripts = [ ...doc.querySelectorAll('*[data-name="ad-trace"]') ]
    debug('adTrace scripts', scripts)
    scripts.map(node => document.head.appendChild(node))
  }
  if (meta) {
    const dynamicMeta = document.querySelectorAll('head meta:not([fixed="true"])')
    const newMeta = _.split(meta, '>')
    _.forEach(dynamicMeta, (node) => {
      document.head.removeChild(node)
    })
    _.forEach(newMeta, (m) => {
      const node = document.createElement('div')
      node.innerHTML = `${m}>`
      const updateMeta = node.querySelector('meta')
      if (updateMeta) {
        document.head.appendChild(updateMeta)
      }
    })
  }
}

const clientTitleMetaMixin = {
  mounted () {
    const metaSet = getMetaSet(this)
    metaSet && updateMeta(metaSet, this)
  },
  updated () {
    const metaSet = getMetaSet(this)
    metaSet && updateMeta(metaSet, this)
  }
}
process.env.VUE_ENV === 'client' && !isWindowLoadedHandlerSetup && window.addEventListener('load', () => {
  const isAppPage = location.pathname.match(/\/app\//g)
  
  if (!isScriptLoaded) {
    const insertCodes = async ({ async, codes, id, src, position }) => {
      const script = document.createElement('script')
      async ? script.setAttribute('async', true) : ''
      id ? script.setAttribute('id', id) : ''
      src ? script.setAttribute('src', src) : ''
      codes ? script.innerHTML = codes : ''
      if (position && document[position]) {
        document[position].appendChild(script)
      } else {
        document.head.appendChild(script)
      }
    }
    const jobs = [
      insertCodes({ codes: gtm_mirrormedia }).then(() => insertCodes({ codes: gtm_likr })),
      insertCodes({ codes: fb_sdk }),
      insertCodes({ codes: scorecardresearch }).then(() => insertCodes({ codes: alexa })),
      insertCodes({ codes: dableScript, position: 'body' }),
    ]
    if (isAppPage && !document.querySelector('#autoAdsAsyncSrc')) {
      jobs.push(insertCodes({ async: true, id: 'autoAdsAsyncSrc', src: autoAdsAsyncSrc }))
      jobs.push(insertCodes({ codes: autoAdsScript, id: 'autoAdsScript',  }))
    }
    // else if (!isAppPage && document.querySelector('#autoAdsAsyncSrc')) {
    //   document.querySelector('#autoAdsAsyncSrc').remove()
    //   document.querySelector('#autoAdsScript').remove()
    // }

    isScriptLoaded = Promise.all(jobs).then(() => true).catch(() => false)
  }
  isWindowLoadedHandlerSetup = true
})

export default process.env.VUE_ENV === 'server'
  ? serverTitleMetaMixin
  : clientTitleMetaMixin
