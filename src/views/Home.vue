<template>
  <VueDfpProvider
    :key="`homepage`"
    :dfp-units="DFP_UNITS"
    :dfpid="DFP_ID"
    section="home"
    :options="dfpOptions"
    :mode="dfpMode"
  >
    <template
      slot="dfpPos"
      slot-scope="props"
    >
      <div class="home-view">
        <section style="width: 100%;">
          <Header
            :dfp-header-logo-loaded="dfpHeaderLogoLoaded"
            :props="props"
            :show-dfp-header-logo="showDfpHeaderLogo"
            active-section="home"
          />
        </section>
        <FlashNews :articles="flashNewsArticle" />
        <LazyItemWrapper :load-after-page-loaded="true">
          <vue-dfp
            :is="props.vueDfp"
            v-if="isMobile"
            :config="props.config"
            :size="adSize"
            pos="LMBHD"
          />
          <vue-dfp
            :is="props.vueDfp"
            v-else
            :config="props.config"
            pos="LPCHD"
          />
        </LazyItemWrapper>
        <section class="home-mainContent">
          <EditorChoice
            :editor-choice="editorChoice"
            :viewport="viewportWidth"
            target="_blank"
          />
          <main>
            <LazyItemWrapper :load-after-page-loaded="true">
              <vue-dfp
                :is="props.vueDfp"
                v-if="isMobile"
                :config="props.config"
                :size="adSize"
                pos="LMBL1"
              />
            </LazyItemWrapper>
            <MirrorMediaTVAside
              v-if="isMobile && hasEventMod"
              :media-data="eventMod"
            />
            <div
              v-show="isMobile"
              ref="aside_title"
              class="aside-title"
            >
              <h2 v-text="$t('homepage.focus')" />
            </div>
            <div
              id="homepage-focus-news"
              class="focusNewsContainer"
            >
              <div
                v-show="isMobile"
                class="focusNewsContainer__latest-mobile-b"
              >
                <LatestArticleFocus
                  v-for="(o, i) in groupedArticle"
                  :key="`${i}-groupedlist-mobile-b`"
                  :grouped-article="o"
                />
              </div>
            </div>
            <LazyItemWrapper :load-after-page-loaded="true">
              <vue-dfp
                :is="props.vueDfp"
                v-if="isMobile"
                :config="props.config"
                :size="adSize"
                pos="LMBL2"
              />
              <vue-dfp
                :is="props.vueDfp"
                v-else
                :config="props.config"
                pos="LPCB1"
              />
            </LazyItemWrapper>
            <LatestArticleMain
              id="latestArticle"
              target="_blank"
              :latest-list="latestArticle"
              :viewport="viewportWidth"
            />
          </main>
          <aside>
            <div>
              <MirrorMediaTVAside
                v-if="!isMobile && hasEventMod"
                :media-data="eventMod"
              />
              <div
                ref="aside_title"
                class="aside-title"
              >
                <h2 v-text="$t('homepage.focus')" />
              </div>
              <LatestArticleAside
                v-for="(o, i) in groupedArticle"
                :key="`${i}-groupedlist`"
                :grouped-article="o"
                :class="{ last: i === (groupedArticle.length - 1), secondLast: i === (groupedArticle.length - 2), first: i === 0 }"
              />
            </div>
          </aside>
        </section>
        <Loading :show="loading" />
        <LazyItemWrapper
          :position="verge.viewportH()"
          :strict="true"
        >
          <HomeEvents />
        </LazyItemWrapper>
        <template v-if="isMobile">
          <DfpCover v-show="showDfpCoverAdFlag">
            <vue-dfp
              :is="props.vueDfp"
              slot="ad-cover"
              :config="props.config"
              pos="LMBCVR"
            />
          </DfpCover>
          <DfpCover
            v-if="showDfpCoverAd2Flag"
            :show-close-btn="false"
            class="raw"
          >
            <vue-dfp
              :is="props.vueDfp"
              slot="ad-cover"
              :config="props.config"
              pos="LMBCVR2"
            />
          </DfpCover>
          <DfpCover
            v-if="showDfpCoverInnityFlag"
            :show-close-btn="false"
            class="raw"
          >
            <vue-dfp
              :is="props.vueDfp"
              slot="ad-cover"
              :config="props.config"
              pos="LMBCVR3"
            />
          </DfpCover>
        </template>
      </div>
    </template>
  </VueDfpProvider>
