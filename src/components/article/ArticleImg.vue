<template>
  <div class="content-image" :class="`img-${id}`">
    <span class="thumbnail" v-show="!isVirtualImgLoaded"><img src="/public/icon/loading.gif" :alt="caption"></span>
    <span class="thumbnail" v-show="isVirtualImgLoaded" ref="lazyImg"></span>
    <div class="caption" v-text="caption"></div>
  </div>
</template>
<script>
  import verge from 'verge'
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  import { get, } from 'lodash'
  
  const debug = require('debug')('CLIENT:ArticleImg')
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
        isVirtualImgLoaded: false,
        isVirtualImgCheckedOut: false,
      }
    },
    methods: {
      constructImages () {
        return {
          desktop: get(this.image, 'desktop.url', get(this.image, 'image.url', '/public/notImage.png')),
          tablet: get(this.image, 'tablet.url', get(this.image, 'image.url', '/public/notImage.png')),
          mobile: get(this.image, 'mobile.url', get(this.image, 'image.url', '/public/notImage.png')),
          tiny: get(this.image, 'tiny.url', get(this.image, 'image.url', '/public/notImage.png')),
        }
      },
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
          get(this.images, 'tablet') + ' 1200w, ' +
          get(this.images, 'desktop') + ' 2000w'
        )
        lazy_img.setAttribute('src', get(this.images, 'desktop'))
      },    
      get,
    },
    mounted () {
      this.images = this.constructImages()
      window.addEventListener('scroll', () => {
        if (this.isVirtualImgCheckedOut) { return }
        const deviceHeight = verge.viewportH()
        const currPosMid = currentYPosition() + deviceHeight / 2
        const this_ele = elmYPosition(`.content-image.img-${this.id}`)
        if (currPosMid < this_ele + 500 && currPosMid > this_ele - 500) {
          this.isVirtualImgCheckedOut = true
          this.lazyLoad()
        }
      })
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
        const firstChild = this.$refs[ 'lazyImg' ].firstChild
        firstChild && this.$refs[ 'lazyImg' ].removeChild(firstChild)
        this.images = this.constructImages()
        // this.lazyLoad()
      },
    },    
  }
</script>
<style lang="stylus" scoped>
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