<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" section="home" :options="dfpOptions" :mode="dfpMode" :key="`homepage`">
    <template slot-scope="props" slot="dfpPos">
      <div class="home-view">
        <section style="width: 100%;">
          <HeaderR :abIndicator="abIndicator" :dfpHeaderLogoLoaded="dfpHeaderLogoLoaded" :props="props" :showDfpHeaderLogo="showDfpHeaderLogo" activeSection="home" />
          <!-- <app-Header v-if="true" :commonData= 'commonData' :eventLogo="eventLogo" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" :props="props"/> -->
        </section>
        <LazyItemWrapper :loadAfterPageLoaded="true">
          <vue-dfp :is="props.vueDfp" pos="LPCHD" v-if="(viewport > 999)" :config="props.config"/>
          <vue-dfp :is="props.vueDfp" pos="LMBHD" v-else-if="(viewport < 550)" :config="props.config"/>
        </LazyItemWrapper>
        <section class="home-mainContent">
          <editor-choice :editorChoice='editorChoice' :viewport="viewport" target="_blank" />
          <main>
            <LazyItemWrapper :loadAfterPageLoaded="true">
              <vue-dfp :is="props.vueDfp" pos="LMBL1" v-if="viewport < 550" :config="props.config"/>
            </LazyItemWrapper>
            <MirrorMediaTVAside v-if="viewport < 1200 && hasEventEmbedded" :mediaData="eventMod"></MirrorMediaTVAside>
            <div class="aside-title" ref="aside_title" v-show="viewport < 1200"><h2 v-text="$t('homepage.focus')"></h2></div>
            <div class="focusNewsContainer" id="homepage-focus-news">
              <div v-show="viewport < 1200"
                class="focusNewsContainer__latest-mobile-b"
              >
                <LatestArticleAsideMobileB
                  v-for="(o, i) in groupedArticle"
                  :key="`${i}-groupedlist-mobile-b`"
                  :groupedArticle="o"
                />
              </div>
            </div>
            <LazyItemWrapper :loadAfterPageLoaded="true">
              <vue-dfp :is="props.vueDfp" pos="LPCB1" v-if="(viewport > 1199)" :config="props.config"/>
              <vue-dfp :is="props.vueDfp" pos="LMBL2" v-if="(viewport < 1199)" :config="props.config"/>
            </LazyItemWrapper>
            <LatestArticleMain id="latestArticle" target="_blank"
              :abIndicator="abIndicator"
              :latestList="latestArticle"
              :viewport="viewport">
            </LatestArticleMain>
            
          </main>
          <aside v-show="viewport >= 1200">
            <div>
              <MirrorMediaTVAside v-if="viewport >= 1200 && hasEventEmbedded" :mediaData="eventMod"></MirrorMediaTVAside>
              <div class="aside-title" ref="aside_title"><h2 v-text="$t('homepage.focus')"></h2></div>
              <LatestArticleAside v-for="(o, i) in groupedArticle" target="_blank"
                :groupedArticle="o"
                :index="i"
                :needStick="false"
                :viewport="viewport"
                :isLast="(i === (groupedArticle.length - 1)) ? '-last' : ''"
                :class="{ last: i === (groupedArticle.length - 1), secondLast: i === (groupedArticle.length - 2), first: i === 0 }"
                :key="`${i}-groupedlist`" />
            </div>
          </aside>
        </section>
        <loading :show="loading" />
        <LazyItemWrapper :position="verge.viewportH()" :strict="true">
          <live-stream v-if="hasEventEmbedded" :mediaData="eventEmbedded" />
          <live-stream v-else-if="!hasEventEmbedded && hasEventMod" :mediaData="eventMod" type="mod" />
        </LazyItemWrapper>
        <DfpCover v-if="isTimeToShowAdCover" v-show="showDfpCoverAdFlag && viewport < 1199">
          <vue-dfp :is="props.vueDfp" pos="LMBCVR" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" />
        </DfpCover>
        <DfpCover v-if="showDfpCoverAd2Flag && viewport < 1199" :showCloseBtn="false" class="raw">
          <vue-dfp :is="props.vueDfp" pos="LMBCVR2" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" />
        </DfpCover>
        <DfpCover v-if="showDfpCoverInnityFlag && viewport < 1199" :showCloseBtn="false" class="raw">
          <vue-dfp :is="props.vueDfp" pos="LMBCVR3" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" />
        </DfpCover>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>
