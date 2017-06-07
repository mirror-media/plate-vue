<template>
  <div class="activityNodeContent" :class="{ noSliderContent: !hasSliderContent }">
    <div class="activityNodeContent__sliderNav">
      <template v-for="n in sliderContentAmount">
        <div class="activityNodeContent__sliderNav--block" :class="[ n === currentSlideshowIndex ? 'active' : '' ]"/>
      </template>
    </div>
    <h3 v-html="node.activity.name"></h3>
    <h2 class="activityNodeContent__date" v-html="node.subtitle"></h2>
    <h2 v-html="node.name"></h2>
    <p class="activityNodeContent__content"  v-html="getNodeText(node)" />
    <div class="activityNodeContent__share" @click="shareFacebook()">
      <img src="/public/icon/facebook@2x.png"/>
    </div>
    <div class="activityNodeContent__desktopSliderNav">
      <template v-for="(item, index) in sliderContent">
        <div class="activityNodeContent__desktopSliderNav--block" :style="{ backgroundImage: 'url(' + getNodeSliderImage(item) + ')' }"
          @click="changeSlideTo(index + 1)" />
      </template>
    </div>
  </div>
</template>

<script>

import { shareFacebook } from '../../util/comm'
import _ from 'lodash'

export default {
  props: [ 'activeIndex', 'hasSliderContent', 'node', 'viewport' ],
  computed: {
    currentSlideshowIndex () {
      return this.activeIndex % this.sliderContentAmount === 0 ? this.sliderContentAmount : this.activeIndex % this.sliderContentAmount
    },
    sliderContent () {
      return _.filter(_.slice(_.get(this.node, [ 'content', 'apiData' ]), 1, _.get(this.node, [ 'content', 'apiData', 'length' ])), function (o) {
        return o.type !== 'unstyled'
      })
    },
    sliderContentAmount () {
      return _.get(this.getNodeSliderContent(this.node), [ 'length' ])
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
      this.$emit('changeSlideTo', index)
    },
    getNodeSliderContent (node) {
      return _.filter(_.slice(_.get(node, [ 'content', 'apiData' ]), 1, _.get(node, [ 'content', 'apiData', 'length' ])), function (o) {
        return o.type !== 'unstyled'
      })
    },
    getNodeSliderImage (node) {
      return _.get(node, [ 'content', '0', this.viewportTarget, 'url' ])
    },
    getNodeText (node) {
      return _.get(node, [ 'content', 'apiData', '0', 'content', '0' ])
    },
    shareFacebook () {
      shareFacebook({ route: this.$route.path })
    }
  }
}

</script>

<style lang="stylus" scoped>

.activityNodeContent
  display flex
  flex-direction column
  width 100%
  height 100%
  padding .5em 0 .5em 15px
  border-left 1px solid #666
  h2, h3
    margin 5px 0
  h2
    font-size 20px
    line-height 23px
  h2.activityNodeContent__date
    position relative
    font-weight bold
    color #bf272d
    font-weight bold
  h2.activityNodeContent__date:before
    content ''
    position absolute
    top 6px
    left -20px
    width 10px
    height 10px
    background-color #bf272d
    border-radius 50%
  h3
    font-size 14px
    line-height 16px
  p
    height 105px
    overflow-y scroll
    margin 1em 0
    line-height 24px
    font-size 14px
  &__sliderNav
    display flex
    justify-content center
    width calc(100% + 45px)
    margin-left -30px
    margin-bottom .5em
    &--block
      width 10px
      height 10px
      margin 0 2.5px
      border 1px solid #666
      &.active
        background-color #666
  &__desktopSliderNav
    display none
  &__share
    display flex
    justify-content center
    width 100%
    height 30px
    margin-top 1em
    box-shadow 0.6px 0.8px 2.5px 0.1px #000
    border-radius 15px
    > img
      height 100%
@media screen and (min-width: 375px)
  .activityNodeContent
    p
      height 170px
      > img
        height 100%
@media screen and (min-width: 414px)
  .activityNodeContent
    p
      height 220px

@media only screen and (max-width: 736px) and (orientation: landscape)
  .activityNodeContent
    padding 20px 0 20px 15px
    border-left: 1px solid #fff
    border none
    h2, h3, p
      color #fff
    h2.activityNodeContent__date:before
      display none
    &__sliderNav
      display none
    &__share
      display none

@media only screen and (min-width: 900px)
  .activityNodeContent
    padding 0
    border none
    h2.activityNodeContent__date:before
      display none
    h3
      padding-bottom 5px
      border-bottom 1px solid #666
    p
      height auto
      flex-grow 0
      overflow hidden
    &__sliderNav
      display none
    &__desktopSliderNav
      display flex
      flex-wrap wrap
      padding 0 15px
      margin 1em -15px
      &--block
        width 27.5px
        height 27.5px
        margin 5px 5px
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
        cursor pointer
    &.noSliderContent
      justify-content flex-end
      padding-bottom 30px
      h2, h3, p
        color #fff
      h2.activityNodeContent__date
        color #bf272d
      h3
        border none
      .activityNodeContent__share
        display none
</style>
