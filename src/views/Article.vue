<template>
  <VueDfpProvider
    :dfpUnits="DFP_UNITS"
    :dfpid="DFP_ID"
    :section="sectionId"
    :options="dfpOptions"
    :mode="dfpMode"
  >
    <template slot-scope="props" slot="dfpPos">
      <section style="width: 100%;" v-show="!isArticlePhotography">
        <Header :activeSection="sectionName" :dfpHeaderLogoLoaded="dfpHeaderLogoLoaded" :props="props" :showDfpHeaderLogo="showDfpHeaderLogo" />
      </section>

      <RelatedListOverContent :articles="articlesOverContent" :relatedCategory="relatedCategory" />

      <div class="article-container" v-if="!isArticlePhotography" >
        <ClientOnly>
          <LazyItemWrapper :loadAfterPageLoaded="true">
            <vue-dfp
              :is="props.vueDfp"
              v-if="isMobile && !hiddenAdvertised"
              pos="MBHD"
              extClass="full"
              :config="props.config"
              :size="_get($store, 'getters.adSize')"
            />
            <vue-dfp
              :is="props.vueDfp"
              v-if="!isMobile && !hiddenAdvertised"
              pos="PCHD"
              extClass="full"
              :config="props.config"
            />
          </LazyItemWrapper>
        </ClientOnly>
        <div class="article" v-if="articleData">
          <ArticleBody
            :articleData="articleData"
            :isAd="isAd"
            :viewport="viewportWidth">
            <template slot="hero">
              <div v-if="heroVideo" class="article-heromedia"><HeroVideo :heroCaption="heroCaption" :video="heroVideo" /></div>
              <HeroImage v-else :heroCaption="heroCaption" :heroImage="heroImage" />
            </template>
            <!-- Aside: viewport width > 1200px -->
            <aside class="article_aside" slot="aside" v-if="!isMobile && !ifSingleCol">
              <LazyItemWrapper
                v-if="!hiddenAdvertised"
                :loadAfterPageLoaded="true"
                :style="{ minHeight: '250px', backgroundColor: '#f5f5f5' }"
              >
                <vue-dfp
                  :is="props.vueDfp"
                  pos="PCR1"
                  :config="props.config"
                />
              </LazyItemWrapper>
              <LazyItemWrapper :position="verge.viewportH() / 2" :strict="true">
                <LatestList :latests="latests" />
              </LazyItemWrapper>
              <LazyItemWrapper :loadAfterPageLoaded="true" :style="{ minHeight: '300px' }">
                <READrEmbeddedPromotions class="readr-embedded-promotions"/>
              </LazyItemWrapper>
              <ArticleAsideFixed :projects="projectlist">
                <LazyItemWrapper
                  v-if="!hiddenAdvertised"
                  slot="dfpR2"
                  :position="verge.viewportH()"
                  :strict="true"
                  :style="{ minHeight: '250px', backgroundColor: '#f5f5f5' }"
                >
                  <vue-dfp
                    :is="props.vueDfp"
                    :config="props.config"
                    extClass="dfp-r2"
                    pos="PCR2"
                  />
                </LazyItemWrapper>
                <LazyItemWrapper :position="verge.viewportH()" :strict="true">
                  <div slot="fbPage" class="article_aside_fbPage fb-page" data-href="https://www.facebook.com/mirrormediamg/" data-width="300" data-small-header="true" data-hide-cover="true" data-show-facepile="false">
                    <blockquote cite="https://www.facebook.com/mirrormediamg/" class="fb-xfbml-parse-ignore">
                      <a href="https://www.facebook.com/mirrormediamg/">鏡週刊</a>
                    </blockquote>
                  </div>
                </LazyItemWrapper>
                <LazyItemWrapper :position="verge.viewportH()" slot="popListVert" :strict="true">
                  <PopListVert :pop="popularlist" class="article_aside_popList" />
                </LazyItemWrapper>
              </ArticleAsideFixed>
            </aside>
            <!-- DFP E1 E2 -->
            <LazyItemWrapper :position="verge.viewportH()" slot="dfpad-set" :strict="true" :style="{ width: '100%' }">
              <div :style="{ display: 'flex', justifyContent: 'space-around' }">
                <vue-dfp
                  :is="props.vueDfp"
                  v-if="isMobile && !hiddenAdvertised"
                  :config="props.config"
                  :size="_get($store, 'getters.adSize')"
                  pos="MBE1"
                />
                <vue-dfp
                  v-if="!isMobile && !hiddenAdvertised"
                  :is="props.vueDfp"
                  :config="props.config"
                  pos="PCE1"
                />
                <vue-dfp
                  :is="props.vueDfp"
                  v-if="!isMobile && !hiddenAdvertised"
                  :config="props.config"
                  :style="{ marginLeft: '10px' }"
                  pos="PCE2"
                />
              </div>
            </LazyItemWrapper>
            <!-- DFP MB AT 1 -->
            <template
              v-if="isMobile"
              slot="dfpad-AR1-MB"
            >
              <span id="innity-custom-adnetwork-span-63518"></span>
              <span id="innity-custom-premium-span-12738"></span>
              <vue-dfp
                :is="props.vueDfp"
                v-if="!hiddenAdvertised"
                :config="props.config"
                :size="_get($store, 'getters.adSize')"
                pos="MBAR1"
              />
            </template>
            <!-- DFP PC AT 1 -->
            <template
              v-if="!isMobile"
              slot="dfpad-AR1-PC"
            >
              <span id="innity-custom-adnetwork-span-63518"></span>
              <span id="innity-custom-premium-span-12738"></span>     
              <vue-dfp
                :is="props.vueDfp"
                v-if="!hiddenAdvertised"
                pos="PCAR"
                :config="props.config"
              />
            </template>
            <!-- DFP MB AT 2 -->
            <template
              v-if="isMobile"
              slot="dfpad-AR2-MB"
            >
              <span id="innity-custom-adnetwork-span-68557"></span>
              <span id="innity-custom-premium-span-12739"></span>
              <vue-dfp
                :is="props.vueDfp"
                v-if="!hiddenAdvertised"
                :config="props.config"
                :size="_get($store, 'getters.adSize')"
                pos="MBAR2"
              />
            </template>
            <!-- DFP MB AT 3 -->
            <template v-if="isMobile && !hiddenAdvertised">
              <vue-dfp
                :is="props.vueDfp"
                slot="dfpad-AR3-MB"
                :config="props.config"
                :size="_get($store, 'getters.adSize')"
                pos="MBAR3"
              />
            </template>
            <PopList :pop="popularlist" slot="poplist" v-if="isMobile" :currEnv="dfpMode" />
            <RelatedListInContent
              :relateds="relateds"
              slot="relatedListInContent"
            >
              <MicroAd
                v-for="ad in _get(microAds, 'article')"
                :id="`${_get(ad, 'pcId')}`"
                :key="`${_get(ad, 'pcId')}`"
                :currEnv="dfpMode"
                :currUrl="articleUrl"
                class="related">
              </MicroAd>
              <PopInAd>
                <div id="_popIn_recommend"></div>
              </PopInAd>
            </RelatedListInContent>
            <RecommendList
              slot="relatedlistBottom" 
              v-if="!isAd"
              :isAd="isAd"
              :sectionId="sectionId"
              :relateds="relateds"
              :currArticleId="currArticleId"
              :recommends="recommendlist"
              :excludingArticle="routeUpateReferrerSlug"
            />            
            <div class="article_fb_comment" style="margin: 1.5em 0;" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
            <!-- dable -->
            <template v-if="!hiddenAdvertised" slot="recommendList">
              <div
                v-if="isMobile"
                id="dablewidget_6XgaOJ7N"
                class="dable-widget"
                data-widget_id="6XgaOJ7N"
              />
              <div
                v-else
                id="dablewidget_GlYwenoy"
                class="dable-widget"
                data-widget_id="GlYwenoy"
              />
            </template>
          </ArticleBody>
          <div class="article_footer" :style="needWineWarning ? { paddingBottom: '10px' } : ''">
            <LazyItemWrapper
              v-if="!hiddenAdvertised"
              :position="verge.viewportH()"
              :strict="true"
            >
              <vue-dfp
                :is="props.vueDfp"
                v-if="isMobile"
                pos="MBFT"
                :extClass="`full ${styleDfpAd}`"
                :config="props.config"
                :size="_get($store, 'getters.adSize')"
              />
              <vue-dfp
                :is="props.vueDfp"
                v-else
                :config="props.config"
                pos="PCFT"
              />
            </LazyItemWrapper>
            <div style="width: 100%; height: 100%;">
              <Footer />
            </div>
          </div>
        </div>
        <ShareTools v-if="viewportWidth > 767" />
      </div>
      <div v-else-if="(articleStyle === 'photography')">
        <ArticleBodyPhotography :articleData="articleData" :viewport="viewportWidth" :initFBComment="initializeFBComments">
          <div class="article_fb_comment" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
          <ClientOnly>
            <div v-if="!hiddenAdvertised" slot="slot_dfpFT">
              <vue-dfp
                :is="props.vueDfp"
                v-if="isMobile"
                pos="MBFT"
                :config="props.config"
                :size="_get($store, 'getters.adSize')"
                extClass="full"
              />
              <vue-dfp
                :is="props.vueDfp"
                v-else
                :config="props.config"
                pos="PCFT"
              />
            </div>
          </ClientOnly>
        </ArticleBodyPhotography>
      </div>
      <LiveStream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
      <WineWarning v-if="needWineWarning" />
      <!-- DFP MB ST, Cover -->
      <ClientOnly>
        <template v-if="isMobile">
          <LazyItemWrapper :loadAfterPageLoaded="true" v-if="!needWineWarning">
            <DfpST :props="props">
              <vue-dfp
                :is="props.vueDfp"
                slot="dfpST"
                :config="props.config"
                pos="MBST"
              />
            </DfpST>
          </LazyItemWrapper>
          <DfpCover
            v-if="!hiddenAdvertised"
            v-show="showDfpCoverAdFlag"
          > 
            <vue-dfp
              :is="props.vueDfp"
              pos="MBCVR"
              :config="props.config"
              slot="ad-cover"
            /> 
          </DfpCover> 
          <DfpCover
            v-if="!hiddenAdvertised && showDfpCoverAd2Flag"
            :showCloseBtn="false"
            class="raw"
          > 
            <vue-dfp
              :is="props.vueDfp"
              slot="ad-cover"
              :config="props.config"
              pos="MBCVR2"
            /> 
          </DfpCover>
          <DfpCover
            v-if="!hiddenAdvertised && showDfpCoverInnityFlag"
            :showCloseBtn="false"
            class="raw"
          >
            <vue-dfp
              :is="props.vueDfp"
              slot="ad-cover"
              pos="MBCVR3"
              :config="props.config"
            />
          </DfpCover>  
        </template>
      </ClientOnly>
      <!-- DFP FF -->
      <DfpFixed
        v-if="!hiddenAdvertised && hasDfpFixed"
        v-show="showDfpFixedBtn"
        @closeDfpFixed="showDfpFixedBtn = false"
      >
        <vue-dfp
          :is="props.vueDfp"
          slot="dfpFF"
          :config="props.config"
          :dfpId="props.dfpId"
          pos="PCFF"
        />
      </DfpFixed>
      <AdultContentAlert v-if="isAdultContent" />
      <div class="fb-quote"></div>
    </template>
  </VueDfpProvider>
