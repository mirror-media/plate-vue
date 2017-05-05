<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId" :options="dfpOptions">
    <template scope="props" slot="dfpPos">

      <div class="list-view" v-if="pageStyle === 'feature'">
        <app-header :commonData= 'commonData' />
        <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCHD" extClass="desktop-only" :dfpUnits="props.dfpUnits" 
          :section="props.section" :dfpId="props.dfpId" />
        <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LMBHD" extClass="mobile-only" :dfpUnits="props.dfpUnits" 
          :section="props.section" :dfpId="props.dfpId" />
        <div class="list-title container" :class="sectionName">
          <span class="list-title__text" v-text="title"></span>
          <div class="list-title__colorBlock" :class="sectionName"></div>
        </div>
        <article-list id="articleList" :articles='autoScrollArticles' :hasDFP='hasDFP' v-if="categoryName !== 'audio' && categoryName !== 'videohub' ">
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA3" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpNA3" :dfpId="props.dfpId" />
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA5" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpNA5" :dfpId="props.dfpId" />
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA9" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpNA9" :dfpId="props.dfpId" />
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LMBL1" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpL1" :dfpId="props.dfpId" />
        </article-list>
        <audio-list :audios="audios.items" v-if="categoryName === 'audio'" />
        <video-list :playlist="playlist.items" v-if="categoryName === 'videohub'"/>
        <section class="container">
          <more v-if="hasMore && (categoryName === 'audio' || categoryName === 'videohub')" v-on:loadMore="loadMore" />
        </section>
        <vue-dfp v-if="title !== 'Topic'" :is="props.vueDfp" pos="LPCFT" extClass="desktop-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <vue-dfp v-if="title !== 'Topic'" :is="props.vueDfp" pos="LMBFT" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <article-list id="articleListAutoScroll" :articles='autoScrollArticlesLoadMore' :hasDFP='false'
          v-if="categoryName !== 'audio' && categoryName !== 'videohub'" v-show="hasAutoScroll"/>
        <loading :show="loading" />
        <section class="footer container">
          <app-footer />
        </section>
        <share />
      </div>

      <div class="listFull-view" v-if="pageStyle === 'full'">
        <header-full :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' />
        <article-leading :articles='articles.items' :props="props" v-if="type === 'SECTION'"/>
        <editorChoice-full :sectionfeatured='sectionfeatured' v-if="type === 'SECTION'"/>
        <latestArticle-full :articles='articles.items' :props="props" v-if="type === 'SECTION'" />
        <leading-watch v-if="type == 'TAG'" :tag='tag' :type='type'/>
        <article-list-full :articles='articles.items' v-if="type === 'TAG'" />
        <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" />
        <loading :show="loading" />
        <vue-dfp :is="props.vueDfp" pos="LPCFT" extClass="desktop-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <vue-dfp :is="props.vueDfp" pos="LMBFT" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <footer-full :commonData='commonData' :sectionName='sectionName' />
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

import { AUDIO_ID, AUTHOR, CAMPAIGN_ID, CATEGORY, FB_APP_ID, FB_PAGE_ID, MARKETING_ID, SECTION, SITE_KEYWORDS, SITE_TITLE, SITE_URL, TAG, VIDEOHUB_ID } from '../constants/index'
import { DFP_ID, DFP_UNITS } from '../constants'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { unLockJS } from '../utils/comm'
import _ from 'lodash'
import ArticleLeading from '../components/ArticleLeading.vue'
import ArticleList from '../components/ArticleList.vue'
import ArticleListFull from '../components/ArticleListFull.vue'
import AudioList from '../components/AudioList.vue'
import Cookie from 'vue-cookie'
import EditorChoiceFull from '../components/EditorChoiceFull.vue'
import Footer from '../components/Footer.vue'
import FooterFull from '../components/FooterFull.vue'
import Header from '../components/Header.vue'
import HeaderFull from '../components/HeaderFull.vue'
import LatestArticleFull from '../components/LatestArticleFull.vue'
import LeadingWatch from '../components/LeadingWatch.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import MoreFull from '../components/MoreFull.vue'
import Share from '../components/Share.vue'
import VideoList from '../components/VideoList.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import vStore from '../store'

const MAXRESULT = 12
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] })
    .then(() => {
      if (_.toUpper(_.split(store.state.route.path, '/')[1]) === TAG) {
        return store.dispatch('FETCH_TAG', {
          'id': store.state.route.params.tagId
        })
      }
    })
}

