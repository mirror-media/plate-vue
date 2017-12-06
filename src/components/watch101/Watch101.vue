<template>
  <div class="watch">
    <slot name="header"></slot>
    <div class="watch--ad">
      <slot name="ad-hd"></slot>
    </div>
    <div class="watch--leading">
      <div class="watch--leading_wrapper">
        <img :alt="getValue(leading, [ 'description' ])" v-if="leading"
            :src="getImageCertain(getValue(leading, [ 'image', 'resizedTargets' ], {}), 'desktop')"
            :srcset="`
              ${getImageCertain(getValue(leading, [ 'image', 'resizedTargets' ], {}), 'mobile')} 800w,
              ${getImageCertain(getValue(leading, [ 'image', 'resizedTargets' ], {}), 'tablet')} 1200w,
              ${getImageCertain(getValue(leading, [ 'image', 'resizedTargets' ], {}), 'desktop')} 2000w,`">
        <div class="title" v-if="title"><span v-text="title"></span></div>
      </div>
    </div>
    <div class="watch--ad1">
      <slot name="ad-na1"></slot>
    </div>
    <div class="watch--listing">
      <div class="hot" v-if="hotWatchList.length > 0">
        <div class="hot--title">熱門錶款</div>
        <hot-list v-if="viewport <= 768" class="hot--list" :list="hotWatchList" v-on:openLightbox="openLightbox"></hot-list>
        <hot-list-verticle v-else class="host--list" :list="hotWatchList" v-on:openLightbox="openLightbox"></hot-list-verticle>
      </div>
      <div class="listing">
        <watch-list :watchList="watchList" :viewport="viewport"  v-on:openLightbox="openLightbox"></watch-list>
      </div>
    </div>
    <watch-item-lightbox v-if="lightboxStatus && viewport <= 768" v-on:closeLightbox="closeLightbox" :lightboxItem="lightboxItem"></watch-item-lightbox>
    <watch-item-lightbox-pc v-if="lightboxStatus && viewport > 768" v-on:closeLightbox="closeLightbox" :lightboxItem="lightboxItem"></watch-item-lightbox-pc>
    <slot name="footer"></slot>
  </div>
</template>
<script>
  import _ from 'lodash'
  import Hot from './Hot.vue'
  import HotAside from './HotAside.vue'
  import WatchList from './WatchList.vue'
  import WatchItemLightbox from './WatchItemLightbox.vue'
  import WatchItemLightboxPC from './WatchItemLightboxPC.vue'
  import { getImageCertain, getValue } from '../../util/comm'

  const MAXRESULT = 200

  const fetchHotWatch = (store) => {
    return store.dispatch('FETCH_HOT_WATCH', {})
  }

  const fetchWatch = (store) => {
    return store.dispatch('FETCH_WATCH', {
      params: {
        related: 'full',
        max_results: MAXRESULT
      }
    })
  }

  const fetchWatchBrands = (store) => {
    return store.dispatch('FETCH_WATCH_BRANDS', {
      params: {
        max_results: 50
      }
    })
  }

  const fetchWatchFunctions = (store) => {
    return store.dispatch('FETCH_WATCH_FUNCTIONS', {
      params: {
        max_results: 50
      }
    })
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
      'watch-list': WatchList,
      'watch-item-lightbox': WatchItemLightbox,
      'watch-item-lightbox-pc': WatchItemLightboxPC
    },
    computed: {
      leading () {
        return _.get(this.$store, [ 'state', 'images', 0 ])
      },
      hotWatchList () {
        let hotList = _.get(this.$store, [ 'state', 'hotWatches' ]) || _.get(this.$store, [ 'state', 'watches' ], [])
        hotList = hotList.length > 0 ? hotList : _.get(this.$store, [ 'state', 'watches' ], [])
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
        lightboxStatus: false,
        lightboxItem: undefined
      }
    },
    name: 'watch101-list',
    methods: {
      closeLightbox () {
        this.lightboxStatus = false
      },
      openLightbox (item) {
        this.lightboxItem = item
        this.lightboxStatus = true
      },
      getImageCertain,
      getValue
    },
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
      background-color #3c3c3c

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
      &--ad1
        > .ad-container
          padding 30px 0
      &--listing
        display flex
        flex-direction row-reverse
        height auto
        justify-content center
        max-width 1100px
        margin 30px auto 0

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
