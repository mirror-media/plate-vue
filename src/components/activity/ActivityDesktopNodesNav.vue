<template>
  <nav class="activityDesktopNodesNav">
    <div class="activityDesktopNodesNav__btn" :class="detectAtFirst()" @click="goToPrev()">
      <img src="/public/icon/arrow1-2017.png" />
    </div>
    <div class="activityDesktopNodesNav__nav">
      <template v-for="item in navNode">
        <div class="activityDesktopNodesNav__nav--block" v-html="`${item.subtitle} <br> ${item.name}`">
        </div>
      </template>
    </div>
    <div class="activityDesktopNodesNav__btn" :class="detectAtEnd()" @click="goToNext()">
      <img src="/public/icon/arrow2-2017.png" />
    </div>
  </nav>
</template>

<script>

import _ from 'lodash'

export default {
  props: [ 'currentIndex', 'nodes', 'nodesAmount' ],
  computed: {
    navNode () {
      return _.slice(this.nodes, this.currentIndex - 2, this.currentIndex + 3)
    }
  },
  methods: {
    detectAtFirst () {
      if (this.currentIndex < 2) {
        return 'hidden'
      }
    },
    detectAtEnd () {
      if (this.currentIndex > this.nodesAmount - 3) {
        return 'hidden'
      }
    },
    goToNext () {
      this.$emit('goToNext')
    },
    goToPrev () {
      this.$emit('goToPrev')
    }
  }
}

</script>

<style lang="stylus" scoped>

.activityDesktopNodesNav
  display none

@media only screen and (min-width: 900px)
  .activityDesktopNodesNav
    display flex
    position fixed
    z-index 1001
    left 0
    bottom 0
    width 100%
    height 40px
    background-color #b1b1b1
    &__btn
      width 50px
      height 100%
      padding 5px 0
      text-align center
      cursor pointer
      > img
        height 100%
      &.hidden
        display none
    &__btn:hover
      background-color #666
    &__nav
      display flex
      width calc(100% - 100px)
      height 100%
      > div:nth-child(3)
        color #bf272d
      &--block
        display flex
        justify-content center
        align-items center
        width 20%
        height 100%
        color #fff
        text-align center
        font-size 10px
        cursor pointer
      &--block:hover
        background-color #666
</style>
