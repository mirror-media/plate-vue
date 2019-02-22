import _ from 'lodash'

const debug = require('debug')('CLIENT:mixinTitleMeta')

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

const clientTitleMetaMixin = {
  mounted () {
    const metaSet = getMetaSet(this)
    if (!metaSet) { return }
    // const meta = metaSet.meta
    const title = metaSet.title
    if (title) {
      document.querySelector('title').innerHTML = title
    }
  },
  updated () {
    const metaSet = getMetaSet(this)
    if (!metaSet) { return }
    const meta = metaSet.meta
    const title = metaSet.title
    const url = metaSet.url
    // const link = metaSet.link
    const adTrace = metaSet.adTrace
    const adTraceScripts = [ ...document.querySelectorAll('*[data-name="ad-trace"]') ]
    debug('adTrace', adTrace)
    adTraceScripts.map(node => node.remove())
    
    if (title) {
      document.querySelector('title').innerHTML = title
    }
    // if (link) {
    //   const amphtml = document.head.querySelector(`link[rel='amphtml']`)
    //   amphtml && (amphtml.href = link)
    // }
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
}

export default process.env.VUE_ENV === 'server'
  ? serverTitleMetaMixin
  : clientTitleMetaMixin
