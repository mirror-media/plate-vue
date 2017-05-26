<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId" :options="dfpOptions" :mode="dfpMode">
    <template scope="props" slot="dfpPos">
      <div class="foodtravel-redesign" v-if="pageStyle === 'video'">
        <section>
          <header-foodtravel :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' />
        </section>
        <heroImage-foodtravel :commonData='commonData' :sectionName='sectionName'/>
        <featuredStory-foodtravel :sectionfeatured='sectionfeatured' :viewport="viewport"/>
        <latestArticle-foodtravel :articles='autoScrollArticles' :commonData='commonData' :props="props" v-if="type === 'SECTION'" id="articleList" :showLatestOnly="false"/>
        <latestArticle-foodtravel :articles='autoScrollArticlesLoadMore' :commonData='commonData' :props="props" v-if="type === 'SECTION'" v-show="hasAutoScroll" id="articleListAutoScroll" :showLatestOnly="true"/>
        <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" :className="'moreFoodTravel'" />
        <loading :show="loading" />
        <vue-dfp :is="props.vueDfp" pos="LPCSFT" extClass="desktop-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <vue-dfp :is="props.vueDfp" pos="LMBSFT" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <footer-foodtravel :commonData='commonData' :sectionName='sectionName' />
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
      </div>

      <div class="listFull-view" v-else-if="pageStyle === 'full'">
        <div v-if="!isMobile"><vue-dfp :is="props.vueDfp" pos="SPCHD" :config="props.config" /></div>
        <div v-if="isMobile"><vue-dfp :is="props.vueDfp" pos="SMBHD" :config="props.config" /></div>
        <header-full :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' />
        <article-leading :articles='articles' :isMobile="isMobile" :props="props" v-if="type === 'SECTION'"/>
        <editorChoice-full :sectionfeatured='sectionfeatured' v-if="type === 'SECTION'"/>
        <latestArticle-full :articles='articles' :isMobile="isMobile" :props="props" v-if="type === 'SECTION'" />
        <leading-watch v-if="type == 'TAG'" :tag='tag' :type='type'/>
        <article-list-full :articles='articles' v-if="type === 'TAG'" />
        <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" />
        <loading :show="loading" />
        <div v-if="!isMobile"><vue-dfp :is="props.vueDfp" pos="SPCFT" :config="props.config" /></div>
        <div v-if="isMobile"><vue-dfp :is="props.vueDfp" pos="SMBFT" :config="props.config" /></div>
        <footer-full :commonData='commonData' :sectionName='sectionName' />
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
      </div>

      <div class="list-view" v-else>
        <app-header :commonData= 'commonData' :eventLogo="eventLogo" :viewport="viewport" />
        <div><vue-dfp v-if="hasDFP && !isMobile" :is="props.vueDfp" pos="LPCHD" :config="props.config" /></div>
        <div><vue-dfp v-if="hasDFP && isMobile" :is="props.vueDfp" pos="LMBHD" :config="props.config" /></div>
        <div class="list-title container" :class="sectionName">
          <span class="list-title__text" v-text="title"></span>
          <div class="list-title__colorBlock" :class="sectionName"></div>
        </div>
        <article-list id="articleList" :articles='autoScrollArticles' :hasDFP='hasDFP' v-if="categoryName !== 'audio' && categoryName !== 'videohub' ">
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA3" slot="dfpNA3" :config="props.config" />
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA5" slot="dfpNA5" :config="props.config" />
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA9" slot="dfpNA9" :config="props.config" />
          <vue-dfp v-if="hasDFP && isMobile" :is="props.vueDfp" pos="LMBL1" slot="dfpL1" :config="props.config" />
        </article-list>
        <audio-list :audios="audios.items" v-if="categoryName === 'audio'" />
        <video-list :playlist="playlist.items" v-if="categoryName === 'videohub'"/>
        <section class="container">
          <more v-if="hasMore && (categoryName === 'audio' || categoryName === 'videohub')" v-on:loadMore="loadMore" />
        </section>
        <div><vue-dfp v-if="title !== 'Topic' && !isMobile" :is="props.vueDfp" pos="LPCFT" :config="props.config" /></div>
        <div><vue-dfp v-if="title !== 'Topic' && isMobile" :is="props.vueDfp" pos="LMBFT" :config="props.config" /></div>
        <article-list id="articleListAutoScroll" :articles='autoScrollArticlesLoadMore' :hasDFP='false'
          v-if="categoryName !== 'audio' && categoryName !== 'videohub'" v-show="hasAutoScroll"/>
        <loading :show="loading" />
        <section class="footer container">
          <app-footer />
        </section>
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
        <share :right="`20px`" :bottom="`20px`" />
      </div>

      <div class="dfp-cover" v-show="showDfpCoverAdFlag && viewport < 1199">
        <div class="ad">
          <vue-dfp :is="props.vueDfp" pos="LMBCVR" extClass="mobile-only" :config="props.config" />
          <div class="close" @click="closeCoverAd"></div>
        </div>
      </div>

    </template>
  </vue-dfp-provider>
