<template>
  <div class="readr-latest" :id="`readr-latest-${this.id}`">
    <iframe class="readr-latest__iframe" v-if="isReadyToShow"
      src="https://www.readr.tw/plugins/latest" frameborder="0" v-resize></iframe>
  </div>
</template>

<script>
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import uuidv4 from 'uuid/v4'
import verge from 'verge'
import { currentYPosition, elmYPosition, } from 'kc-scroll'
const debug = require('debug')('CLIENT:READR')
export default {
  data () {
    return {
      id: `${uuidv4()}`,
      isReadyToShow: false
    }
  },
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
  },
  mounted () {
    /**
     * Lazy load this iframe.
     */
    const handler = () => {
      if (this.isReadyToShow) { return }
      const deviceHeight = verge.viewportH()
      const currPosBottom = currentYPosition() + deviceHeight
      const thisEleTop = elmYPosition(`#readr-latest-${this.id}`)
      if (thisEleTop - 500 < currPosBottom) {
        debug('OPEN IT')
        this.isReadyToShow = true
        window.removeEventListener('scroll', handler)
      }
    }
    window.addEventListener('scroll', handler)
  }
}
</script>

<style lang="stylus" scoped>
.readr-latest
  width 100%
  &__iframe
    min-width 100%
</style>

