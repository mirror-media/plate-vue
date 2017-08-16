import _ from 'lodash'

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
    const meta = metaSet.meta
    const title = metaSet.title
    if (title) {
      this.$ssrContext.title = title
    }
    if (meta) {
      this.$ssrContext.meta = meta
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
    if (title) {
      document.querySelector('title').innerHTML = title
    }
    console.log('--- mixin updated', metaSet)
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
      console.log('mixin updated meta ---')
    }
  }
}

export default process.env.VUE_ENV === 'server'
  ? serverTitleMetaMixin
  : clientTitleMetaMixin
