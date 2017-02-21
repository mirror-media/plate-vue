<template>
  <div class="section-view">
    <app-header :commonData= 'commonData' />
    <div id="dfp-test" class="dfp-test">DFP 970 X 250</div>
    <div class="section-title container" :class="this.$route.params.title">
      <span class="section-title__text" v-text="section"></span>
      <div class="section-title__colorBlock" :class="this.$route.params.title"></div>
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

import { SECTION } from '../constants/index'
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

const fetchData = (store) => {
  return fetchCommonData(store)
}

export default {
  name: 'section-view',
  preFetch: fetchData,
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
    section () {
      return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['title'] )
    },
    sectionID () {
      return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['id'] )
    },
    hasMore () {
      return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'meta', 'total' ], 0)
    },
    sectionStyle () {
      return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['style'] )
    },
    customCSS () {
      return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['css'], null )
    },
    customJS () {
      return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['javascript'], null )
    }
  },
  methods: {
    loadMore () {
      this.page += 1
      switch (this.sectionStyle) {
        case 'full':
          fetchArticlesByUuid(this.$store, this.sectionID, SECTION, {
            page: this.page,
            max_results: MAXRESULT,
            related: 'full'
          }).then(() => {
            this.articles = this.$store.state.articlesByUUID
          })
        default:
          fetchArticlesByUuid(this.$store, this.sectionID, SECTION, {
            page: this.page,
            max_results: MAXRESULT
          }).then(() => {
            this.articles = this.$store.state.articlesByUUID
          })
      }
    }
  },
  metaInfo () {
    const title = this.section + ' - 鏡傳媒 Mirror Media'
    return {
      title
    }
  },
  beforeMount () {
    switch (this.sectionStyle) {
      case 'full':
        fetchArticlesByUuid(this.$store, this.sectionID, SECTION, {
          page: PAGE,
          max_results: MAXRESULT,
          related: 'full'
        }).then(() => {
          this.articles = this.$store.state.articlesByUUID
        })
      default:
        fetchArticlesByUuid(this.$store, this.sectionID, SECTION, {
          page: PAGE,
          max_results: MAXRESULT
        }).then(() => {
          this.articles = this.$store.state.articlesByUUID
        })
    }
  },
  mounted() {
    const custCss = document.createElement('style')
    const custScript = document.createElement('script')
    custCss.appendChild(document.createTextNode(this.customCSS))
    custScript.appendChild(document.createTextNode(this.customJS))
    document.querySelector('body').appendChild(custCss)
    document.querySelector('body').appendChild(custScript)
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

.section
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
