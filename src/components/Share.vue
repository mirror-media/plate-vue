<template>
  <div class="share">
    <a class="share__icon share--toggle" @click="toggleShare()"><img :src="isOpen ? '/public/icon/close_white.png' : '/public/icon/share-white.png'"></a>
    <a class="share__icon share__icon--list share--line" :class="[isOpen ? 'open' : '']" @click="shareLine"><img src="/public/icon/line_white_v2.png"></a>
    <a class="share__icon share__icon--list share--fb" :class="[isOpen ? 'open' : '']" @click="shareFacebook"><img src="/public/icon/facebook_white.png"></a>
    <a class="share__icon share__icon--list share--google" :class="[isOpen ? 'open' : '']" @click="shareGooglePlus"><img src="/public/icon/google-plus.png"></a>
  </div>
</template>

<script>

import { shareGooglePlus, shareLine, shareFacebook } from '../utils/comm'

export default {
  name: 'share',
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    shareGooglePlus() {
      shareGooglePlus({ route: this.$route.path })
    },
    shareLine() {
      shareLine({ 
        route: this.$route.path,
        title: document.querySelector('meta[property="og:title"]').getAttribute('content')
      })
    },
    shareFacebook() {
      shareFacebook({ route: this.$route.path })
    },
    toggleShare() {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="stylus" scoped>

.share
  position fixed
  right 20px
  bottom 20px
  width 40px
  height 40px
  &__icon
    display flex
    justify-content center
    align-items center
    position absolute
    top 0
    left 0
    width 38px
    height 38px
    border-radius 19px
    font-size 0
    transition transform .2s ease-out
    > img
      width auto
      height 20px
    &--list
      top 1px
      left 1px

  &--toggle
    width 40px
    height 40px
    border-radius 20px
    z-index 500
    background-color #356d9c

  &--line
    z-index 400
    background-color #00c300
    &.open
      transition-duration .19s
      transform translate3d(0,-150px,0)
  &--fb
    z-index 400
    background-color #3b5998
    &.open
      transition-duration .19s
      transform translate3d(0,-100px,0)
  &--google
    z-index 400
    background-color #dd4b39
    &.open
      transition-duration .19s
      transform translate3d(0,-50px,0)
    > img
      width 20px
      height auto

@media (min-width 1200px)
  .share
    display none

</style>
