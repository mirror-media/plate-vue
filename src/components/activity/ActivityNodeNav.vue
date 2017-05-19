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
  height 30px
  padding-left 13px
  background-color #666
  &.prev
    top 50px
  &.next
    bottom 0
  p
    margin 0
    padding-left 20px
    color #fff
    font-size 12px
    font-weight 300
    line-height 30px
  p:before
    content ''
    position absolute
    top 10px
    left 10px
    width 10px
    height 10px
    background-color #fff
    border-radius 50%
  p.noNode:before
    width 0
    height 0
  p:after
    content ''
    position absolute
    top 0
    left 15px
    width 1px
    height 30px
    background-color #fff
  p.noNode:after
    width 0
    height 0
</style>