</template>

<script>
import { DFP_ID, DFP_UNITS, DFP_OPTIONS, DFP_SIZE_MAPPING, CATEGORY_POLITICAL_ID, CATEGORY_CITY_NEWS_ID, CATEGORY_BUSINESS_ID, CATEGORY_LATESTNEWS_ID, SITE_MOBILE_URL, SITE_TITLE } from 'src/constants'

import { currentYPosition, elmYPosition } from 'kc-scroll'
import { currEnv, sendAdCoverGA, unLockJS, updateCookie } from 'src/util/comm'
import { getRole } from 'src/util/mmABRoleAssign'
import { adtracker } from 'src/util/adtracking'
import { chunk, flatten, get, xor } from 'lodash'
import { mapGetters, mapState } from 'vuex'
import Cookie from 'vue-cookie'
import DfpCover from 'src/components/DfpCover.vue'
import FlashNews from 'src/components/FlashNews.vue'
import EditorChoice from 'src/components/EditorChoice.vue'
import Header from 'src/components/Header.vue'
import HomeEvents from 'src/components/HomeEvents.vue'
import LatestArticleAside from 'src/components/LatestArticleAside.vue'
import LatestArticleFocus from 'src/components/list/LatestArticleFocus.vue'
import LatestArticleMain from 'src/components/LatestArticleMain.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import Loading from 'src/components/Loading.vue'
import MirrorMediaTVAside from 'src/components/MirrorMediaTVAside.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import verge from 'verge'

const MAX_RESULT = 20
const PAGE = 1
const PARTNER_EBC_ID = '5ea7fd55a66f9e0f00a04e9a'

// const debugDFP = require('debug')('CLIENT:DFP')
const debug = require('debug')('CLIENT:Home')

const fetchCommonData = (store) => store.dispatch('FETCH_COMMONDATA', { endpoints: ['posts-vue', 'projects', 'topics'] })

const fetchCommonDataSections = (store) => store.dispatch('FETCH_COMMONDATA', { endpoints: ['sections'] })

const fetchEvent = (store, eventType = 'embedded') => store.dispatch('FETCH_EVENT', {
  params: {
    max_results: 1,
    where: {
      isFeatured: true,
      eventType: eventType
    }
  }
})

const fetchArticlesGroupedList = (store) => store.dispatch('FETCH_ARTICLES_GROUPED_LIST', { params: {} })

const fetchPartners = (store) => store.dispatch('FETCH_PARTNERS', {
  params: {
    max_results: 25,
    page: PAGE,
    where: {
      public: true
    }
  }
})

const fetchLatestArticle = (store, page) => store.dispatch('FETCH_LATESTARTICLES', {
  params: {
    max_results: MAX_RESULT,
    page,
    sort: '-publishedDate',
    where: { isAudioSiteOnly: false }
  }
})

const fetchFlashNews = (store) => store.dispatch('FETCH_FLASH_NEWS', {
  params: {
    where: {
      categories: { $in: [CATEGORY_POLITICAL_ID, CATEGORY_CITY_NEWS_ID, CATEGORY_BUSINESS_ID, CATEGORY_LATESTNEWS_ID] },
      isAudioSiteOnly: false
    },
    clean: 'content',
    max_results: 10,
    page: PAGE,
    sort: '-publishedDate'
  }
})

const fetchExternals = (store) => store.dispatch('FETCH_EXTERNALS', {
  params: {
    page: 1,
    max_results: 6,
    sort: '-publishedDate',
    where: {
      partner: PARTNER_EBC_ID
    }
  }
})

function throwNotFoundError (log = '') {
  console.error(`[HOME.VUE] ${log}`)
  const e = new Error()
  e.massage = 'Page Not Found'
  e.code = '404'
  throw e
}

