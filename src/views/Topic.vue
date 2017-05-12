<template>
  <div class="topic-view">
    <template v-if="pageStyle === 'feature'">
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
      <section class="footer container">
        <app-footer style="padding: 0 2rem; margin-bottom: 40px;" />
      </section>
      <share />
    </template>
    <template v-if="pageStyle === 'full'">
      <section>
        <header-full :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' />
      </section>
      <leading-watch :topic='topic' :type='`TOPIC`'/>
      <article-list-full :articles='articles.items' />
      <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" />
      <loading :show="loading" />
      <footer-full :commonData='commonData' :sectionName='sectionName' />
      <share />
    </template>
  </div>
</template>

<script>

import { DFP_ID, DFP_UNITS } from '../constants'
import { FB_APP_ID, FB_PAGE_ID, SITE_KEYWORDS, SITE_TITLE, SITE_URL, TOPIC, TOPIC_WATCH_ID } from '../constants/index'
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
import Share from '../components/Share.vue'
import store from '../store'

const MAXRESULT = 12
const PAGE = 1

const fetchData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'topics' ] })
  .then(() => {
    if (!(_.find(_.get(store.getters.topics, [ 'items' ]), { 'id': store.state.route.params.topicId }))) {
      return fetchTopicByUuid(store, store.state.route.params.topicId)
    }
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
    'share': Share
  },
  preFetch: fetchData,
  data () {
    return {
      commonData: this.$store.state.commonData,
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      loading: false,
      showDfpCoverAdFlag: false
    }
  },
  computed: {
    articles () {
      return this.$store.state.articlesByUUID
    },
    customCSS () {
      return _.get(this.topic, [ 'style' ], null)
    },
    customJS () {
      return _.get(this.topic, [ 'javascript' ], null)
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
    hasMore () {
      return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'meta', 'total' ], 0)
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
      return _.get(_.find(_.get(this.commonData, [ 'topics', 'items' ]), { 'id': this.$route.params.topicId }), [ 'name' ])
    },
    topic () {
      if (_.find(_.get(this.$store.state.topics, [ 'items' ]), { 'id': this.uuid })) {
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
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.matched.length !== 0) {
      fetchTopicByUuid(store, to.params.topicId)
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

    fetchArticlesByUuid(this.$store, uuid, false)
    fetchTopicImages(this.$store, uuid)
  },
  mounted () {
    this.insertCustomizedMarkup()
    this.checkIfLockJS()

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
    }
  },
  metaInfo () {
    const description = '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
    const ogImage = _.get(this.topic, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ], null) ? _.get(this.topic, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) : '/public/notImage.png'
    const ogTitle = _.get(this.topic, [ 'ogTitle' ], null) ? _.get(this.topic, [ 'ogTitle' ]) : _.get(this.topic, [ 'title' ], this.title)
    const ogDescription = _.get(this.topic, [ 'ogDescription' ], null) ? _.get(this.topic, [ 'ogDescription' ]) : description
    const title = ogTitle + ` - ${SITE_TITLE}`
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`

    if (!ogTitle && process.env.VUE_ENV === 'server') {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    }

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

<style lang="stylus" scoped>

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
