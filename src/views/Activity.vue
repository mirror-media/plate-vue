<template>
  <div class="activity">
    <a href="/" class="activity__logo">
      <img src="/public/icon/logo_black@3x.png"/>
    </a>
    <share :direction="`right`" :top="`5px`" :left="`55px`" :color="`#000`" style="display: block; z-index: 999;"/>
    <section class="activity-currentNode">
      <nav class="activity-currentNode__nav" @click="toggleNav()">
        <div class="activity-currentNode__nav--menu">
          <span class="hamburgerBar hamburgerBar-1" />
          <span class="hamburgerBar hamburgerBar-2" />
          <span class="hamburgerBar hamburgerBar-3" />
        </div>
      </nav>
      <activity-timelineNav :openNav="openNav" :timelineNodes="timelineNodes" :viewport="viewport" />
      <activity-nodeNav :node="prevNode" :position="`prev`" v-on:goToPrev="goToPrev" />
      <activity-node :currentIndex="currentIndex" :nodes="nodes" :viewport="viewport" />
      <activity-nodeNav :node="nextNode" :position="`next`" v-on:goToNext="goToNext" />
    </section>
  </div>
</template>

<script>

import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
import { disableScroll, enableScroll } from '../utils/comm.js'
import _ from 'lodash'
import ActivityNode from '../components/activity/ActivityNode.vue'
import ActivityNodeNav from '../components/activity/ActivityNodeNav.vue'
import ActivityTimelineNav from '../components/activity/ActivityTimelineNav.vue'
import Share from '../components/Share.vue'
// import moment from 'moment'

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
      deviceHeight: 0,
      doc: {}
    }
  },
  computed: {
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
      return _.get(this.$store.state, [ 'nodes', 'items', this.currentIndex + 1 ]) || _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex + 1 ])
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
      return _.get(this.$store.state, [ 'nodes', 'items', this.currentIndex - 1 ]) || _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex - 1 ])
    },
    timelineNodes () {
      return _.get(this.$store.state, [ 'timeline', 'nodes' ])
    },
    topicId () {
      return _.get(this.$store.state, [ 'activities', 'items', '0', 'topics', 'id' ])
    }

  },
  methods: {
    changeCurrentIndex (index) {
      if (index < this.nodesAmount && index > -1) {
        this.currentIndex = index
      } else if (index >= this.nodesAmount) {
        this.currentIndex = this.nodesAmount - 1
      } else if (index < 0) {
        this.currentIndex = 0
      }
    },
    currentYPosition,
    enableScroll,
    disableScroll,
    elmYPosition,
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
    smoothScroll,
    toggleNav () {
      this.openNav = !this.openNav
    },
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.querySelector('body').offsetWidth
      }
    }
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

    this.disableScroll()
    this.doc = document
    this.deviceHeight = this.doc.documentElement.clientHeight || this.doc.body.clientHeight
    window.addEventListener('wheel', (e) => {
      const _derection = e.wheelDelta
      const currTopY = this.currentYPosition()
      if (_derection > 0 && this.scrollingFlag !== true) {
        this.scrollingFlag = true
        this.changeCurrentIndex(this.currentIndex - 1)
      } else if (_derection < 0 && this.scrollingFlag !== true) {
        this.scrollingFlag = true
        this.changeCurrentIndex(this.currentIndex + 1)
      }
      if (this.scrollingFlag === true) {
        const targElel = this.elmYPosition(`#node-${this.currentIndex}`)
        if (((_derection > 0 && currTopY <= (targElel - 80)) || (_derection < 0 && currTopY >= (targElel - 80))) && Math.abs(_derection) <= 3 && (Math.abs(_derection) < Math.abs(window.tmpWheel))) {
          setTimeout(() => {
            const lastTopY = window.lastTopY || this.currentYPosition()
            this.scrollingFlag = !(lastTopY === currTopY && Math.abs(_derection) <= 3)
          }, 250)
        }
      }
      window.tmpWheel = _derection
    })

    window.addEventListener('scroll', (e) => {
      const currTop = this.currentYPosition()
      window.lastTopY = currTop
    })

    window.addEventListener('touchstart', (e) => {
      const _currTouchClientY = e.pageY
      window.touchClientY = _currTouchClientY
      if (this.scrollingFlag === true) {
        const _currY = this.currentYPosition()
        const _lastTopY = window.lastTopY || this.currentYPosition()
        this.scrollingFlag = !(_lastTopY === _currY)
      }
      if (this.scrollingFlag !== true) {
        this.enableScroll()
      }
    })

    window.addEventListener('touchend', (e) => {
      this.disableScroll()
      const _currTouchClientY = e.pageY
      const _lastTouchClientY = window.touchClientY || _currTouchClientY
      if (this.scrollingFlag !== true && _currTouchClientY > _lastTouchClientY) {
        this.scrollingFlag = true
        this.changeCurrentIndex(this.currentIndex - 1)
      } else if (this.scrollingFlag !== true && _currTouchClientY < _lastTouchClientY) {
        this.scrollingFlag = true
        this.changeCurrentIndex(this.currentIndex + 1)
      }
      window.touchClientY = undefined
    })
  },
  watch: {
    defaultNodeIndex: function () {
      this.currentIndex = _.findIndex(_.get(this.$store.state, [ 'nodes', 'items' ]), this.featureNode)
    },
    currentIndex: function () {
      const currentNodeTop = this.elmYPosition(`#node-${this.currentIndex}`)
      // console.log('currentNodeTop', currentNodeTop)
      // window.scrollTo(0, currentNodeTop - 50)
      // this.smoothScroll(`#node-${this.currentIndex}`)
      const _top = (currentNodeTop - 80 <= 0) ? 1 : currentNodeTop - 80
      this.smoothScroll(null, _top)
    }
  }
}

</script>

<style lang="stylus" scoped>

.activity
  // width 100vw
  // height 100vh
  padding-top 30px
  &-currentNode
    position relative
    // width 100%
    // height 100%
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

  &__logo
    position fixed
    z-index 999
    top 5px
    left 5px
    width 40px
    height 40px
    > img
      width 100%

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
