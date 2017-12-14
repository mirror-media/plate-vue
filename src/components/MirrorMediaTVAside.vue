<template>
  <div class="mmtv-aside">
    <div class="mmtv-aside--title"><h2 v-text="mmtvTitle"></h2></div>
    <div class="mmtv-aside--curtain" @click="toggleLightbox"></div>
    <div class="mmtv-aside--container" :class="containerClass" v-html="mediaDataEmbed" ref="embed-code" @click="toggleLightbox"></div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { MM_TV_CH } from '../constants/'
  export default {
    computed: {
      containerClass () {
        return {
          lightbox: this.showAsLightbox
        }
      },
      mediaDataEmbed () {
        return _.get(this.mediaData, [ 'embed' ])
      }
    },
    data () {
      return {
        isGaEventSentYet: false,
        showAsLightbox: false,
        mmtvTitle: MM_TV_CH
      }
    },
    name: 'mmtv-aside',
    methods: {
      toggleLightbox () {
        this.showAsLightbox = !this.showAsLightbox
        !this.isGaEventSentYet && window.ga && window.ga('send', 'event', 'homemod', 'click', 'fix play', {
          location: document.location.href,
          nonInteraction: false
        })
        this.isGaEventSentYet = true
      }
    },
    mounted () {},
    props: [ 'mediaData' ]
  }
</script>
<style lang="stylus">
  .mmtv-aside
    position relative
    width 90%
    margin 10px auto 0
    &--title
      h2
        font-size 1.5rem
        color #356d9c
        font-weight 400
        overflow hidden
        margin-bottom 10px

        &::after
          content ""
          display inline-block
          height .5em
          vertical-align middle
          width 100%
          margin-right -100%
          margin-left 10px
          border-top 5px solid #356d9c
    &--curtain
      position absolute
      z-index 9
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      cursor pointer
    &--container
      position relative
      width 100%
      padding-top 66.67%
      background-color rgba(0, 0, 0, .7)
      overflow hidden
      cursor pointer
      margin-bottom 40px

      &.lightbox
        position fixed
        top 0
        left 0
        width 100vw
        height 100vh
        padding-top 0
        display flex
        justify-content center
        align-items center
        z-index 1000
        cursor default
        iframe
          width 100%
          height calc(100vw / 16 * 9)
          max-width 1024px
          max-height 576px
          position relative

      > iframe
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        cursor pointer
        transition all 0.2s ease-out

  @media (min-width: 600px)
    .mmtv-aside
      width 100%
      &--title
        width 100%
        color #356d9c
        margin-top 35px
        margin-bottom 10px

        h2
          font-size 1.5rem
          color #356d9c

          &::after
            content ""
            display inline-block
            height .5em
            vertical-align middle
            width 100%
            margin-right -100%
            margin-left 10px
            border-top 5px solid #356d9c

  @media (min-width: 1200px)
    .mmtv-aside
      margin-top 0
      &--title
        margin-top 0
        padding 0
        h2
          margin 0 auto
          font-size 1.3rem
          &::after
            display none
      &--container
        margin-bottom 30px

</style>