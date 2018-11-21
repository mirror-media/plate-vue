<template>
  <div class="ad-cover" :class="{ transparent: !showDefaultSet, }" v-if="switcher">
    <div class="ad-cover--wrapper">
      <slot name="ad-cover">
      </slot>
      <div class="ad-cover--wrapper_close" @click="closeCover" v-if="displayBtnClose">
        <div class="icon"></div>
      </div>
    </div>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:DfpCover')
  export default {
    name: 'DfpCover',
    computed: {
      displayBtnClose () {
        return this.showCloseBtn !== undefined ? this.showCloseBtn : true
      }
    },
    data () {
      return {
        showDefaultSet: true,
        switcher: true,
      }
    },
    methods: {
      closeCover () {
        this.switcher = false
      },
      setupCloseEventListener () {
        const handler = () => {
          debug('GOT EVENT!!!')
          this.showDefaultSet = false
        }
        return new Promise(resolve => {
          debug('SETUP setupCloseEventListener!!!')
          window.addEventListener('hidedefaultset', handler)
          window.parent.addEventListener('hidedefaultset', handler)
          resolve()
        })
      }
    },
    mounted () {
      this.setupCloseEventListener()
    },
    props: [ 'showCloseBtn' ]
  }
</script>
<style lang="stylus" scoped>
  .ad-cover
    &:not(.raw)
      position fixed
      top 0
      left 0
      width 100vw
      height 100vh
      z-index 9997
      background-color rgba(0, 0, 0, 0.7)
      display flex
      justify-content center
      align-items center

      &.transparent
        background-color transparent
        .ad-cover--wrapper_close
          display none

      .ad-cover--wrapper
        position relative
        width 320px
        height 480px

        &_close
          position absolute
          top 0
          right 0
          width 42px
          height 42px
          padding 5px
          > .icon
            width 32px
            height 32px
            background-image url(/assets/mirrormedia/icon/close_white.png)
            background-repeat no-repeat
            background-size contain
            background-position center center
            cursor pointer   
            border 2px solid rgba(255, 255, 255, 0.7)
            background-color rgba(0, 0, 0, 0.3)
            box-shadow 0 0 10px rgba(0, 0, 0, 0.4)
</style>
