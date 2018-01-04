<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="`other`" :options="dfpOptions" :mode="dfpMode">
    <template slot-scope="props" slot="dfpPos">
      <div :class="[ { 'topic-view': !isTimeline }, topicType ]">

        <template v-if="pageStyle === 'wide'">
          <section>
            <header-full :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections'></header-full>
          </section>
          <leading-watch :topic='topic' :type='`TOPIC`'></leading-watch>
          <article-list-full :articles='articles'></article-list-full>
          <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore"></more-full>
          <loading :show="loading"></loading>
          <footer-full :commonData='commonData' :sectionName='sectionName'></footer-full>
          <share :right="`20px`" :bottom="`20px`"></share>
        </template>

        <template v-else-if="topicType === 'timeline'">
          <a href="/" class="topicTimeline__logo">
            <img src="/public/icon/logo_black@3x.png" :alt="siteTitle">
          </a>
          <share :direction="`right`" :top="`5px`" :left="`55px`" :color="`#000`"></share>
          <timeline-headline :initialTimeline="timeline"></timeline-headline>
          <timeline-body :initialTimeline="timeline" :initialHighlightNodes="highlightNodes" :viewport="viewport"></timeline-body>
          <div class="topicTimeline__projects">
            <h1>更多專題文章</h1>
            <ProjectList :projects="projects" :viewport="viewport"></ProjectList>
          </div>
          <div class="topicTimeline__fbComment" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
        </template>

        <template v-else-if="topicType === 'portraitWall'">
          <app-header :commonData= 'commonData' :eventLogo="eventLogo" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" :props="props"></app-header>
          <div class="topic">
            <div class="topic-title"><h1></h1></div>
            <leading :type="getValue(topic, [ 'leading' ])" v-if="getValue(topic, [ 'leading' ])" :mediaData="portraitWallSlideImages"></leading>
          </div>
          <portraitWall-list :articles="articles" :initialMediaData="portraitWallListImages"></portraitWall-list>
          <div><vue-dfp v-if="hasDFP && (viewport > 1000)" :is="props.vueDfp" pos="LPCFT" :dfpUnits="props.dfpUnits"
            :section="props.section" :dfpId="props.dfpId" :unitId="dfp"></vue-dfp></div>
          <div><vue-dfp v-if="hasDFP && (viewport < 900)" :is="props.vueDfp" pos="LMBFT" :dfpUnits="props.dfpUnits"
            :section="props.section" :dfpId="props.dfpId" :unitId="mobileDfp"></vue-dfp></div>
          <section class="footer container">
            <app-footer style="padding: 0 2rem; margin-bottom: 40px;"></app-footer>
          </section>
          <share :right="`20px`" :bottom="`20px`"></share>
        </template>

        <template v-else-if="topicType === 'group'">
          <app-header :commonData= 'commonData' :eventLogo="eventLogo" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" :props="props"></app-header>
          <div class="topic">
            <div class="topic-title"><h1></h1></div>
            <leading :type="getValue(topic, [ 'leading' ])" v-if="getValue(topic, [ 'leading' ])" :mediaData="mediaData"></leading>
          </div>
          <group-list :articles='articles' :tags="tags" :viewport="viewport"></group-list>
          <div><vue-dfp v-if="hasDFP && (viewport > 1000)" :is="props.vueDfp" pos="LPCFT" :dfpUnits="props.dfpUnits"
            :section="props.section" :dfpId="props.dfpId" :unitId="dfp"></vue-dfp></div>
          <div><vue-dfp v-if="hasDFP && (viewport < 900)" :is="props.vueDfp" pos="LMBFT" :dfpUnits="props.dfpUnits"
            :section="props.section" :dfpId="props.dfpId" :unitId="mobileDfp"></vue-dfp></div>
          <section class="footer container">
            <app-footer style="padding: 0 2rem; margin-bottom: 40px;"></app-footer>
          </section>
        </template>

        <template v-else>
          <app-header :commonData= 'commonData' :eventLogo="eventLogo" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" :props="props"></app-header>
          <div class="topic">
            <div class="topic-title"><h1></h1></div>
            <leading :type="getValue(topic, [ 'leading' ])" v-if="getValue(topic, [ 'leading' ])" :mediaData="mediaData"></leading>
          </div>
          <article-list ref="articleList" id="articleList" :articles='autoScrollArticles' :hasDFP='false'></article-list>
          <!--<section class="container">
            <more v-if="hasMore" v-on:loadMore="loadMore"></more>
          </section>-->
          <loading :show="loading"></loading>
          <div><vue-dfp v-if="hasDFP && (viewport > 1000)" :is="props.vueDfp" pos="LPCFT" :dfpUnits="props.dfpUnits"
            :section="props.section" :dfpId="props.dfpId" :unitId="dfp"></vue-dfp></div>
          <div><vue-dfp v-if="hasDFP && (viewport < 900)" :is="props.vueDfp" pos="LMBFT" :dfpUnits="props.dfpUnits"
            :section="props.section" :dfpId="props.dfpId" :unitId="mobileDfp"></vue-dfp></div>
          <article-list ref="articleListAutoScroll" id="articleListAutoScroll" :articles='autoScrollArticlesLoadMore' :hasDFP='false'
            v-show="hasAutoScroll"></article-list>
          <!--<section class="footer container">
            <app-footer style="padding: 0 2rem; margin-bottom: 40px;"></app-footer>
          </section>-->
          <share :right="`20px`" :bottom="`20px`"></share>
        </template>

      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>

