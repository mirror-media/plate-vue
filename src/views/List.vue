<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId">
    <template scope="props" slot="dfpPos">
      <div class="list-view">
        <app-header :commonData= 'commonData' />
        <div class="topic" v-if="type == 'TOPIC'">
          <div class="topic-title"><h1></h1></div>
          <leading :type="getValue(topic, [ 'leading' ])" v-if="getValue(topic, [ 'leading' ])" :mediaData="topic"/>
        </div>
        <!--<div v-if="type !== 'TOPIC'" id="dfp-test" class="dfp-test"></div>-->
        <vue-dfp :is="props.vueDfp" pos="SPCHD" extClass="full" :dfpUnits="props.dfpUnits" :section="props.section" v-if="type !== 'TOPIC'" /> 
        <div class="list-title container" :class="section">
          <span class="list-title__text" v-text="title"></span>
          <div class="list-title__colorBlock" :class="section"></div>
        </div>
        <article-list :articles='articles.items'>
          <vue-dfp :is="props.vueDfp" pos="TEST" :dfpUnits="props.dfpUnits" :section="props.section"/>
        </article-list>
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
import { getValue } from '../utils/comm'
import _ from 'lodash'
import ArticleList from '../components/ArticleList.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import Leading from '../components/Leading.vue'
import More from '../components/More.vue'
import VueDfpProvider from 'kc-vue-dfp/DfpProvider.vue'
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

const fetchTopicByUuid = (store, uuid) => {
  return store.dispatch('FETCH_TOPIC_BY_UUID', { 
    'params': {
      where: {
        _id: uuid
      }
    }
  })
}

const fetchTopicImagesByUuid = (store, uuid, type, params) => {
  return store.dispatch('FETCH_IMAGES', { 
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
  return fetchCommonData(store).then(() => {
    const _type = _.toUpper( _.split( store.state.route.path, '/' )[1] )
    const _sectionStyle = _.get( _.find( _.get(store.state.commonData, ['sections', 'items']), { 'name': store.state.route.params.title } ), ['style'] )
    let uuid

    switch(_type) {
      case AUTHOR:
        uuid = store.state.route.params.authorId
        return fetchArticlesByAuthor(store, uuid, { 
          page: PAGE
        })
        break
      case SEARCH:
        return fetchSearch(store, store.state.route.params.keyword, { 
          page: PAGE,
          max_results: MAXRESULT
        })
        break
      case SECTION:
        uuid = _.get( _.find( _.get(store.state.commonData, ['sections', 'items']), { 'name': store.state.route.params.title } ), ['id'] )
        switch(_sectionStyle) {
          case 'full':
            return fetchArticlesByUuid(store, uuid, SECTION, { 
              page: PAGE,
              max_results: MAXRESULT,
              related: 'full'
            })
            break
          default:
            return fetchArticlesByUuid(store, uuid, SECTION, { 
              page: PAGE,
              max_results: MAXRESULT
            })
        }
        break
      default:
        switch(_type) {
          case CATEGORY:
            uuid = _.get( _.find( _.get(store.state.commonData, ['categories']), { 'name': store.state.route.params.title } ), ['id'] )
            break
          case TAG:
            uuid = store.state.route.params.tagId
            break
          case TOPIC:
            uuid = store.state.route.params.topicId
            break
        }
        return fetchArticlesByUuid(store, uuid, _type, { 
          page: PAGE,
          max_results: MAXRESULT
        })
    }

    if(_type === TOPIC) {
      const _uuid = store.state.route.params.topicId
      const _topic = _.find( _.get(store.state.commonData, ['topics', 'items']), { 'id': _uuid } )
      return (!_topic) ? fetchTopicByUuid(store, _uuid).then(() => {
        return fetchTopicImagesByUuid(store, _uuid, _type, {
          max_results: 25
        })
      }) : null
    } else {
      return
    }
  })
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
      commonData: this.$store.state.commonData,
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      page: PAGE,
    }
  },
  computed: {
    articles () {
      switch(this.type) {
        case AUTHOR:
          return this.$store.state.articles
          break
        case SEARCH:
          return this.$store.state.searchResult
          break
        default:
          return this.$store.state.articlesByUUID
      }
    },
    customCSS () { 
      switch(this.type) {
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['css'], null ) 
        case TOPIC:
          const _style = _.get(this.topic , ['style'], null )
          return _style
        default:
          return null
      }
    }, 
    customJS () { 
      switch(this.type) {
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['javascript'], null ) 
        case TOPIC:
          const _javascript = _.get(this.topic , ['javascript'], null )
          return _javascript
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
    topic() {
      if(this.type === TOPIC) {
        return (this.$store.state.topic.items) ? 
          Object.assign(this.$store.state.topic.items[ 0 ], { images: this.$store.state.images })
          : _.find( _.get(this.commonData, ['topics', 'items']), { 'id': this.uuid } )
      } else {
        return this.$store.state.topic
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
    },
    getValue
  },
  metaInfo () {
    let title = "鏡傳媒 Mirror Media"
    title = (this.title) ? this.title + ' - ' + title : title
    return {
      title
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
    .topic
      width 100%
      height 700px
      background-color rgba(135, 156, 169, 0.15)
      margin-bottom 20px
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      /*display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;*/
      padding 50px
      
      &-title
        height: 200px;
        width: 400px;
        display: flex;
        justify-content: center;
        align-items: center;  
        color: #fff;
      
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