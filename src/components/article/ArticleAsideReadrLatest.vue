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
        iFrameResize({
          // receive postMessage from checked origin
          checkOrigin: [ 'https://www.readr.tw' ],
          messageCallback ({ message, }) {
            const {
              messageType,
              action,
              category,
              label,
            } = message

            if (messageType === 'GA') {
              window.ga('send', 'event', category, action, label)
            }
          }
        }, '.readr-latest__iframe')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.readr-latest
  width 100%
  margin-top 20px!important
  &__iframe
    min-width 100%
</style>

