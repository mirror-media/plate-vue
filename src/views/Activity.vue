<template>
  <div class="activity">
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
    'share': Share,
  },
  data () {
    return {
      currentIndex: _.findIndex(this.nodes, this.featureNode),
      openNav: false,
      viewport: 0
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
    changeCurrentIndex(index) {
      this.currentIndex = index
    },
    currentYPosition,
    elmYPosition,
    goToNext () {
      let goTo = this.currentIndex + 1
      if (goTo < this.nodesAmount) {
        this.currentIndex = goTo
      }
    },
    goToPrev () {
      let goTo = this.currentIndex - 1
      if (goTo > -1) {
        this.currentIndex = goTo
      }
    },
    smoothScroll,
    toggleNav() {
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
    const nodeHeight = document.querySelector('.activityNodeSlider').offsetHeight
    const nodesContainer = document.querySelector(".activityNode-nodeContainer")
    
    window.addEventListener('scroll', (e) => {
      // let goToIndex = Math.round(this.currentYPosition() / nodeHeight)
      // if (goToIndex !== this.currentIndex) {
      //   this.changeCurrentIndex(goToIndex)
      // }
      // console.log('window', window)
    })

    let currentClientY
    window.addEventListener('touchstart', (e) => {
      currentClientY = e.touches[0].clientY
    })

    window.addEventListener('touchend', (e) => {
      let windowDeltaY
      windowDeltaY = e.changedTouches[0].clientY - currentClientY

      // if (windowDeltaY > 20) {
      //   this.goToPrev()
      // }
      // if (windowDeltaY < -20) {
      //   this.goToNext()
      // }
    })
  },
  watch: {
    defaultNodeIndex: function () {
      this.currentIndex = _.findIndex(_.get(this.$store.state, [ 'nodes', 'items' ]), this.featureNode)
    },
    currentIndex: function () {
      const currentNodeTop = this.elmYPosition(`#node-${this.currentIndex}`)
      console.log('this.currentIndex', this.currentIndex)
      console.log('currentNodeTop', currentNodeTop)
      window.scrollTo(0, currentNodeTop - 50)
      // this.smoothScroll(null, currentNodeTop - 50)
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
      z-index 999
      top 0
      left 0
      width 100%
      height 30px
      background-color #fff
      &--menu
        display flex
        flex-direction column
        align-items center
        justify-content space-around
        position absolute
        top 5px
        right 5px
        width 20px
        height 20px
        padding 5px
        background-color #bf272d
        border-radius 10px

.hamburgerBar
  display block
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 10px
  height 1px
  background-color #fff
  &-1
    top calc(50% - 4px)
  &-3
    top calc(50% + 4px)
</style>
