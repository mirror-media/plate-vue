<template>
  <div class="activity" :style="[ viewport > 899 ? { left: `-${activityStyle}vw` } : {} ]">
    <a href="/" class="activity__logo">
      <img src="/public/icon/logo_black@3x.png" alt="鏡週刊 Mirror Media" />
    </a>
    <share :direction="`right`" :top="`5px`" :left="`55px`" :color="`#000`" :sharePath="`/topic/59151f0ff2179c0d0089b7d5`" class="activity__share" />
    <section class="activity-currentNode">
      <nav class="activity-currentNode__nav">
        <div class="activity-currentNode__nav--menu" @click="toggleNav()">
          <span class="hamburgerBar hamburgerBar-1" />
          <span class="hamburgerBar hamburgerBar-2" />
          <span class="hamburgerBar hamburgerBar-3" />
        </div>
      </nav>
      <activity-timelineNav :openNav="openNav" :timelineNodes="timelineNodes" :viewport="viewport" />
      <activity-nodeNav :node="prevNode" :position="`prev`" v-on:goToPrev="goToPrev" />
      <activity-node :currentIndex="currentIndex" :nodes="nodes" :viewport="viewport" :targNodeTopY="targNodeTopY" v-on:changeCurrIdx="changeCurrentIndex" />
      <activity-nodeNav :node="nextNode" :position="`next`" v-on:goToNext="goToNext" />
      <activity-desktopNodesNav :currentIndex="currentIndex" :nodes="nodes" :nodesAmount="nodesAmount"
        v-on:goToPrev="goToPrev" v-on:goToNext="goToNext" v-on:goToIndex="goToIndex"/>
    </section>
  </div>
</template>

<script>

import { FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE, SITE_URL } from '../constants/index'
import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
import { disableScroll, enableScroll, getTruncatedVal } from '../utils/comm.js'
import _ from 'lodash'
import ActivityDesktopNodesNav from '../components/activity/ActivityDesktopNodesNav.vue'
import ActivityNode from '../components/activity/ActivityNode.vue'
import ActivityNodeNav from '../components/activity/ActivityNodeNav.vue'
import ActivityTimelineNav from '../components/activity/ActivityTimelineNav.vue'
import Share from '../components/Share.vue'
import sanitizeHtml from 'sanitize-html'

const PAGE = 1

const fetchData = (store) => {
  return fetchActivities(store, store.state.route.params.activityId)
  .then(() => {
    return fetchNodes(store, store.state.route.params.activityId, PAGE)
  })
}

const fetchTimeline = (store, id) => {
  return store.dispatch('FETCH_TIMELINE', {
    'id': id
  })
}

const fetchActivities = (store, id) => {
  return store.dispatch('FETCH_ACTIVITIES', {
    'params': {
      where: {
        _id: id
      }
    }
  })
}

const fetchNodes = (store, uuid, page) => {
  return store.dispatch('FETCH_NODES', {
    'params': {
      page: page,
      where: {
        activity: uuid
      }
    }
  })
}

const fetchAllNodes = (store) => {
  const page = _.get(store.state, [ 'nodes', 'meta', 'page' ]) + 1
  return store.dispatch('FETCH_NODES', {
    'params': {
      page: page,
      where: {
        activity: _.get(store.state, [ 'route', 'params', 'activityId' ])
      }
    }
  }).then(() => {
    if (_.get(store.state, [ 'nodes', 'items', 'length' ]) < _.get(store.state, [ 'nodes', 'meta', 'total' ])) {
      fetchAllNodes(store)
    }
  })
}

