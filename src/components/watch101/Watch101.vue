<template>
  <div class="watch">
    <slot name="header"></slot>
    <div class="watch--ad">
      <slot name="ad-hd"></slot>
    </div>
    <div class="watch--leading">
      <div class="watch--leading_wrapper">
        <img :alt="getValue(leading, [ 'description' ])" v-lazy="getValue(leading, [ 'image', 'url' ])"
            :data-srcset="`
              ${getValue(leading, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')} 800w,
              ${getValue(leading, [ 'image', 'resizedTargets', 'tablet', 'url' ], '')} 1200w,
              ${getValue(leading, [ 'image', 'resizedTargets', 'desktop', 'url' ], '')} 2000w`">
        <div class="title" v-if="title"><span v-text="title"></span></div>
      </div>
    </div>
    <div class="watch--ad1">
      <slot name="ad-na1"></slot>
    </div>
    <div class="watch--listing">
      <div class="hot" v-if="hotWatchList.length > 0">
        <div class="hot--title">熱門錶款</div>
        <hot-list v-if="viewport <= 768" class="hot--list" :list="hotWatchList"></hot-list>
        <hot-list-verticle v-else class="host--list" :list="hotWatchList"></hot-list-verticle>
      </div>
      <div class="listing">
        <watch-list :watchList="watchList" :viewport="viewport"></watch-list>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
<script>
  import _ from 'lodash'
  import Hot from './Hot.vue'
  import HotAside from './HotAside.vue'
  import WatchList from './WatchList.vue'
  import { getValue } from '../../util/comm'

  const fetchHotWatch = (store) => {
    return store.dispatch('FETCH_HOT_WATCH', {})
  }

  const fetchWatch = (store) => {
    return store.dispatch('FETCH_WATCH', {
      params: {
        related: 'full'
      }
    })
  }

  const fetchWatchBrands = (store) => {
    return store.dispatch('FETCH_WATCH_BRANDS', {})
  }

  const fetchWatchFunctions = (store) => {
    return store.dispatch('FETCH_WATCH_FUNCTIONS', {})
  }

  const fetchLeadingImg = (store, { uuid }) => {
    return store.dispatch('FETCH_IMAGE', {
      uuid: uuid
    })
  }

  export default {
    beforeMount () {
      Promise.all([
        fetchHotWatch(this.$store),
        fetchWatch(this.$store),
        fetchWatchBrands(this.$store),
        fetchWatchFunctions(this.$store),
        fetchLeadingImg(this.$store, {
          uuid: _.get(this.$store, [ 'state', 'commonData', 'categories', this.$route.params.title, 'heroImage' ])
        })
      ])
    },
    components: {
      'hot-list': Hot,
      'hot-list-verticle': HotAside,
      'watch-list': WatchList
    },
    computed: {
      leading () {
        return _.get(this.$store, [ 'state', 'images', 0 ])
      },
      hotWatchList () {
        const hotList = _.get(this.$store, [ 'state', 'hotWatches' ]) || _.get(this.$store, [ 'state', 'watches' ], [])
        return hotList
      },
      title () {
        return _.get(this.$store, [ 'state', 'commonData', 'categories', 'watch101', 'ogTitle' ])
      },
      watchList () {
        return _.get(this.$store, [ 'state', 'watches' ], [])
      }
    },
    data () {
      return {
        getValue
      }
    },
    name: 'watch101-list',
    methods: {},
    mounted () {
    },
    props: [ 'viewport' ]
  }
</script>
<style lang="stylus" scoped>
  .watch
    background-color #fff
    &--ad
      width 100%
      background-color #000
      padding 70px 0 15px
    &--leading
      width 100%
      height 60vh
      background-color #000
      &_wrapper
        width 100%
        height 100%
        position relative
        > img
          height 100%
          width 100%
          object-fit cover
          object-position center center
        > .title
          width 100%
          // height 20%
          position absolute
          bottom 0
          left 0
          font-size 2.5rem
          color #fff
          > span
            padding 10px
            width 100%
            text-align center
            display block
            position relative
            bottom 5vh
            &:before
              content ''
              position absolute
              width 60%
              border-top 2px solid rgba(255, 255, 255, 0.5)
              top 0
              right 0
            &:after
              content ''
              position absolute
              width 60%
              border-top 2px solid rgba(255, 255, 255, 0.5)
              bottom 0
              left 0

    &--ad1
      width 100%
      // height 300px
      background-color #000
    &--listing
      width 100%

      // $hotHeight = 200px
      .hot
        width 100%
        // height 300px
        height 220px
        &--title
          font-size 1.5rem
          padding 20px
          height calc(1.5rem + 40px)
        &--list
          height calc(100% - 1.5rem - 40px)

      .listing
        width 100%
        // height $hotHeight

  @media (min-width: 769px)
    .watch
      &--leading
        height 80vh
        &_wrapper
          > .title
            font-size 4rem
            > span
              bottom 10vh
              padding 30px
              &:before, &:after
                border-width 3px
      &--listing
        display flex
        flex-direction row-reverse
        height auto
        justify-content center
        margin-top 30px
        .hot
          // flex: 1
          width 25%
          max-width 200px
          height auto
          padding-right 50px
          margin 20px
          &--title
            font-weight bold
            padding 0 0 25px
            height auto
        .listing
          // flex:3
          width 75%
          padding-left 50px
          margin 20px

</style>