import { DFP_ID, DFP_UNITS, DFP_OPTIONS, FB_APP_ID, FB_PAGE_ID } from '../constants'
import { SECTION_MAP, SITE_MOBILE_URL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { currEnv, sendAdCoverGA, unLockJS, updateCookie } from '../util/comm'
import { getRole } from '../util/mmABRoleAssign'
import { adtracker } from 'src/util/adtracking'
import _ from 'lodash'
import Cookie from 'vue-cookie'
import DfpCover from '../components/DfpCover.vue'
import EditorChoice from '../components/EditorChoice.vue'
import Header from '../components/Header.vue'
import HeaderR from '../components/HeaderR.vue'
import LatestArticleAside from '../components/LatestArticleAside.vue'
import LatestArticleAsideMobileB from '../components/LatestArticleAsideMobileB.vue'
import LatestArticleBySection from '../components/LatestArticleBySection.vue'
import LatestArticleMain from '../components/LatestArticleMain.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import LiveStream from '../components/LiveStream.vue'
import Loading from '../components/Loading.vue'
import MirrorMediaTVAside from '../components/MirrorMediaTVAside.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import moment from 'moment'
import titleMetaMixin from '../util/mixinTitleMeta'
import uuidv4 from 'uuid/v4'
import verge from 'verge'

// const MAXRESULT = 20
// const PAGE = 1
const showAdCover = store => store.dispatch('SHOW_AD_COVER')
const debugDFP = require('debug')('CLIENT:DFP')
const debug = require('debug')('CLIENT:Home')
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

// const fetchLatestNewsFromJson = (store) => {
//   return store.dispatch('FETCH_LATEST_NEWS_FROM_JSON')
// }

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
    'app-Header': Header,
    'editor-choice': EditorChoice,
    'live-stream': LiveStream,
    'loading': Loading,
    DfpCover,
    LatestArticleAside,
    LatestArticleAsideMobileB,
    LatestArticleBySection,
    LatestArticleMain,
    LazyItemWrapper,
    MirrorMediaTVAside,
    VueDfpProvider,
    HeaderR
  },
  asyncData ({ store }) {
    return fetchSSRData(store)
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    // let abIndicator = ''
    // if (process.env.VUE_ENV === 'client') {
    //   abIndicator = this.getMmid()
    // }
    return {
      url: SITE_MOBILE_URL,
      title: SITE_TITLE,
      meta: `
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
      ` // <meta name="mm-opt" content="home${abIndicator}">
    }
  },
  data () {
    return {
      abIndicator: '',
      dfpid: DFP_ID,
      dfpHeaderLogoLoaded: false,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      hasScrollLoadMore: _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], PAGE) > 1,
      isVponSDKLoaded: false,
      isAdCoverCalledYet: false,
      loading: false,
      page: _.get(this.$store.state, [ 'latestArticles', 'meta', 'page' ], PAGE),
      sectionTempId: `homepage-${uuidv4()}`,
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverInnityFlag: false,
      showDfpHeaderLogo: false,
      viewport: undefined,
      verge
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
      const currentInstance = this
      return Object.assign({}, DFP_OPTIONS, {
        sectionTempId: this.sectionTempId,
        afterEachAdLoaded: (event) => {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')

          /**
           * Because googletag.pubads().addEventListener('slotRenderEnded', afterEachAdLoaded) can't be removed.
           * We have check if current page gets changed through sectionTempId. If so, dont run this outdated callback.*/
          const sectionTempId = dfpCover.getAttribute('sectionTempId')
          if (currentInstance.sectionTempId !== sectionTempId) { return }

          const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
          const loadInnityAd = () => {
            debug('Event "noad2" is detected!!')
            if (this.showDfpCoverAd2Flag && !this.showDfpCoverInnityFlag) {
              sendAdCoverGA('innity')
              debug('noad2 detected and go innity')
              this.showDfpCoverInnityFlag = true
            }
          }
          window.addEventListener('noad2', loadInnityAd)
          window.parent.addEventListener('noad2', loadInnityAd)

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
              debug('ad2 loaded')
              sendAdCoverGA('ad2')
              if (adDisplayStatus === 'none') {
                debug('dfp response no ad2')
              }
              break
            case 'LMBCVR3':
              debug('adInnity loaded')
              sendAdCoverGA('innity')
              if (adDisplayStatus === 'none') {
                debug('dfp response no innity')
              }
              break
            case 'LOGO':
              if (adDisplayStatus !== 'none') {
                this.showDfpHeaderLogo = true
              }
              this.dfpHeaderLogoLoaded = true
              break
          }
          adtracker({
            el: dfpCover,
            slot: event.slot.getSlotElementId(),
            position,
            isAdEmpty: adDisplayStatus === 'none'
          })         
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
    latestArticlesBySection () {
      const latestArticlesBySection = Object.values(_.get(this.$store.state, 'latestNewsFromJson.sections', {})) || []
      return latestArticlesBySection.sort((a, b) => (_.get(SECTION_MAP, [ a.id, 'latestNewsOrder' ]) || 10) - (_.get(SECTION_MAP, [ b.id, 'latestNewsOrder' ]) || 10))
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
    isTimeToShowAdCover () {
      return _.get(this.$store, 'state.isTimeToShowAdCover', false)
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
    detectFixProject: function () {
      const secondLastFocusNews = document.querySelector('aside .latest-aside-container.secondLast')
      const secondLastFocusNewsBottomPos = elmYPosition('aside .latest-aside-container.secondLast') + secondLastFocusNews.offsetHeight
      const lastFocusNews = document.querySelector('aside .latest-aside-container.last')
      const lastFocusNewsBottomPos = elmYPosition('aside .latest-aside-container.last') + lastFocusNews.offsetHeight
      const project = document.querySelector('.projectListVert')
      // const mirrorMediaTVAsideMod = document.querySelector('.mmtv-aside')
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
    get: _.get,
    getMmid () {
      const mmid = Cookie.get('mmid')
      let assisgnedRole = _.get(this.$route, [ 'query', 'ab' ])
      if (assisgnedRole) {
        assisgnedRole = assisgnedRole.toUpperCase()
      }
      const role = getRole({ mmid, distribution: [
        { id: 'A', weight: 50 },
        { id: 'B', weight: 50 } ]
      })
      return assisgnedRole || role
    },
    initHasScrollLoadMore () {
      this.hasScrollLoadMore = false
    },
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
    handleScrollForLoadmore () {
      window.onscroll = () => {
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
    scrollEventHandlerForAd () {
      if (this.isAdCoverCalledYet) { return }
      const currentTop = currentYPosition()
      const eleTop = elmYPosition('#homepage-focus-news')
      const device_height = verge.viewportH()
      if (currentTop + device_height > eleTop) {
        debugDFP('SHOW ADCOVER!')
        showAdCover(this.$store)
        this.isAdCoverCalledYet = true
        window.removeEventListener('scroll', this.scrollEventHandlerForAd)
      }
    }, 
  },
  beforeMount () {
    this.abIndicator = this.getMmid()
    const jobs = [
      fetchEvent(this.$store, 'embedded'),
      fetchEvent(this.$store, 'logo'),
      fetchEvent(this.$store, 'mod'),
    ]
    Promise.all(jobs)
  },
  mounted () {
    this.handleScrollForLoadmore()
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.checkIfLockJS()
    this.updateSysStage()

    window.addEventListener('scroll', this.detectFixProject)

    /**
     * Have ad-cover be rendered as soon as #homepage-focus-news gets visible.
     */
    /** 
     *  Dont show ad cover on listing page for now.     
     *  window.addEventListener('scroll', this.scrollEventHandlerForAd)
     */

    window.ga('set', 'contentGroup1', '')
    window.ga('set', 'contentGroup2', '')
    // window.ga('set', 'contentGroup3', '')
    window.ga('set', 'contentGroup3', `home${this.abIndicator}`)
    window.ga('send', 'pageview', { title: SITE_TITLE, location: document.location.href })
  },
  updated () {
    this.initHasScrollLoadMore()
    this.handleScrollForLoadmore()
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
  flex-wrap wrap
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
  .latest-news
    margin-top 85px
    & + .latest-news
      margin-top 30px
section.footer
  width 100%

.projectListVert
  &.fixed
    position fixed
    top 20px
    right auto
    width calc(1024px * 0.25 - 30px)

.mmtv-aside
  &.fixed
    position fixed
    top 460px
    right auto
    width calc(1024px * 0.25 - 30px)

.focusNewsContainer
  &__latest-mobile-b
    width 90%
    margin 0 auto
    padding 14px 18px
    border solid 2px #224f73

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
    .footer
      width 1024px
      margin 70px auto 0 
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
      margin-top 25px

  section.footer
    width 1024px
    
</style>
