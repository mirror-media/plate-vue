<template>
  <div class="activityNodeSlider">
    <div class="activityNodeSlider__slideshow" :style="{ backgroundImage: 'url(' + getActivityImage() + ')' }"
      :class="[ nodeSliderContentAmount === 0 ? 'onlyone' : '' ]" @click="closeConent()">
      <div class="activityNodeSlider__slideshow--imageDescr" v-html="getActivityImageDescr()"
        :style="[ nodeSliderContentAmount !== 0 ? { display: `none` } : {} ]" />
        <template v-if="nodeSliderContentAmount === 1">
          <template v-if="nodeSliderContent[0]['type'] === `video`">
            <video autoplay controls muted>
              <source :src="getNodeSlideshowVideoSrc(nodeSliderContent[0])" :type="getNodeSlideshowVideoType(nodeSliderContent[0])">
            </video>
          </template>
          <template v-if="nodeSliderContent[0]['type'] === `youtube`">
            <iframe width="100%" height="100%" :src="getYoutubeSrc(nodeSliderContent[0])" frameborder="0" allowfullscreen />
          </template>
          <template v-else>
            <div class="activityNodeSlider__slideshow--OnlyOneImage" :style="{ backgroundImage: 'url(' + getNodeSlideshowImage(nodeSliderContent[0]) + ')' }">
              <div class="activityNodeSlider__slideshow--imageDescr" v-html="getNodeSlideshowImageDescr(nodeSliderContent[0])"/>
            </div>
          </template>
        </template>
        <template v-else>
          <app-slider :option="sliderOption" >
            <template scope="props">
              <swiper-slide :is="props.slide" v-for="(o, i) in nodeSliderContent">
                <template v-if="o.type === `video`">
                  <video autoplay controls muted>
                    <source :src="getNodeSlideshowVideoSrc(o)" :type="getNodeSlideshowVideoType(o)">
                  </video>
                </template>
                <template v-if="o.type === `youtube`">
                  <video autoplay controls muted>
                    <source :src="getYoutubeSrc(o)" >
                  </video>
                </template>
                <template v-else>
                  <div class="activityNodeSlider__slideshow--sliderImage" :style="{ backgroundImage: 'url(' + getNodeSlideshowImage(o) + ')' }">
                    <div class="activityNodeSlider__slideshow--imageDescr" v-html="getNodeSlideshowImageDescr(o)" />
                  </div>
                </template>
              </swiper-slide>
            </template>
          </app-slider>
        </template>
    </div>
    <div class="activityNodeSlider__content" :class="{ open: openContent, noSliderContent: !hasSliderContent }">
      <activity-nodeContent :node="node" :activeIndex="activeIndex" :viewport="viewport" :hasSliderContent="hasSliderContent"
        v-on:changeSlideTo="changeSlideTo"/>
    </div>
    <div class="activityNodeSlider__desktopArrow" :class="{ hidden: openContent }" @click="openConent()" v-show="hasSliderContent">
      <img src="/public/icon/left-2017.png" />
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
      openContent: true,
      activeIndex: 1
    }
  },
  computed: {
    hasSliderContent () {
      return _.get(this.nodeSliderContent, [ 'length' ]) !== 0
    },
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
          console.log('asdasd')
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
    changeSlideTo (index) {
      console.log('index', index + 1)
      console.log('swiper', this)
    },
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
    },
    getNodeSlideshowVideoSrc (item) {
      return _.get(item, [ 'content', '0', 'url' ])
    },
    getNodeSlideshowVideoType (item) {
      return _.get(item, [ 'content', '0', 'filetype' ])
    },
    getYoutubeSrc (item) {
      return `https://www.youtube.com/embed/${_.get(item, [ 'content', '0', 'youtubeId' ])}?autoplay=1`
    },
    openConent () {
      this.openContent = true
    },
    closeConent () {
      this.openContent = false
    }
  },
  mounted () {
    setTimeout(() => {
      this.openContent = false
    }, 2000)
  }
}

</script>

<style lang="stylus" scoped>

video
  width 100%
  height 100%

.activityNodeSlider
  display flex
  flex-direction column
  width 100%
  height calc(100vh - 70px)
  overflow hidden
  &__slideshow
    position relative
    width 100%
    padding-top 56.25%
    background-color #000
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover
    overflow hidden
    &.onlyone
      filter brightness(40%)
    &--imageDescr
      position absolute
      left 4.5px
      bottom 5px
      color #fff
      font-size 12px
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
  &__desktopArrow
    display none

@media only screen and (max-width: 736px) and (orientation: landscape)
  .activityNodeSlider
    position relative
    height calc(100vh - 40px)
    &__slideshow
      padding-top 0
      height 100%
      &--imageDescr
        left 27.5px
        bottom 24.5px
    &__content
      position absolute
      z-index 500
      top 0
      left 0
      width 100%
      height 100%

@media only screen and (min-width: 900px)
  .activityNodeSlider
    position relative
    height: calc(100vh - 40px)
    background-color #000
    &__slideshow
      padding-top 0
      height 100%
      background-size contain
      &--sliderImage
        background-size contain
    &__content
      position absolute
      z-index 1000
      top 0
      right 0
      width 25%
      height 100%
      padding 73.5px 15px 40px
      background-color rgba(255, 255, 255, .7)
      transform translateX(24vw)
      transition .5s ease
      &.open
        transform translateX(0)
      &.noSliderContent
        width 100%
        height 100%
        background-color transparent
        transform translateX(0)
    &__desktopArrow
      display block
      position absolute
      z-index 999
      top 50%
      right 10px
      height 45px
      transform translate(-50%, -50%)
      cursor pointer
      &.hidden
        display none
      > img
        height 100%

.swiper-container
  position absolute
  top 0
  left 0
  width 100%
  height 100%

</style>
