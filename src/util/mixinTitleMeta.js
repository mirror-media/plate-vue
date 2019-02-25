import _ from 'lodash'
import { gtm_mirrormedia, gtm_likr } from './dynamicScript'

const debug = require('debug')('CLIENT:mixinTitleMeta')
let isGTMLoaded = false
let isDomContentLoadedHandlerSetup = false

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

const updateMeta = (metaInfo, vm) => {
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

process.env.VUE_ENV === 'client' && !isDomContentLoadedHandlerSetup && document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  if (!isGTMLoaded) {
    console.log('isGTMLoaded', isGTMLoaded)
    const insertCodes = async codes => {
      const script = document.createElement('script')
      script.innerHTML = codes
      document.head.appendChild(script)
    }
    isGTMLoaded = Promise.all([
      insertCodes(gtm_mirrormedia),
      insertCodes(gtm_likr),
    ]).then(() => true).catch(() => false)
    console.log('isGTMLoaded', isGTMLoaded)
  }
  isDomContentLoadedHandlerSetup = true
})

export default process.env.VUE_ENV === 'server'
  ? serverTitleMetaMixin
  : clientTitleMetaMixin
