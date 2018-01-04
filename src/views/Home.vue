<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" section="home" :options="dfpOptions" :mode="dfpMode">
    <template slot-scope="props" slot="dfpPos">
      <div class="home-view">
        <section style="width: 100%;">
          <app-Header v-if="true" :commonData= 'commonData' :eventLogo="eventLogo" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" :props="props"/>
        </section>
        <vue-dfp :is="props.vueDfp" pos="LPCHD" v-if="(viewport > 999)"  :config="props.config"/>
        <vue-dfp :is="props.vueDfp" pos="LMBHD" v-else-if="(viewport < 550)" :config="props.config"/>
        <section class="home-mainContent">
          <main>
            <editor-choice v-if="abIndicator === 'A'" :editorChoice='editorChoice' :viewport="viewport" target="_blank" />
            <editor-choiceB v-else-if="abIndicator === 'B'" :editorChoice='editorChoice' :viewport="viewport" target="_blank"/>
            <div class="aside-title" ref="aside_title" v-show="viewport < 1200"><h2>專題報導</h2></div>
            <ProjectList v-if="(viewport <= 1199)" :projects="projects" :viewport="viewport" target="_blank" style="margin-bottom: 40px;" />
            <vue-dfp :is="props.vueDfp" pos="LMBL1" v-if="viewport < 550" :config="props.config"/>
            <div class="aside-title" ref="aside_title" v-show="viewport < 1200"><h2>焦點新聞</h2></div>
            <div class="focusNewsContainer">
              <LatestArticleAside :groupedArticle="o" :viewport="viewport" :needStick="false" v-show="viewport < 1200" v-for="(o, i) in groupedArticle" :isLast="(i === (groupedArticle.length - 1)) ? '-last' : ''" :class="{ last: i === (groupedArticle.length - 1), first: i === 0}" :key="`${i}-groupedlist`" target="_blank"/>
            </div>
            <vue-dfp :is="props.vueDfp" pos="LPCB1" v-if="(viewport > 1199)" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="LMBL2" v-if="(viewport < 1199)" :config="props.config"/>
            <LatestArticleMain id="latestArticle" :latestList="latestArticle" :viewport="viewport" target="_blank"></LatestArticleMain>
          </main>
          <aside v-show="viewport >= 1200">
            <div class="aside-title" ref="aside_title"><h2>焦點新聞</h2></div>
            <LatestArticleAside :groupedArticle="o" :index="i" :needStick="false" :viewport="viewport" v-for="(o, i) in groupedArticle" :isLast="(i === (groupedArticle.length - 1)) ? '-last' : ''" :class="{ last: i === (groupedArticle.length - 1), secondLast: i === (groupedArticle.length - 2), first: i === 0}" :key="`${i}-groupedlist`" target="_blank"/>
          </aside>
        </section>
        <loading :show="loading" />
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
        <live-stream :mediaData="eventMod" type="mmtv" v-else-if="!hasEventEmbedded && hasEventMod" />
        <DfpCover v-show="showDfpCoverAdFlag && viewport < 1199">
          <vue-dfp :is="props.vueDfp" pos="LMBCVR" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" />
        </DfpCover>
        <DfpCover v-if="showDfpCoverAd2Flag && viewport < 1199" :showCloseBtn="false" class="raw">
          <vue-dfp :is="props.vueDfp" pos="LMBCVR2" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" />
        </DfpCover>
        <div class="dfp-cover vpon" v-if="showDfpCoverAdVponFlag && (viewport < 550)" v-html="vponHtml()"></div>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>
