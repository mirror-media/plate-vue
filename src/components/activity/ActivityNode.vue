<template>
  <section class="activityNode">
    <div class="activityNode-nodeContainer" :style="[viewport < 600 ? { height: `${100 * nodeAmount}%` } : {} ]">
      <div class="activityNode__node" v-for="item in nodes">
        <div class="activityNode__slideshow">
        </div>
        <div class="activityNode__content">
          <div class="activityNode__contentBlock">
            <h3 v-html="item.activity.name"></h3>
            <h2 class="activityNode__contentBlock--date" v-html="item.subtitle"></h2>
            <h2 v-html="item.name"></h2>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import _ from 'lodash'

export default {
  props: [ 'defaultNodeIndex', 'nodes', 'viewport' ],
  computed: {
    nodeAmount () {
      return _.get(this.nodes, [ 'length' ])
    }
  }
}

</script>

<style lang="stylus" scoped>

.activityNode
  width 100%
  height 100%
  padding 20px 0
  overflow hidden
  &-nodeContainer
    width 100%
  &__node
    width 100%
    height calc(100vh - 70px)
  &__slideshow
    width 100%
    padding-top 56.25%
  &__content
    width 100%
    height calc(100% - (100vw / 16 * 9))
    padding 0 15.5px
  &__contentBlock
    width 100%
    height 100%
    padding-left 15px
    border-left 1px solid #666
    h2, h3
      margin .5em 0
    h2
      font-size 12.5px
    h2.activityNode__contentBlock--date
      font-weight bold
      color #bf272d
    h3
      font-size 10px
</style>
