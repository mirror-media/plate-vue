<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="`other`" :options="dfpOptions" :mode="dfpMode">
    <template scope="props" slot="dfpPos">
      <div :class="{ 'topic-view': !isTimeline }">

        <template v-if="pageStyle === 'full'">
          <section>
            <header-full :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' />
          </section>
          <leading-watch :topic='topic' :type='`TOPIC`'/>
          <article-list-full :articles='articles.items' />
          <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" />
          <loading :show="loading" />
          <footer-full :commonData='commonData' :sectionName='sectionName' />
          <share :right="`20px`" :bottom="`20px`" />
        </template>

        <template v-if="isTimeline">
          <a href="/" class="topicTimeline__logo">
            <img src="/public/icon/logo_black@3x.png"/>
          </a>
          <share :direction="`right`" :top="`5px`" :left="`55px`" :color="`#000`" />
          <timeline-headline :timeline="timeline" :viewport="viewport"/>
          <timeline-body :timeline="timeline" :highlightNodes="highlightNodes" :viewport="viewport" />
          <div class="project-list-wrapper">
            <h1>更多專題文章</h1>
            <ProjectList :projects="projects" :viewport="viewport" />
          </div>
          <div class="article_fb_comment" style="margin: 1.5em 1.5em; @media (min-width: 900px) { margin: 1.5em 20vw; }" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
        </template>

        <template v-else>
          <app-header :commonData= 'commonData' />
          <div class="topic">
            <div class="topic-title"><h1></h1></div>
            <leading :type="getValue(topic, [ 'leading' ])" v-if="getValue(topic, [ 'leading' ])" :mediaData="mediaData"/>
          </div>
          <article-list :articles='articles.items' :hasDFP='false' />
          <section class="container">
            <more v-if="hasMore" v-on:loadMore="loadMore" />
          </section>
          <loading :show="loading" />
          <div><vue-dfp v-if="hasDFP && (viewport > 1000)" :is="props.vueDfp" pos="LPCFT" :dfpUnits="props.dfpUnits"
            :section="props.section" :dfpId="props.dfpId" :unitId="dfp"/></div>
          <div><vue-dfp v-if="hasDFP && (viewport < 900)" :is="props.vueDfp" pos="LMBFT" :dfpUnits="props.dfpUnits"
            :section="props.section" :dfpId="props.dfpId" :unitId="mobileDfp"/></div>
          <section class="footer container">
            <app-footer style="padding: 0 2rem; margin-bottom: 40px;" />
          </section>
          <share :right="`20px`" :bottom="`20px`" />
        </template>
        
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>

import { DFP_ID, DFP_UNITS } from '../constants'
import { FB_APP_ID, FB_PAGE_ID, SITE_KEYWORDS, SITE_TITLE, SITE_URL, TOPIC, TOPIC_PROTEST_ID, TOPIC_WATCH_ID } from '../constants/index'
import { getValue, unLockJS } from '../utils/comm'
import _ from 'lodash'
import ArticleList from '../components/ArticleList.vue'
import ArticleListFull from '../components/ArticleListFull.vue'
import Footer from '../components/Footer.vue'
import FooterFull from '../components/FooterFull.vue'
import Header from '../components/Header.vue'
import HeaderFull from '../components/HeaderFull.vue'
import Leading from '../components/Leading.vue'
import LeadingWatch from '../components/LeadingWatch.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import MoreFull from '../components/MoreFull.vue'
import ProjectList from '../components/article/ProjectList.vue'
import Share from '../components/Share.vue'
import TimelineBody from '../components/timeline/TimelineBody.vue'
import TimelineHeadline from '../components/timeline/TimelineHeadline.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import moment from 'moment'
import store from '../store'

const MAXRESULT = 12
const PAGE = 1

const fetchData = (store) => {
  if (store.state.route.params.topicId === TOPIC_PROTEST_ID) {
    return fetchTimeline(store, TOPIC_PROTEST_ID)
    // return fetchActivities(store)
    // .then(() => {
    //   return fetchNodes(store, {}, true)
    // })
  } else {
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'topics' ] })
    .then(() => {
      if (!(_.find(_.get(store.getters.topics, [ 'items' ]), { 'id': store.state.route.params.topicId }))) {
        return fetchTopicByUuid(store, store.state.route.params.topicId)
      }
    })
  }
}

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'posts-vue', 'projects', 'topics' ] })
}

const fetchTimeline = (store, id) => {
  return store.dispatch('FETCH_TIMELINE', {
    'id': id
  })
}

// const fetchActivities = (store, params = {}) => {
//   return store.dispatch('FETCH_ACTIVITIES', {
//     'params': params
//   })
// }

// const fetchNodes = (store, params = {}, isHighlight = false) => {
//   if (isHighlight) {
//     return store.dispatch('FETCH_NODES', {
//       'params': {
//         'where': {
//           isFeatured: true,
//         }
//       }
//     })
//   }
//   return store.dispatch('FETCH_NODES', {
//     'params': params
//   })
// }

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

