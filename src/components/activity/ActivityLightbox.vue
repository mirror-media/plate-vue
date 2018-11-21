<template>
  <section class="ActivityLightbox" :style="[ isLightboxMenuOpen ? { overflow: 'hidden' } : {} ]">
    <h1 v-text="getValue(activity, [ 'name' ])" />
    <figure class="ActivityLightbox__close" @click="closeLightbox()">
      <img v-lazy="`/assets/mirrormedia/icon/timelineClose@2x.png`" />
    </figure>
    <div class="ActivityLightbox__slider" v-if="currentContentStyle !== 'text'" v-on:touchstart="touchstart" v-on:touchend="touchend">
      <div class="ActivityLightbox__slider--arrow left" v-show="nodeContentMoreThanOne" @click="goToPrev()" />
      <template v-for="(item, index) in currentNodeContents">
        <activity-lightboxSlider :initialContent="item" :class="[ index === currentContentIndex ? 'active' : 'unactive' ]" :viewport="viewport" />
      </template>
      <div class="ActivityLightbox__slider--arrow right" v-show="nodeContentMoreThanOne" @click="goToNext()" />
    </div>
    <div class="ActivityLightbox__slideshowInfo" v-if="currentContentStyle !== 'text'">
      <p v-text="currentContentCredit" />
      <div class="ActivityLightbox__slideshowInfoAmountBox">
        <span>{{ currentContentIndex + 1 }} | {{ getValue(currentNodeContents, [ 'length' ]) }}</span>
        <img v-lazy="`/assets/mirrormedia/icon/square_gray@2x.png`" v-show="nodeContentMoreThanOne" @click="openLightboxMenu()" />
      </div>
    </div>
    <div class="ActivityLightbox__content" :class="currentContentStyle">
      <h3 v-text="getValue(nodes, [ currentNodeIndex, 'subtitle' ])" />
      <h2 v-text="getValue(nodes, [ currentNodeIndex, 'name' ])" />
      <p v-text="getValue(nodes, [ currentNodeIndex, 'content', 'apiData', '0', 'content', '0' ])" />
      <figure @click="share()" id="activity-share">
        <img v-lazy="`/assets/mirrormedia/icon/facebook_white.png`" />
      </figure>
    </div>
    <activity-lightboxMenu :currentNodeContents="currentNodeContents" :initialActivity="activity" :viewport="viewport" 
      v-on:goToContentIndex="goToContentIndex" v-show="isLightboxMenuOpen" v-if="nodeContentMoreThanOne" />
  </section>
</template>

<script>

import { getValue } from '../../util/comm'
import _ from 'lodash'
import ActivityLightboxMenu from './ActivityLightboxMenu.vue'
import ActivityLightboxSlider from './ActivityLightboxSlider.vue'

export default {
  components: {
    'activity-lightboxMenu': ActivityLightboxMenu,
    'activity-lightboxSlider': ActivityLightboxSlider
  },
  props: [ 'initialActivity', 'initialNodes', 'lightboxIndex', 'viewport' ],
  data () {
    return {
      activity: this.initialActivity,
      currentContentIndex: 0,
      isLightboxMenuOpen: false,
      touchStartValueX: 0
    }
  },
  computed: {
    currentContent () {
      return _.get(this.currentNodeContents, [ this.currentContentIndex, 'content', '0' ])
    },
    currentContentCredit () {
      if (this.currentContentStyle === 'image') {
        return _.get(this.currentContent, [ 'description' ])
      } else {
        return _.get(this.currentContent, [ 'title' ])
      }
    },
    currentContentStyle () {
      return _.get(this.currentNodeContents, [ '0', 'type' ], 'text')
    },
    currentNodeIndex () {
      return this.lightboxIndex
    },
    currentNodeContents () {
      return _.filter(_.slice(_.get(this.nodes, [ this.currentNodeIndex, 'content', 'apiData' ]), 1, _.get(this.nodes, [ this.currentNodeIndex, 'content', 'apiData', 'length' ])), function (o) {
        return o.type !== 'unstyled'
      })
    },
    nodeContentMoreThanOne () {
      return _.get(this.currentNodeContents, [ 'length' ]) > 1
    },
    nodes () {
      return this.initialNodes
    },
    windowViewport () {
      return this.viewport
    }
  },
  methods: {
    closeLightbox () {
      const currentVideo = this.$el.querySelectorAll('.ActivityLightboxSlider')[ this.currentContentIndex ]
      if (currentVideo && currentVideo.querySelector('video')) {
        currentVideo.querySelector('video').pause()
      }
      this.$emit('closeLightbox')
    },
    getValue,
    goToContentIndex (index) {
      this.currentContentIndex = index
      this.isLightboxMenuOpen = false
    },
    goToNext () {
      const currentVideo = this.$el.querySelectorAll('.ActivityLightboxSlider')[ this.currentContentIndex ]
      if (currentVideo && currentVideo.querySelector('video')) {
        currentVideo.querySelector('video').pause()
      }
      const nextContentIndex = this.currentContentIndex + 1
      if (nextContentIndex > _.get(this.currentNodeContents, [ 'length' ]) - 1) {
        this.currentContentIndex = 0
      } else {
        this.currentContentIndex = nextContentIndex
      }
    },
    goToPrev () {
      const currentVideo = this.$el.querySelectorAll('.ActivityLightboxSlider')[ this.currentContentIndex ]
      if (currentVideo && currentVideo.querySelector('video')) {
        currentVideo.querySelector('video').pause()
      }
      const prevContentIndex = this.currentContentIndex - 1
      if (prevContentIndex < 0) {
        this.currentContentIndex = _.get(this.currentNodeContents, [ 'length' ]) - 1
      } else {
        this.currentContentIndex = prevContentIndex
      }
    },
    openLightboxMenu () {
      const currentVideo = this.$el.querySelectorAll('.ActivityLightboxSlider')[ this.currentContentIndex ]
      if (currentVideo && currentVideo.querySelector('video')) {
        currentVideo.querySelector('video').pause()
      }
      this.isLightboxMenuOpen = true
    },
    share () {
      let imageUrl
      if (this.currentContentStyle === 'video') {
        imageUrl = _.get(this.currentNodeContents, [ this.currentContentIndex, 'content', '0', 'coverPhoto', 'mobile', 'url' ])
      } else if (this.currentContentStyle === 'image') {
        imageUrl = _.get(this.currentNodeContents, [ this.currentContentIndex, 'content', '0', 'mobile', 'url' ])
      } else {
        imageUrl = _.get(this.activity, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ])
      }
      const description = `${_.get(this.nodes, [ this.currentNodeIndex, 'subtitle' ])} ${_.get(this.nodes, [ this.currentNodeIndex, 'name' ])}： ${_.get(this.nodes, [ this.currentNodeIndex, 'content', 'apiData', '0', 'content', '0' ])}`
      window.FB.ui(
        {
          method: 'feed',
          link: `https://www.mirrormedia.mg/activity/${_.get(this.$route, [ 'params', 'activityId' ])}/`,
          picture: imageUrl,
          description
        }, function () {})
      window.ga('send', 'event', 'activity', 'click', 'share-node')
    },
    touchend (e) {
      const deltaX = e.changedTouches[0].pageX - this.touchStartValueX
      if (deltaX > 10) {
        this.goToPrev()
      }

      if (deltaX < -10) {
        this.goToNext()
      }
    },
    touchstart (e) {
      this.touchStartValueX = e.touches[0].pageX
    }
  },
  watch: {
    currentNodeIndex: function () {
      this.currentContentIndex = 0
    }
  }
}