const fetchListData = (store, type, pageStyle, uuid, isLoadMore, needFetchTag, pageToken = '') => {
  const page = isLoadMore || PAGE
  switch (type) {
    case AUTHOR:
      return fetchArticlesByAuthor(store, uuid, {
        page: page,
        max_results: MAXRESULT
      })
    case CATEGORY:
      switch (uuid) {
        case AUDIO_ID:
          return fetchAudios(store, {
            page: page,
            max_results: MAXRESULT
          })
        case VIDEOHUB_ID:
          return fetchYoutubePlaylist(store, MAXRESULT, pageToken)
        default:
          return fetchArticlesByUuid(store, uuid, CATEGORY, {
            page: page,
            max_results: MAXRESULT
          })
      }
    case SECTION:
      switch (pageStyle) {
        case 'full':
          return fetchArticlesByUuid(store, uuid, SECTION, {
            page: page,
            max_results: MAXRESULT,
            related: 'full'
          })
        default:
          if (uuid === 'topic' && isLoadMore) {
            return fetchTopics(store, {
              page: page,
              max_results: MAXRESULT
            })
          }
          return fetchArticlesByUuid(store, uuid, SECTION, {
            page: page,
            max_results: MAXRESULT
          })
      }
    case TAG:
      if (needFetchTag) {
        return fetchTag(store, uuid).then(() => {
          return fetchArticlesByUuid(store, uuid, TAG, {
            page: page,
            max_results: MAXRESULT
          })
        })
      } else {
        return fetchArticlesByUuid(store, uuid, TAG, {
          page: page,
          max_results: MAXRESULT
        })
      }
  }
}

