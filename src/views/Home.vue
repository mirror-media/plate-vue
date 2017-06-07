<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" section="home" :options="dfpOptions" :mode="dfpMode">
    <template scope="props" slot="dfpPos">
      <div class="home-view">
        <section style="width: 100%;">
          <app-Header v-if="true" :commonData= 'commonData' :eventLogo="eventLogo" :viewport="viewport" />
        </section>
        <vue-dfp :is="props.vueDfp" pos="LPCHD" v-if="(viewport > 999)"  :config="props.config"/>
        <vue-dfp :is="props.vueDfp" pos="LMBHD" v-else-if="(viewport < 550)" :config="props.config"/>
        <editor-choice :editorChoice= 'editorChoice' :viewport="viewport" />
        <vue-dfp :is="props.vueDfp" pos="LMBL1" v-if="(viewport < 550)" :config="props.config"/>
        <section class="container list">
          <aside>
            <div class="aside-title mobile-only"><h2>最新文章</h2></div>
            <LatestArticleAside :groupedArticle="o" :viewport="viewport" v-for="(o, i) in groupedArticle" :key="`${i}-${Date.now()}`" />
          </aside>
          <main>
            <LatestArticleMain :latestList="latestArticle" :viewport="viewport">
              <vue-dfp :is="props.vueDfp" pos="LPCNA3" v-if="(viewport > 1199)"  slot="dfpNA3" :config="props.config"/>
              <vue-dfp :is="props.vueDfp" pos="LPCNA5" v-if="(viewport > 1199)"  slot="dfpNA5" :config="props.config"/>
              <vue-dfp :is="props.vueDfp" pos="LPCNA9" v-if="(viewport > 1199)"  slot="dfpNA9" :config="props.config"/>
              <vue-dfp :is="props.vueDfp" pos="LMBNA3" v-if="(viewport < 600)" slot="dfpNA3" :config="props.config"/>
              <vue-dfp :is="props.vueDfp" pos="LMBNA5" v-if="(viewport < 600)" slot="dfpNA5" :config="props.config"/>
              <vue-dfp :is="props.vueDfp" pos="LMBNA9" v-if="(viewport < 600)" slot="dfpNA9" :config="props.config"/>
            </LatestArticleMain>
            <ProjectList class="mobile-hide" :projects="projects" :viewport="viewport" />
            <PopularArticles :popList="popularlist" />
          </main>
        </section>
        <loading :show="loading" />
        <section class="container footer">
          <vue-dfp :is="props.vueDfp" pos="LPCFT" v-if="(viewport > 1000)"  :config="props.config"/>
          <vue-dfp :is="props.vueDfp" pos="LMBFT" v-else-if="(viewport < 550)":config="props.config"/>
          <app-footer :ifShare="false" />
        </section>
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
        <div class="dfp-cover" v-show="showDfpCoverAdFlag && viewport < 1199">
          <div class="ad">
            <vue-dfp :is="props.vueDfp" pos="LMBCVR" v-if="(viewport < 550)" :config="props.config"/>
            <div class="close" @click="closeCoverAd"></div>
          </div>
        </div>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>

import { DFP_ID, DFP_UNITS, FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { currEnv, unLockJS } from '../util/comm'
import _ from 'lodash'
import Cookie from 'vue-cookie'
import EditorChoice from '../components/EditorChoice.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LatestArticleAside from '../components/LatestArticleAside.vue'
import LatestArticleMain from '../components/LatestArticleMain.vue'
import LiveStream from '../components/LiveStream.vue'
import Loading from '../components/Loading.vue'
import PopularArticles from '../components/PopularArticles.vue'
import ProjectList from '../components/article/ProjectList.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import moment from 'moment'
import titleMetaMixin from '../util/mixinTitleMeta'

// const MAXRESULT = 20
// const PAGE = 1

const fetchSSRData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections' ] })
}

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'posts-vue', 'projects', 'topics' ] })
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

const fetchArticlesGroupedList = (store) => {
  return store.dispatch('FETCH_ARTICLES_GROUPED_LIST', { params: {}})
}

const fetchPop = (store) => {
  return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
}

