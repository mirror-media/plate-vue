<template>
  <vue-dfp-provider
    :dfp-units="dfpUnits"
    :dfpid="dfpid"
    :section="sectionId"
    :options="dfpOptions"
    :mode="dfpMode"
  >
    <template
      slot="dfpPos"
      slot-scope="props"
    >
      <div
        v-if="(articleStyle !== 'photography')"
        class="article-container"
      >
        <vue-dfp
          :is="props.vueDfp"
          pos="APPHD"
          ext-class="full mobile-only"
          :config="props.config"
          :size="getValue($store, 'getters.adSize')"
        />
        <div class="split-line" />
        <div
          v-if="heroVideo"
          class="article-heromedia"
        >
          <article-video
            :video="heroVideo"
            class="heroimg"
          />
          <div
            v-show="(heroCaption && heroCaption.length > 0)"
            class="heroimg-caption"
            v-text="heroCaption"
          />
        </div>
        <div
          v-else-if="heroImage"
          class="article-heromedia"
        >
          <img
            v-if="heroImage && heroImage.image"
            class="heroimg"
            :alt="heroCaption"
            :src="getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ])"
            :srcset="getValue(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ]) + ' 800w, ' +
              getValue(heroImage, [ 'image', 'resizedTargets', 'tablet', 'url' ]) + ' 1200w, ' +
              getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ]) + ' 2000w'"
          >
          <div
            v-show="(heroCaption && heroCaption.length > 0)"
            class="heroimg-caption"
            v-text="heroCaption"
          />
        </div>
        <div
          v-if="articleData"
          class="article"
        >
          <article-body
            :article-data="articleData"
            :viewport="viewport"
          >
            <aside
              v-if="!ifSingleCol"
              slot="aside"
              class="article_aside mobile-hidden"
            />
            <vue-dfp
              :is="props.vueDfp"
              slot="dfpad-set"
              pos="APPE1"
              ext-class="mobile-only"
              :dfp-id="props.dfpId"
              :config="props.config"
              :size="getValue($store, 'getters.adSize')"
            />
            <vue-dfp
              :is="props.vueDfp"
              slot="dfpad-AR1-MB"
              pos="APPAT1"
              ext-class="mobile-only"
              :dfp-id="props.dfpId"
              :config="props.config"
              :size="getValue($store, 'getters.adSize')"
            />
            <vue-dfp
              :is="props.vueDfp"
              slot="dfpad-AR2-MB"
              pos="APPAT2"
              ext-class="mobile-only"
              :dfp-id="props.dfpId"
              :config="props.config"
              :size="getValue($store, 'getters.adSize')"
            />

            <PopList
              slot="poplist"
              :pop="popularlist"
              :curr-env="dfpMode"
            />

            <RelatedListInContent
              slot="relatedListInContent"
              :is-app-page="true"
              :relateds="relateds"
            />
            <RecommendList
              v-if="recommendlist.length > 0 && !isAd"
              slot="relatedlistBottom"
              :is-app-page="true"
              :section-id="sectionId"
              :relateds="relateds"
              :curr-article-id="currArticleId"
              :recommends="recommendlist"
              :excluding-article="routeUpateReferrerSlug"
            />
            <template slot="recommendList">
              <div
                id="dablewidget_GlYwenoy"
                class="dable-widget"
                data-widget_id="GlYwenoy"
              />
            </template>
          </article-body>
          <div class="article_footer">
            <vue-dfp
              :is="props.vueDfp"
              pos="APPFT"
              :ext-class="`full mobile-only`"
              :config="props.config"
              :size="getValue($store, 'getters.adSize')"
            />
          </div>
        </div>
      </div>
      <div v-else-if="(articleStyle === 'photography')">
        <article-body-photography
          :article-data="articleData"
          :viewport="viewport"
          :is-app="true"
        >
          <div slot="slot_dfpFT">
            <vue-dfp
              :is="props.vueDfp"
              v-if="viewport < 767"
              pos="APPFT"
              :ext-class="`full mobile-only`"
              :config="props.config"
              :size="getValue($store, 'getters.adSize')"
            />
          </div>
        </article-body-photography>
      </div>
      <LazyItemWrapper
        v-if="(viewport < 550) && !needWineWarning"
        :load-after-page-loaded="true"
      >
        <DfpST :props="props">
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpST"
            :config="props.config"
            pos="APPST"
          />
        </DfpST>
      </LazyItemWrapper>
      <WineWarning v-if="needWineWarning" />
      <DfpCover
        v-if="!hiddenAdvertised && isTimeToShowAdCover"
        v-show="showDfpCoverAdFlag && viewport < 1199"
      >
        <vue-dfp
          :is="props.vueDfp"
          v-if="(viewport < 550)"
          slot="ad-cover"
          pos="MBCVR"
          :config="props.config"
        />
      </DfpCover>
      <DfpCover
        v-if="showDfpCoverAd2Flag && viewport < 1199"
        :show-close-btn="false"
        class="raw"
      >
        <vue-dfp
          :is="props.vueDfp"
          v-if="(viewport < 550)"
          slot="ad-cover"
          pos="MBCVR2"
          :config="props.config"
        />
      </DfpCover>
      <DfpCover
        v-if="showDfpCoverInnityFlag && viewport < 1199"
        :show-close-btn="false"
        class="raw"
      >
        <vue-dfp
          :is="props.vueDfp"
          v-if="(viewport < 550)"
          slot="ad-cover"
          pos="MBCVR3"
          :config="props.config"
        />
      </DfpCover>
      <adult-content-alert v-if="isAdultContent" />
      <div class="fb-quote" />
    </template>
  </vue-dfp-provider>
