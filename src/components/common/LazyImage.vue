<template>
  <img src="/assets/mirrormedia/icon/loading.gif" class="plate-vue-lazy-image" 
    :class="{ loading: !isVirtualImgLoaded }"
    :alt="caption"
    :id="`img-${id}`">
</template>
<script>
  import uuidv4 from 'uuid/v4'
  import verge from 'verge'
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  export default {
    name: 'LazyImage',
    data () {
      return {
        id: '',
        isVirtualImgLoaded: false,
        isVirtualImgCheckedOut: false
      }
    },
    methods: {
      async lazyLoad () {
        const lazy_img = document.createElement('img')
        lazy_img.onload = () => {
          this.isVirtualImgLoaded = true
          this.srcset && this.$el.setAttribute('srcset', this.srcset)
          this.$el.setAttribute('src', this.src)
        }
        this.caption && lazy_img.setAttribute('alt', this.caption)
        this.srcset && lazy_img.setAttribute('srcset', this.srcset)
        lazy_img.setAttribute('src', this.src)
      },
      handler () {
        if (this.isVirtualImgCheckedOut) { return }
        const deviceHeight = verge.viewportH()
        const currPosBottom = currentYPosition() + deviceHeight
        const eleTop = elmYPosition(`#img-${this.id}`)
        if (eleTop < currPosBottom) {
          this.isVirtualImgCheckedOut = true
          this.lazyLoad().then(() => {
            window.removeEventListener('scroll', this.handler)      
          })
        }
      },
    },
    mounted () {
      window.addEventListener('scroll', this.handler)      
      this.id = uuidv4()
      this.$forceUpdate()
    },
    updated () {
      this.handler()
    },
    props: {
      caption: {},
      src: {},
      srcset: {},
    },
    watch: {
      '$route.fullPath': function () {
        window.removeEventListener('scroll', this.handler)
        this.isVisibleYet = false
        this.isVirtualImgCheckedOut = false
        window.addEventListener('scroll', this.handler)     
      }
    }
  }
</script>
<style lang="stylus" scoped>
  img.loading
    max-width 100px
    width 100%
    object-fit contain!important
    margin 0 auto
</style>