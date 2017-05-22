<template>
  <section class="timelineHeadline">
    <div class="timelineHeadline__heroImage" :style="{ backgroundImage: 'url(' + getImage(this.topic, this.viewportTarget) + ')' }">
      <div class="timelineHeadline__heroImage--title"></div>
    </div>
  </section>
</template>

<script>

import { getImage } from '../../utils/comm'
import _ from 'lodash'

export default {
  props: [ 'timeline', 'viewport', 'viewportTarget' ],
  data () {
    return {
      topic: _.get(this.timeline, [ 'topic' ])
    }
  },
  methods: {
    getImage
  }
}
</script>

<style lang="stylus" scoped>
.timelineHeadline
  position fixed
  z-index -1
  width 100vw
  height 100vh
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
    &--title
      position absolute
      background-repeat no-repeat
      background-size contain

</style>