</template>
<script>
import {
  get as _get,
  map as _map,
  find as _find,
  includes as _includes,
  flatten as _flatten
} from 'lodash'
import { DFP_ID, DFP_SIZE_MAPPING, DFP_UNITS, DFP_OPTIONS, SECTION_MAP, SECTION_WATCH_ID, SITE_OGIMAGE, SITE_TITLE_SHORT, SITE_URL } from '../constants'

import { currEnv, lockJS, unLockJS, insertMicroAd, sendAdCoverGA, updateCookie } from '../util/comm'
import { getRole } from '../util/mmABRoleAssign'
import { microAds } from '../constants/microAds'
import { adtracker } from 'src/util/adtracking'
import AdultContentAlert from '../components/AdultContentAlert.vue'
import ArticleBody from '../components/article/ArticleBodyForApp.vue'
import ArticleBodyPhotography from '../components/article/ArticleBodyPhotographyForApp.vue'
import Cookie from 'vue-cookie'
import DfpCover from '../components/DfpCover.vue'
import DfpFixed from '../components/DfpFixed.vue'
import DfpST from '../components/DfpST.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import PopList from '../components/article/PopList.vue'
import RelatedListInContent from '../components/article/RelatedListInContent.vue'
import RecommendList from '../components/article/RecommendList.vue'
import WineWarning from '../components/WineWarning.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

const fetchArticles = (store, slug) => {
  return store.dispatch('FETCH_ARTICLES', {
    params: {
      // related: 'full',
      clean: 'content',
      where: { slug: slug, isAudioSiteOnly: false }
    }
  })
}

const fetchEvent = (store, eventType = 'embedded') => {
  return store.dispatch('FETCH_EVENT', {
    params: {
      max_results: 1,
      where: {
        isFeatured: true,
        eventType: eventType
      }
    }
  })
}

const fetchPop = (store) => {
  return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
}

const fetchRecommendList = (store, id) => {
  return store.dispatch('FETCH_ARTICLE_RECOMMEND_LIST', {
    params: {
      id: id
    }
  })
}

const fetchSSRData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { endpoints: ['sections', 'topics'] })
}

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { endpoints: ['projects'] })
}

const fetchData = (store) => {
  return Promise.all([fetchSSRData(store), fetchArticles(store, store.state.route.params.slug).then(() => {
    const id = _get(_find(_get(store, ['state', 'articles', 'items']), { slug: store.state.route.params.slug }), ['id'], '')
    return fetchRecommendList(store, id)
  })])
}

const fetchImages = (store, { ids = [], maxResults = 10 }) => store.dispatch('FETCH_IMAGES_BY_ID', {
  ids,
  maxResults
})

