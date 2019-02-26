<template>
  <div class="content-image" :class="`img-${id}`" @click="openLightBox">
    <span class="thumbnail" v-show="!isVirtualImgLoaded"><img src="/assets/mirrormedia/icon/loading.gif" :alt="caption"></span>
    <span class="thumbnail" v-show="isVirtualImgLoaded" ref="lazyImg"></span>
    <div class="caption" v-text="caption"></div>
    <div class="lightbox" v-show="isLightboxActive">
      <div class="lightbox-close" @click="closeLightBox"></div>
      <img class="lightbox-img" :class="{ loading: !isLightboxImgLoaded }" src="/assets/mirrormedia/icon/loading.gif" ref="lightboxImg">
    </div>
  </div>
</template>
<script>
  import verge from 'verge'
  import preventScroll from 'prevent-scroll'  
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  import { get, } from 'lodash'
  
  const debug = require('debug')('CLIENT:ArticleImg')
  // const debugLazy = require('debug')('CLIENT:LAZYIMAGE')
  export default {
    name: 'ArticleImg',
    computed: {
      caption () {
        return get(this.image, 'description', '')
      },
    },
    data () {
      return {
        id: Date.now().toString(),
        images: {},
        isLightboxActive: false,
        isLightboxImgLoaded: false,
        isVirtualImgLoaded: false,
        isVirtualImgCheckedOut: false,
      }
    },
    methods: {
      closeLightBox (e) {
        this.isLightboxActive = false
        e.stopPropagation()
      },       
      constructImages () {
        return {
          desktop: get(this.image, 'desktop.url', get(this.image, 'image.url', '/assets/mirrormedia/notImage.png')),
          tablet: get(this.image, 'tablet.url', get(this.image, 'image.url', '/assets/mirrormedia/notImage.png')),
          mobile: get(this.image, 'mobile.url', get(this.image, 'image.url', '/assets/mirrormedia/notImage.png')),
          tiny: get(this.image, 'tiny.url', get(this.image, 'image.url', '/assets/mirrormedia/notImage.png')),
        }
      },
      get,
      lazyLoad () {
        const lazy_img = document.createElement('img')
        lazy_img.onload = () => {
          debug('virtual img loaded!', Date.now().toString())
          this.isVirtualImgLoaded = true
          this.$refs[ 'lazyImg' ].appendChild(lazy_img)
        }
        lazy_img.setAttribute('alt', this.caption)
        lazy_img.setAttribute('srcset',
          get(this.images, 'mobile') + ' 800w, ' +
          get(this.images, 'tablet') + ' 1200w'
        )
        lazy_img.setAttribute('src', get(this.images, 'tablet'))
      },  
      lazyLoadLightboxImg () {
        const img = new Image()
        img.onload = () => {
          this.$refs[ 'lightboxImg' ].setAttribute('src', img.src)
          this.isLightboxImgLoaded = true
        }
        img.src = get(this.images, 'desktop')
      },
      openLightBox () {
        this.isLightboxActive = true
      }, 
    },
    mounted () {
      this.images = this.constructImages()
      window.addEventListener('scroll', () => {
        if (this.isVirtualImgCheckedOut) { return }
        const deviceHeight = verge.viewportH()
        const currPosMid = currentYPosition() + deviceHeight / 2
        const this_ele = elmYPosition(`.content-image.img-${this.id}`)
        if (this_ele > 0 && currPosMid < this_ele + 500 && currPosMid > this_ele - 500) {
          this.isVirtualImgCheckedOut = true
          this.lazyLoad()
        }
      })
      preventScroll.off()
    },
    props: {
      viewport: {
        type: Number,
      },
      image: {
        type: Object,
      },
    },
    watch: {
      image () {
        debug('Mutation detected: image', this.image)
        this.isVirtualImgLoaded = false
        this.isVirtualImgCheckedOut = false
        this.isLightboxActive = false
        this.isLightboxImgLoaded = false
        const firstChild = this.$refs[ 'lazyImg' ].firstChild
        firstChild && this.$refs[ 'lazyImg' ].removeChild(firstChild)
        this.images = this.constructImages()
        preventScroll.off()
      },
      isLightboxActive () {
        if (this.isLightboxActive) {
          preventScroll.on()
          if (!this.isLightboxImgLoaded) {
            this.lazyLoadLightboxImg()
          }
        } else {
          preventScroll.off()
        }
        debug('Mutation detected: isLightboxActive', this.isLightboxActive)          
      },
    },    
  }
</script>
<style lang="stylus" scoped>
  .lightbox
    justify-content center
    align-items center
    width 100vw
    height 100vh
    background-color rgba(0,0,0,.7)
    position fixed
    top 0
    left 0
    z-index 99999
    box-sizing border-box
    display flex
    justify-content center
    align-items center

    &-img
      max-height 90vh
      max-width 90vw
      z-index 100002
      object-fit contain
      object-position center
      &.loading
        height 20%
        width 20%

    &-close
      background-image url(/assets/mirrormedia/icon/close.png)
      background-size contain
      position absolute
      top 10px
      right 10px
      width 20px
      height 20px
      z-index 100002

      &:hover
        filter brightness(200%)

  .content-image
    clear both
    margin 1.5em 0

    & >>> img 
      width 100%

    .thumbnail
      cursor pointer
    
    .caption 
      font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
      font-size 15px
      line-height 1.7
      letter-spacing 0.3px
      color rgba(0, 0, 0, 0.498039)
      padding-top 10px
      padding-bottom 10px
    
    &.right 
      float right
      width 300px
      margin-left 20px
      border-bottom 2px solid #255577
      margin-bottom 30px
      padding-bottom 10px
    
    &.left 
      float left
      width 300px
      margin-right 20px
      border-bottom 2px solid #255577
      margin-bottom 30px
      padding-bottom 10px
    
    &.center 
      margin-top 20px
      width 100%
  @media (min-width 0px) and (max-width 767px)
    .content-image
      .caption
        text-align justify
</style>