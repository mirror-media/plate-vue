<template>
  <div class="search-view">
    <section style="width: 100%;">
      <app-header :commonData= 'commonData' />
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

<script>

import _ from 'lodash'
import { FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { unLockJS } from '../utils/comm'
import ArticleList from '../components/ArticleList.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'

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

export default {
  name: 'search-view',
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-list': ArticleList,
    'loading': Loading,
    'more': More
  },
  preFetch: fetchData,
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
      page: PAGE
    }
  },
  computed: {
    articles () {
      return this.$store.state.searchResult
    },
    hasMore () {
      return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'nbHits' ], 0)
    },
    title () {
      return this.$route.params.keyword
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
    }
  },
  metaInfo () {
    const title = (this.title) ? `${this.title} - ${SITE_TITLE}` : SITE_TITLE
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`
    return {
      title,
      meta: [
        { name: 'keywords', content: SITE_KEYWORDS },
        { name: 'description', content: SITE_DESCRIPTION },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: SITE_OGIMAGE },
        { property: 'fb:app_id', content: FB_APP_ID },
        { property: 'fb:pages', content: FB_PAGE_ID },
        { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
        { property: 'og:locale', content: 'zh_TW' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: ogUrl },
        { property: 'og:image', content: SITE_OGIMAGE }
      ]
    }
  },
  mounted () {
    this.checkIfLockJS()

    window.ga('set', 'contentGroup1', '')
    window.ga('send', 'pageview', this.$route.path, { title: `${this.title} - ${SITE_TITLE}` })
  },
  watch: {
    title: function () {
      window.ga('set', 'contentGroup1', '')
      window.ga('send', 'pageview', this.$route.path, { title: `${this.title} - ${SITE_TITLE}` })
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