</script>

<style lang="stylus" scoped>

.ActivityLightbox
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 1000
  width 100vw
  height 100vh
  padding-bottom 44px
  background-color #1a1a1a
  overflow-y scroll
  > h1
    display flex
    align-items center
    justify-content center
    width 50%
    height 60px
    margin 0 auto
    color #ababab
    font-size 1.2rem
    font-weight 300
    line-height 1.2
    text-align center
  &__close
    display flex
    align-items center
    justify-content center
    position fixed
    bottom 10px
    right 10px
    width 40px
    height 40px
    margin 0
    background-color #000
    border-radius 50%
    cursor pointer
    img
      width 20px
  &__slider
    position relative
    width 100%
    padding-top 66.66%
    &--arrow
      position absolute
      top 50%
      transform translateY(-50%)
      z-index 1
      width 0
      height 0
      border-style solid
      cursor pointer
      &.left
        left 20px
        border-width 10px 17.3px 10px 0
        border-color transparent #fff transparent transparent
      &.right
        right 20px
        border-width 10px 0 10px 17.3px
        border-color transparent transparent transparent #fff
  &__slideshowInfo
    display flex
    justify-content space-between
    width 100%
    height 30px
    padding 0 5%
    color #ababab
    font-weight 300
    p
      display inline
      margin 0
      font-weight 300
      line-height 30px
  &__slideshowInfoAmountBox
    display inline-flex
    align-items center
    color #ababab
    cursor pointer
    img
      width 20px
      margin-left 10px
  &__content
    margin-top 40px
    padding 0 5%
    h3
      margin 0
      color #bf272d
    h2
      margin .5em 0
      color #fff
    p
      margin 0
      color #fff
      font-weight 300
      line-height 1.5
      text-align justify
    figure
      display flex
      align-items center
      justify-content center
      width 40px
      height 40px
      margin 1em 0
      border 1px solid #fff
      border-radius 50%
      cursor pointer
      img
        width 13px

@media (min-width: 600px) and (orientation: portrait)
  .ActivityLightbox
    > h1
      height 76px
      font-size 2rem
    &__content
      padding 0 10%
      h2
        font-size 1.8rem
      h3
        font-size 1.6rem
      p
        font-size 1.4rem
        line-height 1.5

@media (min-width: 900px)
  .ActivityLightbox
    z-index 980
    padding 0 15%
    &__close
      position absolute
      top 10px
      bottom auto
      background-color transparent
    &__slider
      &--arrow
        &.left
          left -41px
          border-width 15px 26.0px 15px 0
        &.right
          right -41px
          border-width 15px 0 15px 26.0px
    &__content
      margin-top 20px
      padding 0
      h3
        font-size 1.4rem
      p
        font-size 18px
      &.text
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        width 70%
    &__slideshowInfo
      padding 0
      margin-top 10px
  
</style>
