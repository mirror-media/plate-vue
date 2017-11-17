<template>
  <div class="ad-cover" v-if="switcher">
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
  export default {
    computed: {
      displayBtnClose () {
        return this.showCloseBtn !== undefined ? this.showCloseBtn : true
      }
    },
    data () {
      return {
        switcher: true
      }
    },
    name: 'dfp-ad-cover',
    methods: {
      closeCover () {
        this.switcher = false
      }
    },
    mounted () {},
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
            background-image url(/public/icon/close_white.png)
            background-repeat no-repeat
            background-size contain
            background-position center center
            cursor pointer   
            border 2px solid rgba(255, 255, 255, 0.7)
            background-color rgba(0, 0, 0, 0.3)
            box-shadow 0 0 10px rgba(0, 0, 0, 0.4)
</style>
