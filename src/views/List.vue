<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId">
    <template scope="props" slot="dfpPos">

      <div class="list-view" v-if="pageStyle == 'feature'">
        <section style="width: 100%;">
          <app-header :commonData= 'commonData' />
        </section>
        <div class="topic" v-if="type == 'TOPIC'">
          <div class="topic-title"><h1></h1></div>
          <leading :type="getValue(topic, [ 'leading' ])" v-if="getValue(topic, [ 'leading' ])" :mediaData="topic"/>
        </div>
        <vue-dfp :is="props.vueDfp" pos="LPCHD" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" v-if="type !== 'TOPIC'" :dfpId="props.dfpId" />
        <div class="list-title container" :class="sectionName">
          <span class="list-title__text" v-text="title"></span>
          <div class="list-title__colorBlock" :class="sectionName"></div>
        </div>
        <article-list :articles='articles.items' v-if="title !== 'Audio' && name !== 'videohub' ">
          <!-- <vue-dfp :is="props.vueDfp" pos="TEST" :dfpUnits="props.dfpUnits" :section="props.section"/> -->
        </article-list>
        <audio-list :audios="audios.items" v-if="title == 'Audio'" />
        <video-list :playlist="playlist.items" v-if="name == 'videohub'"/>
        <section class="container">
          <more v-if="hasMore" v-on:loadMore="loadMore" />
        </section>
        <section class="footer container">
          <vue-dfp :is="props.vueDfp" pos="LPCFT" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
          <app-footer />
        </section>
      </div>

      <div class="listFull-view" v-if="pageStyle == 'full'">
        <div id="dfp-HD" class="listFull-dfp dfp-HD">AD HD</div>
        <section>
          <header-full :commonData='commonData' :section='sectionName' :sections='commonData.sections' />
        </section>
        <article-leading :articles='articles.items' v-if="type == 'SECTION'"/>
        <editorChoice-full :sectionfeatured='sectionfeatured' v-if="type == 'SECTION'"/>
        <latestArticle-full :articles='articles.items' v-if="type == 'SECTION'" />
        <section v-if="(type == 'TAG' && pageStyle == 'full')" class="tag-gallery" 
                  :style="{ backgroundImage: 'url(' + getImage(tag, 'desktop') + ')' }">
          <div class="tag-gallery-headline">
            <h1 class="tag-gallery-headline__enName"></h1>
            <h3 class="tag-gallery-headline__zhName"></h3>
            <div class="tag-gallery-intro">
              <span class="tag-gallery-intro__title"></span>
              <img src="~public/icon/tag-arrow.png"/>
            </div>
          </div>
        </section>
        <article-list-full :articles='articles.items' v-if="type == 'TAG'" />
        <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" />
        <loading :show="loading" />
        <div class="listFull-dfp dfp-FT">AD FT</div>
        <footer-full :commonData='commonData' :section='sectionName' />
      </div>

    </template>
  </vue-dfp-provider>
</template>

<script>

import { AUTHOR, CATEGORY, SEARCH, SECTION, SITE_URL, TAG, TOPIC } from '../constants/index'
import { DFP_ID, DFP_UNITS } from '../constants'
import { getImage, getValue } from '../utils/comm'
import _ from 'lodash'
import ArticleLeading from '../components/ArticleLeading.vue'
import ArticleList from '../components/ArticleList.vue'
import ArticleListFull from '../components/ArticleListFull.vue'
import AudioList from '../components/AudioList.vue'
import EditorChoiceFull from '../components/EditorChoiceFull.vue'
import Footer from '../components/Footer.vue'
import FooterFull from '../components/FooterFull.vue'
import Header from '../components/Header.vue'
import HeaderFull from '../components/HeaderFull.vue'
import LatestArticleFull from '../components/LatestArticleFull.vue'
import Leading from '../components/Leading.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import MoreFull from '../components/MoreFull.vue'
import VideoList from '../components/VideoList.vue'
import VueDfpProvider from 'kc-vue-dfp/DfpProvider.vue'
import truncate from 'truncate'

const MAXRESULT = 12
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] })
}

