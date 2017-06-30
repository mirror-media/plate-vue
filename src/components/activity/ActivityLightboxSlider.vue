<template>
  <section class="ActivityLightboxSlider">
    <template v-if="contentStyle === 'image'">
        <img :src="contentImageUrl" />
    </template>
    <template v-if="contentStyle === 'video'">
      <video :poster="contentVideoCover" controls="true" controlsList="nodownload" preload="metadata" playsinline>
        <source :src="contentVideoUrl" :type="contentVideoType">
      </video>
    </template>
  </section>
</template>

<script>

import _ from 'lodash'

export default {
  props: [ 'initialContent', 'viewport' ],
  computed: {
    content () {
      return this.initialContent
    },
    contentStyle () {
      return _.get(this.content, [ 'type' ])
    },
    contentImageUrl () {
      if (this.windowViewport < 600) {
        return _.get(this.content, [ 'content', '0', 'mobile', 'url' ])
      } else {
        return _.get(this.content, [ 'content', '0', 'desktop', 'url' ])
      }
    },
    contentVideoCover () {
      return _.get(this.content, [ 'content', '0', 'coverPhoto', 'desktop', 'url' ])
    },
    contentVideoType () {
      return _.get(this.content, [ 'content', '0', 'filetype' ])
    },
    contentVideoUrl () {
      return _.get(this.content, [ 'content', '0', 'url' ])
    },
    windowViewport () {
      return this.viewport
    }
  }
}

</script>

<style lang="stylus" scoped>

.ActivityLightboxSlider
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  opacity 0
  animation fadeOut 0.5s ease-out
  img
    width 100%
    height 100%
    object-fit cover
    object-position 50% 50%
  video
    position relative
    width 100%
    height 100%
  video::-webkit-media-controls-enclosure
    height 30px
  video::-webkit-media-controls-panel-background
    height 30px
  video::-webkit-media-controls-panel
    position absolute
    bottom 0
    width 100%
    height 30px
    background-color rgba(255,255,255, .7)
  video::-webkit-media-controls-current-time-display
    display flex !important
    font-size 12px
  video::-webkit-media-controls-time-remaining-display
    display flex !important
    font-size 12px
  video::-webkit-media-controls-volume-slider
    display none
  &.active
    opacity 1
    animation fadeIn 0.5s ease-out
  &.unactive
    z-index -1

@keyframes fadeIn
  from
    opacity 0
  to
    opacity 1

@keyframes fadeOut
  from
    opacity 1
  to
    opacity 0

</style>
