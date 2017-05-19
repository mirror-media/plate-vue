<template>
  <section class="timelineHeadline">
    <div :style="{ backgroundImage: 'url(' + getImage(this.timeline.topic, imageSet(this.viewport)) + ')' }" class="timelineHeadline__heroImage">
      <div class="timelineHeadline__heroImage__title"></div>
    </div>
  </section>
</template>

<script>
import { getValue, getImage } from '../../utils/comm'
import _ from 'lodash'

export default {
  props:[ 'timeline', 'viewport' ],
  methods: {
    getValue,
    getImage,
    imageSet (viewport) {
      if (viewport < 800) {
        return 'mobile'
      } else if (viewport > 800 && viewport < 1200) {
        return 'tablet'
      } else if (viewport > 1200) {
        return 'desktop'
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
.timelineHeadline
  position absolute
  width 100vw
  height 100vh
  // background-color #000
  &__heroImage
    width 100%
    height 100%
    background-repeat no-repeat
    background-size cover
    background-position center
    margin 0
    display flex
    justify-content center
    align-items center
    &__title
      background-image url(https://storage.googleapis.com/mirrormedia-files/assets/images/20170519175046-eab65fa6f82e7b905d5d63f4e1a9f729.png)
      background-repeat no-repeat
      background-size contain
      width 90%
      height 30%

@media (min-width: 900px)
  .timelineHeadline
    position absolute
    width 100vw
    height 100vh
    // background-color #000
    &__heroImage
      width 100%
      height 100%
      background-repeat no-repeat
      background-size 100% 100%  
      margin 0
      display flex
      justify-content center
      align-items center
      &__title
        background-image url(https://storage.googleapis.com/mirrormedia-files/assets/images/20170519175046-eab65fa6f82e7b905d5d63f4e1a9f729.png)
        background-repeat no-repeat
        background-size contain
        width 35%
        height 35%
        // position absolute
        // top 20vh



</style>
