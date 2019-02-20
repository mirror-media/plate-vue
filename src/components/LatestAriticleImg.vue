<template>
  <div class="latest-image" :class="[ isVirtualImgLoaded ? '' : 'loading', `id-${id}`, ]" style="background-image: url(/assets/mirrormedia/icon/loading.gif);"></div>
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
      checkPos () {
        return new Promise(resolve => {
          if (this.isVirtualImgCheckedOut) { return resolve(false) }
          const deviceHeight = verge.viewportH()
          const currPosMid = currentYPosition() + deviceHeight / 2
          const elePos = elmYPosition(`.latest-image.id-${this.id}`)
          if (currPosMid < elePos + 500 && currPosMid > elePos - 500) { resolve(true) }
        })
      },
      goDoLazyLoad () {
        this.isVirtualImgCheckedOut = true
        this.lazyLoad()
      },
    },
    mounted () {
      this.checkPos().then(isPassed => (isPassed && this.goDoLazyLoad()))     
      window.addEventListener('scroll', () => {
        this.checkPos().then(isPassed => (isPassed && this.goDoLazyLoad()))
      })
    },
    props: {
      src: String,
      id: [ String, Number ],
    },
    watch: {
      src () {
        this.$el.setAttribute('style', 'background-image: url(/assets/mirrormedia/icon/loading.gif);')
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