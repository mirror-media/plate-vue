<template>
  <div class="filter-items">
    <div class="filter-items--item clear-all" @click="delAll" v-if="currFilters.length > 0">
      <span v-text="filterWording[ 'FILTER_CLEAR' ]"></span>
    </div>
    <div v-for="item in currFilters" class="filter-items--item">
      <div class="btn close" @click="delFilter(item)"></div>
      <span v-text="getValue(item, [ 'title' ], '')"></span>
    </div>
  </div>
</template>
<script>
  import { getValue } from '../../util/comm'
  import { FILTER_WORDING } from '../../constants/watch101'

  export default {
    data () {
      return {
        filterWording: FILTER_WORDING
      }
    },
    name: 'current-filter',
    methods: {
      delAll () {
        this.$emit('delFilterAll')
      },
      delFilter (filterItem) {
        this.$emit('delFilter', filterItem)
      },
      getValue
    },
    mounted () {},
    props: [ 'currFilters' ],
    watch: {
      currFilters: function () {}
    },
    updated () {}
  }
</script>
<style lang="stylus" scoped>
  .filter-items
    &--item
      // height 30px
      display inline-block
      font-size 0.8rem
      background-color rgba(0, 0, 0, 0.8)
      color #fff
      padding 5px 10px 5px 20px
      min-height 1.5rem
      margin 0 3px 3px
      vertical-align top
      position relative
      &.clear-all
        padding 5px 10px
        cursor pointer
      > .close
        position absolute
        top 5px
        left calc((20px - 0.8rem) / 2)
        width 0.8rem
        height 0.8rem
        background-repeat no-repeat
        background-size contain
        background-position center center
        background-image url(/public/icon/watch-filter-close.png)
        cursor pointer
</style>
