<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" section="home" :options="dfpOptions" :mode="dfpMode">
    <template scope="props" slot="dfpPos">
      <div class="home-view">
        <section style="width: 100%;">
          <app-Header v-if="true" :commonData= 'commonData' :eventLogo="eventLogo" :viewport="viewport" :props="props"/>
        </section>
        <vue-dfp :is="props.vueDfp" pos="LPCHD" v-if="(viewport > 999)"  :config="props.config"/>
        <vue-dfp :is="props.vueDfp" pos="LMBHD" v-else-if="(viewport < 550)" :config="props.config"/>
        <editor-choice :editorChoice= 'editorChoice' :viewport="viewport" target="_blank"/>
        <vue-dfp :is="props.vueDfp" pos="LMBL1" v-if="(viewport < 550)" :config="props.config"/>
        <section class="container list">
          <ProjectList class="mobile-only" :projects="projects" :viewport="viewport" target="_blank"/>
          <aside>
            <div class="aside-title mobile-only" ref="aside_title"><h2>最新文章</h2></div>
            <LatestArticleAside :groupedArticle="o" :viewport="viewport" v-for="(o, i) in groupedArticle" :class="{ last: i === (groupedArticle.length - 1), first: i === 0}" :key="`${i}-groupedlist`" target="_blank"/>
          </aside>
          <main>
            <ProjectList class="mobile-hide" :projects="projects" :viewport="viewport" target="_blank"/>
            <vue-dfp :is="props.vueDfp" pos="LPCB1" v-if="(viewport > 1199)" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="LMBL2" v-if="(viewport < 1199)" :config="props.config"/>
            <LatestArticleMain id="latestArticle" :latestList="latestArticle" :viewport="viewport" target="_blank"></LatestArticleMain>
          </main>
        </section>
        <loading :show="loading" />
        <section class="container">
          <more v-if="true" v-on:loadMore="loadMore" />
        </section>
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
        <div class="dfp-cover" v-show="showDfpCoverAdFlag && viewport < 1199">
          <div class="ad">
            <vue-dfp :is="props.vueDfp" pos="LMBCVR" v-if="(viewport < 550)" :config="props.config"/>
            <div class="close" @click="closeCoverAd"></div>
          </div>
        </div>
        <div class="dfp-cover vpon" v-show="viewport < 1199"> 
          <div class="dfp-cover vpon" v-if="showDfpCoverAdVponFlag && (viewport < 550)" v-html="vponHtml()"></div>>
        </div>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { DFP_ID, DFP_UNITS, DFP_OPTIONS, FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { currEnv, insertVponAdSDK, unLockJS, updateCookie, vponHtml } from '../util/comm'
import _ from 'lodash'
// import Cookie from 'vue-cookie'
import EditorChoice from '../components/EditorChoice.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LatestArticleAside from '../components/LatestArticleAside.vue'
import LatestArticleMain from '../components/LatestArticleMain.vue'
import LiveStream from '../components/LiveStream.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
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

const MAXRESULT = 20
const PAGE = 1
const fetchLatestArticle = (store, page) => {
  return store.dispatch('FETCH_LATESTARTICLES', {
    params: {
      'max_results': MAXRESULT,
      'page': page,
      'sort': '-publishedDate'
    }
  })
}

export default {
  name: 'home-view',
  components: {
    'app-footer': Footer,
    'app-Header': Header,
    'editor-choice': EditorChoice,
    'live-stream': LiveStream,
    'loading': Loading,
    'more': More,
    LatestArticleAside,
    LatestArticleMain,
    PopularArticles,
    ProjectList,
    VueDfpProvider
  },
  asyncData ({ store }) {
    return fetchSSRData(store)
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    return {
      title: SITE_TITLE,
      meta: `
        <meta name="mm-opt" content="">
        <meta name="robots" content="index">
        <meta name="keywords" content="${SITE_KEYWORDS}">
        <meta name="description" content="${SITE_DESCRIPTION}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${SITE_TITLE}">
        <meta name="twitter:description" content="${SITE_DESCRIPTION}">
        <meta name="twitter:image" content="${SITE_OGIMAGE}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="${SITE_TITLE}">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${SITE_TITLE}">
        <meta property="og:description" content="${SITE_DESCRIPTION}">
        <meta property="og:url" content="${SITE_URL}">
        <meta property="og:image" content="${SITE_OGIMAGE}">
      `
    }
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
  data () {
    return {
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      isVponSDKLoaded: false,
      loading: false,
      hasScrollLoadMore: _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], PAGE) > 1,
      page: _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], PAGE),
      showDfpCoverAdFlag: false,
      showDfpCoverAdVponFlag: false,
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
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded: (event) => {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')
          if (position === 'LMBCVR' || position === 'MBCVR') {
            const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
            if (adDisplayStatus === 'none') {
              updateCookie({ currEnv: this.dfpMode }).then((isVisited) => {
                this.showDfpCoverAdVponFlag = !isVisited
                this.isVponSDKLoaded = this.insertVponAdSDK({ currEnv: this.dfpMode, isVponSDKLoaded: this.isVponSDKLoaded })
              })
            } else {
              updateCookie({ currEnv: this.dfpMode }).then((isVisited) => {
                this.showDfpCoverAdFlag = !isVisited
              })
            }
          }
        },
        setCentering: true
      })
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
    latestArticlesList () {
      return _.get(this.$store.state, [ 'latestArticles', 'items' ])
    },
    latestEndIndex () {
      return _.get(this.$store.state, [ 'articlesGroupedList', 'latestEndIndex' ])
    },
    latestArticle () {
      const { articlesGroupedList, latestEndIndex, latestArticlesList } = this

      const latestFirstPage = _.dropRight(_.get(articlesGroupedList, [ 'latest' ]), 3)
      const latestAfterFirstPage = _.drop(latestArticlesList, latestEndIndex)
      const choices = _.get(articlesGroupedList, [ 'choices' ])
      const groupedTitle = _.get(articlesGroupedList, [ 'grouped' ])
      const groupedRelateds = _.flatten(_.map(_.get(articlesGroupedList, [ 'grouped' ]), (o) => o.relateds))
      const grouped = _.union(groupedTitle, groupedRelateds)
      const choicesAndGrouped = _.unionBy(choices, grouped, 'slug')
      const choicesAndGrouped_slugs = choicesAndGrouped.map((o) => o.slug)

      const latest = _.uniqBy(
        _.concat(latestFirstPage, latestAfterFirstPage),
        'slug'
      )

      _.remove(latest, (o) => {
        return _.includes(choicesAndGrouped_slugs, o.slug)
      })

      if (this.notFirstPageNow) {
        return latest
      } else {
        return latestFirstPage
      }
    },
    notFirstPageNow () {
      return _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], 1) !== 1
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
    initHasScrollLoadMore () {
      this.hasScrollLoadMore = false
    },
    insertVponAdSDK,
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.documentElement.clientWidth || document.body.clientWidth
      }
    },
    updateSysStage () {
      this.dfpMode = currEnv()
    },
    loadMore () {
      this.page += 1
      this.loading = true

      fetchLatestArticle(this.$store, this.page).then(() => {
        this.hasScrollLoadMore = false
        this.loading = false
      })
    },
    handleScroll () {
      window.onscroll = (e) => {
        const _latestArticleDiv = document.querySelector('#latestArticle')
        if (!_latestArticleDiv) { return }
        const firstPageArticleHeight = _latestArticleDiv.offsetHeight
        const firstPageArticleBottom = elmYPosition('#latestArticle') + (firstPageArticleHeight)
        const currentBottom = currentYPosition() + window.innerHeight
        if ((currentBottom > (firstPageArticleBottom - 0)) && !this.hasScrollLoadMore) {
          this.hasScrollLoadMore = true
          this.loadMore()
        }
      }
    },
    vponHtml
  },
  beforeMount () {
    fetchCommonData(this.$store)
    fetchPop(this.$store)
    fetchEvent(this.$store, 'embedded')
    fetchEvent(this.$store, 'logo')
    fetchArticlesGroupedList(this.$store)
  },
  mounted () {
    this.handleScroll()
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.checkIfLockJS()
    this.updateSysStage()
    window.ga('set', 'contentGroup1', '')
    window.ga('set', 'contentGroup2', '')
    window.ga('set', 'contentGroup3', '')
    window.ga('send', 'pageview', { title: SITE_TITLE, location: document.location.href })
  },
  updated () {
    this.initHasScrollLoadMore()
    this.handleScroll()
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

    .project-container
      margin 0 20px

    aside
      .aside-title
        // overflow hidden
        padding: 0 2rem;
        margin-top 10px

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

      .project-container
        margin 0

      aside
        display flex
        flex-wrap wrap
        justify-content space-between

        .aside-title
          width 100%
          color #356d9c
          margin-top 35px
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
        #latestArticle
          margin-top 30px

      aside
        width 25%
        padding 0 30px 0 0



  section.footer
    width 1024px
    
</style>
