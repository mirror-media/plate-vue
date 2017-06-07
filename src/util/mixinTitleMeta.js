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
    // const meta = metaSet.meta
    const title = metaSet.title
    if (title) {
      document.querySelector('title').innerHTML = title
    }
  }
}

export default process.env.VUE_ENV === 'server'
  ? serverTitleMetaMixin
  : clientTitleMetaMixin