import { DFP_ID, DFP_UNITS, DFP_OPTIONS } from '../constants'
import { FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL, TOPIC, TOPIC_PROTEST_ID, TOPIC_WATCH_ID } from '../constants/index'
import { camelize } from 'humps'
import { consoleLogOnDev, currEnv, getTruncatedVal, getValue, sendAdCoverGA, unLockJS, updateCookie } from '../util/comm'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { getRole } from '../util/mmABRoleAssign'
import _ from 'lodash'
import ArticleList from '../components/ArticleList.vue'
import ArticleListFull from '../components/ArticleListFull.vue'
import Cookie from 'vue-cookie'
import Footer from '../components/Footer.vue'
import FooterFull from '../components/FooterFull.vue'
import GroupList from '../components/GroupList.vue'
import Header from '../components/Header.vue'
import HeaderFull from '../components/HeaderFull.vue'
import Leading from '../components/Leading.vue'
import LeadingWatch from '../components/LeadingWatch.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import MoreFull from '../components/MoreFull.vue'
import PortraitWallList from '../components/PortraitWallList.vue'
import ProjectList from '../components/article/ProjectList.vue'
import Share from '../components/Share.vue'
import TimelineBody from '../components/timeline/TimelineBody.vue'
import TimelineHeadline from '../components/timeline/TimelineHeadline.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import titleMetaMixin from '../util/mixinTitleMeta'

const MAXRESULT = 12
const PAGE = 1