export default {
  name: 'activity-view',
  preFetch: fetchData,
  components: {
    'activity-desktopNodesNav': ActivityDesktopNodesNav,
    'activity-node': ActivityNode,
    'activity-nodeNav': ActivityNodeNav,
    'activity-timelineNav': ActivityTimelineNav,
    'share': Share
  },
  data () {
    return {
      currentIndex: _.findIndex(this.nodes, this.featureNode),
      openNav: false,
      viewport: 0,
      scrollingFlag: false,
      // activityStyle: `left: -${(this.currentIndex * 100)}vw;`
      targNodeTopY: 0,
      windowHeight: 0
    }
  },
  computed: {
    activityStyle () {
      return this.currentIndex * 100
    },
    activityCurrNodeStyle () {
      return this.currentIndex * 100
    },
    currentNode () {
      return _.get(this.$store.state, [ 'nodes', 'items', this.currentIndex ]) || _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex ])
    },
    defaultNodeIndex () {
      return _.findIndex(_.get(this.$store.state, [ 'nodes', 'items' ]), this.featureNode)
    },
    featureNode () {
      return _.find(_.get(this.$store.state, [ 'nodes', 'items' ]), { 'isFeatured': true })
    },
    hasAllNodes () {
      return _.get(this.$store.state, [ 'nodes', 'items', 'length' ]) >= _.get(this.$store.state, [ 'nodes', 'meta', 'total' ])
    },
    nextNode () {
      return _.get(this.$store.state, [ 'nodes', 'items', this.currentIndex ]) || _.get(this.$store.state, [ 'nodes', 'items', this.currentIndex - 1 ])
    },
    nodes () {
      return _.get(this.$store.state, [ 'nodes', 'items' ])
    },
    nodesAmount () {
      return _.get(this.$store.state, [ 'nodes', 'items', 'length' ])
    },
    page () {
      return _.get(this.$store.state, [ 'nodes', 'meta', 'page' ])
    },
    prevNode () {
      return _.get(this.$store.state, [ 'nodes', 'items', this.currentIndex - 2 ]) || _.get(this.$store.state, [ 'nodes', 'items', this.currentIndex - 1 ])
    },
    timelineNodes () {
      return _.get(this.$store.state, [ 'timeline', 'nodes' ])
    },
    title () {
      return _.get(this.$store.state, [ 'activities', 'items', '0', 'name' ])
    },
    topicId () {
      return _.get(this.$store.state, [ 'activities', 'items', '0', 'topics', 'id' ])
    }
  },
  methods: {
    changeCurrentIndex (index) {
      if (index <= this.nodesAmount && index > -1) {
        this.currentIndex = index
      } else if (index > this.nodesAmount) {
        this.currentIndex = this.nodesAmount - 1
      } else if (index < 0) {
        this.currentIndex = 0
      }
    },
    currentYPosition,
    enableScroll,
    disableScroll,
    elmYPosition,
    getTruncatedVal,
    goToNext () {
      const goTo = this.currentIndex + 1
      if (goTo < this.nodesAmount) {
        this.currentIndex = goTo
      }
    },
    goToPrev () {
      const goTo = this.currentIndex - 1
      if (goTo > -1) {
        this.currentIndex = goTo
      }
    },
    goToIndex (goTo) {
      this.currentIndex = goTo
    },
    smoothScroll,
    toggleNav () {
      if (this.viewport > 899) {
        this.$router.push('/topic/59151f0ff2179c0d0089b7d5')
      } else {
        this.openNav = !this.openNav
      }
    },
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.querySelector('body').offsetWidth
        this.windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      }
    },
    updateTargNodeTopY (_targNodeTopY) {
      this.targNodeTopY = (process.env.VUE_ENV === 'client') ? _targNodeTopY : 0
    }
  },
  beforeRouteLeave (to, from, next) {
    this.enableScroll()
    next()
  },
  beforeMount () {
    fetchTimeline(this.$store, this.topicId)
    if (!this.hasAllNodes) {
      fetchAllNodes(this.$store)
    }
  },
  mounted () {
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    window.ga('send', 'pageview', this.$route.path, { title: `${this.title} - ${SITE_TITLE}` })
  },
  watch: {
    defaultNodeIndex: function () {
      this.currentIndex = _.findIndex(_.get(this.$store.state, [ 'nodes', 'items' ]), this.featureNode)
    },
    currentIndex: function () {}
  },
  metaInfo () {
    const url = `${SITE_URL}${this.$route.path}`
    const title = this.getTruncatedVal(this.title, 11) + ` - ${SITE_TITLE}`
    const ogImage = _.get(this.$store.state, [ 'activities', 'items', '0', 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ], null)
    const image = ogImage || '/public/notImage.png'
    const ogDescription = sanitizeHtml(_.get(this.$store.state, [ 'activities', 'items', '0', 'brief', 'html' ]), { allowedTags: [] })
    const description = ogDescription !== '' ? this.getTruncatedVal(ogDescription, 197) : SITE_DESCRIPTION

    return {
      title,
      meta: [
          { name: 'keywords', content: SITE_KEYWORDS },
          { name: 'description', content: description },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: image },
          { property: 'fb:app_id', content: FB_APP_ID },
          { property: 'fb:pages', content: FB_PAGE_ID },
          { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:url', content: url },
          { property: 'og:image', content: image }
      ]
    }
  }
}

</script>

<style lang="stylus" scoped>

.activity
  // padding-top 50px
  transition left 1s ease
  &-currentNode
    position relative
    &__nav
      position fixed
      z-index 998
      top 0
      left 0
      width 100%
      height 50px
      background-color #fff
      &--menu
        display flex
        flex-direction column
        align-items center
        justify-content space-around
        position absolute
        top 5px
        right 5px
        width 40px
        height 40px
        padding 5px
        background-color #bf272d
        border-radius 50%
        cursor pointer

  &__logo
    position fixed
    z-index 999
    top 5px
    left 5px
    width 40px
    height 40px
    > img
      width 100%
  &__desktopNodesNav
    display none
  &__share
    display block
    z-index 999

@media only screen and (max-width: 736px) and (orientation: landscape)
  .activity
    &__logo
      display none
    &-currentNode
      &__nav
        display none
    &__share
      display none
    


@media only screen and (min-width: 900px)
  .activity
    padding 0
    &-currentNode
       &__nav
        height 40px
        background-color transparent
        &--menu
          z-index 1001
          right 20px
          width 40px
          height 40px
          border-radius 50%

.hamburgerBar
  display block
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 20px
  height 1.5px
  background-color #fff
  &-1
    top calc(50% - 6px)
  &-3
    top calc(50% + 6px)
</style>
