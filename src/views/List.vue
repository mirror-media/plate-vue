<template>
  <div class="list-view">
    <app-header :commonData= 'commonData' />
    <leading v-if="type == 'TOPIC'"/>
    <div v-if="type !== 'TOPIC'" id="dfp-test" class="dfp-test">DFP 970 X 250</div>
    <div class="list-title container" :class="section">
      <span class="list-title__text" v-text="title"></span>
      <div class="list-title__colorBlock" :class="section"></div>
    </div>
    <article-list :articles='articles.items' />
    <section class="container">
      <more v-if="hasMore" v-on:loadMore="loadMore" />
    </more>
    <section class="footer container">
      <app-footer/>
    </app-footer>
  </div>
</template>

<script>

import { CATEGORY, SEARCH, SECTION, TAG, TOPIC } from '../constants/index'
import _ from 'lodash'
import ArticleList from '../components/ArticleList.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import Leading from '../components/Leading.vue'
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

const fetchSearch = (store, keyword, params) => {
  return store.dispatch('FETCH_SEARCH', { 
    'keyword': keyword,
    'params': params
  })
}

const fetchData = (store) => {
  return fetchCommonData(store)
}

export default {
  name: 'list-view',
  preFetch: fetchData,
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-list': ArticleList,
    'leading': Leading,
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
    hasMore () {
      switch(this.type) {
        case SEARCH:
          return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'nbHits' ], 0)
          break
        default:
          return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'meta', 'total' ], 0)
      }
    },
    section () {
      switch(this.type) {
        case CATEGORY:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), (s) => { 
            return _.find(s.categories, { 'id': this.uuid })
          }), ['name'])
        case SEARCH:
          return 'other'
        case SECTION:
          return this.$route.params.title
        case TOPIC:
          return 'other'
      }
    },
    sectionStyle () {
      return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['style'] )
    },
    title () {
      switch(this.type) {
        case CATEGORY:
          return _.get( _.find( _.get(this.commonData, ['categories']), { 'name': this.$route.params.title } ), ['title'] )
        case SEARCH:
          return this.$route.params.keyword
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['title'] )
          break
        case TOPIC:
          return _.get( _.find( _.get(this.commonData, ['topics', 'items']), { 'id': this.$route.params.topicId } ), ['name'] )
      }
    },
    type () {
      return  _.toUpper( _.split( this.$route.path, '/' )[1] )
    },
    uuid () {
      switch(this.type) {
        case CATEGORY:
          return _.get( _.find( _.get(this.commonData, ['categories']), { 'name': this.$route.params.title } ), ['id'] )
        case SEARCH:
          break
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['id'] )
        case TOPIC:
          return this.$route.params.topicId
      }
    },
  },
  methods: {
    loadMore () {
      this.page += 1

      switch(this.type) {
        case CATEGORY:
          fetchArticlesByUuid(this.$store, this.uuid, CATEGORY, { 
            page: this.page,
            max_results: MAXRESULT
          }).then(() => {
            this.articles = this.$store.state.articlesByUUID
          })
        case SEARCH:
          fetchSearch(this.$store, this.$route.params.keyword, { 
            page: this.page,
            max_results: MAXRESULT
          }).then(() => {
            this.articles = this.$store.state.searchResult
          })
        case SECTION:
          switch (this.sectionStyle) {
            case 'full':
              fetchArticlesByUuid(this.$store, this.uuid, SECTION, { 
                page: this.page,
                max_results: MAXRESULT,
                related: 'full'
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
              })
            default:
              fetchArticlesByUuid(this.$store, this.uuid, SECTION, { 
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
              })
          }
        case TOPIC:
          fetchArticlesByUuid(this.$store, this.uuid, TOPIC, { 
            page: this.page,
            max_results: MAXRESULT
          }).then(() => {
            this.articles = this.$store.state.articlesByUUID
          })
      }
    }
  },
  metaInfo () {
    const title = this.title + ' - 鏡傳媒 Mirror Media'
    return {
      title
    }
  },
  beforeMount () {
    switch(this.type) {
      case CATEGORY:
        fetchArticlesByUuid(this.$store, this.uuid, CATEGORY, { 
          page: PAGE,
          max_results: MAXRESULT
        }).then(() => {
          this.articles = this.$store.state.articlesByUUID
        })
        break
      case SEARCH:
        fetchSearch(this.$store, this.$route.params.keyword, { 
          page: PAGE,
          max_results: MAXRESULT
        }).then(() => {
          this.articles = this.$store.state.searchResult
        })
        break
      case SECTION:
        switch (this.sectionStyle) {
          case 'full':
            fetchArticlesByUuid(this.$store, this.uuid, SECTION, { 
              page: PAGE,
              max_results: MAXRESULT,
              related: 'full'
            }).then(() => {
              this.articles = this.$store.state.articlesByUUID
            })
          default:
            fetchArticlesByUuid(this.$store, this.uuid, SECTION, { 
              page: PAGE,
              max_results: MAXRESULT
            }).then(() => {
              this.articles = this.$store.state.articlesByUUID
            })
        }
        break
      case TOPIC:
        fetchArticlesByUuid(this.$store, this.uuid, TOPIC, { 
          page: PAGE,
          max_results: MAXRESULT
        }).then(() => {
          this.articles = this.$store.state.articlesByUUID
        })
        break
    }
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

.list
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