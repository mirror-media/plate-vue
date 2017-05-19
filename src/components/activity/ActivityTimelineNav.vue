<template>
  <nav class="activityTimelineNav" :class="{ open: openNav }">
    <div class="activityTimelineNav__line" />
    <div class="activityTimelineNav__activities">
      <div class="activityTimelineNav__activity" v-for="(item, index) in timelineNodes">
        <h2 v-html="item.subtitle"></h2>
        <a :href="`/activity/${item.activity.id}`" class="activityTimelineNav__activityImgBox">
          <div class="activityTimelineNav__activityImgBox--title" v-html="item.activity.name" />
          <div class="activityTimelineNav__activityImgBox--img" :style="{ backgroundImage: 'url(' + getImage(item) + ')' }" />
        </a>
      </div>
    </div>
  </nav>
</template>

<script>

import _ from 'lodash'

export default {
  props: [ 'openNav', 'timelineNodes', 'viewport' ],
  methods: {
    getImage (node) {
      let viewportTarget
      if (this.viewport < 600) {
        viewportTarget = 'mobile'
      } else if (this.viewport > 600 && this.viewport < 1200) {
        viewportTarget = 'tablet'
      } else {
        viewportTarget = 'desktop'
      }
      // let ttt = _.get(node, [ 'content', 'apiData' ])
      // let tt = _.filter(ttt, [ 'type', 'image' ])
      // console.log('tt', tt)
      // return _.get(_.filter(_.get(node, [ 'content', 'apiData' ]), function (o) {
      //   return o.type !== 'unstyled'
      // }), [ 'content', '0', viewportTarget, 'url' ])
      return _.get(node, [ 'activity', 'heroImage', 'image', 'resizedTargets', viewportTarget, 'url' ])
    }
  }
}

</script>
<style lang="stylus" scoped>

.activityTimelineNav
  display flex
  position fixed
  top 0
  z-index 550
  width 100vw
  padding-top 50px
  background-color #f0f0f0
  transform translate3d(100vw,0,0)
  transition .5s ease
  overflow-y scroll
  &.open
    transform translate3d(0,0,0)
    transition .5s ease
  &__line
    width 15px
    border-right 1px solid #000
  &__activities
    flex-grow 1
    width 100%
    height calc(100vh - 35px)
    padding-left 10px
    padding-right 15px
    overflow-y scroll
    h2
      position relative
      margin 0
      color #bf272d
      font-size 1.5rem
      font-weight bold
    h2:before
      content ''
      position absolute
      top 8.5px
      left -16px
      width 10px
      height 10px
      background-color #000
      border-radius 5px
  &__activityImgBox
    display block
    position relative
    width 100%
    padding-top 56.25%
    &--title
      position absolute
      z-index 1
      top 0
      left 0
      width 100%
      padding .2em .2em .2em .4em
      color #fff
      font-size 1rem
      font-weight 300
      background-color rgba(191, 39, 45, .8)
    &--img
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover

@media only screen and (min-width: 900px)
  .activityTimelineNav
    z-index 501
    left 0
    width 25vw
    transform translate3d(100vw,0,0)
    &.open
      transform translate3d(75vw,0,0)
</style>
