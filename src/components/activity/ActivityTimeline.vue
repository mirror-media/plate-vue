<template>
  <section class="activityTimeline" v-on:touchstart="touchstart" v-on:touchend="touchend">
    <div class="activityTimeline__time" :style="{ width: timeWidth, transform: `translate3d(${timeTransform}px,0,0)` }">
      <div class="activityTimeline__timeBlock" v-show="windowViewport < 900" />
      <div class="activityTimeline__timeBlock" v-for="(item, index) in nodes">
        <div class="activityTimeline__timeBlock--vertLine" />
        <p v-text="getValue(item, [ 'subtitle' ])"/>
      </div>
      <div class="activityTimeline__timeBlock" v-show="windowViewport < 900" />
    </div>
    <div class="activityTimeline__images" :style="{ width: imagesWidth, transform: `translate3d(${imagesTransform}px,0,0)` }">
      <template v-for="(item, index) in nodes">
        <div class="activityTimeline__imageBlock" :class="[ index % 2 === 0 ? '' : 'deeper', getNodeStyle(item) ]" @click="openLightbox(index)" :id="`activity-${item.id}`" >
          <figure>
            <img v-lazy="getNodeImage(item)" v-show="getNodeImage(item)" />
          </figure>
          <div class="activityTimeline__imageBlock--text" >
            <h2 v-text="getTruncatedVal(getValue(item, [ 'name' ]), 16)" />
            <div class="activityTimeline__imageBlock--textIcon" />
          </div>
        </div>
      </template>
    </div>
    <div class="activityTimeline__arrow left" @click="goToPrev()" v-show="hasPrev">
      <img src="/assets/mirrormedia/icon/arrow-left_white.png" />
    </div>
    <div class="activityTimeline__arrow right" @click="goToNext()" v-show="hasNext">
      <img src="/assets/mirrormedia/icon/arrow-right_white.png" />
    </div>
  </section>
</template>

<script>

import { getTruncatedVal, getValue } from '../../util/comm'
import _ from 'lodash'

export default {
  props: [ 'initialNodeIndex', 'initialNodes', 'viewport' ],
  data () {
    return {
      currentNodeIndex: this.initialNodeIndex,
      imagesTransform: this.windowViewport,
      timeTransform: this.windowViewport,
      touchStartValueX: 0
    }
  },
  computed: {
    hasPrev () {
      return this.imagesTransform < 0
    },
    hasNext () {
      if (this.windowViewport < 900) {
        return this.imagesTransform > (-(this.nodeAmount - 1) * this.windowViewport)
      } else {
        return this.imagesTransform > (-(this.nodeAmount - 4) * 0.22 * this.windowViewport)
      }
    },
    nodeAmount () {
      return _.get(this.nodes, [ 'length' ])
    },
    nodes () {
      return this.initialNodes
    },
    timeWidth () {
      if (this.windowViewport >= 900) {
        return `${(this.nodeAmount + 2) * 22}vw`
      } else {
        return `${(this.nodeAmount + 2) * 45}vw`
      }
    },
    windowViewport () {
      return this.viewport
    },
    imagesWidth () {
      if (this.windowViewport >= 900) {
        return `${this.nodeAmount * 22}vw`
      } else {
        return `${this.nodeAmount * 100}vw`
      }
    }
  },
  methods: {
    getNodeImage (item) {
      const nodeContents = _.filter(_.slice(_.get(item, [ 'content', 'apiData' ]), 1, _.get(item, [ 'content', 'apiData', 'length' ])), function (o) {
        return o.type !== 'unstyled'
      })
      const nodeContentStyle = _.get(nodeContents, [ '0', 'type' ])
      if (nodeContentStyle === 'image') {
        return _.get(nodeContents, [ '0', 'content', '0', 'desktop', 'url' ])
      } else {
        return _.get(nodeContents, [ '0', 'content', '0', 'coverPhoto', 'desktop', 'url' ])
      }
    },
    getNodeStyle (item) {
      return _.get(item, [ 'content', 'apiData', '1', 'type' ], 'text')
    },
    getTruncatedVal,
    getValue,
    goToPrev () {
      if (this.windowViewport < 900) {
        if (this.imagesTransform < 0) {
          this.imagesTransform += (1 * this.windowViewport)
          this.timeTransform += (0.45 * this.windowViewport)
        }
      } else {
        const prevTransformValue = this.imagesTransform + (0.88 * this.windowViewport)
        if (prevTransformValue >= 0) {
          this.imagesTransform = 0
          this.timeTransform = 0
        } else {
          this.imagesTransform = prevTransformValue
          this.timeTransform = prevTransformValue
        }
      }
    },
    goToNext () {
      if (this.windowViewport < 900) {
        if (this.imagesTransform > (-(this.nodeAmount - 1) * this.windowViewport)) {
          this.imagesTransform -= (1 * this.windowViewport)
          this.timeTransform -= (0.45 * this.windowViewport)
        }
      } else {
        const nextTransformValue = this.imagesTransform - (0.88 * this.windowViewport)
        const maxTransformValue = -(this.nodeAmount - 4) * 0.22 * this.windowViewport
        if (nextTransformValue <= maxTransformValue) {
          this.imagesTransform = -(this.nodeAmount - 4) * 0.22 * this.windowViewport
          this.timeTransform = -(this.nodeAmount - 4) * 0.22 * this.windowViewport
        } else {
          this.imagesTransform = nextTransformValue
          this.timeTransform = nextTransformValue
        }
      }
    },
    initialTransformValue () {
      const wWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (wWidth < 900) {
        this.imagesTransform = 0
        this.timeTransform = -(0.175 * wWidth)
      } else {
        this.imagesTransform = 0
        this.timeTransform = 0
      }
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
    },
    openLightbox (index) {
      this.$emit('openLightbox', index)
    }
  },
  mounted () {
    this.initialTransformValue()
    window.addEventListener('resize', () => {
      this.initialTransformValue()
    })
  }
}

