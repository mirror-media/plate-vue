<template>
  <div class="activityNodeContent">
    <div class="activityNodeContent__sliderNav">
      <template v-for="n in sliderContentAmount">
        <div class="activityNodeContent__sliderNav--block" :class="[ n === currentSlideshowIndex ? 'active' : '' ]"/>
      </template>
    </div>
    <h3 v-html="node.activity.name"></h3>
    <h2 class="activityNodeContent__date" v-html="node.subtitle"></h2>
    <h2 v-html="node.name"></h2>
    <p v-html="getNodeText(node)" />
    <div class="activityNodeContent__share"></div>
  </div>
</template>

<script>

import _ from 'lodash'

export default {
  props: [ 'activeIndex', 'node' ],
  computed: {
    currentSlideshowIndex () {
      return this.activeIndex % this.sliderContentAmount === 0 ? this.sliderContentAmount : this.activeIndex % this.sliderContentAmount
    },
    sliderContentAmount () {
      return _.get(this.getNodeSliderContent(this.node), [ 'length' ])
    }
  },
  methods: {
    getNodeSliderContent (node) {
      return _.filter(_.slice(_.get(node, [ 'content', 'apiData' ]), 1, _.get(node, [ 'content', 'apiData', 'length' ])), function (o) {
        return o.type !== 'unstyled'
      })
    },
    getNodeText (node) {
      return _.get(node, [ 'content', 'apiData', '0', 'content', '0' ])
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
  padding .5em 0 25px 15px
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
    // flex-grow 1
    height 105px
    overflow-y scroll
    margin 5px 0
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
  &__share
    width 100%
    height 30px
    box-shadow 0.6px 0.8px 2.5px 0.1px #000
    border-radius 15px
@media screen and (min-width: 375px)
  .activityNodeContent
    p
      height 170px
@media screen and (min-width: 414px)
  .activityNodeContent
    p
      height 220px
</style>
