<template>
  <div class="activityNodeSlider">
    <div class="activityNodeSlider__slideshow" :style="{ backgroundImage: 'url(' + getActivityImage() + ')' }"
      :class="[ nodeSliderContentAmount === 0 ? 'onlyone' : '' ]" @click="closeConent()">
      <div class="activityNodeSlider__slideshow--imageDescr" v-html="getActivityImageDescr()"
        :style="[ nodeSliderContentAmount !== 0 ? { display: `none` } : {} ]" />
        <template v-if="nodeSliderContentAmount === 1">
          <template v-if="nodeSliderContent[0]['type'] === `video`">
            <video controls>
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
        <template v-if="nodeSliderContentAmount > 1">
          <app-slider :option="sliderOption" :slideId="slideId">
            <template scope="props">
              <swiper-slide :is="props.slide" v-for="(o, i) in nodeSliderContent">
                <template v-if="o.type === `video`">
                  <video controls>
                    <source :src="getNodeSlideshowVideoSrc(o)" :type="getNodeSlideshowVideoType(o)">
                  </video>
                </template>
                <template v-if="o.type === `youtube`">
                  <video autoplay controls muted>
                    <iframe width="100%" height="100%" :src="getYoutubeSrc(o)" frameborder="0" allowfullscreen />
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
    <div class="activityNodeSlider__content" :class="{ open: openContent, noSliderContent: !hasSliderContent, hidden: !openLandscapeContent}">
      <activity-nodeContent :node="node" :activeIndex="activeIndex" :viewport="viewport" :hasSliderContent="hasSliderContent"
        v-on:changeSlideTo="changeSlideTo"/>
    </div>
    <div class="activityNodeSlider__landscapeNav">
      <div class="activityNodeSlider__landscapeNav--text" @click="toggleLandscapeContent()">
        <img src="/public/icon/text.png" />
      </div>
      <div class="activityNodeSlider__landscapeNav--fb" @click="shareFacebook()">
        <img src="/public/icon/sharefb.png" />
      </div>
    </div>
    <div class="activityNodeSlider__desktopArrow" :class="{ hidden: openContent }" @click="openConent()" v-show="hasSliderContent">
      <img src="/public/icon/left-2017.png" />
    </div>
  </div>
</template>

<script>

import { shareFacebook } from '../../utils/comm'
import _ from 'lodash'
import ActivityNodeContent from './ActivityNodeContent.vue'
import Slider from '../Slider.vue'

export default {
  components: {
    'activity-nodeContent': ActivityNodeContent,
    'app-slider': Slider
  },
  props: [ 'index', 'node', 'viewport' ],
  data () {
    return {
      openLandscapeContent: false,
      openContent: true,
      activeIndex: 1,
      slideId: `thisslider-${this.index}`
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
    openSlideBtn () {
      return this.viewport < 900
    },
    sliderOption () {
      return {
        autoplay: 3000,
        initialSlide: 0,
        paginationable: true,
        paginationClickable: true,
        paginationHide: false,
        setNavBtn: this.openSlideBtn,
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
    changeSlideTo (index) {
      window.refs[`thisslider-${this.index}`].slideTo(index)
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
    },
    shareFacebook () {
      shareFacebook({ route: this.$route.path })
    },
    toggleLandscapeContent () {
      this.openLandscapeContent = !this.openLandscapeContent
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
  background-color #000

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
    > video
      position absolute
      top 0
      left 0
    
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
    height calc(100vh - 60px)
    &__slideshow
      padding-top 0
      height 100%
      &--imageDescr
        left 27.5px
        bottom 24.5px
    &__content
      position absolute
      z-index 490
      top 0
      left 0
      width 100%
      height 100%
      padding 0
      background-color rgba(0,0,0,.6)
      &.hidden
        display none
    &__landscapeNav
      position absolute
      z-index 490
      left 0
      bottom 0
      width 100%
      height 40px
      &--text, &--fb
        position absolute
        bottom 5px
        width 20px
        height 20px
        > img
          width 100%
      &--text
        right 40px
      &--fb
        right 10px
@media only screen and (min-width: 900px)
  .activityNodeSlider
    position relative
    height: calc(100vh - 40px)
    background-color #000
    display inline-block
    width 100vw
    &__slideshow
      padding-top 0
      height 100%
      background-size contain
      &.onlyone
        filter brightness(40%)
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
        width 75%
        height 100%
        margin-right 25%
        padding 0 0 0 10%
        background-color transparent
        transform translateX(0)
    &__landscapeNav
      display none
    &__desktopArrow
      display block
      position absolute
      z-index 500
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
    background-color #000

.swiper-container
  position absolute
  top 0
  left 0
  width 100%
  height 100%

</style>
