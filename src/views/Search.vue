<template>
  <div class="search-view">
    <app-header :commonData= 'commonData' />
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
import ArticleList from '../components/ArticleList.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'

const MAXRESULT = 12
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { })
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
    'more': More,
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
    })
    next()
  },
  data () {
    return {
      commonData: this.$store.state.commonData,
      loading: false,
      page: PAGE,
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
    let title = "鏡傳媒 Mirror Media"
    title = (this.title) ? this.title + ' - ' + title : title
    return {
      title
    }
  },
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