const fetchArticlesByUuid = (store, uuid, isLoadMore) => {
  const page = isLoadMore || PAGE
  return store.dispatch('FETCH_ARTICLES_BY_UUID', {
    'uuid': uuid,
    'type': TOPIC,
    'params': {
      page: page,
      max_results: MAXRESULT
    }
  })
}

export default {
  name: 'topic-view',
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-list': ArticleList,
    'article-list-full': ArticleListFull,
    'footer-full': FooterFull,
    'header-full': HeaderFull,
    'leading': Leading,
    'leading-watch': LeadingWatch,
    'loading': Loading,
    'more': More,
    'more-full': MoreFull,
    'share': Share,
    'timeline-body': TimelineBody,
    'timeline-headline': TimelineHeadline,
    'vue-dfp-provider': VueDfpProvider,
    ProjectList
  },
  preFetch: fetchData,
  data () {
    return {
      // commonData: this.$store.state.commonData,
      timeline: this.$store.state.timeline,
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      loading: false,
      showDfpCoverAdFlag: false,
      viewport: 0
    }
  },
  computed: {
    activities () {
      return _.get(this.$store.state, [ 'activities', 'items' ])
    },
    articles () {
      return _.get(this.$store.state, [ 'articlesByUUID' ])
    },
    articleUrl () {
      return `${SITE_URL}/topic/${this.currArticleSlug}/`
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
    commonData () {
      return this.$store.state.commonData
    },
    dfp () {
      return _.get(this.topic, [ 'dfp' ], null)
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
    fbCommentDiv () {
      return `<div class="fb-comments" data-href="${this.articleUrl}" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>`
    },
    fbAppId () {
      return _.get(this.$store, [ 'state', 'fbAppId' ])
    },
    hasDFP () {
      return this.dfp !== '' || this.mobileDfp !== ''
    },
    hasMore () {
      return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'meta', 'total' ], 0)
    },
    mobileDfp () {
      return _.get(this.topic, [ 'mobileDfp' ], null)
    },
    highlightNodes () {
      return _.sortBy(_.get(this.$store.state, [ 'timeline', 'nodes' ]), [ function (o) {
        if (true) { // 判斷升降序
          return -moment(new Date(o.nodeDate))
        }
        return moment(new Date(o.nodeDate))
      } ])
    },
    isTimeline () {
      return this.$route.params.topicId === TOPIC_PROTEST_ID
    },
    page () {
      return _.get(this.$store.state, [ 'articlesByUUID', 'meta', 'page' ], PAGE)
    },
    pageStyle () {
      switch (this.$route.params.topicId) {
        case TOPIC_WATCH_ID:
          return 'full'
        default:
          return 'feature'
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
    title () {
      if (_.get(this.$route, [ 'params', 'topicId' ]) === TOPIC_WATCH_ID) {
        return '錶展特區'
      }
      if (_.get(this.$route, [ 'params', 'topicId' ]) === TOPIC_PROTEST_ID) {
        return _.get(this.$store.state, [ 'timeline', 'topic', 'ogTitle' ])
      }
      return _.get(_.find(_.get(this.commonData, [ 'topics', 'items' ]), { 'id': this.$route.params.topicId }), [ 'name' ])
    },
    topic () {
      if (_.get(this.$route, [ 'params', 'topicId' ]) === TOPIC_PROTEST_ID) {
        return _.get(this.$store.state, [ 'timeline', 'topic' ])
      } else if (_.find(_.get(this.$store.state.topics, [ 'items' ]), { 'id': this.uuid })) {
        return _.find(_.get(this.$store.state.topics, [ 'items' ]), { 'id': this.uuid })
      } else {
        return _.get(this.$store.state, [ 'topic', 'items', '0' ])
      }
    },
    mediaData () {
      return {
        images: _.get(this.$store.state, [ 'images' ])
      }
    },
    uuid () {
      return this.$route.params.topicId
    }
  },
  methods: {
    checkIfLockJS () {
      unLockJS()
    },
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
    insertFbSdkScript () {
      if (!window.FB) {
        const fbSdkScript = document.createElement('script')
        fbSdkScript.setAttribute('id', 'fbsdk')
        fbSdkScript.innerHTML = '(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.8&appId=' + this.fbAppId + '\"; fjs.parentNode.insertBefore(js, fjs); }(document, \'script\', \'facebook-jssdk\'));'
        fbSdkScript.async = true
        fbSdkScript.type = 'text/javascript'
        document.querySelector('body').insertBefore(fbSdkScript, document.querySelector('body').children[0])
      } else {
        window.FB && window.FB.init({
          appId: this.fbAppId,
          xfbml: true,
          version: 'v2.0'
        })
        window.FB && window.FB.XFBML.parse()
      }
    },
    insertMediafarmersScript () {
      const mediafarmersScript = document.createElement('script')
      mediafarmersScript.setAttribute('id', 'mediafarmersJS')
      mediafarmersScript.setAttribute('src', 'https://mediafarmers.org/api/api.js')
      if (!document.getElementById('mediafarmersJS')) {
        document.querySelector('body').appendChild(mediafarmersScript)
      }
    },
    loadMore () {
      let currentPage = this.page
      currentPage += 1
      this.loading = true

      fetchArticlesByUuid(this.$store, this.uuid, currentPage)
      .then(() => {
        this.loading = false
      })
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
    updateMediafarmersScript () {
      const mediafarmersScript = document.querySelector('#mediafarmersJS')
      document.querySelector('body').removeChild(mediafarmersScript)
      this.insertMediafarmersScript()
    }
  },
  beforeRouteEnter (to, from, next) {
    const uuid = _.split(to.path, '/')[2]
    if (from.matched.length !== 0 && uuid !== TOPIC_PROTEST_ID) {
      fetchTopicByUuid(store, to.params.topicId)
    } else {
      fetchTimeline(store, TOPIC_PROTEST_ID)
    }
    next()
  },
  beforeRouteUpdate (to, from, next) {
    const uuid = _.split(to.path, '/')[2]
    const topic = _.find(_.get(this.$store.state.topics, [ 'items' ]), { 'id': uuid }, undefined)
    this.page = PAGE

    fetchArticlesByUuid(this.$store, uuid, false)
    .then(() => {
      fetchTopicImages(this.$store, uuid)
      .then(() => {
        if (!topic) {
          fetchTopicByUuid(this.$store, uuid)
        }
      }).then(() => next())
    })
  },
  beforeRouteLeave (to, from, next) {
    const custCss = document.querySelector('#custCSS')
    const custScript = document.querySelector('#custJS')
    custCss.innerHTML = ''
    custScript.innerHTML = ''
    next()
  },
  beforeMount () {
    const uuid = _.split(this.$route.path, '/')[2]
    if (uuid === TOPIC_PROTEST_ID) {
      fetchCommonData(this.$store)
    } else {
      fetchArticlesByUuid(this.$store, uuid, false)
      fetchTopicImages(this.$store, uuid)
    }
  },
  mounted () {
    this.insertFbSdkScript()
    this.insertMediafarmersScript()
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })

    this.insertCustomizedMarkup()
    this.checkIfLockJS()
    this.updateViewport()

    window.ga('set', 'contentGroup1', '')
    window.ga('send', 'pageview', this.$route.path, { title: `${this.title} - ${SITE_TITLE}` })
  },
  watch: {
    uuid: function () {
      window.ga('set', 'contentGroup1', '')
      window.ga('send', 'pageview', this.$route.path, { title: `${this.title} - ${SITE_TITLE}` })
    },
    customCSS: function () {
      this.updateCustomizedMarkup()
    },
    articleUrl: function () {
      window.FB && window.FB.init({
        appId: this.fbAppId,
        xfbml: true,
        version: 'v2.0'
      })
      window.FB && window.FB.XFBML.parse()
      // this.checkIfLockJS()
      this.updateMediafarmersScript()
      // this.sendGA(this.articleData)
    }
  },
  metaInfo () {
    const description = '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
    const ogImage = _.get(this.topic, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ], null) ? _.get(this.topic, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) : '/public/notImage.png'
    const ogTitle = _.get(this.topic, [ 'ogTitle' ], null) ? _.get(this.topic, [ 'ogTitle' ]) : _.get(this.topic, [ 'title' ], this.title)
    const ogDescription = _.get(this.topic, [ 'ogDescription' ], null) ? _.get(this.topic, [ 'ogDescription' ]) : description
    const title = ogTitle + ` - ${SITE_TITLE}`
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`

    // if (!ogTitle && process.env.VUE_ENV === 'server') {
    //   const e = new Error()
    //   e.massage = 'Page Not Found'
    //   e.code = '404'
    //   throw e
    // }

    return {
      title,
      meta: [
          { name: 'keywords', content: SITE_KEYWORDS },
          { name: 'description', content: ogDescription },
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

.topicTimeline__logo
  position fixed
  z-index 999
  top 5px
  left 5px
  width 40px
  height 40px
  > img
    width 100%

.project-list-wrapper
  border-top 30px solid #4d4d4d
  border-bottom 30px solid #4d4d4d
  border-right 1.5em solid #4d4d4d
  border-left 1.5em solid #4d4d4d
  h1
    text-align center
    background-color #4d4d4d
    color white
    margin 0
    padding-bottom 10px
    font-weight 200


  .project-container
    .proj_title
      display none

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
  .project-list-wrapper
    border-top 50px solid #4d4d4d
    border-bottom 100px solid #4d4d4d
    border-right 20vw solid #4d4d4d
    border-left 20vw solid #4d4d4d
    h1
      text-align center
      background-color #4d4d4d
      color white
      margin 0
      padding-bottom 10px
      font-weight 200


    .project-container
      .proj_title
        display none



</style>
