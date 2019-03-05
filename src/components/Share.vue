<template>
  <div class="share" :class="direction"
    :style="[isTimeline ? { display: 'block' } : {}, { top: `${top}`, right: `${right}`, bottom: `${bottom}`, left: `${left}` } ]">
    <a class="share__icon share--toggle" @click="toggleShare()" :style="{ backgroundColor: `${color}` }" ><img :src="isOpen ? '/assets/mirrormedia/icon/close_white.png' : '/assets/mirrormedia/icon/share-white.png'" :alt="isOpen ? '關閉' : '開啟'"></a>
    <a id="share-line" class="share__icon share__icon--list share--line" :class="[isOpen ? 'open' : '']" @click="shareLine"><img src="/assets/mirrormedia/icon/line_white_v2.png" alt="Line"></a>
    <a id="share-fb" class="share__icon share__icon--list share--fb" :class="[isOpen ? 'open' : '']" @click="shareFacebook"><img src="/assets/mirrormedia/icon/facebook_white.png" alt="Facebook"></a>
  </div>
</template>

<script>

import { TOPIC_PROTEST_ID } from '../constants/index'
import { shareLine, shareFacebook } from '../util/comm'
import _ from 'lodash'

export default {
  name: 'share',
  props: {
    direction: {
      type: String,
      default: 'top'
    },
    top: {
      default: 'auto'
    },
    right: {
      default: 'auto'
    },
    bottom: {
      default: 'auto'
    },
    left: {
      default: 'auto'
    },
    color: {
      default: '#356d9c'
    },
    sharePath: {
      type: String
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    isTimeline () {
      return _.get(this.$store.state, [ 'route', 'params', 'topicId' ]) === TOPIC_PROTEST_ID
    },
    link () {
      return _.get(this, [ 'sharePath' ], this.$store.state.route.path)
    }
  },
  methods: {
    shareLine () {
      shareLine({
        route: this.link,
        title: document.querySelector('meta[property="og:title"]').getAttribute('content')
      })
    },
    shareFacebook () {
      shareFacebook({ route: this.link })
    },
    toggleShare () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="stylus" scoped>

.share
  display none
  position fixed
  z-index 500
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

  &--line
    z-index 400
    background-color #00c300
    &.open
      transition-duration .19s
      
  &--fb
    z-index 400
    background-color #3b5998
    &.open
      transition-duration .19s
      
  &--google
    z-index 400
    background-color #dd4b39
    &.open
      transition-duration .19s
      
    > img
      width 20px
      height auto
.activity
    &__share
      display block
      z-index 999

.share
  &.top
    .share--line
      &.open
        transform translate3d(0,-100px,0)
    .share--fb
      &.open
        transform translate3d(0,-50px,0)
    .share--google
      &.open
        transform translate3d(0,-50px,0)
  &.right
    .share--line
      &.open
        transform translate3d(100px,0,0)
    .share--fb
      &.open
        transform translate3d(50px,0,0)
    .share--google
      &.open
        transform translate3d(50px,0,0)      
  &.bottom
    .share--line
      &.open
        transform translate3d(0,100px,0)
    .share--fb
      &.open
        transform translate3d(0,50px,0)
    .share--google
      &.open
        transform translate3d(0,50px,0)
  &.left
    .share--line
      &.open
        transform translate3d(-100px,0,0)
    .share--fb
      &.open
        transform translate3d(-50px,0,0)
    .share--google
      &.open
        transform translate3d(-50px,0,0)
@media (min-width 600px)
  .share
    display block

@media only screen and (max-width: 736px) and (orientation: landscape)
  .activity
    &__share
      display none

</style>
