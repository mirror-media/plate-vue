<template>
  <nav class="activityNodeNav" :class="position">
    <p v-html="title" />
  </nav>
</template>

<script>

import _ from 'lodash'

export default {
  props: [ 'node', 'position' ],
  computed: {
    title () {
      return `${_.get(this.node, [ 'subtitle' ])} ${_.get(this.node, [ 'name' ])}`
    }
  }
}

</script>

<style lang="stylus" scoped>

.activityNodeNav
  position absolute
  left 0
  width 100%
  height 20px
  padding-left 13px
  background-color #666
  &.prev
    top 0
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

</style>