export default {
  name: 'home-view',
  components: {
    'app-footer': Footer,
    'app-Header': Header,
    'editor-choice': EditorChoice,
    'live-stream': LiveStream,
    'loading': Loading,
    LatestArticleAside,
    LatestArticleMain,
    PopularArticles,
    ProjectList,
    VueDfpProvider
  },
  asyncData ({ store }) {
    return fetchSSRData(store)
  },
  beforeRouteEnter (to, from, next) {
    if (process.env.VUE_ENV === 'client' && to.path !== from.path) {
      next(vm => {
        if (_.get(vm.$store, [ 'state', 'commonData', 'sections', 'items' ]) || _.get(vm.$store, [ 'state', 'articlesGroupedList', 'choices' ])) {
          fetchSSRData(vm.$store)
          fetchArticlesGroupedList(vm.$store)
          fetchPop(vm.$store)
        }
      })
    } else {
      next()
    }
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    return {
      title: SITE_TITLE,
      meta: `
        <meta name="keywords" content="${SITE_KEYWORDS}">
        <meta name="description" content="${SITE_DESCRIPTION}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${SITE_TITLE}">
        <meta name="twitter:description" content="${SITE_DESCRIPTION}">
        <meta name="twitter:image" content="${SITE_OGIMAGE}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="鏡週刊 Mirror Media">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${SITE_TITLE}">
        <meta property="og:description" content="${SITE_DESCRIPTION}">
        <meta property="og:url" content="${SITE_URL}">
        <meta property="og:image" content="${SITE_OGIMAGE}">
      `
    }
  },
  data () {
    return {
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      loading: false,
      showDfpCoverAdFlag: false,
      viewport: undefined
    }
  },
  computed: {
    articlesGroupedList () {
      return this.$store.state.articlesGroupedList
    },
    commonData () {
      return this.$store.state.commonData
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
    editorChoice () {
      return _.get(this.articlesGroupedList, [ 'choices' ])
    },
    eventEmbedded () {
      return _.get(this.$store.state.eventEmbedded, [ 'items', '0' ])
    },
    eventLogo () {
      return _.get(this.$store.state.eventLogo, [ 'items', '0' ])
    },
    groupedArticle () {
      return _.slice(_.get(this.articlesGroupedList, [ 'grouped' ]))
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
    latestArticle () {
      return _.get(this.articlesGroupedList, [ 'latest' ])
    },
    popularlist () {
      const { report = [] } = _.get(this.$store, [ 'state', 'articlesPopList' ])
      return report
    },
    projects () {
      return _.get(this.commonData, [ 'projects', 'items' ])
    }
  },
  methods: {
    checkIfLockJS () {
      unLockJS()
    },
    closeCoverAd () {
      this.showDfpCoverAdFlag = false
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
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.documentElement.clientWidth || document.body.clientWidth
      }
    },
    updateSysStage () {
      this.dfpMode = currEnv()
    }
  },
  beforeMount () {
    fetchCommonData(this.$store)
    fetchPop(this.$store)
    fetchEvent(this.$store, 'embedded')
    fetchEvent(this.$store, 'logo')
    fetchArticlesGroupedList(this.$store)
  },
  mounted () {
    window.utmx('url', 'A/B')
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    // this.updateCookie()
    this.checkIfLockJS()
    this.updateSysStage()
    window.ga('send', 'pageview', this.$route.path, { title: SITE_TITLE })
  },
  updated () {
    this.updateSysStage()
  }
}

</script>
<style lang="stylus" scoped>
.editorChoice
  margin-top 40px

.articleList-block
  display block

.home-view
  width 100%
  box-sizing border-box
  padding-bottom 50px 

  h2 
    margin: 0;
    font-family Noto Sans TC,sans-serif
    font-size 18px
    font-weight 700
    line-height 1.5
    letter-spacing .5px
    color rgba(0,0,0,.8)
    list-style-type none

.list
  &.container
    width 100%

    aside
      .aside-title
        // overflow hidden
        padding: 0 2rem;

        h2
          font-size 1.5rem
          color #356d9c
          font-weight 400
          overflow hidden
          margin-bottom 10px

          &::after
            content ""
            display inline-block
            height .5em
            vertical-align middle
            width 100%
            margin-right -100%
            margin-left 10px
            border-top 5px solid #356d9c

    main
      width 90%
      margin 0 auto

section.footer
  width 100%
     
      
@media (min-width: 600px)
  .list
    &.container
      width 100%
      padding 0 2rem

      // main

      aside
        display flex
        flex-wrap wrap
        justify-content space-between

        .aside-title
          width 100%
          color #356d9c
          margin-bottom 10px
          // overflow hidden

          h2
            font-size 1.5rem
            color #356d9c

            &::after
              content ""
              display inline-block
              height .5em
              vertical-align middle
              width 100%
              margin-right -100%
              margin-left 10px
              border-top 5px solid #356d9c

      main
        width 100%

  section.footer
    width 100%
    padding 0 2rem


@media (min-width: 1200px)
  .list
    &.container
      width 1024px
      padding 0
      flex-direction row
      flex-wrap wrap
      align-items flex-start

      main
        width 75%

      aside
        width 25%
        padding 0 30px 0 0

  section.footer
    width 1024px
    
</style>
