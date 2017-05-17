<template>
  <div class="activity">
    <section class="activity-currentNode">
      <activity-nodeNav :node="prevNode" :position="`prev`"/>
      <activity-node :defaultNodeIndex="defaultNodeIndex" :nodes="nodes" :viewport="viewport" />
      <activity-nodeNav :node="nextNode" :position="`next`"/>
    </section>
  </div>
</template>

<script>

import _ from 'lodash'
import ActivityNode from '../components/activity/ActivityNode.vue'
import ActivityNodeNav from '../components/activity/ActivityNodeNav.vue'
// import moment from 'moment'

const PAGE = 1

const fetchData = (store) => {
  return fetchNodes(store, store.state.route.params.activityId, PAGE)
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
    'activity-nodeNav': ActivityNodeNav
  },
  data () {
    return {
      currentNode: _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex ]),
      nextNode: _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex + 1 ]),
      prevNode: _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex - 1 ]),
      viewport: 0
    }
  },
  computed: {
    defaultNodeIndex () {
      return _.findIndex(_.get(this.$store.state, [ 'nodes', 'items' ]), this.featureNode)
    },
    featureNode () {
      return _.find(_.get(this.$store.state, [ 'nodes', 'items' ]), { 'isFeatured': true })
    },
    hasAllNodes () {
      return _.get(this.$store.state, [ 'nodes', 'items', 'length' ]) >= _.get(this.$store.state, [ 'nodes', 'meta', 'total' ])
    },
    nodes () {
      return _.get(this.$store.state, [ 'nodes', 'items' ])
    },
    page () {
      return _.get(this.$store.state, [ 'nodes', 'meta', 'page' ])
    }
  },
  methods: {
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.querySelector('body').offsetWidth
      }
    }
  },
  beforeMount () {
    if (!this.hasAllNodes) {
      fetchAllNodes(this.$store)
    }
  },
  mounted () {
    this.updateViewport()

    window.addEventListener('resize', () => {
      this.updateViewport()
    })
  },
  watch: {
    defaultNodeIndex: function () {
      this.currentNode = _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex ])
    },
    currentNode: function () {
      this.nextNode = _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex + 1 ])
      this.prevNode = _.get(this.$store.state, [ 'nodes', 'items', this.defaultNodeIndex - 1 ])
    }
  }
}

</script>

<style lang="stylus" scoped>
.activity
  width 100vw
  height 100vh
  padding-top 30px
  &-currentNode
    position relative
    width 100%
    height 100%
      
</style>