export default {
  name: 'AppHome',
  components: {
    FlashNews,
    EditorChoice,
    Loading,
    DfpCover,
    HomeEvents,
    LatestArticleAside,
    LatestArticleFocus,
    LatestArticleMain,
    LazyItemWrapper,
    MirrorMediaTVAside,
    VueDfpProvider,
    Header
  },
  asyncData ({ store }) {
    return Promise.allSettled([
      fetchCommonDataSections(store),
      fetchCommonData(store),
      fetchArticlesGroupedList(store),
      fetchPartners(store)
    ])
      .then((results) => {
        if (results[2].status === 'rejected') {
          console.log('---- 2', results[2])
          throwNotFoundError('fetchArticlesGroupedList failed.')
        }
        if (results[1].status === 'rejected') {
          return fetchLatestArticle(store, PAGE)
        }
        return Promise.resolve()
      })
      .catch(() => throwNotFoundError('fetchLatestArticle failed.'))
  },
  metaInfo: {
    titleTemplate: null,
    meta: [
      { name: 'robots', content: 'index' }
    ],
    link: [
      { rel: 'alternate', href: SITE_MOBILE_URL }
    ]
  },
  data () {
    return {
      DFP_ID,
      DFP_UNITS,
      abIndicator: '',
      dfpHeaderLogoLoaded: false,
      dfpMode: 'prod',
      hasScrollLoadMore: get(this.$store, 'state.latestArticles.meta.page', PAGE) > 1,
      insertedExternals: false,
      latestArticle: [],
      loading: false,
      page: get(this.$store, 'state.latestArticles.meta.page', PAGE),
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverInnityFlag: false,
      showDfpHeaderLogo: false,
      verge
    }
  },
  computed: {
    ...mapState({
      articlesGroupedList: (state) => state.articlesGroupedList,
      editorChoice: (state) => get(state, 'articlesGroupedList.choices', []),
      eventMod: (state) => get(state, 'eventMod.items.0'),
      externals: (state) => get(state, 'externals.items', []),
      flashNewsArticle: (state) => get(state, 'flashNews.items', []),
      groupedArticle: (state) => get(state, 'articlesGroupedList.grouped', []),
      latestArticlesList: (state) => get(state, 'latestArticles.items', []),
      latestEndIndex: (state) => get(state, 'articlesGroupedList.latestEndIndex'),
      viewportWidth: (state) => get(state, 'viewport.width', 0)
    }),
    ...mapGetters([
      'adSize'
    ]),
    choicesAndGroupedSlugs () {
      return flatten([
        ...this.editorChoice,
        ...this.groupedArticle,
        ...this.groupedArticle.map((item) => item.relateds)
      ]).map((item) => item.slug)
    },
    dfpOptions () {
      const currentInstance = this
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded: function (event) {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')

          /**
           * Because googletag.pubads().addEventListener('slotRenderEnded', afterEachAdLoaded) can't be removed.
           * We have check if current page gets changed with checking by sessionId to prevent from runnig this outdated callback.
           */
          const elSessionId = dfpCover.getAttribute('sessionId')
          if (elSessionId !== this.sessionId) { return }

          const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
          const loadInnityAd = () => {
            debug('Event "noad2" is detected!!')
            if (currentInstance.showDfpCoverAd2Flag && !currentInstance.showDfpCoverInnityFlag) {
              sendAdCoverGA('innity')
              debug('noad2 detected and go innity')
              currentInstance.showDfpCoverInnityFlag = true
            }
          }
          window.addEventListener('noad2', loadInnityAd)
          window.parent.addEventListener('noad2', loadInnityAd)

          switch (position) {
            case 'LMBCVR':
              sendAdCoverGA('dfp')
              if (adDisplayStatus === 'none') {
                updateCookie({ currEnv: currentInstance.dfpMode }).then((isVisited) => {
                  currentInstance.showDfpCoverAd2Flag = !isVisited
                })
              } else {
                updateCookie({ currEnv: currentInstance.dfpMode }).then((isVisited) => {
                  currentInstance.showDfpCoverAdFlag = !isVisited
                })
              }
              break
            case 'LMBCVR2':
              debug('ad2 loaded')
              sendAdCoverGA('ad2')
              adDisplayStatus === 'none' && debug('dfp response no ad2')
              break
            case 'LMBCVR3':
              debug('adInnity loaded')
              sendAdCoverGA('innity')
              adDisplayStatus === 'none' && debug('dfp response no innity')
              break
            case 'LOGO':
              if (adDisplayStatus !== 'none') {
                currentInstance.showDfpHeaderLogo = true
              }
              currentInstance.dfpHeaderLogoLoaded = true
              break
          }
          adtracker({
            el: dfpCover,
            slot: event.slot.getSlotElementId(),
            position,
            isAdEmpty: adDisplayStatus === 'none',
            sessionId: elSessionId
          })
        },
        setCentering: true,
        sizeMapping: DFP_SIZE_MAPPING
      })
    },
    hasEventMod () {
      const currentTime = Date.now()
      const startTimeEvent = new Date(get(this.eventMod, 'startDate')).getTime()
      let endTimeEvent = new Date(get(this.eventMod, 'endDate')).getTime()

      if (endTimeEvent && (endTimeEvent < startTimeEvent)) {
        // add 12 hours
        endTimeEvent = endTimeEvent + (12 * 60 * 60 * 1000)
      }
      return (currentTime >= startTimeEvent) && (currentTime < endTimeEvent)
    },
    isMobile () {
      return this.viewportWidth < 1200
    }
  },
  watch: {
    latestArticlesList: {
      handler (newValue, oldVale) {
        if (this.page === 1) {
          const latestWithoutChoicesAndGrouped = this.latestArticlesList
            .filter((item) => !this.choicesAndGroupedSlugs.includes(item.slug))
          // 避免因為篩掉編輯精選和焦點新聞而造成最新文章的廣告會因此連續出現
          this.latestArticle = latestWithoutChoicesAndGrouped.length < 6
            ? this.latestArticlesList
            : latestWithoutChoicesAndGrouped
        } else {
          const changeValue = xor(newValue, oldVale)
          this.latestArticle = [...this.latestArticle, ...changeValue]
        }

        const hasExternals = this.externals.length > 0
        const needInsertExternals = !this.insertedExternals && hasExternals && (this.latestArticle.length >= 9)
        if (needInsertExternals) {
          const chunked = chunk(this.latestArticle, 9)
          this.latestArticle = [...chunked[0], ...this.externals, ...chunked[1]]
          this.insertedExternals = true
        }
      },
      immediate: true
    }
  },
  mounted () {
    // this.abIndicator = this.getMmid()
    Promise.all([
      fetchFlashNews(this.$store),
      fetchExternals(this.$store),
      fetchEvent(this.$store, 'embedded'),
      fetchEvent(this.$store, 'logo'),
      fetchEvent(this.$store, 'mod')
    ])
    unLockJS()
    this.handleScrollForLoadmore()
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
    window.ga('set', 'contentGroup3', '')
    // window.ga('set', 'contentGroup3', `home${this.abIndicator}`)
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
  methods: {
    detectFixProject: function () {
      if (!this.isMobile) {
        const secondLastFocusNews = document.querySelector('aside .latest-aside-container.secondLast')
        const secondLastFocusNewsBottomPos = elmYPosition('aside .latest-aside-container.secondLast') + secondLastFocusNews.offsetHeight
        const lastFocusNews = document.querySelector('aside .latest-aside-container.last')
        const lastFocusNewsBottomPos = elmYPosition('aside .latest-aside-container.last') + lastFocusNews.offsetHeight
        const project = document.querySelector('.projectListVert')
        // const mirrorMediaTVAsideMod = document.querySelector('.mmtv-aside')
        if (project) {
          if (currentYPosition() > lastFocusNewsBottomPos) {
            project.classList.add('fixed')
          } else {
            project.classList.remove('fixed')
          }
        } else {
          if (currentYPosition() > secondLastFocusNewsBottomPos) {
            lastFocusNews.classList.add('fixed')
          } else {
            lastFocusNews.classList.remove('fixed')
          }
        }
      }
    },
    getMmid () {
      const mmid = Cookie.get('mmid')
      let assisgnedRole = get(this.$route, 'query.ab')
      if (assisgnedRole) {
        assisgnedRole = assisgnedRole.toUpperCase()
      }
      const role = getRole({
        mmid,
        distribution: [
          { id: 'A', weight: 50 },
          { id: 'B', weight: 50 }]
      })
      return assisgnedRole || role
    },
    initHasScrollLoadMore () {
      this.hasScrollLoadMore = false
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
    }
  }
}

</script>
<style lang="stylus" scoped>
.editorChoice
  padding-top 10px

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
  aside
    display none
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
    margin 10px auto 0
    padding 0

    main
      width 75%
      .aside-title
        h2
          display none
    aside
      display block
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

  .focusNewsContainer
    &__latest-mobile-b
      display none

</style>