</template>
<script>
  import {
    find as _find,
    get as _get,
    isEmpty as _isEmpty,
    map as _map
  } from 'lodash'
  import { DFP_ID, DFP_SIZE_MAPPING, DFP_UNITS, DFP_OPTIONS, FB_APP_ID, FB_PAGE_ID, SECTION_WATCH_ID } from '../constants'
  import { SITE_MOBILE_URL, SITE_DESCRIPTION, SITE_TITLE, SITE_TITLE_SHORT, SITE_URL, SITE_OGIMAGE } from '../constants'
  import { ScrollTriggerRegister } from '../util/scrollTriggerRegister'
  import { adtracker } from 'src/util/adtracking'
  import { currEnv, getImage, lockJS, sendAdCoverGA, sendGaClickEvent, unLockJS, updateCookie } from '../util/comm'
  import { getRole } from '../util/mmABRoleAssign'
  import { microAds } from '../constants/microAds'
  import ArticleBody from '../components/article/ArticleBody.vue'
  import ArticleBodyPhotography from '../components/article/ArticleBodyPhotography.vue'
  import AdultContentAlert from '../components/AdultContentAlert.vue'
  import ArticleAsideFixed from '../components/article/ArticleAsideFixed.vue'
  import ClientOnly from 'vue-client-only'
  import Cookie from 'vue-cookie'
  import DfpCover from '../components/DfpCover.vue'
  import DfpFixed from '../components/DfpFixed.vue'
  import DfpST from '../components/DfpST.vue'
  import Footer from '../components/Footer.vue'
  import Header from '../components/Header.vue'
  import HeroImage from '../components/article/HeroImage.vue'
  import HeroVideo from '../components/article/HeroVideo.vue'
  import LatestList from '../components/article/LatestList.vue'
  import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
  import LiveStream from '../components/LiveStream.vue'
  import MicroAd from '../components/MicroAd.vue'
  import PopInAd from '../components/PopInAd.vue'
  import PopList from '../components/article/PopList.vue'
  import PopListVert from '../components/article/PopListVert.vue'
  import RelatedListInContent from '../components/article/RelatedListInContent.vue'
  import RelatedListOverContent from '../components/article/RelatedListOverContent.vue'
  import RecommendList from '../components/article/RecommendList.vue'
  import ShareTools from '../components/article/ShareTools.vue'
  import WineWarning from '../components/WineWarning.vue'
  import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
  import moment from 'moment'
  import sanitizeHtml from 'sanitize-html'
  import titleMetaMixin from '../util/mixinTitleMeta'
  import truncate from 'truncate'
  import verge from 'verge'

  // This is a workaround
  let READrEmbeddedPromotions = {}
  if (process.env.VUE_ENV === 'client') {
    READrEmbeddedPromotions = require('@readr-ui/embedded-promotions')
  }
  
  const debug = require('debug')('CLIENT:VIEWS:article')
  const debugDFP = require('debug')('CLIENT:DFP')
  const debugDataLoad = require('debug')('CLIENT:DATALOAD')
  const fetchArticles = (store, slug) => {
    debug('Going to fetch article data.', slug)
    const timestamp = Date.now()
    return store.dispatch('FETCH_ARTICLES', {
      params: {
        // related: 'full',
        clean: 'content',
        where: { 'slug': slug, isAudioSiteOnly: false }
      },
      preview: _get(store, 'state.route.query.preview')
    }).then(article => {
      traceResponse(store, { log: `fetch articlle data: ${Date.now() - timestamp}ms` })
      return article
    })
  }

  const fetchEvent = (store, eventType = 'embedded') => store.dispatch('FETCH_EVENT', {
    params: {
      max_results: 1,
      where: {
        isFeatured: true,
        eventType: eventType
      }
    }
  })

  const fetchPartners = store => {
    const page = (_get(store.state, 'partners.meta.page') || 0) + 1
    return store.dispatch('FETCH_PARTNERS', {
      params: {
        max_results: 25,
        page: page
      }
    }).then(() => {
      const amount = _get(store.state, 'partners.items.length')
      const total = _get(store.state, 'partners.meta.total')
      if (amount < total) {
        return fetchPartners(store)
      }
      return Promise.resolve()
    })
  }

  const fetchPop = store => store.dispatch('FETCH_ARTICLES_POP_LIST', {})

  const fetchSSRData = store => {
    const timestamp = Date.now()
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'topics' ] }).then(response => {
      traceResponse(store, { log: `fetch sections and topics data: ${Date.now() - timestamp}ms` })
      return response
    })
  }

  const fetchCommonData = store => {
    const timestamp = Date.now()
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'projects' ] }).then(response => {
      traceResponse(store, { log: `fetch projects data: ${Date.now() - timestamp}ms` })
      return response
    })
  }

  const fetchData = store => Promise.all([
    fetchArticles(store, store.state.route.params.slug),
    fetchSSRData(store),
    fetchPartners(store),
    fetchCommonData(store)
  ])

  const fetchLatestArticle = (store, params) => store.dispatch('FETCH_LATESTARTICLE', { params: params })
  const fetchImages = (store, { ids = [], max_results = 10 }) => store.dispatch('FETCH_IMAGES_BY_ID', {
    ids,
    max_results
  })

  const traceResponse = (store, log) => (process.env.VUE_ENV === 'server' ? store.dispatch('TRACE_RES_STACK', log) : Promise.resolve())

  export default {
    name: 'AppArticle',
    preFetch: fetchData,
    asyncData ({ store }) { // asyncData ({ store, route: { params: { id }}})
      debug('RUN asyncData')
      return !process.browser ? fetchData(store) : Promise.resolve()
    },
    mixins: [ titleMetaMixin ],
    metaSet () {
      debug('About to change the metaSet.')
      debug('this.articleData.slug', this.articleData.slug)
      debug('process.env.VUE_ENV', process.env.VUE_ENV)
      if (!this.articleData.slug && process.env.VUE_ENV === 'server') {
        const e = new Error()
        e.massage = 'Page Not Found'
        e.code = '404'
        throw e
      }
      const {
        adTrace = '',
        brief = {},
        categories = [],
        heroImage = {},
        isAdult = false,
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
      const robotsValue = isAdult ? 'noindex' : 'index'
      const ogImageUrl = _get(ogImage, 'image.resizedTargets.mobile.url', '')
      const publishedTime = publishedDate ? new Date(publishedDate).toISOString() : ''
      const pureBrief = truncate(sanitizeHtml(_map(_get(brief, 'apiData', []), o => _map(_get(o, 'content', []), str => str)).join(''), { allowedTags: [] }), 197)
      const pureTags = _map(tags, t => _get(t, 'name', ''))
      const sectionName = _get(sections, '0.name', '')
      const sectionTitle = _get(sections, '0.title', '')
      const topicId = _get(topics, '_id', '')

      return {
        url: `${SITE_MOBILE_URL}/story/${slug}/`,
        title: title,
        meta: `
          <meta name="robots" content="${robotsValue}">
          <meta name="keywords" content="${_get(categories, '0.title') + ',' + pureTags.toString()}">
          <meta name="description" content="${pureBrief}">
          <meta name="section-name" content="${sectionName}">
          <meta name="category-name" content="${categorieName}">
          <meta name="topic-id" content="${topicId}">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${ogTitle.length > 0 ? ogTitle : title}">
          <meta name="twitter:description" content="${ogDescription.length > 0 ? truncate(ogDescription, 197) : pureBrief}">
          <meta name="twitter:image" content="${ogImageUrl.length > 0 ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : SITE_OGIMAGE)}">
          <meta property="fb:app_id" content="${FB_APP_ID}">
          <meta property="fb:pages" content="${FB_PAGE_ID}">
          <meta property="og:site_name" content="${SITE_TITLE}">
          <meta property="og:locale" content="zh_TW">
          <meta property="og:type" content="article">
          <meta property="og:title" content="${ogTitle.length > 0 ? ogTitle : title}">
          <meta property="og:description" content="${ogDescription.length > 0 ? truncate(ogDescription, 197) : pureBrief}">
          <meta property="og:url" content="${SITE_URL}/story/${slug}/">
          <meta property="og:image" content="${(ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : SITE_OGIMAGE)}">
          <meta property="dable:item_id" content="${slug}">
          <meta property="dable:author" content="${author}">
          <meta property="article:section" content="${sectionTitle}">
          <meta property="article:section2" content="${categorieTitle}">
          <meta property="article:published_time" content="${publishedTime}">
        `,
        link: `<link rel="amphtml" href="${SITE_URL}/story/amp/${slug}/">`,
        adTrace: adTrace
      }
    },
    beforeRouteUpdate (to, from, next) {
      debug('beforeRouteUpdate')
      fetchArticles(this.$store, to.params.slug)
        .then(() => {
          const thisItem = _find(_get(this.$store, 'state.articles.items'), { 'slug': to.params.slug })
          const theComingArticleSlug = _get(thisItem, 'slug')

          debug('this.articleData', theComingArticleSlug)
          if (!theComingArticleSlug) { location.replace('/404') }
          this.routeUpateReferrerSlug = _get(from, 'params.slug', 'N/A')
          return
        })
        .then(() => next())
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
    beforeMount () {
      debug('beforeMount')
    },
    components: {
      AdultContentAlert,
      ArticleAsideFixed,
      ArticleBody,
      ArticleBodyPhotography,
      ClientOnly,
      DfpCover,
      DfpFixed,
      DfpST,
      Footer,
      Header,
      HeroImage,
      HeroVideo,
      LatestList,
      LazyItemWrapper,
      LiveStream,
      MicroAd,
      PopInAd,
      PopList,
      PopListVert,
      RelatedListInContent,
      RelatedListOverContent,
      RecommendList,
      ShareTools,
      READrEmbeddedPromotions,
      VueDfpProvider,
      WineWarning,
    },
    data () {
      return {
        DFP_ID,
        DFP_UNITS,
        abIndicator: '',
        dfpHeaderLogoLoaded: false,
        dfpMode: 'prod',
        hasSentFirstEnterGA: false,
        isLowPriorityDataLoaded: false,
        microAds,
        routeUpateReferrerSlug: 'N/A',
        showDfpCoverAdFlag: false,
        showDfpCoverAd2Flag: false,
        showDfpCoverInnityFlag: false,        
        showDfpFixedBtn: false,
        showDfpHeaderLogo: false,
        state: {},
        verge
      }
    },
    computed: {
      articleUrl () {
        return `${SITE_URL}/story/${this.currArticleSlug}/`
      },
      articleData () {
        const _data = _find(_get(this.$store, 'state.articles.items'), { 'slug': this.currArticleSlug })
        return _data || {}
      },
      articleStyle () {
        return _get(this.articleData, 'style', '')
      },
      articlesOverContent () {
        return this.abIndicator === 'A' ? this.relateds : this.latests
      },
      relatedCategory () {
        return this.abIndicator === 'A' ? _get(this.articleData, 'categories.0.title', '新聞') : ''
      },
      currArticleSlug () {
        return _get(this.$store, 'state.route.params.slug', '')
      },
      currArticleId () {
        return _get(_find(_get(this.$store, 'state.articles.items'), { 'slug': this.$store.state.route.params.slug }), 'id', '')
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
            debug('this.sessionId', this.sessionId, elSessionId)
            if (elSessionId !== this.sessionId) { return }


            const adDisplayStatus = dfpCurrAd.currentStyle ? dfpCurrAd.currentStyle.display : window.getComputedStyle(dfpCurrAd, null).display
            const loadInnityAd = () => {
              debugDFP('Event "noad2" is detected!!')
              if (currentInstance.showDfpCoverAd2Flag && !currentInstance.showDfpCoverInnityFlag) {
                sendAdCoverGA('innity')
                debugDFP('noad2 detected and go innity')
                currentInstance.showDfpCoverInnityFlag = true
              }
            }
            window.addEventListener('noad2', loadInnityAd)
            window.parent.addEventListener('noad2', loadInnityAd)
            switch (position) {
              case 'MBCVR':
                sendAdCoverGA('dfp')
                debugDFP('MBCVR LOADED.')
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
                debugDFP('ad2 loaded')
                sendAdCoverGA('ad2')
                adDisplayStatus === 'none' &&  debugDFP('dfp response no ad2')
                break
              case 'MBCVR3':
                debugDFP('adInnity loaded')
                sendAdCoverGA('innity')
                adDisplayStatus === 'none' && debugDFP('dfp response no innity')
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
              default:
                debugDFP(`AD ${position} LOADED!`)
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
      eventEmbedded () {
        return _get(this.$store, 'state.eventEmbedded.items.0')
      },
      fbAppId () {
        return _get(this.$store, 'state.fbAppId')
      },
      fbCommentDiv () {
        return `<div class="fb-comments" data-href="${this.articleUrl}" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>`
      },
      hasDfpFixed () {
        return this.sectionId === SECTION_WATCH_ID
      },
      hasEventEmbedded () {
        const _now = moment()
        const _eventStartTime = moment(new Date(_get(this.eventEmbedded, 'startDate')))
        let _eventEndTime = moment(new Date(_get(this.eventEmbedded, 'endDate')))
        if (_eventEndTime && (_eventEndTime < _eventStartTime)) {
          _eventEndTime = moment(new Date(_get(this.eventEmbedded, 'endDate'))).add(12, 'h')
        }
        return (_eventStartTime && _eventEndTime && (_now >= _eventStartTime) && (_now <= _eventEndTime))
      },
      heroCaption () {
        return _get(this.articleData, [ 'heroCaption' ], '')
      },
      heroImage () {
        return _get(this.articleData, 'heroImage') || { image: {}, }
      },
      heroVideo () {
        const { heroVideo } = this.articleData
        const poster = getImage(this.articleData)
        return (heroVideo && heroVideo.video)
          ? Object.assign(_get(heroVideo, 'video', {}), { id: _get(heroVideo, 'id', '') }, { poster })
          : heroVideo
      },
      hiddenAdvertised () {
        return _get(this.articleData, 'hiddenAdvertised')
      },
      isAd () {
        return _get(this.articleData, [ 'isAdvertised' ], false)
      },
      isAdultContent () {
        return _get(this.articleData, 'isAdult')
      },
      isArticlePhotography () {
        return _get(this.articleData, 'style', '') === 'photography'
      },
      isLockJS () {
        return _get(this.articleData, 'lockJS')
      },
      ifSingleCol () {
        return (this.articleStyle === 'wide' || this.isMobile)
      },
      isMobile () {
        return this.viewportWidth < 1200
      },
      jsonLDBreadcrumbList () {
        return `{ "@context": "http://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "item": { "@id": "${SITE_URL}", "name": "${SITE_TITLE}" } },
            { "@type": "ListItem", "position": 2, "item": { "@id": "${SITE_URL + '/section/' + _get(this.articleData, 'sections.0.name')}", "name": "${_get(this.articleData, 'sections.0.title')}" } },
            { "@type": "ListItem", "position": 3, "item": { "@id": "${SITE_URL + _get(this.$route, 'path')}", "name": "${_get(this.articleData, 'title')}" } }
          ]
        }`
      },
      jsonLDNewsArticle () {
        return `{ "@context": "http://schema.org", "@type": "NewsArticle", "headline": "${_get(this.articleData, 'title')}",
          "url": "${SITE_URL + _get(this.$route, 'path')}", "thumbnailUrl": "${_get(this.heroImage, 'image.resizedTargets.desktop.url')}",
          "articleSection": "${_get(this.articleData, 'sections.0.title')}",
          "keywords": [ ${_map(_get(this.articleData, 'tags'), t => `"${_get(t, 'name')}"`)} ],
          "mainEntityOfPage": { "@type": "WebPage", "@id": "${SITE_URL + _get(this.$route, 'path')}" },
          "image": { "@type": "ImageObject", "url": "${_get(this.heroImage, 'image.resizedTargets.desktop.url')}", "height": ${_get(this.heroImage, 'image.resizedTargets.desktop.height')}, "width": ${_get(this.heroImage, 'image.resizedTargets.desktop.width')} },
          "datePublished": "${_get(this.articleData, 'publishedDate')}", "dateModified": "${_get(this.articleData, 'updatedAt')}", "author": { "@type": "Person", "name": "${_get(this.articleData, 'writers.0.name')}" },
          "publisher": { "@type": "Organization", "name": "${SITE_TITLE}", "logo": { "@type": "ImageObject", "url": "https://www.mirrormedia.mg/assets/images/logo.png" } },
          "description": "${_get(this.articleData, 'brief.apiData.0.content.0')}"
        }`
      },
      jsonLDPerson () {
        return `{ "@context": "http://schema.org", "@type": "Person", "name": "${_get(this.articleData, 'writers.0.name')}",
          "url": "${SITE_URL + '/author/' + _get(this.articleData, 'writers.0.id')}",
          "brand": { "@type": "Brand", "name": "${SITE_TITLE}", "url": "${SITE_URL}", "image": "https://www.mirrormedia.mg/assets/mirrormedia/logo.svg", "logo": "https://www.mirrormedia.mg/assets/mirrormedia/logo.svg", "description": "${SITE_DESCRIPTION}" }
        }`
      },
      latests () {
        return _get(this.$store, 'state.latestArticle.items', [])
                .filter((latest) => _get(latest, 'slug', '') !== this.currArticleSlug)
      },
      needWineWarning () {
        const cats = this.articleData.categories
        return cats.some(cat => cat.name === 'wine')
      },
      popularlist () {
        return _get(this.$store, 'state.articlesPopList.report') || []
      },
      projectlist () {
        return _get(this.$store, 'state.commonData.projects.items') || []
      },
      recommendlist () {
        return _get(this.$store, 'state.articlesRecommendList.relatedNews') || []
      },
      relateds () {
        return (_get(this.articleData, 'relateds') || []).filter(item => item)
      },
      sectionName () {
        return _get(this.articleData, 'sections.0.name')
      },
      sectionId () {
        const _sectionId = _get(this.articleData, 'sections.0.id')
        return DFP_UNITS[ _sectionId ] ? _sectionId : 'other'
      },
      styleDfpAd () {
        return this.viewportWidth < 321 ? 'ad-fit' : ''
      },
      viewportWidth () {
        return _get(this.$store, 'state.viewport.width') || 0
      },
    },
    methods: {
      checkLockJS () {
        this.isLockJS ? lockJS() : unLockJS()
      },
      _get,
      getMmid () {
        const mmid = Cookie.get('mmid')
        let assisgnedRole = _get(this.$route, [ 'query', 'ab' ])
        if (assisgnedRole) {
          assisgnedRole = assisgnedRole.toUpperCase()
        }
        const role = getRole({ mmid, distribution: [
          { id: 'A', weight: 50 },
          { id: 'B', weight: 50 } ]
        })
        return assisgnedRole || role
      },
      handleWWChange () {
        const isLapW = window.innerWidth >= 1200
        if (isLapW && !this.latests.length) {
          fetchLatestArticle(this.$store, {
            sort: '-publishedDate',
            where: { 'sections': this.sectionId }
          })
        }
      },
      initializeFBComments () {
        if (window.FB) {
          window.FB.init({
            appId: this.fbAppId,
            xfbml: true,
            version: 'v2.0'
          })
          window.FB.XFBML.parse()
        }
      },
      insertJSONLDScript () {
        const newsArticleScript = document.createElement('script')
        const personScript = document.createElement('script')
        const breadcrumbScript = document.createElement('script')
        newsArticleScript.setAttribute('id', 'js-newsArticle')
        newsArticleScript.setAttribute('type', 'application/ld+json')
        newsArticleScript.innerHTML = this.jsonLDNewsArticle
        personScript.setAttribute('id', 'js-person')
        personScript.setAttribute('type', 'application/ld+json')
        personScript.innerHTML = this.jsonLDPerson
        breadcrumbScript.setAttribute('id', 'js-breadcrumb')
        breadcrumbScript.setAttribute('type', 'application/ld+json')
        breadcrumbScript.innerHTML = this.jsonLDBreadcrumbList
        if (!document.getElementById('js-newsArticle')) {
          document.querySelector('head').appendChild(newsArticleScript)
        }
        if (!document.getElementById('js-person')) {
          document.querySelector('head').appendChild(personScript)
        }
        if (!document.getElementById('js-breadcrumb')) {
          document.querySelector('head').appendChild(breadcrumbScript)
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
      sendGA (articleData) {
        if (_get(articleData, 'sections.length') === 0) {
          window.ga('set', 'contentGroup1', '')
          window.ga('set', 'contentGroup2', '')
        } else {
          window.ga('set', 'contentGroup1', `${_get(articleData, 'sections.0.name')}`)
          window.ga('set', 'contentGroup2', `${_get(articleData, 'categories.0.name')}`)
        }
        window.ga('set', 'contentGroup3', '')
        window.ga('set', 'contentGroup3', `article${this.abIndicator}`)
        window.ga('send', 'pageview', { title: `${_get(articleData, 'title', '')} - ${SITE_TITLE_SHORT}`, location: document.location.href })
      },
      sendGaClickEvent,
      updateJSONLDScript () {
        const newsArticleScript = document.querySelector('#js-newsArticle')
        const personScript = document.querySelector('#js-person')
        const breadcrumbScript = document.querySelector('#js-breadcrumb')
        if (newsArticleScript) {
          document.querySelector('head').removeChild(newsArticleScript)
          document.querySelector('head').removeChild(personScript)
          document.querySelector('head').removeChild(breadcrumbScript)
        }
        this.insertJSONLDScript()
      },
      updateMediafarmersScript () {
        const mediafarmersScript = document.querySelector('#mediafarmersJS')
        document.querySelector('body').removeChild(mediafarmersScript)
        this.insertMediafarmersScript()
      },
      updateSysStage () {
        this.dfpMode = currEnv()
      },
    },
    mounted () {
      this.insertMediafarmersScript()
      this.checkLockJS()
      this.updateSysStage()
      this.abIndicator = this.getMmid()
      const scrollTriggerRegister = new ScrollTriggerRegister([
        { target: '.dable-widget', offset: 400, cb: this.initializeFBComments }
      ])
      scrollTriggerRegister.init()

      if (!_isEmpty(this.articleData)) {
        this.sendGA(this.articleData)
        this.hasSentFirstEnterGA = true
      }

      /**
       * Fetch latests after window.onload.
       */
      window.addEventListener('load', () => {
        (!this.isMobile || this.abIndicator === 'B') && fetchLatestArticle(this.$store, {
          sort: '-publishedDate',
          where: { 'sections': this.sectionId }
        })
      })

      window.addEventListener('resize', this.handleWWChange)
      window.addEventListener('orientationChange', this.handleWWChange)

      /**
       * Data's supposed to be loaded later.
       */
      const lowPriorityDataLoader = () => {
        if (this.isLowPriorityDataLoaded) { return }        
        debugDataLoad('GO LOAD DATA!')
        this.isLowPriorityDataLoaded = true
        if (this.articleData.relateds && this.articleData.relateds.length > 0) {
          const relatedImages = this.articleData.relateds.filter(related => related).map(related => related.heroImage)
          fetchImages(this.$store, { ids: relatedImages, max_results: relatedImages.length  })
        }        
        Promise.all([
          fetchPop(this.$store),
          fetchEvent(this.$store, 'embedded'),
          fetchEvent(this.$store, 'logo'),
        ]).then(() => {
          window.removeEventListener('scroll', lowPriorityDataLoader)
        })
       }
       window.addEventListener('scroll', lowPriorityDataLoader)
    },
    updated () {
      this.updateSysStage()
    },
    watch: {
      '$route.fullPath': function () {
        this.initializeFBComments()
        this.updateMediafarmersScript()
        this.checkLockJS()
        this.sendGA(this.articleData)
      },
      articleData (value) {
        if (!this.hasSentFirstEnterGA) {
          this.sendGA(this.articleData)
          this.hasSentFirstEnterGA = true
        }
        if (value.relateds && value.relateds.length > 0) {
          const relatedImages = value.relateds.filter(related => related).map(related => related.heroImage)
          fetchImages(this.$store, { ids: relatedImages, max_results: relatedImages.length  })
        }
        this.updateJSONLDScript()
      },
      isLockJS () {
        this.checkLockJS()
      },
      sectionId: function () {
        (!this.isMobile || this.abIndicator === 'B') && fetchLatestArticle(this.$store, {
          sort: '-publishedDate',
          where: {
            'sections': this.sectionId
          }
        })
      }   
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.handleWWChange)
      window.removeEventListener('orientationChange', this.handleWWChange)
    }
  }

</script>
<style lang="stylus" scoped>
  .article-container
    width 100%
    background-color #414141

    .article-heromedia
      margin 30px auto 0
      background-color #fff
      max-width 1160px
      position relative
    
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
        &_fbPage
          width 300px
          margin 20px 5px 15px
        &_popList
          margin 10px 0 0
      
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
      max-width 1160px
      background-color #fff
      margin 0 auto
      padding 20px 0

    a, a:hover, a:link, a:visited
      display inline

  .dable-widget
    margin-top 15px

  .readr-embedded-promotions
    width 300px
    margin 15px auto 0 auto
    min-height 300px

  @media (min-width 0px) and (max-width 499px)
    .article-container
      .article
        padding 0

  @media (min-width 321px) and (max-width 499px)
    .article-container
      .article
        padding 0 25px
  
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
      .article
        padding 0
        .article_footer
          width 645px
          margin 0 auto

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