</script>
<style lang="stylus" scoped>

.activityTimeline
  position absolute
  bottom 0
  left 0
  right 0
  display flex
  flex-direction column
  width 100%
  margin-top -50px
  border-top 2px solid #bf272d
  overflow hidden
  &__time
    display flex
    position relative
    height 50px
    background-color rgba(255,255,255,.8)
    transition .3s ease-in-out
    overflow hidden
  &__timeBlock
    display inline-block
    position relative
    float left
    width 45vw
    height 50px
    color #000
    p
      position absolute
      bottom 10px
      left 50%
      transform translateX(-50%)
      margin 0
      text-align center
      cursor pointer
    &--vertLine
      position absolute
      top 0
      left 50%
      transform translateX(-50%)
      width 2px
      height 15px
      background-color #bf272d
    &.active
      color #fff
  &__images
    position relative
    display flex
    height calc(30vh + 44px)
    transition .3s ease-in-out
    
  &__imageBlock
    position relative
    display flex
    align-items center
    justify-content center
    width 100vw
    height 100%
    background-color #1a1a1a
    cursor pointer
    figure
      position relative
      width 100%
      height 100%
      margin 0
      overflow hidden
      img
        width 100%
        height 100%
        object-fit cover
        object-position 50% 50%
        filter brightness(.7)
      figcaption
        position absolute
        top 50%
        left 50%
        width 80%
        transform translate(-50%, -50%)
        color #fff
        text-align center
        font-size 1.4rem
        font-weight 300
        letter-spacing 2px
    &.deeper
      background-color #000
    &--text
      position absolute
      top 0
      left 10%
      right 10%
      width 80%
      height calc(100% - 44px)
      h2
        position absolute
        top 20%
        left 50%
        transform translateX(-50%)
        width 80%
        height 56px
        margin 0
        color #fff
        text-align center
        font-size 1.2rem
        font-weight 300
        line-height 1.5
        letter-spacing 1px
    &--textIcon
      position absolute
      bottom 10px
      left 50%
      transform translateX(-50%)
      width 30px
      height 30px
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover
    
    &.text
      .activityTimeline__imageBlock--textIcon
        background-image url("/assets/mirrormedia/icon/timelineText@2x.png")
      &:hover
        h2
          color #fff
    &.image
      .activityTimeline__imageBlock--textIcon
        background-image url("/assets/mirrormedia/icon/camera@2x.png")
      &:hover
        .activityTimeline__imageBlock--text
          display none
    &.video
      .activityTimeline__imageBlock--textIcon
        background-image url("/assets/mirrormedia/icon/video_gray@2x.png")
      &:hover
        .activityTimeline__imageBlock--text
          display none
  &__imageBlock:hover
    figure
      img
        transform scale(1.5)
        filter none

  &__arrow
    position fixed
    top calc(70vh + 22px)
    z-index 500
    transform translateY(50%)
    width 10vw
    padding 0 7px
    font-size 0
    img
      width 100%
      cursor pointer
    &.left
      left 0
    &.right
      right 0

@media (min-width: 600px) and (orientation: portrait)
  .activityTimeline
    &__time
      height 60px
    &__timeBlock
      p
        top 20px
        bottom auto
        font-size 1.4rem
    &__images
      height calc(25vh + 44px)
    &__imageBlock
      &--text
        h2
          font-size 1.8rem
      &--textIcon
        bottom 20px
    &__arrow
      top calc(75vh + 22px)
      width 40px
      padding 0
      &.left
        left 5vw
      &.right
        right 5vw

@media (min-width: 900px)
  .activityTimeline
    &__timeBlock
      width 22vw
    &__images
      height 25vh
    &__imageBlock
      position relative
      width 22vw
      padding 0
      figure
        img
          object-fit cover
      &--text
        height 100%
        h2
          top 40%
          transform translate(-50%, -50%)
          color rgba(255,255,255,.5)
      &--textIcon
        bottom 20px
    &__arrow
      display flex
      justify-content center
      align-items center
      top auto
      bottom 12.5vh
      width 10vw
      height 25vh
      img
        width 40px
      &.left
        left 0
        background linear-gradient(to right,rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)
      &.right
        right 0
        background linear-gradient(to left,rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)
</style>
