<template>
  <nav class="activityNodeNav" :class="position">
    <p :class="[ !hasNode ? 'noNode' : '' ]" v-html="title" @click="goToPrev()" v-if="position === 'prev'"/>
    <p :class="[ !hasNode ? 'noNode' : '' ]" v-html="title" @click="goToNext()" v-if="position === 'next'"/>
  </nav>
</template>

<script>

import _ from 'lodash'

export default {
  props: [ 'node', 'position' ],
  computed: {
    hasNode () {
      return this.node
    },
    title () {
      return `${_.get(this.node, [ 'subtitle' ], '')} ${_.get(this.node, [ 'name' ], '')}`
    }
  },
  methods: {
    goToNext (position) {
      if (this.hasNode) {
        this.$emit('goToNext')
      }
    },
    goToPrev (position) {
      if (this.hasNode) {
        this.$emit('goToPrev')
      }
    }
  }
}

</script>

<style lang="stylus" scoped>

.activityNodeNav
  position fixed
  z-index 500
  left 0
  width 100%
  height 20px
  padding-left 13px
  background-color #666
  &.prev
    top 30px
  &.next
    bottom 0
  p
    margin 0
    padding-left 20px
    color #fff
    font-size 8px
    font-weight 300
    line-height 20px
  p:before
    content ''
    position absolute
    top 7px
    left 13px
    width 5px
    height 5px
    background-color #fff
    border-radius 2.5px
  p.noNode:before
    width 0
    height 0
  p:after
    content ''
    position absolute
    top 0
    left 15px
    width 1px
    height 20px
    background-color #fff
  p.noNode:after
    width 0
    height 0
</style>
