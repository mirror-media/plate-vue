<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId">
    <template scope="props" slot="dfpPos">
      <div class="list-view">
        <app-header :commonData= 'commonData' />
        <leading v-if="type == 'TOPIC'"/>
        <!--<div v-if="type !== 'TOPIC'" id="dfp-test" class="dfp-test"></div>-->
        <vue-dfp :is="props.vueDfp" pos="SPCHD" extClass="full" :dfpUnits="props.dfpUnits" :section="props.section" v-if="type !== 'TOPIC'" /> 
        <div class="list-title container" :class="section">
          <span class="list-title__text" v-text="title"></span>
          <div class="list-title__colorBlock" :class="section"></div>
        </div>
        <article-list :articles='articles.items' />
        <section class="container">
          <more v-if="hasMore" v-on:loadMore="loadMore" />
        </section>
        <section class="footer container">
          <vue-dfp :is="props.vueDfp" pos="SPCFT" :dfpUnits="props.dfpUnits" :section="props.section" />
          <app-footer />
        </section>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>

import { AUTHOR, CATEGORY, SEARCH, SECTION, TAG, TOPIC } from '../constants/index'
import { DFP_ID, DFP_UNITS } from '../constants'
import _ from 'lodash'
import ArticleList from '../components/ArticleList.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import Leading from '../components/Leading.vue'
import More from '../components/More.vue'
import VueDfpProvider from '../utils/plate-vue-dfp/PlateDfpProvider.vue'
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

const fetchArticlesByAuthor = (store, uuid, params) => {
  return store.dispatch('FETCH_ARTICLES', {
    params: Object.assign({
      page: PAGE,
      max_results: MAXRESULT,
      where: {
        '$or' : [
          { writers: uuid },
          { photographers: uuid },
          { camera_man: uuid },
          { designers: uuid },
          { engineers: uuid }
        ]
      },
      sort: '-publishedDate'
    }, params)
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
    VueDfpProvider
  },
  data () {
    return {
      articles: {},
      commonData: this.$store.state.commonData,
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      page: PAGE,
    }
  },
  computed: {
    customCSS () { 
      switch(this.type) {
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['css'], null ) 
        case TOPIC:
          return _.get( _.find( _.get(this.commonData, ['topics', 'items']), { 'id': this.uuid } ), ['style'], null ) 
        default:
          return null
      }
    }, 
    customJS () { 
      switch(this.type) {
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['javascript'], null ) 
        case TOPIC:
          return _.get( _.find( _.get(this.commonData, ['topics', 'items']), { 'id': this.uuid } ), ['javascript'], null ) 
        default:
          return null
      }
    },
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
        default:
          return 'other'
      }
    },
    sectionId() {
      switch(this.type) {
        case CATEGORY:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), (s) => { 
            return _.find(s.categories, { 'id': this.uuid })
          }), ['id'], 'home')
        case SECTION:
          return this.uuid
        default:
          return 'home'
      }      
    },
    sectionStyle () {
      return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['style'] )
    },
    title () {
      switch(this.type) {
        case AUTHOR:
          return this.$route.params.authorName
        case CATEGORY:
          return _.get( _.find( _.get(this.commonData, ['categories']), { 'name': this.$route.params.title } ), ['title'] )
        case SEARCH:
          return this.$route.params.keyword
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['title'] )
          break
        case TAG: 
          return this.$route.params.tagName
        case TOPIC:
          return _.get( _.find( _.get(this.commonData, ['topics', 'items']), { 'id': this.$route.params.topicId } ), ['name'] )
      }
    },
    type () {
      return  _.toUpper( _.split( this.$route.path, '/' )[1] )
    },
    uuid () {
      switch(this.type) {
        case AUTHOR:
          return this.$route.params.authorId
        case CATEGORY:
          return _.get( _.find( _.get(this.commonData, ['categories']), { 'name': this.$route.params.title } ), ['id'] )
        case SEARCH:
          break
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['id'] )
        case TAG:
          return this.$route.params.tagId
        case TOPIC:
          return this.$route.params.topicId
      }
    },
  },
  methods: {
    insertCustomizedMarkup () {
      if(this.customCSS) {
        const custCss = document.createElement('style') 
        custCss.appendChild(document.createTextNode(this.customCSS)) 
        document.querySelector('body').appendChild(custCss) 
      }
      if(this.customJS) {
        const custScript = document.createElement('script') 
        custScript.appendChild(document.createTextNode(this.customJS)) 
        document.querySelector('body').appendChild(custScript) 
      }
    },
    loadMore () {
      this.page += 1

      switch(this.type) {
        case AUTHOR:
          fetchArticlesByAuthor(this.$store, this.uuid, { 
            page: this.page
          }).then(() => {
            this.articles = this.$store.state.articles          
          })
          break
        case SEARCH:
          fetchSearch(this.$store, this.$route.params.keyword, { 
            page: this.page,
            max_results: MAXRESULT
          }).then(() => {
            this.articles = this.$store.state.searchResult
          })
          break
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
              break
            default:
              fetchArticlesByUuid(this.$store, this.uuid, SECTION, { 
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
              })
          }
          break
        default:
          fetchArticlesByUuid(this.$store, this.uuid, this.type, { 
            page: this.page,
            max_results: MAXRESULT
          }).then(() => {
            this.articles = this.$store.state.articlesByUUID
          })
      }
    }
  },
  metaInfo () {
    let title = "鏡傳媒 Mirror Media"
    title = (this.title) ? this.title + ' - ' + title : title
    return {
      title
    }
  },
  beforeMount () {
    switch(this.type) {
      case AUTHOR:
        fetchArticlesByAuthor(this.$store, this.uuid, { 
            page: this.page
          }).then(() => {
          this.articles = this.$store.state.articles          
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
            break
          default:
            fetchArticlesByUuid(this.$store, this.uuid, SECTION, { 
              page: PAGE,
              max_results: MAXRESULT
            }).then(() => {
              this.articles = this.$store.state.articlesByUUID
            })
        }
        break
      default:
        fetchArticlesByUuid(this.$store, this.uuid, this.type, { 
          page: PAGE,
          max_results: MAXRESULT
        }).then(() => {
          this.articles = this.$store.state.articlesByUUID
        })
    }
  },
  mounted() {
    if(this.type === SECTION || this.type === TOPIC) {
      this.insertCustomizedMarkup()
    }
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
      margin-top 40px

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