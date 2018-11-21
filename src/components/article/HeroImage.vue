<template>
  <div class="heroimage-container">
    <template v-if="viewport > 1199">
      <div class="hero-info">
        <div class="hero-info-category-container">
          <div class="hero-info-category"
            v-if="!isAd"
            v-text="get(articleData, [ 'categories', 0, 'title' ], get(articleData, [ 'sections', 0, 'title' ], ''))"
            :style="{ borderLeftColor: get(sectionMap, [ sectionId, 'bgcolor' ]) }"></div>
          <h1 v-text="get(articleData, [ 'title' ])"></h1>
          <h2 v-if="get(articleData, [ 'subtitle' ])" v-text="get(articleData, [ 'subtitle' ])"></h2>
        </div>
        <div class="hero-info-heroCaption" v-text="heroCaption"></div>
      </div>
      <div v-if="heroImage && heroImage.image" class="hero-img">
        <span class="img" v-show="!isVirtualImgLoaded"><img src="/assets/mirrormedia/icon/loading.gif" :alt="heroCaption"></span>
        <span class="img" v-show="isVirtualImgLoaded" ref="lazyImg"></span>
      </div>
    </template>
    <template v-else-if="viewport">
      <span class="heroimg" v-show="!isVirtualImgLoaded"><img src="/assets/mirrormedia/icon/loading.gif" :alt="heroCaption"></span>
      <span class="heroimg" v-show="isVirtualImgLoaded" ref="lazyImg"></span>
      <div class="heroimg-caption" v-text="heroCaption" v-show="heroCaption && heroCaption.length > 0"></div>
    </template>
  </div>
</template>
<script>
  import { get } from 'lodash'
  const debug = require('debug')('CLIENT:HeroImage')
  export default {
    name: 'HeroImage',
    data () {
      return {
        images: {},
        isVirtualImgLoaded: false,
      }
    },
    methods: {
      constructImages () {
        return {
          desktop: get(this.heroImage, 'image.resizedTargets.desktop.url', get(this.heroImage, 'image.url', '/assets/mirrormedia/notImage.png')),
          tablet: get(this.heroImage, 'image.resizedTargets.tablet.url', get(this.heroImage, 'image.url', '/assets/mirrormedia/notImage.png')),
          mobile: get(this.heroImage, 'image.resizedTargets.mobile.url', get(this.heroImage, 'image.url', '/assets/mirrormedia/notImage.png')),
          tiny: get(this.heroImage, 'image.resizedTargets.tiny.url', get(this.heroImage, 'image.url', '/assets/mirrormedia/notImage.png')),
        }
      },
      lazyLoad () {
        const lazy_img = document.createElement('img')
        lazy_img.onload = () => {
          debug('virtual img loaded!')
          while (this.$refs[ 'lazyImg' ].hasChildNodes()) {
            this.$refs[ 'lazyImg' ].removeChild(this.$refs[ 'lazyImg' ].lastChild)
          }
          this.isVirtualImgLoaded = true
          this.$refs[ 'lazyImg' ].appendChild(lazy_img)
        }
        lazy_img.setAttribute('alt', this.heroCaption)
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
      this.lazyLoad()
    },
    props: [ 'abIndicator', 'articleData', 'heroCaption', 'heroImage', 'sectionId', 'sectionMap', 'viewport', 'isAd' ],
    watch: {
      heroImage () {
        debug('Mutation detected: heroImage', this.heroImage)
        this.isVirtualImgLoaded = false
        const firstChild = this.$refs[ 'lazyImg' ].firstChild
        firstChild && this.$refs[ 'lazyImg' ].removeChild(firstChild)
        this.images = this.constructImages()
        this.lazyLoad()
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .heroimage-container
    margin 0 auto
    background-color #fff
    max-width 1160px
    position relative
    display flex
    justify-content space-between
  .hero-info
    display flex 
    flex-direction column
    justify-content space-between 
    width 33.34%
    background-color #989898
  .hero-info-category-container
    display flex
    flex-direction column
    justify-content center
    height 100%
    padding 0 10%
    > h1 
      margin-top 10px
      color #fff 
      font-size 40px 
      font-weight 400 
      line-height 1.3 
      text-align justify
    > h2
      margin 0
      color #fff 
      font-size 30px 
      font-weight 300 
      line-height 1.3 
      text-align justify
  .hero-info-category 
    width 80% 
    padding-left 10px 
    color #000 
    font-size 21px 
    border-left 7px solid #989898 
  .hero-info-heroCaption 
    position relative 
    padding 10px 10% 
    color #fff 
    font-weight 300 
    line-height 1.4 
    border-top 3px solid #fff 
    &::after 
      content '' 
      position absolute 
      top -9px 
      right -7.5px 
      z-index 1 
      width 15px 
      height 15px 
      background-color #fff 
      border-radius 50% 
  .hero-img 
    position relative 
    width 66.66% 
    &::after 
      content '' 
      display block 
      width 100% 
      padding-top 66.66%
    .img 
      position absolute 
      top 0 
      left 0 
      bottom 0 
      right 0 
      width 100% 
      height 100% 
      & >>> img
        width 100% 
        height 100% 
        object-fit cover 
        object-position 50% 50% 
  @media (max-width: 1200px)
    .heroimg
      display block
      & >>> img
        width 100%
    .heroimage-container
      display block
    .heroimg-caption
      padding 5px 25px 0
      line-height 1.3rem
</style>