</template>
<script>

import { AUDIO_ID, AUTHOR, CAMPAIGN_ID, CATEGORY, FB_APP_ID, FB_PAGE_ID, MARKETING_ID, SECTION, SECTION_FOODTRAVEL_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL, TAG, VIDEOHUB_ID } from '../constants/index'
import { DFP_ID, DFP_UNITS } from '../constants'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { currEnv, getTruncatedVal, unLockJS } from '../utils/comm'
import _ from 'lodash'
import ArticleLeading from '../components/ArticleLeading.vue'
import ArticleList from '../components/ArticleList.vue'
import ArticleListFull from '../components/ArticleListFull.vue'
import AudioList from '../components/AudioList.vue'
import Cookie from 'vue-cookie'
import EditorChoiceFull from '../components/EditorChoiceFull.vue'
import FeaturedStoryFoodTravel from '../components/FeaturedStoryFoodTravel.vue'
import Footer from '../components/Footer.vue'
import FooterFull from '../components/FooterFull.vue'
import FooterFoodTravel from '../components/FooterFoodTravel.vue'
import Header from '../components/Header.vue'
import HeaderFull from '../components/HeaderFull.vue'
import HeaderFoodTravel from '../components/HeaderFoodTravel.vue'
import HeroImageFoodTravel from '../components/HeroImageFoodTravel.vue'
import LatestArticleFull from '../components/LatestArticleFull.vue'
import LatestArticleFoodTravel from '../components/LatestArticleFoodTravel.vue'
import LeadingWatch from '../components/LeadingWatch.vue'
import LiveStream from '../components/LiveStream.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import MoreFull from '../components/MoreFull.vue'
import Share from '../components/Share.vue'
import VideoList from '../components/VideoList.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import store from '../store'
import moment from 'moment'

const MAXRESULT = 12
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] })
    .then(() => {
      if (_.toUpper(_.split(store.state.route.path, '/')[1]) === TAG) {
        return fetchTag(store, store.state.route.params.tagId)
      }
      if (_.toUpper(_.split(store.state.route.path, '/')[1]) === AUTHOR) {
        return fetchAuthor(store, store.state.route.params.authorId)
      }
    })
}

