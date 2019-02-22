<template>
  <div class="plate-vue-lazy-item-wrapper" :id="`lazyitemwrp-${id}`">
    <div v-show="isVisibleYet">
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
    data () {
      return {
        id: '',
        isVisibleYet: false
      }
    },
    mounted () {
      const uuid = uuidv4()
      this.id = uuid
      let currPosTop = currentYPosition()
      let deviceHeight = verge.viewportH()
      let eleTop = elmYPosition(`#lazyitemwrp-${this.id}`)
      const handler = () => {
        if (this.isVisibleYet) { return }
        currPosTop = currentYPosition()
        deviceHeight = verge.viewportH()
        eleTop = elmYPosition(`#lazyitemwrp-${this.id}`)
        if (eleTop - deviceHeight * 1.5 < currPosTop) {
          this.isVisibleYet = true
          window.removeEventListener('scroll', handler)
        }
      }
      if (eleTop - deviceHeight * 1.5 < currPosTop) {
        this.isVisibleYet = true
      } else {
        window.addEventListener('scroll', handler)
      }
    },
  }
</script>
<style lang="stylus" scoped></style>