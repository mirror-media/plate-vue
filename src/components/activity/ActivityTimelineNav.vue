<template>
  <nav class="activityTimelineNav" :class="{ open: openNav }">
    <div class="activityTimelineNav__line" />
    <div class="activityTimelineNav__activities">
      <div class="activityTimelineNav__activity" v-for="(item, index) in timelineNodes">
        <h2 v-html="item.subtitle"></h2>
        <a :href="`/activity/${item.id}`" class="activityTimelineNav__activityImgBox">
          <div class="activityTimelineNav__activityImgBox--title" v-html="item.activity.name" />
          <div class="activityTimelineNav__activityImgBox--img" :style="{ backgroundImage: 'url(' + getImage(item) + ')' }" />
        </a>
      </div>
    </div>
  </nav>
</template>

<script>

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
      return _.get(node, [ 'activity', 'heroImage', 'image', 'resizedTargets', viewportTarget, 'url' ])
    },
  },
}

</script>
<style lang="stylus" scoped>

.activityTimelineNav
  display flex
  position fixed
  top 0
  z-index 550
  width 100vw
  height 100vh
  padding-top 35px
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
    padding-left 10px
    padding-right 15px
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
      left -20px
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
</style>
