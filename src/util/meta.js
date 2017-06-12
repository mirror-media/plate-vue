function getMeta (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
  }
}

const serverTitleMixin = {
  created () {
    const meta = getMeta(this)
    if (meta) {
      this.$ssrContext.meta = `${meta}`
    }
  }
}

const clientTitleMixin = {
  mounted () {
    const meta = getMeta(this)
    if (meta) {
      document.meta = `${meta}`
    }
  }
}

export default process.env.VUE_ENV === 'server'
  ? serverTitleMixin
  : clientTitleMixin