import { DFP_ID, DFP_UNITS, DFP_OPTIONS, FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { consoleLogOnDev, currEnv, insertVponAdSDK, sendAdCoverGA, unLockJS, updateCookie, vponHtml } from '../util/comm'
import { getRole } from '../util/mmABRoleAssign'
import _ from 'lodash'
import Cookie from 'vue-cookie'
import DfpCover from '../components/DfpCover.vue'
import EditorChoice from '../components/EditorChoice.vue'
import EditorChoiceB from '../components/EditorChoiceB.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LatestArticleAside from '../components/LatestArticleAside.vue'
import LatestArticleMain from '../components/LatestArticleMain.vue'
import LiveStream from '../components/LiveStream.vue'
import Loading from '../components/Loading.vue'
import MirrorMediaTVAside from '../components/MirrorMediaTVAside.vue'
import More from '../components/More.vue'
import PopularArticles from '../components/PopularArticles.vue'
import ProjectList from '../components/article/ProjectList.vue'
import ProjectListVert from '../components/article/ProjectListVert.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import moment from 'moment'
import titleMetaMixin from '../util/mixinTitleMeta'

// const MAXRESULT = 20
// const PAGE = 1

const fetchSSRData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections' ] }).then(() => {
    return Promise.all([
      fetchCommonData(store),
      fetchArticlesGroupedList(store),
      fetchPartners(store)
    ])
  })
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
    'editor-choiceB': EditorChoiceB,
    'live-stream': LiveStream,
    'loading': Loading,
    'more': More,
    'project-listVert': ProjectListVert,
    DfpCover,
    LatestArticleAside,
    LatestArticleMain,
    MirrorMediaTVAside,
    PopularArticles,
    ProjectList,
    VueDfpProvider
  },
  asyncData ({ store }) {
    return fetchSSRData(store)
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    const abIndicator = this.abIndicator
    return {
      url: SITE_URL,
      title: SITE_TITLE,
      meta: `
        <meta name="mm-opt" content="choice${abIndicator}">
        <meta name="robots" content="index">
        <meta name="mm-opt" content="">
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
        }
      })
    } else {
      next()
    }
  },
  data () {
    return {
      abIndicator: '',
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      isVponSDKLoaded: false,
      loading: false,
      hasScrollLoadMore: _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], PAGE) > 1,
      page: _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], PAGE),
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverAdVponFlag: false,
      showDfpHeaderLogo: false,
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
    editorChoice () {
      return _.get(this.articlesGroupedList, [ 'choices' ])
    },
    eventEmbedded () {
      return _.get(this.$store.state.eventEmbedded, [ 'items', '0' ])
    },
    eventLogo () {
      return _.get(this.$store.state.eventLogo, [ 'items', '0' ])
    },
    eventMod () {
      return _.get(this.$store, [ 'state', 'eventMod', 'items', '0' ])
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
    hasEventMod () {
      const _now = moment()
      const _eventStartTime = moment(new Date(_.get(this.eventMod, [ 'startDate' ])))
      let _eventEndTime = moment(new Date(_.get(this.eventMod, [ 'endDate' ])))
      if (_eventEndTime && (_eventEndTime < _eventStartTime)) {
        _eventEndTime = moment(new Date(_.get(this.eventMod, [ 'endDate' ]))).add(12, 'h')
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
    detectFixProject: function (e) {
      const secondLastFocusNews = document.querySelector('aside .latest-aside-container.secondLast')
      const secondLastFocusNewsBottomPos = elmYPosition('aside .latest-aside-container.secondLast') + secondLastFocusNews.offsetHeight
      const lastFocusNews = document.querySelector('aside .latest-aside-container.last')
      const lastFocusNewsBottomPos = elmYPosition('aside .latest-aside-container.last') + lastFocusNews.offsetHeight
      const project = document.querySelector('.projectListVert')
      if (project) {
        if (this.viewport >= 1200 && (currentYPosition() > lastFocusNewsBottomPos)) {
          project.classList.add('fixed')
        } else {
          project.classList.remove('fixed')
        }
      } else {
        if (this.viewport >= 1200 && (currentYPosition() > secondLastFocusNewsBottomPos)) {
          lastFocusNews.classList.add('fixed')
        } else {
          lastFocusNews.classList.remove('fixed')
        }
      }
    },
    getRole,
    getMmid () {
      const mmid = Cookie.get('mmid')
      let assisgnedRole = _.get(this.$route, [ 'query', 'ab' ])
      if (assisgnedRole) {
        assisgnedRole = assisgnedRole.toUpperCase()
      }
      const role = this.getRole({ mmid, distribution: [
        { id: 'A', weight: 50 },
        { id: 'B', weight: 50 } ]
      })
      return assisgnedRole || role
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
      window.ga('send', 'event', 'home', 'scroll', 'loadmore' + this.page, { location: document.location.href })
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
    return Promise.all([
      fetchEvent(this.$store, 'embedded'),
      fetchEvent(this.$store, 'logo'),
      fetchEvent(this.$store, 'mod')
    ])
  },
  mounted () {
    this.handleScroll()
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.checkIfLockJS()
    this.updateSysStage()
    this.abIndicator = this.getMmid()

    window.addEventListener('scroll', this.detectFixProject)

    window.ga('set', 'contentGroup1', '')
    window.ga('set', 'contentGroup2', '')
    window.ga('set', 'contentGroup3', '')
    // window.ga('set', 'contentGroup3', `home${this.abIndicator}`)
    // window.ga('set', 'contentGroup3', `mod${this.abIndicator}`)
    window.ga('send', 'pageview', { title: SITE_TITLE, location: document.location.href })
  },
  updated () {
    this.initHasScrollLoadMore()
    this.handleScroll()
    this.updateSysStage()
  },
  destroyed () {
    window.removeEventListener('scroll', this.detectFixProject)
  },
  watch: {
    abIndicator: function () {
      this.$forceUpdate()
    }
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
    &.project-title--desktop
      display none
  .project-title--mobile
    padding 0 2em
    margin 10px 0
    h2
      font-size 1.5rem
      color #356d9c
      font-weight 400
      overflow hidden
      &::after
        content ""
        display inline-block
        height 0.5em
        vertical-align middle
        width 100%
        margin-right -100%
        margin-left 10px
        border-top 5px solid #356d9c
    
    
.list
  &.container
    width 100%

    .project-container
      margin 0 20px

    aside
      .aside-title
        // overflow hidden
        padding: 0 2rem
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

.home-mainContent
  width 100%
  .latest-main-container
    width 90%
    margin 0 auto
  .project-container
    width 90%
    margin 0 auto
  .aside-title
    width 90%
    margin 10px auto 0

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

section.footer
  width 100%

.projectListVert
  &.fixed
    position fixed
    top 20px
    right auto
    width calc(1024px * 0.25 - 30px)     
      
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

  .home-mainContent
    padding 0 2rem
    .aside-title
      width 100%
    .project-container
      width 100%
    .focusNewsContainer
      display flex
      flex-wrap wrap
      justify-content space-between
    .latest-main-container
      width 100%

  section.footer
    width 100%
    padding 0 2rem


@media (min-width: 1200px)
  .home-view
    h2
      &.project-title--desktop
        display block
        margin-bottom 10px
        color #356d9c
        font-size 1.3rem
        font-weight 400
    .project-title--mobile
      display none
        
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

        .aside-title
          margin-top 0
          padding 0
          h2
            margin-bottom 0
            font-size 1.3rem
            &::after
              display none
  .editorChoice
    margin-top 0
  .home-mainContent
    display flex
    width 1024px
    margin 40px auto 0
    padding 0
    main
      width 75%
    aside
      width 25%
      padding-left 30px
      .aside-title
        margin-top 0
        margin-bottom 10px
        padding 0
        h2
          margin-bottom 0
          font-size 1.3rem
          line-height 1.15
          &::after
            display none
    .latest-main-container
      margin-top 15px

  section.footer
    width 1024px
    
</style>
