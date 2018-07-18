<template>
  <div class="latest-image" :class="[ isVirtualImgLoaded ? '' : 'loading', `id-${id}`, ]" style="background-image: url(/public/icon/loading.gif);"></div>
</template>
<script>
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  import verge from 'verge'
  // const debug = require('debug')('CLIENT:LatestAriticleImg')
  export default {
    name: 'LatestAriticleImg',
    data () {
      return {
        isVirtualImgLoaded: false,
        isVirtualImgCheckedOut: false,
      }
    },
    methods: {
      lazyLoad () {
        const img = new Image()
        img.onload = () => {
          this.$el.setAttribute('style', `background-image: url(${img.src});`)
          this.isVirtualImgLoaded = true        
        }
        img.src = this.src
      },
    },
    mounted () {
      window.addEventListener('scroll', () => {
        if (this.isVirtualImgCheckedOut) { return }
        const deviceHeight = verge.viewportH()
        const currPosMid = currentYPosition() + deviceHeight / 2
        const elePos = elmYPosition(`.latest-image.id-${this.id}`)
        if (currPosMid < elePos + 500 && currPosMid > elePos - 500) {
          this.isVirtualImgCheckedOut = true
          this.lazyLoad()
        }
      })
    },
    props: {
      src: String,
      id: String,
    },
    watch: {
      src () {
        this.$el.setAttribute('style', 'background-image: url(/public/icon/loading.gif);')
        this.isVirtualImgLoaded = false
        this.isVirtualImgCheckedOut = false        
        this.lazyLoad()       
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .latest-image
    &.loading
      background-size 40% !important
</style>