const fetchListData = (store, type, sectionStyle) => {
  let uuid
  switch(type) {
    case AUTHOR:
      uuid = store.state.route.params.authorId
      return fetchArticlesByAuthor(store, uuid, { 
        page: PAGE,
        max_results: MAXRESULT
      })
      break
    case SECTION:
      uuid = _.get( _.find( _.get(store.state.commonData, ['sections', 'items']), { 'name': store.state.route.params.title } ), ['id'] )
      switch(sectionStyle) {
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
    case TAG:
      uuid = store.state.route.params.tagId
      return fetchTag(store, uuid).then(() => {
        return fetchArticlesByUuid(store, uuid, TAG, { 
          page: PAGE,
          max_results: MAXRESULT
        })
      })
      break
    case CATEGORY:
      let catName = store.state.route.params.title
      switch(catName) {
        case 'audio':
          return fetchAudios(store, {
            page: PAGE,
            max_results: MAXRESULT
          })
          break
        case 'videohub':
          return fetchYoutubePlaylist(store, MAXRESULT)
          break
        default:
          uuid = _.get( _.find( _.get(store.state.commonData, ['categories']), { 'name': store.state.route.params.title } ), ['id'] )
          return fetchArticlesByUuid(store, uuid, CATEGORY, { 
            page: PAGE,
            max_results: MAXRESULT
          })
      }
      break
    case TOPIC:
      uuid = store.state.route.params.topicId
      return fetchArticlesByUuid(store, uuid, TOPIC, { 
        page: PAGE,
        max_results: MAXRESULT
      })
  }
}

const fetchListDataBeforeRouteUpdate = (store, type, sectionStyle, to) => {
  let uuid
  switch(type) {
    case AUTHOR:
      uuid = to.params.authorId
      return fetchArticlesByAuthor(store, uuid, { 
        page: PAGE
      })
      break
    case SECTION:
      uuid = _.get( _.find( _.get(store.state.commonData, ['sections', 'items']), { 'name': to.params.title } ), ['id'] )
      switch(sectionStyle) {
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
    case TAG:
      uuid = to.params.tagId
      return fetchArticlesByUuid(store, uuid, TAG, { 
        page: PAGE,
        max_results: MAXRESULT
      })
      break
    case CATEGORY:
      let catName = to.params.title
      switch(catName) {
        case 'audio':
          return fetchAudios(store, {
            page: PAGE,
            max_results: MAXRESULT
          })
          break
        case 'videohub':
          return fetchYoutubePlaylist(store, MAXRESULT)
          break
        default:
          uuid = _.get( _.find( _.get(store.state.commonData, ['categories']), { 'name': to.params.title } ), ['id'] )
          return fetchArticlesByUuid(store, uuid, CATEGORY, { 
            page: PAGE,
            max_results: MAXRESULT
          })
      }
      break
    case TOPIC:
      uuid = to.params.topicId
      let topic = _.find( _.get(store.state.commonData, ['topics', 'items']), { 'id': uuid } )
      return fetchArticlesByUuid(store, uuid, TOPIC, { 
        page: PAGE,
        max_results: MAXRESULT
      }).then(() => {
        return (!topic) ? fetchTopicByUuid(store, uuid).then(() => {
          return fetchTopicImagesByUuid(store, uuid, type, {
            max_results: 25
          })
        }) : null
      })
      break
  }
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

const fetchArticlesByUuid = (store, uuid, type, params) => {
  return store.dispatch('FETCH_ARTICLES_BY_UUID', { 
    'uuid': uuid,
    'type': type,
    'params': params
  })
}

const fetchAudios = (store, params={}) => {
  return store.dispatch('FETCH_AUDIOS', { 
    'params': params
  })
}

const fetchTag = (store, id) => {
  return store.dispatch('FETCH_TAG', { 
    'id': id
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

const fetchYoutubePlaylist = (store, limit, pageToken='') => {
  return store.dispatch('FETCH_YOUTUBE_PLAY_LIST', { 
    'limit': limit,
    'pageToken': pageToken
  })
}


const fetchData = (store) => {
  return fetchCommonData(store).then(() => {
    const _type = _.toUpper( _.split( store.state.route.path, '/' )[1] )
    const _sectionStyle = _.get( _.find( _.get(store.state.commonData, ['sections', 'items']), { 'name': store.state.route.params.title } ), ['style'] )
    
    return fetchListData(store, _type, _sectionStyle)

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
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-leading': ArticleLeading,
    'article-list': ArticleList,
    'article-list-full': ArticleListFull,
    'audio-list': AudioList,
    'editorChoice-full': EditorChoiceFull,
    'footer-full': FooterFull,
    'header-full': HeaderFull,
    'latestArticle-full': LatestArticleFull,
    'leading': Leading,
    'loading': Loading,
    'more': More,
    'more-full': MoreFull,
    'video-list': VideoList,
    VueDfpProvider
  },
  preFetch: fetchData,
  mounted() {
    if(this.type === SECTION || this.type === TOPIC || this.type === TAG) {
      this.insertCustomizedMarkup()
    }
  },
  beforeRouteEnter (to, from, next) {
    let type = _.toUpper( _.split( to.path, '/' )[1] )
    if(process.env.VUE_ENV === 'client' && to.path !== from.path && from.matched && from.matched.length > 0) {
      next(vm => {
        let sectionStyle = _.get( _.find( _.get(vm.$store.state.commonData, ['sections', 'items']), 
          { 'name': _.get(to, ['params', 'title']) } ), ['style'] )
        fetchCommonData(vm.$store).then(() => {
          fetchListData(vm.$store, type, sectionStyle)
        })
      })
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.page = PAGE
    let type = _.toUpper( _.split( to.path, '/' )[1] )
    let sectionStyle = _.get( _.find( _.get(this.$store.state.commonData, ['sections', 'items']), { 'name': to.params.title } ), ['style'] )
    fetchListDataBeforeRouteUpdate(this.$store, type, sectionStyle, to).then(() => {
      next()
    })
    
  },
  data () {
    return {
      commonData: this.$store.state.commonData,
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      loading: false,
      page: PAGE,
    }
  },
  computed: {
    articles () {
      switch(this.type) {
        case AUTHOR:
          return this.$store.state.articles
          break
        default:
          return this.$store.state.articlesByUUID
      }
    },
    audios () {
      return this.$store.state.audios
    },
    customCSS () { 
      switch(this.type) {
        case SECTION:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['css'], null ) 
        case TAG:
          return _.get( this.tag, ['css'] )
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
      switch(this.name) {
        case 'audio':
          return _.get(this.audios, [ 'items', 'length' ], 0) < _.get(this.audios, [ 'meta', 'total' ], 0)
          break
        case 'videohub':
          return _.get(this.playlist, [ 'items', 'length' ], 0) < _.get(this.playlist, [ 'pageInfo', 'totalResults' ], 0)
          break
        default:
          return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'meta', 'total' ], 0)
      }
    },
    name () {
      switch(this.type) {
        case CATEGORY:
          return this.$route.params.title
      }
    },
    section() {
      return _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ) 
    },
    sectionName () {
      switch(this.type) {
        case CATEGORY:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), (s) => { 
            return _.find(s.categories, { 'id': this.uuid })
          }), ['name'], 'other')
        case SECTION:
          return this.$route.params.title
        case TAG:
          return _.get(this.tag, 'sections[0].name' )
        case TOPIC:
          return 'other'
        default:
          return 'other'
      }
    },
    sectionfeatured () {
      return _.get( _.pick( _.get(this.$store.state.commonData, ['sectionfeatured', 'items']), this.sectionName ), [ this.sectionName] )
    },
    sectionId () {
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
    pageStyle () {
      switch(this.type) {
        case TAG:
          return _.get(this.$store.state, [ 'tag', 'style' ], 'feature' )
          break
        default:
          return _.get( _.find( _.get(this.commonData, ['sections', 'items']), { 'name': this.$route.params.title } ), ['style'], 'feature' )
      }
    },
    playlist () {
      return this.$store.state.playlist
    },
    tag () {
      return _.get(this.$store.state, [ 'tag' ] )
    },
    title () {
      switch(this.type) {
        case AUTHOR:
          return this.$route.params.authorName
        case CATEGORY:
          return this.$route.params.title == 'audio' ? 'Audio' :
            _.get( _.find( _.get(this.commonData, ['categories']), { 'name': this.$route.params.title } ), ['title'] )
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
    getImage,
    getValue,
    insertCustomizedMarkup () {
      if(this.customCSS) {
        const custCss = document.createElement('style') 
        custCss.setAttribute('id', 'custCSS')
        custCss.appendChild(document.createTextNode(this.customCSS)) 
        document.querySelector('body').appendChild(custCss) 
      }
      if(this.customJS) {
        const custScript = document.createElement('script') 
        custScript.setAttribute('id', 'custJS')
        custScript.appendChild(document.createTextNode(this.customJS)) 
        document.querySelector('body').appendChild(custScript) 
      }
    },
    loadMore () {
      this.page += 1
      this.loading = true
      switch(this.type) {
        case AUTHOR:
          fetchArticlesByAuthor(this.$store, this.uuid, { 
            page: this.page
          }).then(() => {
            this.articles = this.$store.state.articles
            this.loading = false          
          })
          break
        case SECTION:
          switch (this.pageStyle) {
            case 'full':
              fetchArticlesByUuid(this.$store, this.uuid, SECTION, { 
                page: this.page,
                max_results: MAXRESULT,
                related: 'full'
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
                this.loading = false
              })
              break
            default:
              fetchArticlesByUuid(this.$store, this.uuid, SECTION, { 
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
                this.loading = false
              })
          }
          break
        default:
          switch(this.name) {
            case 'audio':
              fetchAudios(this.$store, {
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.audios = this.$store.state.audios
              })
              break
            case 'videohub':
              let pageToken = _.get(this.playlist, ['nextPageToken'])
              fetchYoutubePlaylist(this.$store, MAXRESULT, pageToken).then(() => {
                this.playlist = this.$store.state.playlist
              })
              break
            default:
              fetchArticlesByUuid(this.$store, this.uuid, this.type, { 
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
                this.loading = false
              })
          }
          
      }
    },
    updateCustomizedMarkup () {
      const custCss = document.querySelector('#custCSS') 
      const custScript = document.querySelector('#custJS') 
      if(!custCss || !custScript) { this.insertCustomizedMarkup(); return; }
      if(this.customCSS) {
        custCss.innerHTML = this.customCSS
      }
      if(this.customJS) {
        custScript.innerHTML = this.customJS
      }
    },
  },
  metaInfo () {
    let type = this.type
    let description = '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
    let ogImage
    let ogTitle
    let ogDescription
    switch(type) {
      case SECTION:
        let imageURL = _.get(this.section, ['ogImage', 'image', 'resizedTargets', 'desktop', 'url'], null) ? _.get(this.section, ['ogImage', 'image', 'resizedTargets', 'desktop', 'url']) : _.get(this.section, ['heroImage', 'image', 'resizedTargets', 'desktop', 'url'], null)
        ogImage = imageURL ? imageURL : '/public/notImage.png'
        ogTitle = _.get(this.section, ['ogTitle'], null) ? _.get(this.section, ['ogTitle']) : _.get(this.section, ['title'])
        ogDescription = _.get(this.section, ['ogDescription'], null) ? _.get(this.section, ['ogDescription']) : _.get(this.section, ['description'])
        break
      case TOPIC:
        ogImage = _.get(this.topic, ['ogImage', 'image', 'resizedTargets', 'desktop', 'url'], null) ? _.get(this.topic, ['ogImage', 'image', 'resizedTargets', 'desktop', 'url']) : '/public/notImage.png'
        ogTitle = _.get(this.topic, ['ogTitle'], null) ? _.get(this.topic, ['ogTitle']) : _.get(this.topic, ['title'])
        ogDescription = _.get(this.topic, ['ogDescription'], null) ? _.get(this.topic, ['ogDescription']) : description
      default:
        ogTitle = this.title
        ogImage = '/public/notImage.png'
        ogDescription = description

    }
    let title = ogTitle + ' - 鏡週刊 Mirror Media'

    return {
      title,
      meta: [
          { name: 'keywords', content: '鏡週刊,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說'},
          { name: 'description', content: ogDescription },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: ogDescription },
          { name: 'twitter:image', content: ogImage },
          { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: ogDescription },
          { property: 'og:url', content: SITE_URL },
          { property: 'og:image', content: ogImage },
      ]
    }
  },
  updated() {
    if(this.type === TOPIC) {
      this.updateCustomizedMarkup()
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
      background-repeat no-repeat
      background-position center center
      background-size cover
      padding 50px
      
      &-title
        height 200px
        width 400px
        display flex
        justify-content center
        align-items center  
        color #fff
        background-size contain
        background-position center center
        background-repeat no-repeat
      
  &-title
    &.container
      position relative
      align-items center
      flex-direction row
      margin-top 40px
      padding 0 2em

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

      &.hotvideo
        background linear-gradient(to right, $color-other 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.other
        background linear-gradient(to right, $color-other 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

.listFull
  &-view
    background-color #f5f5f5
  &-dfp
    width 300px
    margin 0 auto 35px
    background-color #ffe066
    &.dfp-FT
      height 250px
    &.dfp-HD
      display none
      height 250px

.tag-gallery 
  display flex
  justify-content center
  align-items center
  width 100%
  height calc(100vh - 200px)
  background-position center center
  background-repeat no-repeat
  background-size cover
  &-headline
    text-align center
    color #fff
    > h1
      margin 0
      font-size 42px
      font-weight 700
    > h3
      margin 7px 0 26px
      font-size 19px
      font-weight 300
    &__enName, &__zhName
      visibility hidden
    &__enName:after, &__zhName:after
      visibility visible
  &-intro
    &__title
      visibility hidden
    &__title:after
      visibility visible
    > span
      margin-right 8px
      font-size 16px
      font-weight 300
    > img
      vertical-align middle
      height 8px

@media (min-width: 600px)
  .list
    &-title
      &.container
        padding-left 10px

@media (min-width: 1200px)
  .listFull
    &-dfp
      width 970px
      &.dfp-FT
        height 90px

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