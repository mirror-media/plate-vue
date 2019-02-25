<template>
  <div class="plate-vue-lazy-item-wrapper" :id="`lazyitemwrp-${id}`">
    <div v-show="isVisibleYet" v-if="isSupposedToRenderOnSS || isVisibleYet || !strict">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import uuidv4 from 'uuid/v4'
  import verge from 'verge'
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  // const debug = require('debug')('CLIENT:LAZYITEM')
  export default {
    name: 'LazyItemWrapper',
    computed: {
      isSupposedToRenderOnSS () {
        return this.ssr && process.env.VUE_ENV === 'server'
      }
    },
    data () {
      return {
        id: '',
        isVisibleYet: false
      }
    },
    mounted () {
      const uuid = uuidv4()
      this.id = uuid
      const handler = () => {
        if (this.isVisibleYet) { return }
        const currPosTop = currentYPosition()
        const deviceHeight = verge.viewportH()
        const eleTop = elmYPosition(`#lazyitemwrp-${this.id}`)
        const offset = this.offset || 0
        const checkPoint = this.position || (eleTop - offset)
        if (checkPoint < currPosTop + deviceHeight) {
          this.isVisibleYet = true
          window.removeEventListener('scroll', handler)
        }
      }
      window.addEventListener('scroll', handler)
      handler()
    },
    props: {
      offset: {},
      position: {},
      ssr: {
        default: false
      },
      strict: {
        default: false
      },
    },
  }
</script>
<style lang="stylus" scoped></style>