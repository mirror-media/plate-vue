<template>
  <section class="activityNode">
    <div class="activityNode-nodeContainer" :style="nodeContainerStyle">
      <activity-nodeSlider :id="`node-${index}`" :currentIndex="currentIndex"
                :index="index" :node="item" :viewport="viewport" v-for="(item, index) in nodes" 
                :windowHeight="windowHeight" />
    </div>
  </section>
</template>

<script>

import { elmYPosition, smoothScroll, OnePageScroller } from 'kc-scroll'
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
  props: [ 'currentIndex', 'nodes', 'targNodeTopY', 'viewport' ],
  data () {
    return {
      hasToFeature: false,
      isScrolling: false,
      sliderId: 'a' + Date.now(),
      slideIndex: 0,
      windowHeight: 0,
      nodeSliderStyle: '',
      onePageScroll: (new OnePageScroller())
    }
  },
  computed: {
    activityCurrNodeStyle () {
      return this.currentIndex * 100
    },
    nodeAmount () {
      return _.get(this.nodes, [ 'length' ])
    },
    nodeContainerStyle () {
      if (this.viewport > 899) {
        return `width: ${(this.nodes.length * 100)}vw;`
      } else if (this.windowHeight < this.viewport) {
        // return `height: calc((100vh - 60px) * ${this.nodeAmount} + 30px); `
        // return `top: ${this.targNodeTopY}px;`
        return ''
      } else {
        // return `top: ${this.targNodeTopY}px;`
        return ''
      }
    }
  },
  methods: {
    changeCurrentIndex (index) {
      this.$emit('changeCurrIdx', index)
    },
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
    smoothScroll,
    updateWindowHeight () {
      if (process.env.VUE_ENV === 'client') {
        // this.windowHeight = document.querySelector('body').offsetHeight
        this.windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      }
    }
  },
  mounted () {
    this.updateWindowHeight()
    window.addEventListener('resize', () => {
      this.updateWindowHeight()
    })
    window.addEventListener('load', () => {
      if (this.viewport < 900) {
        this.onePageScroll.init('.activityNode', {
          pageContainer: '.activityNodeSlider',
          defaultInitialPage: this.currentIndex > -1 ? (this.currentIndex + 1) : 0,
          afterMove: (index, next_el) => {
            if (this.onePageScroll.initializedFlag === true) {
              this.changeCurrentIndex(index)
            }
          }
        })
      }
    })
  },
  watch: {
    currentIndex: function () {
      if (process.env.VUE_ENV === 'client' && this.onePageScroll.initializedFlag === true && this.viewport < 900) {
        this.onePageScroll.moveTo(this.currentIndex)
      }
    }
  }
}

</script>

<style lang="stylus" scoped>

.activityNode
  // width 100%
  height 100vh
  // padding 30px 0
  // overflow hidden
  &-nodeContainer
    // width 100%
    // height 100%
    // overflow scroll
    position relative
    // transition top 1s ease   
    display flex
    flex-direction  column
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

@media only screen and (max-width: 736px) and (orientation: landscape)
  .activityNode
    padding 0

@media only screen and (min-width: 900px)
  .activityNode
    padding 0
    &-nodeContainer
      position static
      display block

.swiper-container
  position absolute
  top 0
  left 0
  width 100%
  height 100%

</style>
