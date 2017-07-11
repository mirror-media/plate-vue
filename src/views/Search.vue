<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="`other`" :options="dfpOptions" :mode="dfpMode">
    <template scope="props" slot="dfpPos">
      <div class="search-view">
        <section style="width: 100%;">
          <app-header :commonData= 'commonData' :eventLogo="eventLogo" :viewport="viewport" :props="props"/>
        </section>
        <div class="search-title container">
          <span class="search-title__text" v-text="title"></span>
          <div class="search-title__colorBlock"></div>
        </div>
        <article-list :articles='articles.items' />
        <loading :show="loading" />
        <section class="container">
          <more v-if="hasMore" v-on:loadMore="loadMore" />
        </section>
        <section class="footer container">
          <app-footer />
        </section>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>

import _ from 'lodash'
import { DFP_ID, DFP_UNITS } from '../constants'
import { FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { unLockJS, currEnv } from '../util/comm'
import ArticleList from '../components/ArticleList.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import titleMetaMixin from '../util/mixinTitleMeta'

const MAXRESULT = 12
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'topics' ] })
}

const fetchSearch = (store, keyword, params) => {
  return store.dispatch('FETCH_SEARCH', {
    'keyword': keyword,
    'params': params
  })
}

const fetchData = (store) => {
  return fetchCommonData(store).then(() => {
    return fetchSearch(store, store.state.route.params.keyword, {
      page: PAGE,
      max_results: MAXRESULT
    })
  })
}

const fetchEvent = (store, eventType = 'embedded') => {
  return store.dispatch('FETCH_EVENT', {
    params: {
      'max_results': 1,
      'where': {
        isFeatured: true,
        eventType: eventType
      }
    }
  })
}

export default {
  name: 'search-view',
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-list': ArticleList,
    'loading': Loading,
    'more': More,
    'vue-dfp-provider': VueDfpProvider
  },
  asyncData ({ store }) {
    return fetchData(store)
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    const title = (this.title) ? `${this.title} - ${SITE_TITLE}` : SITE_TITLE
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`
    return {
      title: title,
      meta: `
        <meta name="mm-opt" content="">
        <meta name="keywords" content="${SITE_KEYWORDS}">
        <meta name="description" content="${SITE_DESCRIPTION}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${SITE_DESCRIPTION}">
        <meta name="twitter:image" content="${SITE_OGIMAGE}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="${SITE_TITLE}">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${SITE_DESCRIPTION}">
        <meta property="og:url" content="${ogUrl}">
        <meta property="og:image" content="${SITE_OGIMAGE}">
      `
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      fetchSearch(vm.$store, to.params.keyword, {
        page: PAGE,
        max_results: MAXRESULT
      })
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.page = PAGE
    fetchSearch(this.$store, to.params.keyword, {
      page: PAGE,
      max_results: MAXRESULT
    }).then(() => {
      next()
    })
  },
  data () {
    return {
      commonData: this.$store.state.commonData,
      loading: false,
      page: PAGE,
      viewport: undefined,
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS
    }
  },
  computed: {
    articles () {
      return this.$store.state.searchResult
    },
    eventLogo () {
      return _.get(this.$store.state.eventLogo, [ 'items', '0' ])
    },
    hasMore () {
      return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'nbHits' ], 0)
    },
    title () {
      return this.$route.params.keyword
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
    }
  },
  methods: {
    checkIfLockJS () {
      unLockJS()
    },
    loadMore () {
      this.page += 1
      this.loading = true
      fetchSearch(this.$store, this.$route.params.keyword, {
        page: this.page,
        max_results: MAXRESULT
      }).then(() => {
        this.loading = false
      })
    },
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.querySelector('body').offsetWidth
      }
    },
    updateSysStage () {
      this.dfpMode = currEnv()
    }
  },
  beforeMount () {
    fetchEvent(this.$store, 'logo')
  },
  mounted () {
    this.checkIfLockJS()
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.updateSysStage()

    window.ga('set', 'contentGroup1', '')
    window.ga('set', 'contentGroup2', '')
    window.ga('set', 'contentGroup3', '')
    window.ga('send', 'pageview', { title: `${this.title} - ${SITE_TITLE}`, location: this.$route.path })
  },
  updated () {
    this.updateSysStage()
  },
  watch: {
    title: function () {
      if (process.env.VUE_ENV === 'client') {
        window.ga('send', 'pageview', { title: `${this.title} - ${SITE_TITLE}`, location: this.$route.path })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.search
  &-title
    &.container
      position: relative
      align-items: center
      flex-direction row
      margin-top 40px
      padding 0 2em
    &__text
        font-size 3rem
    &__colorBlock
      flex-grow 1
      height 10px
      margin-left: 10px
      background linear-gradient(to right, #bcbcbc 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

@media (min-width: 600px)
  .search
    &-title
      &.container
        padding-left 10px
</style>
