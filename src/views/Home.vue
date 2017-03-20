<template>
  <div class="home-view">
    <app-Header :commonData= 'commonData' />
    <leading v-if="hasEvent" :type="eventType" :mediaData="eventData" :style="{ margin: '30px auto 0' }" :class="event" />
    <editor-choice :editorChoice= 'editorChoice'/>
    <section class="container list">
      <latest-article :latestArticle= 'latestArticle' />
      <latest-project :projects= 'projects' />
    </section>
    <loading :show="loading" />
    <section class="container">
      <more v-if="hasMore" v-on:loadMore="loadMore" />
    </section>
    <section class="container">
      <app-footer />
    </section>
  </div>
</template>

<script>

import { currentYPosition, elmYPosition } from 'kc-scroll'
import { DFP_ID, DFP_UNITS } from '../constants'
import _ from 'lodash'
import EditorChoice from '../components/EditorChoice.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LatestArticle from '../components/LatestArticle.vue'
import LatestProject from '../components/LatestProject.vue'
import Leading from '../components/Leading.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import VueDfpProvider from 'kc-vue-dfp/DfpProvider.vue'
import moment from 'moment'
import truncate from 'truncate'

const MAXRESULT = 20
const PAGE = 1

const fetchSSRData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'choices' ] } )
}

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'posts-vue', 'projects', 'topics' ] } )
}

const fetchEvent = (store) => {
  return store.dispatch('FETCH_EVENT', {
    params: {
      'max_results': 1,
      'where': {
        isFeatured: true
      }
    }
  })
}

const fetchLatestArticle = (store, page) => {
  return store.dispatch('FETCH_LATESTARTICLE', {
    params: {
      'max_results': MAXRESULT,
      'page': page,
      'sort':'-publishedDate'
    }
  })
}

export default {
  name: 'home-view',
  components: {
    'app-footer': Footer,
    'app-Header': Header,
    'editor-choice': EditorChoice,
    'latest-article': LatestArticle,
    'latest-project': LatestProject,
    'leading': Leading,
    'loading': Loading,
    'more': More,
  },
  preFetch: fetchSSRData,
  beforeRouteEnter (to, from, next) {
    if(process.env.VUE_ENV === 'client' && to.path !== from.path) {
      next(vm => {
        fetchSSRData(vm.$store)
        fetchCommonData(vm.$store)
        fetchEvent(vm.$store)
      })
    } else {
      next()
    }
  },
  data () {
    return {
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      hasScrollLoadMore: false,
      loading: false,
      page: PAGE,
    }
  },
  computed: {
    commonData () {
      return this.$store.state.commonData
    },
    editorChoice () {
      if ( _.get(this.$store.state.editorChoice, ['items', 'length']) > 4) {
        return _.get(this.$store.state.editorChoice, ['items'])
      } else {
        let orig = _.values(this.$store.state.editorChoice['items'])
        let xorBy = _.xorBy(this.$store.state.editorChoice['items'], this.$store.state.latestArticle['items'], 'title')
        return _.concat(orig, _.take(xorBy, (5 - _.get(this.$store.state.editorChoice, ['items', 'length']))))
      }
    },
    event () {
      return this.$store.state.event
    },
    eventData () {
      return _.get(this.event, ['items', '0'])
    },
    eventType () {
      return this.is404 ? 'image' : _.get(this.event, ['items', '0', 'eventType'])
    },
    hasEvent () {
      const _eventStartTime = moment(new Date(_.get(this.event, ['items', 0, 'startDate'])))
      const _eventEndTime = moment(new Date(_.get(this.event, ['items', 0, 'endDate'])))
      const _now = moment()
      return (_eventStartTime && _eventEndTime && (_now >= _eventStartTime) && (_now <= _eventEndTime)) ? true : false
    },
    hasMore () {
      return _.get(this.latestArticle, [ 'length' ], 0) < _.get(this.$store.state.latestArticle, [ 'meta', 'total' ], 0)
    },
    latestArticle () {
      let xorBy = _.xorBy(this.$store.state.editorChoice['items'], this.$store.state.latestArticle['items'], 'id')
      let latestArticle = _.slice(xorBy, (5 - _.get(this.$store.state.editorChoice, ['items', 'length'])))
      return latestArticle
    },
    projects () {
      return _.get(this.commonData, ['projects', 'items'])
    }
  },
  methods: {
    loadMore () {
      this.page += 1
      this.loading = true
      fetchLatestArticle(this.$store, this.page).then(() => {
        this.loading = false
      })
    },
    handleScroll () {
      window.onscroll = (e) => {
        const _latestArticleDiv = document.querySelector('#latestArticle')
        if(!_latestArticleDiv) { return }
        let firstPageArticleHeight = _latestArticleDiv.offsetHeight
        let firstPageArticleBottom = elmYPosition('#latestArticle') + ( firstPageArticleHeight )
        let currentBottom = currentYPosition() + window.innerHeight
        if ( ( currentBottom > firstPageArticleBottom ) && !this.hasScrollLoadMore) {
          this.hasScrollLoadMore = true
          this.loadMore()
        }
      } 
    }
  },
  metaInfo () {
    const title = '鏡傳媒 Mirror Media'
    return {
      title
    }
  },
  beforeMount() {
    fetchCommonData(this.$store)
    fetchEvent(this.$store)
  },
  mounted() {
    this.handleScroll()
  }
}
  
</script>
<style lang="stylus" scoped>
.editorChoice
  margin-top 40px
.home-view
  width 100%
  box-sizing border-box
  h2 
    margin: 0;
    font-family Noto Sans TC,sans-serif
    font-size 18px
    font-weight 700
    line-height 1.5
    letter-spacing .5px
    color rgba(0,0,0,.8)
    list-style-type none

.list
  &.container
    flex-direction row
    flex-wrap wrap
    align-items flex-start
    width 100%

@media (min-width: 600px)
  .list
    &.container
      width 100%
      padding 0 2em

@media (min-width: 1200px)
  .list
    &.container
      width 1024px
      padding 0
    
</style>