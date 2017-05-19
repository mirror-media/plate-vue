<template>
  <div class="activityNodeSlider">
    <div class="activityNodeSlider__slideshow" :style="{ backgroundImage: 'url(' + getActivityImage() + ')' }">
      <div class="activityNodeSlider__slideshow--imageDescr" v-html="getActivityImageDescr()" />
        <template v-if="nodeSliderContentAmount === 1">
          <div class="activityNodeSlider__slideshow--OnlyOneImage" :style="{ backgroundImage: 'url(' + getNodeSlideshowImage(nodeSliderContent[0]) + ')' }">
            <div class="activityNodeSlider__slideshow--imageDescr" v-html="getNodeSlideshowImageDescr(nodeSliderContent[0])" />
          </div>
        </template>
        <template v-else>
          <app-slider :option="sliderOption" >
            <template scope="props">
              <swiper-slide :is="props.slide" v-for="(o, i) in nodeSliderContent">
                <div class="activityNodeSlider__slideshow--sliderImage" :style="{ backgroundImage: 'url(' + getNodeSlideshowImage(o) + ')' }">
                  <div class="activityNodeSlider__slideshow--imageDescr" v-html="getNodeSlideshowImageDescr(o)" />
                </div>
              </swiper-slide>
            </template>
          </app-slider>
        </template>
    </div>
    <div class="activityNodeSlider__content">
      <activity-nodeContent :node="node" :activeIndex="activeIndex" />
    </div>
  </div>
</template>

<script>

import _ from 'lodash'
import ActivityNodeContent from './ActivityNodeContent.vue'
import Slider from '../Slider.vue'

export default {
  components: {
    'activity-nodeContent': ActivityNodeContent,
    'app-slider': Slider
  },
  props: [ 'node', 'viewport' ],
  data () {
    return {
      activeIndex: 1
    }
  },
  computed: {
    nodeSliderContentAmount () {
      return _.get(this.nodeSliderContent, [ 'length' ])
    },
    nodeSliderContent () {
      return _.filter(_.slice(_.get(this.node, [ 'content', 'apiData' ]), 1, _.get(this.node, [ 'content', 'apiData', 'length' ])), function (o) {
        return o.type !== 'unstyled'
      })
    },
    sliderOption () {
      return {
        initialSlide: 1,
        paginationable: true,
        paginationClickable: true,
        paginationHide: false,
        setNavBtn: false,
        onSlideChangeEnd: (swiper) => {
          this.activeIndex = swiper.activeIndex
        }
      }
    },
    viewportTarget () {
      if (this.viewport < 600) {
        return 'mobile'
      } else if (this.viewport > 600 && this.viewport < 1200) {
        return 'tablet'
      } else {
        return 'desktop'
      }
    }
  },
  methods: {
    getActivityImage () {
      return _.get(this.$store.state, [ 'activities', 'items', '0', 'heroImage', 'image', 'resizedTargets', this.viewportTarget, 'url' ])
    },
    getActivityImageDescr () {
      return _.get(this.$store.state, [ 'activities', 'items', '0', 'heroCaption' ])
    },
    getNodeSlideshowImage (item) {
      return _.get(item, [ 'content', '0', this.viewportTarget, 'url' ])
    },
    getNodeSlideshowImageDescr (item) {
      return _.get(item, [ 'content', '0', 'description' ])
    }
  }
}

</script>

<style lang="stylus" scoped>

.activityNodeSlider
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
      position relative
      width 100%
      height 100%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover
    &--OnlyOneImage
      position absolute
      top 0
      left 0
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
