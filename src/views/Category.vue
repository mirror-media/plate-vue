<template>
  <div class="category-view">
    <app-header :commonData= 'commonData' />
    <div id="dfp-test" class="dfp-test">DFP 970 X 250</div>
    <div class="category-title container" :class="this.section">
      <span class="category-title__text" v-text="category"></span>
      <div class="category-title__colorBlock" :class="this.section"></div>
    </div>
    <article-list :articles='articles' />
    <section class="container">
      <more v-if="hasMore" v-on:loadMore="loadMore" />
    </more>
    <section class="footer container">
      <app-footer />
    </app-footer>
  </div>
</template>

<script>

import { CATEGORY } from '../constants/index'
import _ from 'lodash'
import ArticleList from '../components/ArticleList.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import More from '../components/More.vue'
import truncate from 'truncate'

const MAXRESULT = 12
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { })
}

const fetchArticlesByUuid = (store, uuid, type, params) => {
  return store.dispatch('FETCH_ARTICLES_BY_UUID', { 
    'uuid': uuid,
    'type': type,
    'params': params
  })
}

export default {
  name: 'category-view',
  preFetch: fetchCommonData,
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-list': ArticleList,
    'more': More,
  },
  data () {
    return {
      articles: {},
      commonData: this.$store.state.commonData,
      page: PAGE,
    }
  },
  computed: {
    category () {
      return _.get( _.find( _.get(this.commonData, ['categories']), { 'name': this.$route.params.title } ), ['title'] )
    },
    categoryID () {
      return _.get( _.find( _.get(this.commonData, ['categories']), { 'name': this.$route.params.title } ), ['id'] )
    },
    hasMore () {
      return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'meta', 'total' ], 0)
    },
    section() {
      return _.get( _.find( _.get(this.commonData, ['sections', 'items']), (s) => { 
        return _.find(s.categories, { 'id': this.categoryID })
      }), ['name'])

    }
  },
  methods: {
    loadMore () {
      this.page += 1
      fetchArticlesByUuid(this.$store, this.categoryID, CATEGORY, { 
        page: this.page,
        max_results: MAXRESULT
      }).then(() => {
        this.articles = this.$store.state.articlesByUUID
      })
    }
  },
  metaInfo () {
    const title = this.category + ' - 鏡傳媒 Mirror Media'
    return {
      title
    }
  },
  beforeMount () {
    fetchArticlesByUuid(this.$store, this.categoryID, CATEGORY, { 
      page: PAGE,
      max_results: MAXRESULT
    }).then(() => {
      this.articles = this.$store.state.articlesByUUID
    })
  },
  mounted() {

  }
}
  
</script>
<style lang="stylus" scoped>

$color-news = #30bac8
$color-entertainment = #bf3284
$color-foodtravel = #eac151
$color-watch = #c1d16e
$color-projects = #000
$color-other = #bcbcbc

.category
  &-view
    background-color #f2f2f2

  &-title
    &.container
      position: relative
      align-items: center
      flex-direction row

    &__text
      font-size 3rem

    &__colorBlock
      flex-grow 1
      height 10px
      margin-left: 10px
      &.news-people
        background linear-gradient(to right, $color-news 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.entertainment
        background linear-gradient(to right, $color-entertainment 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.foodtravel
        background linear-gradient(to right, $color-foodtravel 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.watch
        background linear-gradient(to right, $color-watch 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.projects
        background linear-gradient(to right, $color-projects 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.other
        background linear-gradient(to right, $color-other 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)


.footer
  &.container
    flex-direction column
    align-items stretch

.news-people
  color $color-news

.entertainment
  color $color-entertainment

.foodtravel
  color $color-foodtravel

.watch
  color $color-watch

.projects
  color $color-projects

.other
  color $color-other
  
</style>