const fetchArticlesByAuthor = (store, uuid, params) => {
  return store.dispatch('FETCH_ARTICLES', {
    params: Object.assign({
      page: PAGE,
      max_results: MAXRESULT,
      where: {
        '$or': [
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

const fetchAudios = (store, params = {}) => {
  return store.dispatch('FETCH_AUDIOS', {
    'params': params
  })
}

const fetchTag = (store, id) => {
  return store.dispatch('FETCH_TAG', {
    'id': id
  })
}

const fetchTopics = (store, params) => {
  return store.dispatch('FETCH_TOPIC_BY_UUID', {
    'params': params
  })
}

const fetchYoutubePlaylist = (store, limit, pageToken = '') => {
  return store.dispatch('FETCH_YOUTUBE_PLAY_LIST', {
    'limit': limit,
    'pageToken': pageToken
  })
}

const getUUID = (store, type, to) => {
  switch (type) {
    case AUTHOR:
      return to.params.authorId
    case CATEGORY:
      switch (to.params.title) {
        case 'audio':
          return AUDIO_ID
        case 'campaign':
          return CAMPAIGN_ID
        case 'marketing':
          return MARKETING_ID
        case 'videohub':
          return VIDEOHUB_ID
        default:
          return _.get(_.find(_.get(store.state.commonData, [ 'categories' ]), { 'name': to.params.title }), [ 'id' ])
      }
    case SECTION:
      return _.get(_.find(_.get(store.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'id' ])
  }
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
    'leading-watch': LeadingWatch,
    'loading': Loading,
    'more': More,
    'more-full': MoreFull,
    'share': Share,
    'video-list': VideoList,
    'vue-dfp-provider': VueDfpProvider
  },
  preFetch: fetchCommonData,
  data () {
    return {
      articleListAutoScrollHeight: 0,
      canScrollLoadMord: true,
      commonData: this.$store.state.commonData,
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      hasAutoScroll: false,
      loading: false,
      page: PAGE,
      showDfpCoverAdFlag: false,
      viewport: undefined
    }
  },
  computed: {
    articles () {
      switch (this.type) {
        case AUTHOR:
          return this.$store.state.articles
        default:
          if (this.$route.params.title === 'topic') {
            return this.$store.state.commonData.topics
          }
          return this.$store.state.articlesByUUID
      }
    },
    audios () {
      return this.$store.state.audios
    },
    autoScrollArticles () {
      return _.take(this.articles.items, 12)
    },
    autoScrollArticlesLoadMore () {
      return _.slice(this.articles.items, 12)
    },
    categoryName () {
      if (this.type === CATEGORY) {
        return _.get(this.$route, [ 'params', 'title' ])
      }
    },
    customCSS () {
      switch (this.type) {
        case SECTION:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'css' ], null)
        case TAG:
          return _.get(this.tag, [ 'css' ])
        default:
          return null
      }
    },
    customJS () {
      switch (this.type) {
        case SECTION:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'javascript' ], null)
        default:
          return null
      }
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
    hasDFP () {
      return !(this.$route.params.title === 'topic')
    },
    hasMore () {
      switch (this.$route.params.title) {
        case 'audio':
          return _.get(this.audios, [ 'items', 'length' ], 0) < _.get(this.audios, [ 'meta', 'total' ], 0)
        case 'videohub':
          return _.get(this.playlist, [ 'items', 'length' ], 0) < _.get(this.playlist, [ 'pageInfo', 'totalResults' ], 0)
        default:
          return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'meta', 'total' ], 0)
      }
    },
    pageStyle () {
      switch (this.type) {
        case TAG:
          return _.get(this.$store.state, [ 'tag', 'style' ], 'feature')
        default:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'style' ], 'feature')
      }
    },
    playlist () {
      return _.get(this.$store.state, [ 'playlist' ])
    },
    section () {
      return _.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title })
    },
    sectionfeatured () {
      return _.get(_.pick(_.get(this.$store.state.commonData, [ 'sectionfeatured', 'items' ]), this.sectionName), [ this.sectionName ])
    },
    sectionId () {
      switch (this.type) {
        case CATEGORY:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), (s) => {
            return _.find(s.categories, { 'id': this.uuid })
          }), [ 'id' ], 'other')
        case SECTION:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'id' ], 'other')
        default:
          return 'other'
      }
    },
    sectionName () {
      switch (this.type) {
        case CATEGORY:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), (s) => {
            return _.find(s.categories, { 'id': this.uuid })
          }), [ 'name' ], 'other')
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'other'
          } else {
            return this.$route.params.title
          }
        case TAG:
          return _.get(this.$store.state, [ 'tag', 'sections', '0', 'name' ], 'other')
        default:
          return 'other'
      }
    },
    tag () {
      return _.get(this.$store.state, [ 'tag' ])
    },
    title () {
      switch (this.type) {
        case AUTHOR:
          return _.get(this.$store.state, [ 'authors', '0', 'name' ])
        case CATEGORY:
          switch (this.$route.params.title) {
            case 'audio':
              return 'Audio'
            case 'marketing':
              return '企劃特輯'
            case 'campaign':
              return '活動專區'
            default:
              return _.get(_.find(_.get(this.commonData, [ 'categories' ]), { 'name': this.$route.params.title }), [ 'title' ])
          }
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'Topic'
          } else {
            return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'title' ])
          }
        case TAG:
          return _.get(this.$store.state, [ 'tag', 'name' ])
      }
    },
    type () {
      return _.toUpper(_.split(vStore.state.route.path, '/')[1])
    },
    uuid () {
      switch (this.type) {
        case AUTHOR:
          return this.$route.params.authorId
        case CATEGORY:
          switch (this.$route.params.title) {
            case 'marketing':
              return MARKETING_ID
            case 'campaign':
              return CAMPAIGN_ID
            default:
              return _.get(_.find(_.get(this.commonData, [ 'categories' ]), { 'name': this.$route.params.title }), [ 'id' ])
          }
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'topic'
          } else {
            return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'id' ])
          }
        case TAG:
          return this.$route.params.tagId
      }
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
        if (document.querySelector('#articleList')) {
          const currentBottom = currentYPosition() + window.innerHeight
          const articleListHeight = document.querySelector('#articleList').offsetHeight
          const articleListBottom = elmYPosition('#articleList') + articleListHeight
          this.articleListAutoScrollHeight = document.querySelector('#articleListAutoScroll').offsetHeight
          const articleListAutoScrollBottom = elmYPosition('#articleListAutoScroll') + this.articleListAutoScrollHeight
          if (currentBottom > (articleListBottom - 300) && this.canScrollLoadMord && (this.page === 1) && this.hasMore) {
            this.canScrollLoadMord = false
            this.loadMore()
          }

          if (currentBottom > (articleListAutoScrollBottom - 300) && this.canScrollLoadMord && (this.page > 1) && this.hasMore) {
            this.canScrollLoadMord = false
            this.loadMore()
          }
        }
      }
    },
    insertCustomizedMarkup () {
      const custCss = document.createElement('style')
      const custScript = document.createElement('script')
      custCss.setAttribute('id', 'custCSS')
      custScript.setAttribute('id', 'custJS')
      if (this.customCSS) {
        custCss.appendChild(document.createTextNode(this.customCSS))
      }
      if (this.customJS) {
        custScript.appendChild(document.createTextNode(this.customJS))
      }
      if (!document.getElementById('custCSS') || !document.getElementById('custJS')) {
        document.querySelector('body').appendChild(custCss)
        document.querySelector('body').appendChild(custScript)
      } else {
        document.querySelector('#custCSS').innerHTML = this.customCSS
        document.querySelector('#custJS').innerHTML = this.customJS
      }
    },
    loadMore () {
      let pageToken
      this.page += 1
      this.loading = true
      if (this.uuid === VIDEOHUB_ID) {
        pageToken = _.get(this.$store.state.playlist, [ 'nextPageToken' ])
      }
      return fetchListData(this.$store, this.type, this.pageStyle, this.uuid, this.page, false, pageToken)
      .then(() => {
        if (this.uuid === 'topic') {
          const orig = _.values(this.articles[ 'items' ])
          const concat = _.concat(orig, _.get(this.$store.state, [ 'topic', 'items' ]))
          this.articles[ 'meta' ] = _.get(this.$store.state, [ 'topic', 'meta' ])
          this.articles[ 'items' ] = concat
        }
        this.loading = false
        this.hasAutoScroll = true
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
    updateCustomizedMarkup () {
      const custCss = document.querySelector('#custCSS')
      const custScript = document.querySelector('#custJS')
      custCss.innerHTML = ''
      custScript.innerHTML = ''
      if (this.customCSS) {
        custCss.innerHTML = this.customCSS
      }
      if (this.customJS) {
        custScript.innerHTML = this.customJS
      }
    },
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.querySelector('body').offsetWidth
      }
    }
  },
  watch: {
    articleListAutoScrollHeight: function () {
      this.canScrollLoadMord = true
    },
    customCSS: function () {
      this.updateCustomizedMarkup()
    },
    uuid: function () {
      this.page = PAGE
      this.articleListAutoScrollHeight = 0
      this.hasAutoScroll = false
    }
  },
  beforeRouteEnter (to, from, next) {
    const type = _.toUpper(_.split(to.path, '/')[1])
    const pageStyle = _.get(_.find(_.get(vStore.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'style' ], 'feature')

    if (from.matched.length !== 0) { // check whether first time
      fetchListData(vStore, type, pageStyle, getUUID(vStore, type, to), false, true)
      .then(() => next())
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    const type = _.toUpper(_.split(to.path, '/')[1])
    const pageStyle = _.get(_.find(_.get(this.$store.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'style' ], 'feature')

    fetchListData(this.$store, type, pageStyle, getUUID(this.$store, type, to), false, true)
    .then(() => next())
  },
  beforeRouteLeave (to, from, next) {
    const custCss = document.querySelector('#custCSS')
    const custScript = document.querySelector('#custJS')
    custCss.innerHTML = ''
    custScript.innerHTML = ''
    next()
  },
  beforeMount () {
    // only fetch at first time
    this.$store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured' ] })
    fetchListData(this.$store, this.type, this.pageStyle, this.uuid, false, false)
  },
  mounted () {
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.checkIfLockJS()
    this.insertCustomizedMarkup()
    this.handleScroll()
  },
  metaInfo () {
    const type = this.type

    const description = '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`
    let ogImage
    let ogTitle
    let ogDescription
    let sectionName
    switch (type) {
      case SECTION:
        sectionName = this.sectionName
        const imageURL = _.get(this.section, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ], null) ? _.get(this.section, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) : _.get(this.section, [ 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ], null)
        ogImage = imageURL || '/public/notImage.png'
        ogTitle = _.get(this.section, [ 'ogTitle' ], null) ? _.get(this.section, [ 'ogTitle' ]) : _.get(this.section, [ 'title' ], this.title)
        ogDescription = _.get(this.section, [ 'ogDescription' ], null) ? _.get(this.section, [ 'ogDescription' ]) : _.get(this.section, [ 'description' ])
        break
      case CATEGORY:
        sectionName = this.sectionName
        ogTitle = this.title
        ogImage = '/public/notImage.png'
        ogDescription = description
        break
      default:
        ogTitle = this.title || ''
        ogImage = '/public/notImage.png'
        ogDescription = description
    }

    if (!ogTitle && process.env.VUE_ENV === 'server' && type !== AUTHOR) {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    }

    const title = ogTitle + ` - ${SITE_TITLE}`
    return {
      title: title,
      meta: [
        { name: 'keywords', content: SITE_KEYWORDS },
        { name: 'description', content: ogDescription },
        { name: 'section-name', content: sectionName },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: ogDescription },
        { name: 'twitter:image', content: ogImage },
        { property: 'fb:app_id', content: FB_APP_ID },
        { property: 'fb:pages', content: FB_PAGE_ID },
        { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
        { property: 'og:locale', content: 'zh_TW' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: ogDescription },
        { property: 'og:url', content: ogUrl },
        { property: 'og:image', content: ogImage }
      ]
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

@media (min-width: 600px)
  .list
    &-title
      &.container
        padding-left 0

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
