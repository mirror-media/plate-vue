<template>
  <img src="/assets/mirrormedia/icon/loading.gif" :alt="caption" class="plate-vue-lazy-image" :id="`img-${id}`">
</template>
<script>
  import uuidv4 from 'uuid/v4'
  import verge from 'verge'
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  export default {
    name: 'LazyImage',
    data () {
      return {
        id: `${uuidv4()}`,
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
    },
    props: {
      caption: {},
      src: {},
      srcset: {},
    },
  }
</script>
<style lang="stylus" scoped></style>