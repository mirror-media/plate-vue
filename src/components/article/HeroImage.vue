<template>
  <div class="hero-image">
    <figure v-if="heroImage" >
      <img v-show="loading" :src="get(heroImage, 'image.resizedTargets.tiny.url', '/assets/mirrormedia/icon/loading.gif')">
      <img
        v-show="!loading"
        id="hero-image"
        :src="images.mobile || heroImage.image.url"
        :srcset="`${images.mobile} 800w, ${images.tablet} 1200w`"
        :alt="heroCaption">
      <figcaption v-text="heroCaption"></figcaption>
    </figure>
  </div>
</template>
<script>
  import { get } from 'lodash'
  const debug = require('debug')('CLIENT:HeroImage')
  
  const constructImages = (heroImage) => {
    return {
      desktop: get(heroImage, 'image.resizedTargets.desktop.url', get(heroImage, 'image.url', '/assets/mirrormedia/notImage.png')),
      tablet: get(heroImage, 'image.resizedTargets.tablet.url', get(heroImage, 'image.url', '/assets/mirrormedia/notImage.png')),
      mobile: get(heroImage, 'image.resizedTargets.mobile.url', get(heroImage, 'image.url', '/assets/mirrormedia/notImage.png')),
      tiny: get(heroImage, 'image.resizedTargets.tiny.url', get(heroImage, 'image.url', '/assets/mirrormedia/notImage.png')),
    } 
  }

  export default {
    name: 'HeroImage',
    props: [ 'heroCaption', 'heroImage', ],
    data () {
      return {
        images: {},
        loading: false
      }
    },
    methods: {
      get,
    },
    watch: {
      '$route.fullPath' () {
        this.loading = true
      },
      heroImage (value) {
        debug('Mutation detected: heroImage', value)
        this.images = constructImages(value)
      },
      images () {
        if (this.loading) {
          const heroImage = document.querySelector('#hero-image')
          heroImage.onload = () => { this.loading = false }
        }
      }
    },
    created () {
      this.images = constructImages(this.heroImage)
    },
  }
</script>
<style lang="stylus" scoped>
  .hero-image
    position relative
    left -25px
    width calc(100% + 50px)
    background-color #fff
    figure
      margin 0
      font-size 0
      img
        width 100%
        object-fit cover
        object-position center center
      figcaption
        padding 0 25px
        margin-top 5px
        font-size 1rem
        line-height 1.3
        text-align justify

@media (min-width: 500px)
  .hero-image
    width calc(100% + 100px)
    left -50px
    figure
      figcaption
        padding 0 50px

@media (min-width: 768px)
  .hero-image
    position static
    width 100%
    figure
      figcaption
        padding 0 calc((100% - 645px) / 2)

@media (min-width: 900px)
  .hero-image
    figure
      figcaption
        padding 0 calc((100% - 695px) / 2)

@media (min-width: 1200px)
  .hero-image
    figure
      width 100% 
      height auto
      overflow hidden
    figcaption
      margin-top .5em
      // .image-caption
      //   display block
      //   margin-top .5em
      //   color #6e6e6e
      //   line-height 1.5
      //   text-align justify
      // .info-title__category
      //   display block
      //   margin 30px 0 0 0
      //   padding-left 10px
      //   color #000
      //   font-size 21px
      //   border-left 7px solid #989898
</style>