export default {
  name: 'ArticleView',
  preFetch: fetchData,
  components: {
    'adult-content-alert': AdultContentAlert,
    'article-body': ArticleBody,
    'article-body-photography': ArticleBodyPhotography,
    'dfp-fixed': DfpFixed,
    'vue-dfp-provider': VueDfpProvider,
    WineWarning,
    DfpCover,
    DfpST,
    LazyItemWrapper,
    PopList,
    RelatedListInContent,
    RecommendList
  },
  asyncData ({ store }) { // asyncData ({ store, route: { params: { id }}})
    return fetchData(store)
  },
  metaInfo () {
    if (!this.articleData.slug && process.env.VUE_ENV === 'server') {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    }

    const {
      brief = {},
      categories = [],
      heroImage = {},
      ogDescription = '',
      ogImage = {},
      ogTitle = '',
      publishedDate = '',
      sections = [],
      slug = '',
      tags = [],
      title = '',
      topics = {},
      writers = []
    } = this.articleData

    const author = _get(writers, '0.name', '')
    const categorieName = _get(categories, '0.name', '')
    const categorieTitle = _get(categories, '0.title', '')
    const imageUrl = _get(heroImage, 'image.resizedTargets.mobile.url', '')
    const ogImageUrl = _get(ogImage, 'image.resizedTargets.mobile.url', '')
    const publishedTime = publishedDate ? new Date(publishedDate).toISOString() : ''
    const pureBrief = truncate(sanitizeHtml(_map(_get(brief, 'apiData', []), o => _map(_get(o, 'content', []), str => str)).join(''), { allowedTags: [] }), 197)
    const pureTags = _map(tags, t => _get(t, 'name', ''))
    const keywords = _get(categories, '0.title') + ',' + pureTags.toString()
    const sectionName = _get(sections, '0.name', '')
    const sectionTitle = _get(sections, '0.title', '')
    const topicId = _get(topics, '_id', '')
    const ogUrl = `${SITE_URL}/story/${slug}/`

    const metaTitle = ogTitle.length > 0 ? ogTitle : title
    const metaDescription = ogDescription.length > 0 ? truncate(ogDescription, 197) : pureBrief
    const metaImage = ogImageUrl.length > 0 ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : SITE_OGIMAGE)

    return {
      title,
      titleTemplate: null,
      meta: [
        { vmid: 'keywords', name: 'keywords', content: keywords },
        { vmid: 'description', name: 'description', content: pureBrief },
        { vmid: 'og:title', property: 'og:title', content: metaTitle },
        { vmid: 'og:description', property: 'og:description', content: metaDescription },
        { vmid: 'og:url', property: 'og:url', content: ogUrl },
        { vmid: 'og:image', property: 'og:image', content: metaImage },
        { name: 'section-name', content: sectionName },
        { name: 'category-name', content: categorieName },
        { name: 'topic-id', content: topicId },
        { vmid: 'twitter:title', name: 'twitter:title', content: metaTitle },
        { vmid: 'twitter:description', name: 'twitter:description', content: metaDescription },
        { vmid: 'twitter:image', name: 'twitter:image', content: metaImage },
        { property: 'dable:item_id', content: slug },
        { property: 'dable:author', content: author },
        { property: 'article:section', content: sectionTitle },
        { property: 'article:section2', content: categorieTitle },
        { property: 'article:published_time', content: publishedTime }
      ],
      link: [
        { rel: 'canonical', href: `${SITE_URL}/story/${slug}/` }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    if (process.env.VUE_ENV === 'client' && to.path !== from.path && from.matched && from.matched.length > 0) {
      next(vm => {
        const _targetArticle = _find(_get(vm.$store, ['state', 'articles', 'items']), { slug: to.params.slug })
        if (!_targetArticle) {
          Promise.all([
            fetchArticles(vm.$store, to.params.slug).then(() => {
              const id = _get(_find(_get(vm.$store, ['state', 'articles', 'items']), { slug: vm.$store.state.route.params.slug }), ['id'], '')
              return fetchRecommendList(vm.$store, id)
            }),
            fetchPop(vm.$store)
          ])
        }
      })
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    fetchArticles(this.$store, to.params.slug).then(() => {
      next()
    }).then(() => {
      const id = _get(_find(_get(this.$store, ['state', 'articles', 'items']), { slug: this.$store.state.route.params.slug }), ['id'], '')
      this.routeUpateReferrerSlug = _get(from, ['params', 'slug'], 'N/A')
      return fetchRecommendList(this.$store, id)
    })
  },
  beforeRouteLeave (to, from, next) {
    if (process.env.VUE_ENV === 'client') {
      const mediafarmersScript = document.querySelector('#mediafarmersJS')
      if (mediafarmersScript) {
        document.querySelector('body').removeChild(mediafarmersScript)
      }
    }
    next()
  },
  data () {
    return {
      abIndicator: '',
      clientSideFlag: false,
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      isVponSDKLoaded: false,
      microAds,
      microAdLoded: {},
      routeUpateReferrerSlug: 'N/A',
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverInnityFlag: false,
      showDfpFixedBtn: false,
      state: {},
      viewport: undefined
    }
  },
  computed: {
    currArticleId () {
      return _get(_find(_get(this.$store, 'state.articles.items'), { slug: this.$store.state.route.params.slug }), 'id', '')
    },
    articleUrl () {
      return `${SITE_URL}/story/${this.currArticleSlug}/`
    },
    articleData () {
      const _data = _find(_get(this.$store, ['state', 'articles', 'items']), { slug: this.currArticleSlug })
      return _data || {}
    },
    articleStyle () {
      return _get(this.articleData, ['style'], '')
    },
    currArticleSlug () {
      return this.$store.state.route.params.slug
    },
    commonData () {
      return this.$store.state.commonData
    },
    dfpOptions () {
      const currentInstance = this
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded: function (event) {
          const dfpCurrAd = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCurrAd.getAttribute('pos')

          /**
            * Because googletag.pubads().addEventListener('slotRenderEnded', afterEachAdLoaded) can't be removed.
            * We have check if current page gets changed with checking by sessionId to prevent from runnig this outdated callback.
            */
          const elSessionId = dfpCurrAd.getAttribute('sessionId')
          if (elSessionId !== this.sessionId) { return }

          const adDisplayStatus = dfpCurrAd.currentStyle ? dfpCurrAd.currentStyle.display : window.getComputedStyle(dfpCurrAd, null).display
          const loadInnityAd = () => {
            if (currentInstance.showDfpCoverAd2Flag && !currentInstance.showDfpCoverInnityFlag) {
              sendAdCoverGA('innity')
              currentInstance.showDfpCoverInnityFlag = true
            }
          }
          window.addEventListener('noad2', loadInnityAd)
          window.parent.addEventListener('noad2', loadInnityAd)
          switch (position) {
            case 'MBCVR':
              sendAdCoverGA('dfp')
              if (adDisplayStatus === 'none') {
                updateCookie({ currEnv: currentInstance.dfpMode }).then(isVisited => {
                  currentInstance.showDfpCoverAd2Flag = !isVisited
                })
              } else {
                updateCookie({ currEnv: currentInstance.dfpMode }).then(isVisited => {
                  currentInstance.showDfpCoverAdFlag = !isVisited
                })
              }
              break
            case 'MBCVR2':
              sendAdCoverGA('ad2')
              break
            case 'MBCVR3':
              sendAdCoverGA('innity')
              break
            case 'PCFF':
              currentInstance.showDfpFixedBtn = !(adDisplayStatus === 'none')
              break
            case 'LOGO':
              if (adDisplayStatus !== 'none') {
                currentInstance.showDfpHeaderLogo = true
              }
              currentInstance.dfpHeaderLogoLoaded = true
              break
          }
          adtracker({
            el: dfpCurrAd,
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
    eventLogo () {
      return _get(this.$store.state.eventLogo, ['items', '0'])
    },
    fbAppId () {
      return _get(this.$store, ['state', 'fbAppId'])
    },
    hasDfpFixed () {
      return this.sectionId === SECTION_WATCH_ID
    },
    heroCaption () {
      return _get(this.articleData, ['heroCaption'], '')
    },
    heroImage () {
      return _get(this.articleData, ['heroImage'])
    },
    heroVideo () {
      const { heroImage, heroVideo, ogImage } = this.articleData
      const heroImgUrl = _get(heroImage, ['image', 'resizedTargets', 'mobile', 'url'], undefined)
      const ogImgUrl = _get(ogImage, ['image', 'resizedTargets', 'mobile', 'url'], undefined)
      const poster = ogImgUrl || (heroImgUrl || '/assets/mirrormedia/notImage.png')
      return (heroVideo && heroVideo.video) ? Object.assign(_get(heroVideo, ['video'], {}), { id: _get(heroVideo, ['id'], '') }, { poster }) : heroVideo
    },
    hiddenAdvertised () {
      return _get(this.articleData, 'hiddenAdvertised', false)
    },
    ifLockJS () {
      return _get(this.articleData, ['lockJS'])
    },
    ifRenderAside () {
      return this.viewport >= 1200
    },
    ifRenderRelatedAside () {
      if (process.env.VUE_ENV === 'client') {
        // const mmab = this.getMmab()
        // return this.viewport >= 1200 && mmab === 'a'
        return this.viewport >= 1200
      }
      return this.viewport >= 1200
    },
    ifShowPoplist () {
      return _get(SECTION_MAP, [this.sectionId, 'ifShowPoplist'], true)
    },
    ifSingleCol () {
      return (this.articleStyle === 'wide' || !this.ifRenderAside)
    },
    isAdultContent () {
      return _get(this.articleData, ['isAdult'], false)
    },
    isAd () {
      return _get(this.articleData, ['isAdvertised'], false)
    },
    isCategoryBusinessMoney () {
      const categories = _flatten(_map(_get(this.articleData, ['categories']), (o) => _get(o, ['name'])))
      return _includes(categories, 'business') || _includes(categories, 'money')
    },
    isTimeToShowAdCover () {
      return _get(this.$store, 'state.isTimeToShowAdCover', false)
    },
    needWineWarning () {
      const cats = this.articleData.categories || []
      return cats.some((cat) => cat.name === 'wine')
    },
    popularlist () {
      const { report = [] } = _get(this.$store, ['state', 'articlesPopList'])
      return report
    },
    recommendlist () {
      return _get(this.$store, ['state', 'articlesRecommendList', 'relatedNews'], [])
    },
    relateds () {
      const items = _get(this.articleData, ['relateds'], []) || []
      return items.filter(item => item)
    },
    sectionId () {
      const _sectionId = _get(this.articleData, ['sections', 0, 'id'])
      return this.dfpUnits[_sectionId] ? _sectionId : 'other'
    },
    styleDfpAd () {
      return (this.viewport < 321) ? 'ad-fit' : ''
    }
  },
  watch: {
    articleUrl: function () {
      window.FB && window.FB.init({
        appId: this.fbAppId,
        xfbml: true,
        version: 'v2.0'
      })
      window.FB && window.FB.XFBML.parse()
      this.checkIfLockJS()
      this.updateMediafarmersScript()
      this.sendGA(this.articleData)
    },
    articleData: function (value) {
      if (value.relateds && value.relateds.length > 0) {
        const relatedImages = value.relateds.filter(related => related).map(related => related.heroImage)
        fetchImages(this.$store, { ids: relatedImages, maxResults: relatedImages.length })
      }
    }
  },
  beforeMount () {
    fetchPop(this.$store)
    fetchCommonData(this.$store)
    fetchEvent(this.$store, 'logo')
  },
  mounted () {
    this.insertMediafarmersScript()
    this.updateViewport()
    this.clientSideFlag = process.env.VUE_ENV === 'client'
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.checkIfLockJS()
    this.updateSysStage()
    // this.abIndicator = this.getMmid()
    this.sendGA(this.articleData)
  },
  updated () {
    this.updateSysStage()
  },
  methods: {
    checkIfLockJS () {
      if (this.ifLockJS) {
        lockJS()
      } else {
        unLockJS()
      }
    },
    closeDfpFixed () {
      this.showDfpFixedBtn = false
    },
    getMmid () {
      const mmid = Cookie.get('mmid')
      const role = getRole({
        mmid,
        distribution: [
          { id: 'A', weight: 50 },
          { id: 'B', weight: 50 }]
      })
      return role
    },
    getValue (o = {}, p = [], d = '') {
      return _get(o, p, d)
    },
    insertMediafarmersScript () {
      const mediafarmersScript = document.createElement('script')
      mediafarmersScript.setAttribute('id', 'mediafarmersJS')
      mediafarmersScript.setAttribute('src', 'https://mediafarmers.org/api/api.js')
      if (!document.getElementById('mediafarmersJS')) {
        document.querySelector('body').appendChild(mediafarmersScript)
      }
    },
    runMicroAd (adId) {
      this.microAdLoded[adId] = insertMicroAd({ adId, currEnv: this.dfpMode, microAdLoded: this.microAdLoded[adId] })
      return true
    },
    sendGA (articleData) {
      if (_get(articleData, ['sections', 'length']) === 0) {
        window.ga('set', 'contentGroup1', '')
        window.ga('set', 'contentGroup2', '')
      } else {
        window.ga('set', 'contentGroup1', `${_get(articleData, ['sections', '0', 'name'])}`)
        window.ga('set', 'contentGroup2', `${_get(articleData, ['categories', '0', 'name'])}`)
      }
      window.ga('set', 'contentGroup3', '')
      // window.ga('set', 'contentGroup3', `article${this.abIndicator}`)
      window.ga('send', 'pageview', { title: `${_get(articleData, ['title'], '')} - ${SITE_TITLE_SHORT}`, location: document.location.href })
    },
    updateMediafarmersScript () {
      const mediafarmersScript = document.querySelector('#mediafarmersJS')
      document.querySelector('body').removeChild(mediafarmersScript)
      this.insertMediafarmersScript()
    },
    updateViewport () {
      const browser = typeof window !== 'undefined'
      if (browser) {
        this.viewport = document.documentElement.clientWidth || document.body.clientWidth
      }
    },
    updateSysStage () {
      this.dfpMode = currEnv()
    }
  }
}

</script>
<style lang="stylus" scoped>
  .article-container
    width 100%
    background-color #414141

    .article-heromedia
      margin 0 auto
      background-color #fff
      max-width 1160px
      position relative

      .heroimg
        width 100%

      .heroimg-caption
        margin-top 5px
        padding 5px 50px 0

    .article
      font-family "Noto Sans TC", STHeitiTC-Light, "Microsoft JhengHei", sans-serif
      max-width 1160px
      margin 0 auto
      background-color #fff
      padding 30px 50px 0

      .article_aside
        float right
        padding-top 10px
        width 310px
        margin-top -30px

      .article_footer
        text-align center
        clear both

      .split-line
        overflow hidden
        clear both

        &::after
          content ""
          display inline-block
          height 0.5em
          vertical-align bottom
          width 100%
          margin 30px -100% 30px 0
          border-top 1px solid #c5c5c5

    .ad-container.full
      width 100%
      background-color #fff
      margin 0 auto
      padding 20px 0
      text-align center

    a, a:hover, a:link, a:visited
      display inline

  @media (min-width 0px) and (max-width 499px)
    .article-container
      .article-heromedia
        .heroimg-caption
          padding 5px 25px 0
          line-height 1.3rem

      .article
        padding 30px 0 0

  @media (min-width 321px) and (max-width 499px)
    .article-container
      .article
        padding 30px 25px 0
      .ad-container.full
        position relative
        width calc(100% + 40px)
        top 0
        left -20px

  @media (min-width 0px) and (max-width 767px)
    .article-container
      .article-heromedia, .article
         max-width 100%

  @media (max-width 999px)
    .mobile-hide
      display none !important

  @media (min-width 1000px)
    .mobile-only
      display none !important

  @media (min-width 768px) and (max-width 1199px)
    .article-container
      .article-heromedia
        .heroimg-caption
          text-align center

      .article
        padding 100px 50px 0

.ad-fit
  position relative
  margin-left -15px !important

@keyframes fade-in
  0%
    opacity 1

  100%
    opacity 0

@keyframes fade-out
  0%
    opacity 0

  100%
    opacity 1

</style>
