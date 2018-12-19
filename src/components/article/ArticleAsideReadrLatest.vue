<template>
  <div class="readr-latest">
    <iframe class="readr-latest__iframe" src="https://www.readr.tw/plugins/latest" frameborder="0" v-resize></iframe>
  </div>
</template>

<script>
import iFrameResize from 'iframe-resizer/js/iframeResizer'

export default {
  directives: {
    'resize': {
      inserted () {
        iFrameResize({ checkOrigin: [ 'https://www.readr.tw' ] }, '.readr-latest__iframe')
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
.readr-latest
  width 100%
  &__iframe
    min-width 100%
</style>

