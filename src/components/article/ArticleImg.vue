<template>
  <div
    class="content-image"
    :class="`img-${id}`"
    @click="openLightBox"
  >
    <span
      v-show="!isVirtualImgLoaded"
      class="thumbnail"
    ><img
      src="/assets/mirrormedia/icon/loading.gif"
      :alt="caption"
    ></span>
    <span
      v-show="isVirtualImgLoaded"
      ref="lazyImg"
      class="thumbnail"
    />
    <div
      class="caption"
      v-text="caption"
    />
    <div
      v-show="isLightboxActive"
      class="lightbox"
    >
      <div
        class="lightbox-close"
        @click="closeLightBox"
      />
      <img
        ref="lightboxImg"
        class="lightbox-img"
        :class="{ loading: !isLightboxImgLoaded }"
        src="/assets/mirrormedia/icon/loading.gif"
      >
    </div>
  </div>
</template>
<script>
import verge from 'verge'
import preventScroll from 'prevent-scroll'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { get } from 'lodash'
import { sendGaClickEvent } from '../../util/comm'

const debug = require('debug')('CLIENT:ArticleImg')
// const debugLazy = require('debug')('CLIENT:LAZYIMAGE')
export default {
  name: 'ArticleImg',
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      id: Date.now().toString(),
      images: {},
      isLightboxActive: false,
      isLightboxImgLoaded: false,
      isVirtualImgLoaded: false,
      isVirtualImgCheckedOut: false
    }
  },
  computed: {
    caption () {
      return get(this.image, 'description', '')
    }
  },
  watch: {
    image () {
      debug('Mutation detected: image', this.image)
      this.isVirtualImgLoaded = false
      this.isVirtualImgCheckedOut = false
      this.isLightboxActive = false
      this.isLightboxImgLoaded = false
      const firstChild = this.$refs.lazyImg.firstChild
      firstChild && this.$refs.lazyImg.removeChild(firstChild)
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
    }
  },
  mounted () {
    this.images = this.constructImages()
    window.addEventListener('scroll', () => {
      if (this.isVirtualImgCheckedOut) { return }
      const deviceHeight = verge.viewportH()
      const currPosMid = currentYPosition() + deviceHeight / 2
      const thisEle = elmYPosition(`.content-image.img-${this.id}`)
      if (thisEle > 0 && currPosMid < thisEle + 500 && currPosMid > thisEle - 500) {
        this.isVirtualImgCheckedOut = true
        this.lazyLoad()
      }
    })
    preventScroll.off()
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
        tiny: get(this.image, 'tiny.url', get(this.image, 'image.url', '/assets/mirrormedia/notImage.png'))
      }
    },
    get,
    lazyLoad () {
      const lazyImg = document.createElement('img')
      lazyImg.onload = () => {
        debug('virtual img loaded!', Date.now().toString())
        this.isVirtualImgLoaded = true
        this.$refs.lazyImg.appendChild(lazyImg)
      }
      lazyImg.setAttribute('alt', this.caption)
      lazyImg.setAttribute('srcset',
        get(this.images, 'mobile') + ' 800w, ' +
          get(this.images, 'tablet') + ' 1200w'
      )
      lazyImg.setAttribute('src', get(this.images, 'tablet'))
    },
    lazyLoadLightboxImg () {
      const img = new Image()
      img.onload = () => {
        this.$refs.lightboxImg.setAttribute('src', img.src)
        this.isLightboxImgLoaded = true
      }
      img.src = get(this.images, 'desktop')
    },
    openLightBox () {
      this.isLightboxActive = true
      sendGaClickEvent('article', 'image')
    }
  }
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
