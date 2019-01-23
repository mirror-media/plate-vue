<template>
  <div v-show="showDfp" class="dfp-st">
    <slot name="dfpST"></slot>
  </div>
</template>
<script>
import { throttle } from 'lodash'

export default {
  name: 'DfpST',
  data () {
    return {
      showDfp: false,
      scrollTop: 0
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll: throttle(function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > this.scrollTop) {
        this.showDfp = true
        window.removeEventListener('scroll', this.handleScroll)
      }
      this.scrollTop = scrollTop
    }, 500)
  }
}
</script>
<style lang="stylus" scoped>
.dfp-st
  position fixed
  left 0
  right 0
  bottom 0
  z-index 900

@media (min-width 1200px)
  .dfp-st
    display none !important
</style>
