<template>
  <div
    v-if="showLiveStream"
    ref="pop"
    class="liveStream"
  >
    <div
      v-show="!hasZoomIn"
      class="liveStream__curtain"
      @click="toggleZoomIn()"
    />
    <div
      class="liveStream-container"
      :class="{ zoomIn: hasZoomIn }"
      @click="toggleZoomIn()"
      v-html="mediaDataEmbed"
    />
    <img
      v-show="!hasZoomIn"
      class="liveStream__close"
      src="/assets/mirrormedia/icon/close-btn.png"
      alt="關閉"
      @click="closeLiveStream()"
    >
    <span
      v-show="!hasZoomIn"
      v-if="type === 'live'"
      class="liveStream__prompt"
    >LIVE</span>
  </div>
</template>

<script>

import _ from 'lodash'
import Cookie from 'vue-cookie'
import { sendGaClickEvent } from '../util/comm'

export default {
  name: 'LiveStream',
  props: {
    mediaData: {
      required: true
    },
    type: {
      default: () => ('live')
    }
  },
  data () {
    return {
      hasZoomIn: false,
      isGaCloseEventSentYet: false,
      isGaPlayEventSentYet: false,
      showLiveStream: true
    }
  },
  computed: {
    mediaDataEmbed () {
      return _.get(this.mediaData, ['embed'])
    }
  },
  mounted () {
    const cookie = Cookie.get('liveStreamClosed')
    if (cookie) {
      this.showLiveStream = !cookie
    }
  },
  methods: {
    closeLiveStream () {
      Cookie.set('liveStreamClosed', 'true', { expires: '10m' })
      this.showLiveStream = false
      this.sendGaClickEvent('close')
    },
    sendGaClickEvent (action) {
      if (this.$route.path === '/') {
        sendGaClickEvent('home', `${this.type} ${action}`)
      } else if (this.$route.path.match(/\/story\//)) {
        sendGaClickEvent('article', `${this.type} ${action}`)
      } else {
        sendGaClickEvent('listing', `${this.type} ${action}`)
      }
    },
    toggleZoomIn () {
      this.hasZoomIn = !this.hasZoomIn
      this.hasZoomIn ? this.sendGaClickEvent('open') : this.sendGaClickEvent('close')
    }
  }
}

</script>

<style lang="stylus">

.liveStream
  position fixed
  bottom 10px
  right 10px
  z-index 999
  width calc(50% - 10px)
  &__curtain
    position absolute
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    width 100%
    height 100%
    cursor pointer
  &-container
    position relative
    width 100%
    padding-top 56.25%
    background-color rgba(0, 0, 0, .7)
    overflow hidden
    cursor pointer
    iframe
      position absolute
      top 0
      left 50%
      bottom 0
      right 0
      width 100%
      height calc(100vw / 16 * 9)
      transform translateX(-50%)
      transition transform .2s ease-out
    &.zoomIn
      position fixed
      top 0
      left 0
      width 100vw
      height 100vh
      padding-top 0
      iframe
        top 50%
        transform translate(-50%, -50%)
      iframe:fullscreen
        top auto
        transform none
  &__close
    position absolute
    z-index 150
    top -10px
    right -10px
    width 25px
    cursor pointer
  &__prompt
    position absolute
    top 5px
    left 5px
    padding 2px
    color red
    font-size 10px
    border 1px solid red

@media (min-width: 600px)
  .liveStream
    &__prompt
      font-size 16px

@media (min-width: 1200px)
  .liveStream
    width 25%
    &-container
      iframe
        height 100%
      &.zoomIn
        background-color rgba(0, 0, 0, .7)
        iframe
          width 1024px
          height 576px
</style>
