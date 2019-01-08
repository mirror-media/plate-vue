<template>
  <div :class="[ 'hero-image', `hero-image--${abIndicator.toLowerCase()}` ]">
    <div class="hero-image__info">
      <div class="info-title">
        <div
          v-if="!isAd"
          :style="{ borderLeftColor: get(sectionMap, [ sectionId, 'bgcolor' ]) }"
          class="info-title__category"
          v-text="get(articleData, 'categories.0.title', get(articleData, 'sections.0.title'))">
        </div>
        <h1 v-text="get(articleData, 'title')"></h1>
        <h2 v-if="get(articleData, 'subtitle')" v-text="get(articleData, 'subtitle')"></h2>
      </div>
      <div v-if="heroCaption" class="info-caption" v-text="heroCaption"></div>
    </div>
    <div v-if="heroImage" class="hero-image__image">
      <figure>
        <img v-show="loading" src="/assets/mirrormedia/icon/loading.gif">
        <img
          v-show="!loading"
          id="hero-image"
          :src="images.mobile || heroImage.image.url"
          :srcset="`${images.mobile} 800w, ${images.tablet} 1200w, ${images.desktop} 2000w`"
          :alt="heroCaption">
      </figure>
      <div v-if="heroCaption" class="image-caption" v-text="heroCaption"></div>
      <template v-if="abIndicator === 'B'">
        <div
          v-if="!isAd"
          :style="{ borderLeftColor: get(sectionMap, [ sectionId, 'bgcolor' ]) }"
          class="info-title__category"
          v-text="get(articleData, 'categories.0.title', get(articleData, 'sections.0.title'))">
        </div>
        <h1 v-text="get(articleData, 'title')"></h1>
        <h2 v-if="get(articleData, 'subtitle')" v-text="get(articleData, 'subtitle')"></h2>
      </template>
    </div>
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
    props: [ 'abIndicator', 'articleData', 'heroCaption', 'heroImage', 'sectionId', 'sectionMap', 'isAd' ],
    data () {
      return {
        images: {},
        loading: false
      }
    },
    created () {
      this.images = constructImages(this.heroImage)
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
          heroImage.onload = () => {
            this.loading = false
          }
        }
      }
    },
    methods: {
      get,
    },
  }
</script>
<style lang="stylus" scoped>
  .hero-image
    display flex
    background-color #fff
    &__info
      display none
    &__image
      position relative
      width 100%
      font-size 0
      figure
        margin 0
      img
        width 100%
        object-fit cover
        object-position center center
      .image-caption
        padding 0 50px
        margin-top 5px
        font-size 1rem
        line-height 1.3
    &--b
      .hero-image__image
        .info-title__category
          display none
        > h1, > h2
          display none

@media (max-width: 499px)
  .hero-image
    &__image
      .image-caption
        padding 0 25px

@media (min-width: 768px)
  .hero-image
    &__image
      .image-caption
        padding 0 calc((100% - 645px) / 2)

@media (min-width: 900px)
  .hero-image
    &__image
      .image-caption
        padding 0 calc((100% - 695px) / 2)

@media (min-width: 1200px)
  .hero-image
    max-width 1160px
    margin 0 auto
    &__info
      display flex
      flex-direction column
      width 33.4%
      background-color #989898
      .info-title
        flex 1
        display flex
        flex-direction column
        justify-content center
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
        &__category
          padding-left 10px
          color #000
          font-size 21px
          border-left 7px solid #989898
      .info-caption
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
    &__image
      flex 1
      width 66.6%
      &::after
        content ''
        display block
        width 100%
        padding-top 66.66%
      figure
        position absolute
        top 0 
        left 0 
        bottom 0 
        right 0 
        width 100% 
        height 100%
        overflow hidden
      img
        height 100%
      .image-caption
        display none
    &--b
      width 100%
      .hero-image__info
        display none
      .hero-image__image
        width 100%
        &::after
          content none
        > h1, > h2
          display block
        > h1
          margin 15px 0 25px 0
          color #000
          font-size 2rem
          text-align justify
          line-height 1.5
        > h2
          font-size 1.875rem
        figure
          position static
          width 100%
          height auto
        .image-caption
          display block
          margin-top .5em
          color #6e6e6e
          line-height 1.5
          text-align justify
        .info-title__category
          display block
          margin 30px 0 0 0
          padding-left 10px
          color #000
          font-size 21px
          border-left 7px solid #989898
        
</style>