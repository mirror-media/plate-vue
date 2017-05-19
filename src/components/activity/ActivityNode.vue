<template>
  <section class="activityNode">
    <div class="activityNode-nodeContainer">
      <activity-nodeSlider :id="`node-${index}`" :node="item" :viewport="viewport" v-for="(item, index) in nodes" />
    </div>
  </section>
</template>

<script>

import { elmYPosition, smoothScroll } from 'kc-scroll'
import _ from 'lodash'
import ActivityNodeContent from './ActivityNodeContent.vue'
import ActivityNodeSlider from './ActivityNodeSlider.vue'
import Slider from '../Slider.vue'

export default {
  components: {
    'activity-nodeContent': ActivityNodeContent,
    'activity-nodeSlider': ActivityNodeSlider,
    'app-slider': Slider
  },
  props: [ 'currentIndex', 'nodes', 'viewport' ],
  data () {
    return {
      hasToFeature: false,
      isScrolling: false,
      sliderId: 'a' + Date.now(),
      slideIndex: 0
    }
  },
  computed: {
    nodeAmount () {
      return _.get(this.nodes, [ 'length' ])
    }
  },
  methods: {
    elmYPosition,
    getActivityImage () {
      let viewportTarget
      if (this.viewport < 600) {
        viewportTarget = 'mobile'
      } else if (this.viewport > 600 && this.viewport < 1200) {
        viewportTarget = 'tablet'
      } else {
        viewportTarget = 'desktop'
      }
      return _.get(this.$store.state, [ 'activities', 'items', '0', 'heroImage', 'image', 'resizedTargets', viewportTarget, 'url' ])
    },
    getActivityImageDescr () {
      return _.get(this.$store.state, [ 'activities', 'items', '0', 'heroCaption' ])
    },
    getNodeImage (node) {
      let viewportTarget
      if (this.viewport < 600) {
        viewportTarget = 'mobile'
      } else if (this.viewport > 600 && this.viewport < 1200) {
        viewportTarget = 'tablet'
      } else {
        viewportTarget = 'desktop'
      }
      return _.get(node, [ 'content', '0', viewportTarget, 'url' ])
    },
    getNodeSliderContent (node) {
      return _.filter(_.slice(_.get(node, [ 'content', 'apiData' ]), 1, _.get(node, [ 'content', 'apiData', 'length' ])), function (o) {
        return o.type !== 'unstyled'
      })
    },
    smoothScroll
  },
  mounted () {

  },
  watch: {
  }
}

</script>

<style lang="stylus" scoped>

.activityNode
  // width 100%
  // height 100%
  padding 20px 0
  // overflow hidden
  &-nodeContainer
    // width 100%
    // height 100%
    // overflow scroll
  &__node
    display flex
    flex-direction column
    width 100%
    height calc(100vh - 70px)
  &__slideshow
    position relative
    width 100%
    padding-top 56.25%
    background-color #000
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover
    overflow hidden
    &--imageDescr
      position absolute
      left 4.5px
      bottom 5px
      color #fff
      font-size 8px
      font-weight 300
    &--sliderImage
      width 100%
      height 100%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover
  &__content
    width 100%
    height calc(100% - (100vw / 16 * 9))
    padding 0 15px
  

  .swiper-container
    position absolute
    top 0
    left 0
    width 100%
    height 100%
</style>