const fetchData = (store, id) => {
  return Promise.all([
    store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'projects', 'topics' ] }),
    fetchPartners(store)
  ])
  .then(() => {
    if (!(_.find(_.get(store.getters.topics, [ 'items' ]), { 'id': id }))) {
      return fetchTopicByUuid(store, id)
    }
  })
  .then(() => {
    const topicType = _.get(_.find(_.get(store.getters.topics, [ 'items' ]), { 'id': id }), [ 'type' ]) || _.get(store.getters.topic, [ 'items', '0', 'type' ])
    if (topicType === 'timeline') {
      return fetchTimeline(store, id)
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

const fetchPartners = (store) => {
  const page = _.get(store.state, [ 'partners', 'meta', 'page' ], 0) + 1
  return store.dispatch('FETCH_PARTNERS', {
    params: {
      max_results: 25,
      page: page
    }
  }).then(() => {
    if (_.get(store.state, [ 'partners', 'items', 'length' ]) < _.get(store.state, [ 'partners', 'meta', 'total' ])) {
      fetchPartners(store)
    }
  })
}

const fetchTimeline = (store, id) => {
  return store.dispatch('FETCH_TIMELINE', {
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

const fetchTopicImages = (store, uuid) => {
  return store.dispatch('FETCH_IMAGES', {
    'uuid': uuid,
    'type': TOPIC,
    'params': {
      max_results: 25
    }
  })
}

const fetchTopicAllImages = (store, uuid) => {
  const page = _.get(store.state, [ 'images', 'meta', 'page' ], 0) + 1
  return store.dispatch('FETCH_IMAGES', {
    'uuid': uuid,
    'type': TOPIC,
    'params': {
      max_results: 25,
      page: page
    }
  }).then(() => {
    if (_.get(store.state, [ 'images', 'items', 'length' ]) < _.get(store.state, [ 'images', 'meta', 'total' ])) {
      fetchTopicAllImages(store, uuid)
    }
  })
}

const fetchArticlesByUuid = (store, uuid, type, isLoadMore, useMetaEndpoint, maxResult = MAXRESULT) => {
  const page = isLoadMore || PAGE
  return store.dispatch('FETCH_ARTICLES_BY_UUID', {
    'uuid': uuid,
    'type': type,
    'params': {
      page: page,
      max_results: maxResult,
      useMetaEndpoint: useMetaEndpoint
    }
  })
}

const fetchAllArticlesByUuid = (store, uuid, type, useMetaEndpoint) => {
  const page = _.get(store.state, [ 'articlesByUUID', 'TOPIC', uuid, 'meta', 'page' ], 0) + 1
  return store.dispatch('FETCH_ARTICLES_BY_UUID', {
    'uuid': uuid,
    'type': type,
    'params': {
      page: page,
      max_results: 10,
      useMetaEndpoint: useMetaEndpoint
    }
  }).then(() => {
    if (_.get(store.state, [ 'articlesByUUID', 'TOPIC', uuid, 'items', 'length' ]) < _.get(store.state, [ 'articlesByUUID', 'TOPIC', uuid, 'meta', 'total' ])) {
      fetchAllArticlesByUuid(store, uuid, type, useMetaEndpoint)
    }
  })
}

export default {
  name: 'Topic',
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-list': ArticleList,
    'article-list-full': ArticleListFull,
    'footer-full': FooterFull,
    'group-list': GroupList,
    'header-full': HeaderFull,
    'leading': Leading,
    'leading-watch': LeadingWatch,
    'loading': Loading,
    'more': More,
    'more-full': MoreFull,
    'portraitWall-list': PortraitWallList,
    'share': Share,
    'timeline-body': TimelineBody,
    'timeline-headline': TimelineHeadline,
    'vue-dfp-provider': VueDfpProvider,
    ProjectList
  },
  asyncData ({ store, route }) {
    return fetchData(store, route.params.topicId)
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    if (!this.topic && process.env.VUE_ENV === 'server') {
      return this.pageNotFoundHandler()
    }
    const {
      heroImage = {},
      ogDescription = '',
      ogImage = {},
      ogTitle = '',
      name = ''
    } = this.topic

    const metaTitle = ogTitle || name
    const metaDescription = ogDescription ? this.getTruncatedVal(ogDescription, 197) : SITE_DESCRIPTION
    const metaImage = ogImage ? _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ]) : _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], SITE_OGIMAGE)
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`
    if (!metaTitle && process.env.VUE_ENV === 'server') {
      return this.pageNotFoundHandler()
    }

    return {
      url: ogUrl,
      title: `${metaTitle} - ${SITE_TITLE}`,
      meta: `
        <meta name="mm-opt" content="">
        <meta name="robots" content="index">
        <meta name="keywords" content="${SITE_KEYWORDS}">
        <meta name="description" content="${metaDescription}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${metaTitle}">
        <meta name="twitter:description" content="${metaDescription}">
        <meta name="twitter:image" content="${metaImage}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="${SITE_TITLE}">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${metaTitle}">
        <meta property="og:description" content="${metaDescription}">
        <meta property="og:url" content="${ogUrl}">
        <meta property="og:image" content="${metaImage}">
      `
    }
  },
  data () {
    return {
      abIndicator: 'A',
      articleListAutoScrollHeight: 0,
      canScrollLoadMord: true,
      commonData: this.$store.state.commonData,
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      isVponSDKLoaded: false,
      loading: false,
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverAdVponFlag: false,
      showDfpHeaderLogo: false,
      siteTitle: SITE_TITLE,
      viewport: 0
    }
  },
  computed: {
    articles () {
      return _.uniqBy(_.get(this.$store.state, [ 'articlesByUUID', TOPIC, this.uuid, 'items' ]), 'slug')
    },
    articleUrl () {
      return `${SITE_URL}/topic/${this.currArticleSlug}/`
    },
    autoScrollArticles () {
      return _.take(this.articles, 12)
    },
    autoScrollArticlesLoadMore () {
      return _.slice(this.articles, 12)
    },
    customCSS () {
      return _.get(this.topic, [ 'style' ], null)
    },
    customJS () {
      return _.get(this.topic, [ 'javascript' ], null)
    },
    currArticleSlug () {
      return this.$store.state.route.params.topicId
    },
    dfp () {
      return _.get(this.topic, [ 'dfp' ], null)
    },
    dfpOptions () {
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded: (event) => {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')

          const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
          const afVponLoader = () => {
            if (this.showDfpCoverAd2Flag && !this.isVponSDKLoaded) {
              sendAdCoverGA('vpon')
              consoleLogOnDev({ msg: 'noad2 detected' })
              this.showDfpCoverAdVponFlag = true
              this.isVponSDKLoaded = this.insertVponAdSDK({ currEnv: this.dfpMode, isVponSDKLoaded: this.isVponSDKLoaded })
            }
          }
          window.addEventListener('noad2', afVponLoader)
          window.parent.addEventListener('noad2', afVponLoader)

          switch (position) {
            case 'LMBCVR':
              sendAdCoverGA('dfp')
              if (adDisplayStatus === 'none') {
                updateCookie({ currEnv: this.dfpMode }).then((isVisited) => {
                  this.showDfpCoverAd2Flag = !isVisited
                })
              } else {
                updateCookie({ currEnv: this.dfpMode }).then((isVisited) => {
                  this.showDfpCoverAdFlag = !isVisited
                })
              }
              break
            case 'LMBCVR2':
              consoleLogOnDev({ msg: 'ad2 loaded' })
              sendAdCoverGA('ad2')
              if (adDisplayStatus === 'none') {
                consoleLogOnDev({ msg: 'dfp response no ad2' })
              }
              break
            case 'LOGO':
              if (adDisplayStatus === 'none') {
                this.showDfpHeaderLogo = false
              } else {
                this.showDfpHeaderLogo = true
              }
              break
          }
        },
        setCentering: true
      })
    },
    eventLogo () {
      return _.get(this.$store.state.eventLogo, [ 'items', '0' ])
    },
    fbCommentDiv () {
      return `<div class="fb-comments" data-href="${this.articleUrl}" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>`
    },
    fbAppId () {
      return _.get(this.$store, [ 'state', 'fbAppId' ])
    },
    hasAutoScroll () {
      return _.get(this.$store.state, [ 'articlesByUUID', TOPIC, this.uuid, 'meta', 'page' ], PAGE) !== 1
    },
    hasDFP () {
      return this.dfp !== '' || this.mobileDfp !== ''
    },
    hasMore () {
      return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'articlesByUUID', TOPIC, this.uuid, 'meta', 'total' ], 0)
    },
    mobileDfp () {
      return _.get(this.topic, [ 'mobileDfp' ], null)
    },
    highlightNodes () {
      return _.get(this.$store.state, [ 'timeline', 'nodes' ])
    },
    isTimeline () {
      return this.$route.params.topicId === TOPIC_PROTEST_ID
    },
    page () {
      return _.get(this.$store.state, [ 'articlesByUUID', TOPIC, this.uuidh, 'meta', 'page' ], PAGE)
    },
    pageStyle () {
      return _.get(this.topic, [ 'pageStyle' ])
    },
    portraitWallListImages () {
      return _.filter(_.get(this.mediaData, [ 'images', 'items' ]), (i) => {
        return _.indexOf(i.keywords, '@') === -1
      })
    },
    portraitWallSlideImages () {
      const slideImages = _.filter(_.get(this.$store.state, [ 'images', 'items' ]), (i) => {
        return _.indexOf(i.keywords, '@') !== -1
      })
      return {
        images: {
          items: slideImages
        }
      }
    },
    projects () {
      return _.get(this.commonData, [ 'projects', 'items' ])
    },
    sectionId () {
      return 'other'
    },
    sectionName () {
      switch (this.$route.params.topicId) {
        case TOPIC_WATCH_ID:
          return 'watch'
        default:
          return 'other'
      }
    },
    tags () {
      return _.filter(_.get(this.$store.state, [ 'tags' ]), (t) => {
        return _.includes(_.get(this.topic, [ 'tags' ]), t.id)
      })
    },
    timeline () {
      return _.get(this.$store.state, [ 'timeline' ])
    },
    topic () {
      if (_.find(_.get(this.$store.state.topics, [ 'items' ]), { 'id': this.uuid })) {
        return _.find(_.get(this.$store.state.topics, [ 'items' ]), { 'id': this.uuid })
      } else {
        return _.get(this.$store.state, [ 'topic', 'items', '0' ])
      }
    },
    topicType () {
      return this.camelize(_.get(this.topic, [ 'type' ]))
    },
    mediaData () {
      return {
        images: _.get(this.$store.state, [ 'images', this.uuid ])
      }
    },
    uuid () {
      return this.$route.params.topicId
    },
    viewportTarget () {
      if (this.viewport < 600) {
        return 'mobile'
      } else if (this.viewport > 600 && this.viewport < 1200) {
        return 'tablet'
      } else {
        return 'desktop'
      }
    }
  },
  beforeMount () {
    fetchEvent(this.$store, 'logo')
    if (this.topicType !== 'timeline') {
      if (this.topicType === 'portraitWall') {
        fetchAllArticlesByUuid(this.$store, this.uuid, TOPIC, false)
      } else if (this.topicType === 'group') {
        fetchAllArticlesByUuid(this.$store, this.uuid, TOPIC, true)
      } else {
        fetchArticlesByUuid(this.$store, this.uuid, TOPIC, false, false)
      }
      fetchTopicAllImages(this.$store, this.uuid)
    }
  },
  mounted () {
    this.updateViewport()
    this.insertCustomizedMarkup()
    this.checkIfLockJS()
    this.updateSysStage()
    // this.abIndicator = this.getMmid()

    window.ga('set', 'contentGroup1', '')
    window.ga('set', 'contentGroup2', '')
    window.ga('set', 'contentGroup3', '')
    // window.ga('set', 'contentGroup3', `list${this.abIndicator}`)
    window.ga('send', 'pageview', { title: `${_.get(this.topic, [ 'name' ])} - ${SITE_TITLE}`, location: document.location.href })

    window.addEventListener('resize', this.updateViewport)
    if (this.topicType === 'list') { window.addEventListener('scroll', this.scrollHandler) }
    if (this.topicType === 'timeline') { window.addEventListener('scroll', this.timelineScrollHandler) }
  },
  methods: {
    camelize,
    checkIfLockJS () {
      unLockJS()
    },
    currentYPosition,
    elmYPosition,
    getMmid () {
      const mmid = Cookie.get('mmid')
      const role = getRole({ mmid, distribution: [
        { id: 'A', weight: 50 },
        { id: 'B', weight: 50 } ]
      })
      return role
    },
    getTruncatedVal,
    getValue,
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
      let currentPage = this.page
      currentPage += 1
      this.loading = true

      fetchArticlesByUuid(this.$store, this.uuid, TOPIC, currentPage, false)
      .then(() => {
        this.loading = false
        this.canScrollLoadMord = true
      })
    },
    pageNotFoundHandler () {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    },
    scrollHandler (e) {
      if (this.$refs.articleList) {
        const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        const currentBottom = this.currentYPosition() + vh
        const articleListBottom = this.elmYPosition('#articleList') + this.$refs.articleList.$el.offsetHeight
        this.articleListAutoScrollHeight = this.$refs.articleListAutoScroll.$el.offsetHeight
        const articleListAutoScrollBottom = this.elmYPosition('#articleListAutoScroll') + this.articleListAutoScrollHeight

        if (this.hasMore && (this.page === 1) && this.canScrollLoadMord && currentBottom > (articleListBottom - 300)) {
          this.canScrollLoadMord = false
          this.loadMore()
        }
        if (this.hasMore && (this.page > 1) && this.canScrollLoadMord && currentBottom > (articleListAutoScrollBottom - 300)) {
          this.canScrollLoadMord = false
          this.loadMore()
        }
      }
    },
    timelineScrollHandler (e) {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const timelineBodyBriefHeight = document.querySelector('.timelineBody__brief').offsetHeight
      const activityBoxHeight = document.querySelector('.timelineMenu-activityBox').offsetHeight
      const cutHeight = (windowHeight / 2) + timelineBodyBriefHeight + 20

      if (this.currentYPosition() - cutHeight > 0) {
        const timelineMenuStartTop = this.currentYPosition() - cutHeight
        const onCenterIndex = Math.floor(timelineMenuStartTop / activityBoxHeight)
        const activityBoxs = document.querySelectorAll('.timelineMenu-activityBox')
        for (let i = 0; i < activityBoxs.length; i += 1) {
          activityBoxs[i].classList.remove('onCenter')
        }
        activityBoxs[onCenterIndex].classList.add('onCenter')
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
        this.viewport = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      }
    },
    updateSysStage () {
      this.dfpMode = currEnv()
    }
  },
  beforeRouteUpdate (to, from, next) {
    let topicType
    const uuid = _.split(to.path, '/')[2]
    const topic = _.find(_.get(this.$store.state.topics, [ 'items' ]), { 'id': uuid }, undefined)

    if (!topic) {
      fetchTopicByUuid(this.$store, uuid)
      .then(() => {
        topicType = _.camelCase(_.get(this.$store.state.topic, [ 'items', '0', 'type' ]))
        if (topicType === 'group') {
          Promise.all([ fetchAllArticlesByUuid(this.$store, uuid, TOPIC, true), fetchTopicImages(this.$store, uuid) ])
          .then(next())
        } else if (topicType === 'portraitWall') {
          Promise.all([ fetchAllArticlesByUuid(this.$store, uuid, TOPIC, false), fetchTopicImages(this.$store, uuid) ])
          .then(next())
        } else if (topicType === 'timeline') {
          Promise.all([ fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false), fetchTopicImages(this.$store, uuid), fetchTimeline(this.$store, uuid) ])
          .then(next())
        } else {
          Promise.all([ fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false), fetchTopicImages(this.$store, uuid) ])
          .then(next())
        }
      })
    } else {
      topicType = _.camelCase(_.get(topic, [ 'type' ]))
      if (topicType === 'group') {
        Promise.all([ fetchAllArticlesByUuid(this.$store, uuid, TOPIC, true), fetchTopicImages(this.$store, uuid) ])
        .then(next())
      } else if (topicType === 'portraitWall') {
        Promise.all([ fetchAllArticlesByUuid(this.$store, uuid, TOPIC, false), fetchTopicImages(this.$store, uuid) ])
        .then(next())
      } else if (topicType === 'timeline') {
        Promise.all([ fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false), fetchTopicImages(this.$store, uuid), fetchTimeline(this.$store, uuid) ])
        .then(next())
      } else {
        Promise.all([ fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false), fetchTopicImages(this.$store, uuid) ])
        .then(next())
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (process.env.VUE_ENV === 'client') {
      const custCss = document.querySelector('#custCSS')
      const custScript = document.querySelector('#custJS')
      custCss.innerHTML = ''
      custScript.innerHTML = ''
    }
    next()
  },
  updated () {
    this.updateSysStage()
  },
  destroyed () {
    window.removeEventListener('resize', this.updateViewport)
    window.removeEventListener('scroll', this.scrollHandler)
    window.removeEventListener('scroll', this.timelineScrollHandler)
  },
  watch: {
    uuid: function () {
      this.$forceUpdate()
      if (process.env.VUE_ENV === 'client') {
        window.ga('send', 'pageview', { title: `${_.get(this.topic, [ 'name' ])} - ${SITE_TITLE}`, location: document.location.href })
        if (this.topicType === 'list') {
          window.removeEventListener('scroll', this.scrollHandler)
          window.addEventListener('scroll', this.scrollHandler)
        } else {
          window.removeEventListener('scroll', this.scrollHandler)
        }
        if (this.topicType === 'timeline') {
          window.removeEventListener('scroll', this.timelineScrollHandler)
          window.addEventListener('scroll', this.timelineScrollHandler)
        } else {
          window.removeEventListener('scroll', this.timelineScrollHandler)
        }
      }
    },
    customCSS: function () {
      if (process.env.VUE_ENV === 'client') {
        this.updateCustomizedMarkup()
      }
    },
    articleUrl: function () {
      if (process.env.VUE_ENV === 'client') {
        window.FB && window.FB.init({
          appId: this.fbAppId,
          xfbml: true,
          version: 'v2.0'
        })
        window.FB && window.FB.XFBML.parse()
      }
    }
  }
}
</script>

<style lang="stylus">

.topic
  position relative
  width 100%
  padding-top 66.66%
  background-color rgba(135, 156, 169, 0.15)
  margin-bottom 20px
  background-repeat no-repeat
  background-position center center
  background-size cover
  &-view
    background-color #f2f2f2
  &-title
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 80%
    height 50%
    background-size cover
    background-repeat no-repeat
    h1
      margin 0

.topic-view.portraitWall
  .topic
    margin 0

.topicTimeline
  &__logo
    position fixed
    z-index 999
    top 5px
    left 5px
    width 40px
    height 40px
    > img
      width 100%
  &__projects
    width 100%
    padding 1em
    background-color #4d4d4d
    .project-container
      margin 1em 0
      background-color #fff
      .proj_title
        display none
    > h1
      margin 0
      color #fff
      text-align center
      font-weight 200
  &__fbComment
    width 100%
    padding 0 5%
    background-color #fff

@media (min-width: 600px)
  .topicTimeline
    &__projects
      padding 5% 10%

@media (min-width: 900px)
  .topic
    height 600px
    padding-top 0
    &-title
      height 200px
      width 400px
      color #fff
      background-size contain
      background-position center center

</style>
