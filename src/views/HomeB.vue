<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" section="home" :options="dfpOptions">
    <template scope="props" slot="dfpPos">
      <div class="home-view">
        <section style="width: 100%;">
          <app-Header v-if="true" :commonData= 'commonData' />
        </section>
        <vue-dfp :is="props.vueDfp" pos="LPCHD" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <leading v-if="hasEvent" :type="eventType" :mediaData="eventData" :style="{ margin: '30px auto 0' }" class="event" />
        <editor-choice :editorChoice= 'editorChoice' :viewport="viewport" />
        <section class="container list">
          <latest-article :latestArticle= 'latestArticle' :props="props"/>
          <latest-project :projects= 'projects' />
        </section>
        <loading :show="loading" />
        <section class="container">
          <more v-if="hasMore" v-on:loadMore="loadMore" />
        </section>
        <section class="container">
          <vue-dfp :is="props.vueDfp" pos="LPCFT" extClass="desktop-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
          <vue-dfp :is="props.vueDfp" pos="LMBFT" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
          <app-footer v-if="viewport > 599" />
        </section>
      </div>
      <div class="dfp-cover" v-show="showDfpCoverAdFlag && viewport < 1199">
        <div class="ad">
          <vue-dfp :is="props.vueDfp" pos="LMBCVR" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
          <div class="close" @click="closeCoverAd"></div>
        </div>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>

import { currentYPosition, elmYPosition } from 'kc-scroll'
import { unLockJS } from '../utils/comm'
import { DFP_ID, DFP_UNITS, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, FB_APP_ID, FB_PAGE_ID } from '../constants'
import _ from 'lodash'
import Cookie from 'vue-cookie'
import EditorChoice from '../components/EditorChoice.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LatestArticle from '../components/LatestArticle.vue'
import LatestProject from '../components/LatestProject.vue'
import Leading from '../components/Leading.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import moment from 'moment'

const MAXRESULT = 20
const PAGE = 1

const fetchSSRData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'choices' ] })
}

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'posts-vue', 'projects', 'topics' ] })
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
  return store.dispatch('FETCH_LATESTARTICLES', {
    params: {
      'max_results': MAXRESULT,
      'page': page,
      'sort': '-publishedDate'
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
    VueDfpProvider
  },
  preFetch: fetchSSRData,
  beforeRouteEnter (to, from, next) {
    if (process.env.VUE_ENV === 'client' && to.path !== from.path) {
      next(vm => {
        if (!_.get(vm.$store, [ 'state', 'commonData', 'sections', 'items' ], null) || !_.get(vm.$store, [ 'state', 'commonData', 'choices', 'items' ], null)) {
          fetchSSRData(vm.$store)
        }
      })
    } else {
      next()
    }
  },
  data () {
    return {
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      hasScrollLoadMore: _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], PAGE) > 1,
      loading: false,
      page: _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], PAGE),
      showDfpCoverAdFlag: false,
      viewport: undefined
    }
  },
  computed: {
    commonData () {
      return this.$store.state.commonData
    },
    dfpOptions () {
      return {
        afterEachAdLoaded: (event) => {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')
          if (position === 'LMBCVR' || position === 'MBCVR') {
            const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
            if (adDisplayStatus === 'none') {
              this.showDfpCoverAdFlag = false
            } else {
              this.updateCookie()
            }
          }
        },
        setCentering: true
      }
    },
    editorChoice () {
      if (_.get(this.$store.state.editorChoice, [ 'items', 'length' ]) > 4) {
        return _.get(this.$store.state.editorChoice, [ 'items' ])
      } else {
        const orig = _.values(_.get(this.$store.state, [ 'editorChoice', 'items' ]))
        const xorBy = _.xorBy(_.get(this.$store.state, [ 'editorChoice', 'items' ]), _.get(this.$store.state, [ 'latestArticles', 'id' ]), 'title')
        return _.concat(orig, _.take(xorBy, (5 - _.get(this.$store.state.editorChoice, [ 'items', 'length' ]))))
      }
    },
    event () {
      return this.$store.state.event
    },
    eventData () {
      return _.get(this.event, [ 'items', '0' ])
    },
    eventType () {
      return this.is404 ? 'image' : _.get(this.event, [ 'items', '0', 'eventType' ])
    },
    hasEvent () {
      const _eventStartTime = moment(new Date(_.get(this.event, [ 'items', 0, 'startDate' ])))
      const _eventEndTime = moment(new Date(_.get(this.event, [ 'items', 0, 'endDate' ])))
      const _now = moment()
      return (_eventStartTime && _eventEndTime && (_now >= _eventStartTime) && (_now <= _eventEndTime))
    },
    hasMore () {
      return _.get(this.latestArticle, [ 'length' ], 0) < _.get(this.$store.state.latestArticles, [ 'meta', 'total' ], 0)
    },
    latestArticle () {
      const unionBy = _.unionBy(_.get(this.$store.state, [ 'editorChoice', 'items' ]), _.get(this.$store.state, [ 'latestArticles', 'items' ]), 'id')
      const xorBy = _.xorBy(_.get(this.$store.state, [ 'editorChoice', 'items' ]), unionBy, 'id')
      const latestArticle = _.slice(xorBy, (5 - _.get(this.$store.state.editorChoice, [ 'items', 'length' ])))
      return latestArticle
    },
    projects () {
      return _.get(this.commonData, [ 'projects', 'items' ])
    }
  },
  methods: {
    checkIfLockJS () {
      unLockJS()
    },
    closeCoverAd () {
      this.showDfpCoverAdFlag = false
    },
    handleScroll () {
      window.onscroll = (e) => {
        const _latestArticleDiv = document.querySelector('#latestArticle')
        if (!_latestArticleDiv) { return }
        const firstPageArticleHeight = _latestArticleDiv.offsetHeight
        const firstPageArticleBottom = elmYPosition('#latestArticle') + (firstPageArticleHeight)
        const currentBottom = currentYPosition() + window.innerHeight
        if ((currentBottom > firstPageArticleBottom) && !this.hasScrollLoadMore) {
          this.hasScrollLoadMore = true
          this.loadMore()
        }
      }
    },
    loadMore () {
      this.page += 1
      this.loading = true

      fetchLatestArticle(this.$store, this.page).then(() => {
        this.loading = false
      })
    },
    updateCookie () {
      const cookie = Cookie.get('visited')
      if (!cookie) {
        Cookie.set('visited', 'true', { expires: '10m' })
        this.showDfpCoverAdFlag = true
      } else {
        this.showDfpCoverAdFlag = false
      }
    },
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.querySelector('body').offsetWidth
      }
    }
  },
  metaInfo () {
    const title = SITE_TITLE
    const description = SITE_DESCRIPTION

    return {
      title,
      meta: [
          { name: 'keywords', content: '鏡週刊,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說' },
          { name: 'description', content: description },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: '/public/notImage.png' },
          { property: 'fb:app_id', content: FB_APP_ID },
          { property: 'fb:pages', content: FB_PAGE_ID },
          { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:url', content: SITE_URL },
          { property: 'og:image', content: '/public/notImage.png' }
      ]
    }
  },
  beforeMount () {
    fetchCommonData(this.$store)
    fetchEvent(this.$store)
  },
  mounted () {
    // window.utmx('url', 'A/B')
    this.handleScroll()
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.checkIfLockJS()
  }
}

</script>
<style lang="stylus" scoped>
.editorChoice
  margin-top 40px
.home-view
  width 100%
  box-sizing border-box
  padding-bottom 50px 
  
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