const fetchListData = (store, type, pageStyle, uuid, isLoadMore, hasPrefetch = false, pageToken = '') => {
  const page = isLoadMore || PAGE
  switch (type) {
    case AUTHOR:
      if (!hasPrefetch) {
        return fetchAuthor(store, uuid).then(() => {
          return fetchArticlesByAuthor(store, uuid, {
            page: page,
            max_results: MAXRESULT
          })
        })
      } else {
        return fetchArticlesByAuthor(store, uuid, {
          page: page,
          max_results: MAXRESULT
        })
      }

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
        case 'video':
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
      if (!hasPrefetch) {
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

const fetchAuthor = (store, uuid) => {
  return store.dispatch('FETCH_CONTACT', {
    params: {
      where: {
        _id: uuid
      }
    }
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

const fetchTag = (store, id) => {
  return store.dispatch('FETCH_TAG', {
    'id': id
  })
}

const fetchTopics = (store, params) => {
  return store.dispatch('FETCH_TOPICS', {
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
    'featuredStory-foodtravel': FeaturedStoryFoodTravel,
    'footer-full': FooterFull,
    'footer-foodtravel': FooterFoodTravel,
    'header-full': HeaderFull,
    'header-foodtravel': HeaderFoodTravel,
    'heroImage-foodtravel': HeroImageFoodTravel,
    'latestArticle-full': LatestArticleFull,
    'latestArticle-foodtravel': LatestArticleFoodTravel,
    'leading-watch': LeadingWatch,
    'live-stream': LiveStream,
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
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      loading: false,
      showDfpCoverAdFlag: false,
      viewport: undefined
    }
  },
  computed: {
    articles () {
      switch (this.type) {
        case AUTHOR:
          return _.get(this.$store.state, [ 'articles', 'items' ])
        default:
          if (this.$route.params.title === 'topic') {
            return _.get(this.$store.state, [ 'topics', 'items' ])
          }
          return _.uniqBy(_.get(this.$store.state, [ 'articlesByUUID', 'items' ]), 'slug')
      }
    },
    audios () {
      return this.$store.state.audios
    },
    autoScrollArticles () {
      if (this.uuid === SECTION_FOODTRAVEL_ID) {
        return _.take(this.articles, 8)
      }
      return _.take(this.articles, 12)
    },
    autoScrollArticlesLoadMore () {
      if (this.uuid === SECTION_FOODTRAVEL_ID) {
        return _.slice(this.articles, 8)
      }
      return _.slice(this.articles, 12)
    },
    categoryName () {
      if (this.type === CATEGORY) {
        return _.get(this.$route, [ 'params', 'title' ])
      }
    },
    commonData () {
      return this.$store.state.commonData
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
    eventEmbedded () {
      return _.get(this.$store.state.eventEmbedded, [ 'items', '0' ])
    },
    eventLogo () {
      return _.get(this.$store.state.eventLogo, [ 'items', '0' ])
    },
    hasAutoScroll () {
      switch (this.type) {
        case AUTHOR:
          return _.get(this.$store.state, [ 'articles', 'meta', 'page' ], PAGE) !== 1
        default:
          if (this.$route.params.title === 'topic') {
            return _.get(this.$store.state, [ 'topics', 'meta', 'page' ], PAGE) !== 1
          }
          return _.get(this.$store.state, [ 'articlesByUUID', 'meta', 'page' ], PAGE) !== 1
      }
    },
    hasDFP () {
      return !(this.$route.params.title === 'topic')
    },
    hasEventEmbedded () {
      const _now = moment()
      const _eventStartTime = moment(new Date(_.get(this.eventEmbedded, [ 'startDate' ])))
      let _eventEndTime = moment(new Date(_.get(this.eventEmbedded, [ 'endDate' ])))
      if (_eventEndTime && (_eventEndTime < _eventStartTime)) {
        _eventEndTime = moment(new Date(_.get(this.eventEmbedded, [ 'endDate' ]))).add(12, 'h')
      }
      return (_eventStartTime && _eventEndTime && (_now >= _eventStartTime) && (_now <= _eventEndTime))
    },
    hasMore () {
      switch (this.$route.params.title) {
        case 'audio':
          return _.get(this.audios, [ 'length' ], 0) < _.get(this.$store.state, [ 'audios', 'meta', 'total' ], 0)
        case 'videohub':
          return _.get(this.playlist, [ 'length' ], 0) < _.get(this.$store.state, [ 'playlist', 'pageInfo', 'totalResults' ], 0)
        case 'topic':
          return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'topics', 'meta', 'total' ], 0)
        default:
          if (this.type === AUTHOR) {
            return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'articles', 'meta', 'total' ], 0)
          }
          return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'articlesByUUID', 'meta', 'total' ], 0)
      }
    },
    isMobile () {
      return this.viewport < 1200
    },
    page () {
      switch (this.type) {
        case AUTHOR:
          return _.get(this.$store.state, [ 'articles', 'meta', 'page' ], PAGE)
        default:
          if (this.$route.params.title === 'topic') {
            return _.get(this.$store.state, [ 'topics', 'meta', 'page' ], PAGE)
          }
          return _.get(this.$store.state, [ 'articlesByUUID', 'meta', 'page' ], PAGE)
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
          return _.get(this.$store.state, [ 'contact', 'items', '0', 'name' ])
        case CATEGORY:
          switch (this.$route.params.title) {
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
      return _.toUpper(_.split(store.state.route.path, '/')[1])
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
    getTruncatedVal,
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
      let currentPage = this.page
      currentPage += 1
      this.loading = true
      if (this.uuid === VIDEOHUB_ID) {
        pageToken = _.get(this.$store.state.playlist, [ 'nextPageToken' ])
      }
      return fetchListData(this.$store, this.type, this.pageStyle, this.uuid, currentPage, false, pageToken)
      .then(() => {
        this.loading = false
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
    },
    updateSysStage () {
      this.dfpMode = currEnv()
    }
  },
  watch: {
    articleListAutoScrollHeight: function () {
      if (this.uuid === SECTION_FOODTRAVEL_ID && this.page >= 2) {
        this.canScrollLoadMord = false
      } else {
        this.canScrollLoadMord = true
      }
      // this.canScrollLoadMord = true
    },
    customCSS: function () {
      this.updateCustomizedMarkup()
    },
    uuid: function () {
      this.page = PAGE
      this.articleListAutoScrollHeight = 0
      if (this.sectionName === 'other') {
        window.ga('set', 'contentGroup1', '')
      } else {
        window.ga('set', 'contentGroup1', this.sectionName)
      }
      window.ga('send', 'pageview', this.$route.path, { title: `${this.title} - ${SITE_TITLE}` })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.matched.length !== 0) { // check whether first time
      return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] })
      .then(() => next())
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    const type = _.toUpper(_.split(to.path, '/')[1])
    const pageStyle = _.get(_.find(_.get(this.$store.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'style' ], 'feature')

    fetchListData(this.$store, type, pageStyle, getUUID(this.$store, type, to), false, false)
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
    // only fetch at first time after preFetch
    fetchListData(this.$store, this.type, this.pageStyle, this.uuid, false, false)
    fetchEvent(this.$store, 'embedded')
    fetchEvent(this.$store, 'logo')
  },
  mounted () {
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.checkIfLockJS()
    this.insertCustomizedMarkup()
    this.handleScroll()
    this.updateSysStage()
    if (this.sectionName === 'other') {
      window.ga('set', 'contentGroup1', '')
    } else {
      window.ga('set', 'contentGroup1', this.sectionName)
    }
    window.ga('send', 'pageview', this.$route.path, { title: `${this.title} - ${SITE_TITLE}` })
  },
  metaInfo () {
    const type = this.type
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`
    let ogImage
    let ogTitle
    let ogDescription
    let sectionName
    switch (type) {
      case SECTION:
        sectionName = this.sectionName
        const imageURL = _.get(this.section, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ], null) ? _.get(this.section, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) : _.get(this.section, [ 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ], null)
        ogImage = imageURL || SITE_OGIMAGE
        ogTitle = _.get(this.section, [ 'ogTitle' ], null) ? this.getTruncatedVal(_.get(this.section, [ 'ogTitle' ]), 11) : this.getTruncatedVal(_.get(this.section, [ 'title' ], this.title), 11)
        ogDescription = _.get(this.section, [ 'ogDescription' ], null) ? this.getTruncatedVal(_.get(this.section, [ 'ogDescription' ]), 197) : _.get(this.section, [ 'description' ])
        ogDescription !== '' ? this.getTruncatedVal(ogDescription, 197) : SITE_DESCRIPTION
        break
      case CATEGORY:
        sectionName = this.sectionName
        ogTitle = this.getTruncatedVal(this.title, 11)
        ogImage = SITE_OGIMAGE
        ogDescription = SITE_DESCRIPTION
        break
      default:
        ogTitle = this.getTruncatedVal(this.title, 11) || ''
        ogImage = SITE_OGIMAGE
        ogDescription = SITE_DESCRIPTION
    }

    if (!ogTitle && process.env.VUE_ENV === 'server' && type !== AUTHOR) {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    }

    const title = ogTitle === '' ? SITE_TITLE : ogTitle + ` - ${SITE_TITLE}`
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
  },
  updated () {
    this.updateSysStage()
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

.foodtravel-redesign
  background-image url("/public/foodtravelbg.jpg")

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
