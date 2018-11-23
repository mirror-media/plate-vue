<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId" :options="dfpOptions" :mode="dfpMode">
    <template slot-scope="props" slot="dfpPos">
      <section style="width: 100%;">
        <app-header :commonData="commonData" :eventLogo="eventLogo" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" v-if="(articleStyle !== 'photography')" :props="props"></app-header>
      </section>
      <div class="article-container" v-if="(articleStyle !== 'photography')" >
        <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="PCHD" extClass="full mobile-hide" :config="props.config"/>
        <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="MBHD" extClass="full mobile-only" :config="props.config"/>
        <div class="split-line"></div>
        <div class="article-heromedia" v-if="heroVideo" >
          <HeroVideo
            :abIndicator="abIndicator"
            :isAd="isAd"
            :viewport="viewport"
            :sectionMap="sectionMap"
            :sectionId="sectionId"
            :articleData="articleData"
            :heroCaption="heroCaption"
            :video="heroVideo"></HeroVideo>
        </div>
        <HeroImage v-else
          :abIndicator="abIndicator"
          :isAd="isAd"
          :viewport="viewport"
          :sectionMap="sectionMap"
          :sectionId="sectionId"
          :articleData="articleData"
          :heroCaption="heroCaption"
          :heroImage="heroImage"></HeroImage>
        <div class="article" v-if="articleData">
          <article-body
            :abIndicator="abIndicator"
            :articleData="articleData"
            :isAd="isAd"
            :poplistData="popularlist"
            :projlistData="projectlist"
            :viewport="viewport">
            <aside class="article_aside mobile-hidden" slot="aside" v-if="!ifSingleCol">
              <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="PCR1" extClass="mobile-hide" :config="props.config"></vue-dfp>
              <latest-list
                v-if="ifRenderAside"
                :latest="latestList"
                :currArticleSlug="currArticleSlug"
                :sectionId="getValue(articleData, [ 'sections', 0, 'id' ])"></latest-list>
              <article-aside-fixed :projects="projectlist">
                <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" slot="dfpR2" pos="PCR2" extClass="dfp-r2 mobile-hide" :config="props.config"></vue-dfp>
                <div slot="fbPage" class="article_aside_fbPage fb-page" data-href="https://www.facebook.com/mirrormediamg/" data-width="300" data-small-header="true" data-hide-cover="true" data-show-facepile="false">
                  <blockquote cite="https://www.facebook.com/mirrormediamg/" class="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/mirrormediamg/">鏡週刊</a>
                  </blockquote>
                </div>
                <pop-list-vert :pop="popularlist" slot="popListVert">
                  <micro-ad v-for="(a, i) in getValue(microAds, [ 'articleFixed' ])" :currEnv="dfpMode" :currUrl="articleUrl"
                    :id="`${getValue(a, [ 'pcId' ])}`" :key="`${getValue(a, [ 'pcId' ])}`"
                    class="popListVert-list__item" :slot="`microAd${getValue(a, [ 'pos' ])}`"></micro-ad>
                </pop-list-vert>
              </article-aside-fixed>
            </aside>
            <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="PCE1" extClass="mobile-hide" slot="dfpad-set" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="PCE2" extClass="mobile-hide" slot="dfpad-set" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="MBE1" extClass="mobile-only" slot="dfpad-set" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised && dfpMode === 'dev' && sectionId === '596441604bbe120f002a3197'" pos="PCAROOP" extClass="mobile-hide" slot="dfpad-AR1" :config="props.config" />
            <vue-dfp :is="props.vueDfp" v-else-if="!hiddenAdvertised" pos="PCAR" extClass="mobile-hide" slot="dfpad-AR1" :config="props.config"  />
            <template slot="dfpad-AR1">
              <span id="innity-custom-adnetwork-span-63518"></span>
              <span id="innity-custom-premium-span-12738"></span>            
            </template>
            <template slot="dfpad-AR2">
              <span id="innity-custom-adnetwork-span-68557"></span>
              <span id="innity-custom-premium-span-12739"></span>           
            </template>
            <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="MBAR1" extClass="mobile-only" slot="dfpad-AR1" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="MBAR2" extClass="mobile-only" slot="dfpad-AR2" :config="props.config"/>
            <pop-list :pop="popularlist" slot="poplist" v-if="ifShowPoplist && !(viewport >= 1200)" :currEnv="dfpMode">
              <micro-ad  v-for="(a, i) in getValue(microAds, [ 'article' ])" :currEnv="dfpMode" :currUrl="articleUrl"
                :id="`${getValue(a, [ 'pcId' ])}`" :key="`${getValue(a, [ 'pcId' ])}`"
                class="pop_item margin-top-0" :slot="`microAd${i}`"></micro-ad>
            </pop-list>
            <RelatedListInContent v-if="abIndicator === 'B'" slot="relatedListInContent" :relateds="relateds" />
            <RelatedListWithRecommendList v-if="relateds.length > 0 || (recommendlist.length > 0 && !isAd)"
              slot="relatedlistBottom" 
              :abIndicator="abIndicator"
              :isAd="isAd"
              :sectionId="sectionId"
              :relateds="relateds"
              :currArticleId="currArticleId"
              :recommends="recommendlist"
              :excludingArticle="routeUpateReferrerSlug"></RelatedListWithRecommendList>
            <div class="article_fb_comment" style="margin: 1.5em 0;" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
            <template v-if="!hiddenAdvertised" slot="recommendList">
              <div><h3>推薦文章</h3></div>
              <div id="matchedContentContainer" class="matchedContentContainer"></div>
            </template>
          </article-body>
          <div class="article_footer">
            <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised" pos="PCFT" extClass="mobile-hide" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" v-if="!hiddenAdvertised && dfpMode === 'dev' && sectionId === '596441d04bbe120f002a319a'" pos="MBFTOOP" :extClass="`full mobile-only ${styleDfpAd}`" :config="props.config" />
            <vue-dfp :is="props.vueDfp" v-else-if="!hiddenAdvertised" pos="MBFT" :extClass="`full mobile-only ${styleDfpAd}`" :config="props.config" />
            <div style="width: 100%; height: 100%;">
              <app-footer />
            </div>
          </div>
        </div>
        <share-tools v-if="viewport > 767" />
      </div>
      <div v-else-if="(articleStyle === 'photography')">
        <article-body-photography :articleData="articleData" :viewport="viewport" :initFBComment="initializeFBComments">
          <div class="article_fb_comment" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
          <div v-if="!hiddenAdvertised" slot="slot_dfpFT">
            <vue-dfp :is="props.vueDfp" pos="PCFT" extClass="mobile-hide" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="MBFT" :extClass="`full mobile-only`" :config="props.config" v-if="viewport < 767" />
          </div>
        </article-body-photography>
      </div>
      <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
      <DfpCover v-if="!hiddenAdvertised" v-show="showDfpCoverAdFlag && viewport < 1199"> 
        <vue-dfp :is="props.vueDfp" pos="MBCVR" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" /> 
      </DfpCover> 
      <DfpCover v-if="!hiddenAdvertised && showDfpCoverAd2Flag && viewport < 1199" :showCloseBtn="false" class="raw"> 
        <vue-dfp :is="props.vueDfp" pos="MBCVR2" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" /> 
      </DfpCover>
      <DfpCover v-if="!hiddenAdvertised && showDfpCoverInnityFlag && viewport < 1199" :showCloseBtn="false" class="raw">
        <vue-dfp :is="props.vueDfp" pos="MBCVR3" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" />
      </DfpCover>      
      <dfp-fixed v-if="!hiddenAdvertised && hasDfpFixed" v-show="showDfpFixedBtn" v-on:closeDfpFixed="closeDfpFixed">
        <vue-dfp :is="props.vueDfp" pos="PCFF" :dfpId="props.dfpId" slot="dfpFF" :config="props.config"/>
      </dfp-fixed>
      <adult-content-alert v-if="isAdultContent" />
      <div class="fb-quote"></div>
    </template>
  </vue-dfp-provider>
</template>
<script>
  import _ from 'lodash'
  import { DFP_ID, DFP_SIZE_MAPPING, DFP_UNITS, DFP_OPTIONS, FB_APP_ID, FB_PAGE_ID, SECTION_MAP, SECTION_WATCH_ID } from '../constants'
  import { SITE_MOBILE_URL, SITE_DESCRIPTION, SITE_TITLE, SITE_TITLE_SHORT, SITE_URL, SITE_OGIMAGE } from '../constants'
  import { MATCHED_CONTENT_AD_CLIENT, MATCHED_CONTENT_AD_SLOT } from '../constants'
  import { ScrollTriggerRegister } from '../util/scrollTriggerRegister'
  import { consoleLogOnDev, currEnv, getImage, getTruncatedVal, lockJS, sendAdCoverGA, unLockJS, updateCookie } from '../util/comm'
  import { getRole } from '../util/mmABRoleAssign'
  import { microAds } from '../constants/microAds'
  import AdultContentAlert from '../components/AdultContentAlert.vue'
  import ArticleAsideFixed from '../components/article/ArticleAsideFixed.vue'
  import ArticleBody from '../components/article/ArticleBody.vue'
  import ArticleBodyPhotography from '../components/article/ArticleBodyPhotography.vue'
  import ArticleVideo from '../components/article/Video.vue'
  import Cookie from 'vue-cookie'
  import DfpCover from '../components/DfpCover.vue'
  import DfpFixed from '../components/DfpFixed.vue'
  import Footer from '../components/Footer.vue'
  import Header from '../components/Header.vue'
  import HeroImage from '../components/article/HeroImage.vue'
  import HeroVideo from '../components/article/HeroVideo.vue'
  import LatestList from '../components/article/LatestList.vue'
  import LiveStream from '../components/LiveStream.vue'
  import MicroAd from '../components/MicroAd.vue'
  import PopList from '../components/article/PopList.vue'
  import PopListVert from '../components/article/PopListVert.vue'
  import RelatedListInContent from '../components/article/RelatedListInContent.vue'
  import RelatedListWithRecommendList from '../components/article/RelatedListWithRecommendList.vue'
  import ShareTools from '../components/article/ShareTools.vue'
  import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
  import moment from 'moment'
  import sanitizeHtml from 'sanitize-html'
  import titleMetaMixin from '../util/mixinTitleMeta'
  import truncate from 'truncate'

  const debug = require('debug')('CLIENT:VIEWS:article')
  const fetchArticles = (store, slug) => {
    debug('Going to fetch article data.', slug)
    return store.dispatch('FETCH_ARTICLES', {
      params: {
        // related: 'full',
        clean: 'content',
        where: {
          'slug': {
            '$in': [
              slug
            ]
          }
        }
      },
      preview: _.get(store, [ 'state', 'route', 'query', 'preview' ])
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

  const fetchPop = (store) => {
    return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
  }

  const fetchSSRData = (store) => {
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'topics' ] })
  }

  const fetchCommonData = (store) => {
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'projects' ] })
  }

  const fetchData = (store) => {
    return Promise.all([ fetchSSRData(store), fetchArticles(store, store.state.route.params.slug) ])
  }

  export default {
    name: 'article-view',
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
        categories = {},
        heroImage = {},
        isAdult = false,
        ogDescription = '',
        ogImage = {},
        ogTitle = '',
        sections = {},
        slug = '',
        tags = {},
        title = '',
        topics = {}
      } = this.articleData
      const categorieName = _.get(categories, [ 0, 'name' ], '')
      const imageUrl = _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const robotsValue = isAdult ? 'noindex' : 'index'
      const ogImageUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const pureBrief = truncate(sanitizeHtml(_.map(_.get(brief, [ 'apiData' ], []), (o) => (_.map(_.get(o, [ 'content' ], []), (str) => (str)))).join(''), { allowedTags: [] }), 197)
      const pureTags = _.map(tags, (t) => (_.get(t, [ 'name' ], '')))
      const sectionName = _.get(sections, [ 0, 'name' ], '')
      const topicId = _.get(topics, [ '_id' ], '')
      let abIndicator = ''
      if (process.env.VUE_ENV === 'client') {
        abIndicator = this.getMmid()
      }
      return {
        url: `${SITE_MOBILE_URL}/story/${slug}/`,
        title: `${title} - ${SITE_TITLE_SHORT}`,
        meta: `
          <meta name="mm-opt" content="article${abIndicator}">
          <meta name="robots" content="${robotsValue}">
          <meta name="keywords" content="${_.get(categories, [ 0, 'title' ]) + ',' + pureTags.toString()}">
          <meta name="description" content="${pureBrief}">
          <meta name="section-name" content="${sectionName}">
          <meta name="category-name" content="${categorieName}">
          <meta name="topic-id" content="${topicId}">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${(ogTitle.length > 0) ? ogTitle + ' - ' + SITE_TITLE_SHORT : title + ' - ' + SITE_TITLE_SHORT}">
          <meta name="twitter:description" content="${(ogDescription.length > 0) ? truncate(ogDescription, 197) : pureBrief}">
          <meta name="twitter:image" content="${(ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : SITE_OGIMAGE)}">
          <meta property="fb:app_id" content="${FB_APP_ID}">
          <meta property="fb:pages" content="${FB_PAGE_ID}">
          <meta property="og:site_name" content="${SITE_TITLE}">
          <meta property="og:locale" content="zh_TW">
          <meta property="og:type" content="article">
          <meta property="og:title" content="${(ogTitle.length > 0) ? ogTitle + ' - ' + SITE_TITLE_SHORT : title + ' - ' + SITE_TITLE_SHORT}">
          <meta property="og:description" content="${(ogDescription.length > 0) ? truncate(ogDescription, 197) : pureBrief}">
          <meta property="og:url" content="${SITE_URL}/story/${slug}/">
          <meta property="og:image" content="${(ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : SITE_OGIMAGE)}">
        `,
        link: `<link rel="amphtml" href="${SITE_URL}/story/amp/${slug}/">`,
        adTrace: adTrace
      }
    },
    beforeRouteUpdate (to, from, next) {
      debug('beforeRouteUpdate')
      fetchArticles(this.$store, to.params.slug)
        .then(() => {
          const thisItem = _.find(_.get(this.$store, 'state.articles.items'), { 'slug': to.params.slug })
          const theComingArticleSlug = _.get(thisItem, 'slug')

          debug('this.articleData', theComingArticleSlug)
          if (!theComingArticleSlug) { location.replace('/404') }
          this.routeUpateReferrerSlug = _.get(from, 'params.slug', 'N/A')
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
      fetchPop(this.$store)
      fetchCommonData(this.$store)
      fetchPartners(this.$store)
      fetchEvent(this.$store, 'embedded')
      fetchEvent(this.$store, 'logo')
    },
    components: {
      'adult-content-alert': AdultContentAlert,
      'article-aside-fixed': ArticleAsideFixed,
      'article-body': ArticleBody,
      'article-body-photography': ArticleBodyPhotography,
      'app-footer': Footer,
      'app-header': Header,
      'dfp-fixed': DfpFixed,
      'latest-list': LatestList,
      'live-stream': LiveStream,
      'micro-ad': MicroAd,
      'pop-list': PopList,
      'pop-list-vert': PopListVert,
      'share-tools': ShareTools,
      'vue-dfp-provider': VueDfpProvider,
      ArticleVideo,
      DfpCover,
      HeroImage,
      HeroVideo,
      RelatedListInContent,
      RelatedListWithRecommendList
    },
    data () {
      return {
        abIndicator: '',
        clientSideFlag: false,
        dfpid: DFP_ID,
        dfpMode: 'prod',
        dfpUnits: DFP_UNITS,
        hasSentFirstEnterGA: false,
        isVponSDKLoaded: false,
        isYahooAdLoaded: false,
        microAds,
        routeUpateReferrerSlug: 'N/A',
        sectionMap: SECTION_MAP,
        showDfpCoverAdFlag: false,
        showDfpCoverAd2Flag: false,
        showDfpCoverInnityFlag: false,        
        showDfpFixedBtn: false,
        showDfpHeaderLogo: false,
        state: {},
        viewport: undefined
      }
    },
    computed: {
      articleUrl () {
        return `${SITE_URL}/story/${this.currArticleSlug}/`
      },
      articleData () {
        const _data = _.find(_.get(this.$store, [ 'state', 'articles', 'items' ]), { 'slug': this.currArticleSlug })
        return _data || {}
      },
      articleStyle () {
        return _.get(this.articleData, [ 'style' ], '')
      },
      currArticleSlug () {
        return this.$store.state.route.params.slug
      },
      currArticleId () {
        return _.get(_.find(_.get(this.$store, 'state.articles.items'), { 'slug': this.$store.state.route.params.slug }), 'id', '')
      },
      commonData () {
        return this.$store.state.commonData
      },
      dfpOptions () {
        return Object.assign({}, DFP_OPTIONS, {
          afterEachAdLoaded: (event) => {
            const dfpCurrAd = document.querySelector(`#${event.slot.getSlotElementId()}`)
            const position = dfpCurrAd.getAttribute('pos')

            const adDisplayStatus = dfpCurrAd.currentStyle ? dfpCurrAd.currentStyle.display : window.getComputedStyle(dfpCurrAd, null).display
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
              case 'MBCVR':
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
              case 'MBCVR2':
                consoleLogOnDev({ msg: 'ad2 loaded' })
                sendAdCoverGA('ad2')
                if (adDisplayStatus === 'none') {
                  consoleLogOnDev({ msg: 'dfp response no ad2' })
                }
                break
              case 'MBCVR3':
                debug('adInnity loaded')
                sendAdCoverGA('innity')
                if (adDisplayStatus === 'none') {
                  debug('dfp response no innity')
                }
                break                
              case 'PCFF':
                this.showDfpFixedBtn = !(adDisplayStatus === 'none')
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
          setCentering: true,
          sizeMapping: DFP_SIZE_MAPPING
        })
      },
      eventEmbedded () {
        return _.get(this.$store.state.eventEmbedded, [ 'items', '0' ])
      },
      eventLogo () {
        return _.get(this.$store.state.eventLogo, [ 'items', '0' ])
      },
      fbAppId () {
        return _.get(this.$store, [ 'state', 'fbAppId' ])
      },
      fbCommentDiv () {
        return `<div class="fb-comments" data-href="${this.articleUrl}" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>`
      },
      hasDfpFixed () {
        return this.sectionId === SECTION_WATCH_ID
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
      heroCaption () {
        return _.get(this.articleData, [ 'heroCaption' ], '')
      },
      heroImage () {
        return _.get(this.articleData, [ 'heroImage' ]) || { image: {}, }
      },
      heroVideo () {
        const { heroVideo } = this.articleData
        const poster = getImage(this.articleData)
        return (heroVideo && heroVideo.video)
          ? Object.assign(_.get(heroVideo, [ 'video' ], {}), { id: _.get(heroVideo, [ 'id' ], '') }, { poster })
          : heroVideo
      },
      hiddenAdvertised () {
        return _.get(this.articleData, 'hiddenAdvertised', false)
      },
      ifLockJS () {
        return _.get(this.articleData, [ 'lockJS' ])
      },
      ifRenderAside () {
        return this.viewport >= 1200
      },
      ifRenderRelatedAside () {
        if (process.env.VUE_ENV === 'client') {
          return this.viewport >= 1200
        }
        return this.viewport >= 1200
      },
      ifShowPoplist () {
        return _.get(SECTION_MAP, [ this.sectionId, 'ifShowPoplist' ], true)
      },
      ifSingleCol () {
        return (this.articleStyle === 'wide' || !this.ifRenderAside)
      },
      isAdultContent () {
        return _.get(this.articleData, [ 'isAdult' ], false)
      },
      isAd () {
        return _.get(this.articleData, [ 'isAdvertised' ], false)
      },
      jsonLDBreadcrumbList () {
        return `{ "@context": "http://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "item": { "@id": "${SITE_URL}", "name": "${SITE_TITLE}" } },
            { "@type": "ListItem", "position": 2, "item": { "@id": "${SITE_URL + '/section/' + _.get(this.articleData, [ 'sections', '0', 'name' ])}", "name": "${_.get(this.articleData, [ 'sections', '0', 'title' ])}" } },
            { "@type": "ListItem", "position": 3, "item": { "@id": "${SITE_URL + _.get(this.$route, [ 'path' ])}", "name": "${_.get(this.articleData, [ 'title' ])}" } }
          ]
        }`
      },
      jsonLDNewsArticle () {
        return `{ "@context": "http://schema.org", "@type": "NewsArticle", "headline": "${_.get(this.articleData, [ 'title' ])}",
          "url": "${SITE_URL + _.get(this.$route, [ 'path' ])}", "thumbnailUrl": "${_.get(this.heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ])}",
          "articleSection": "${_.get(this.articleData, [ 'sections', '0', 'title' ])}",
          "keywords": [ ${_.map(_.get(this.articleData, [ 'tags' ]), (t) => { return `"${_.get(t, [ 'name' ])}"` })} ],
          "mainEntityOfPage": { "@type": "WebPage", "@id": "${SITE_URL + _.get(this.$route, [ 'path' ])}" },
          "image": { "@type": "ImageObject", "url": "${_.get(this.heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ])}", "height": ${_.get(this.heroImage, [ 'image', 'resizedTargets', 'desktop', 'height' ])}, "width": ${_.get(this.heroImage, [ 'image', 'resizedTargets', 'desktop', 'width' ])} },
          "datePublished": "${_.get(this.articleData, [ 'publishedDate' ])}", "dateModified": "${_.get(this.articleData, [ 'updatedAt' ])}", "author": { "@type": "Person", "name": "${_.get(this.articleData, [ 'writers', '0', 'name' ])}" },
          "publisher": { "@type": "Organization", "name": "${SITE_TITLE}", "logo": { "@type": "ImageObject", "url": "https://www.mirrormedia.mg/assets/images/logo.png" } },
          "description": "${_.get(this.articleData, [ 'brief', 'apiData', '0', 'content', '0' ])}"
        }`
      },
      jsonLDPerson () {
        return `{ "@context": "http://schema.org", "@type": "Person", "name": "${_.get(this.articleData, [ 'writers', '0', 'name' ])}",
          "url": "${SITE_URL + '/author/' + _.get(this.articleData, [ 'writers', '0', 'id' ])}",
          "brand": { "@type": "Brand", "name": "${SITE_TITLE}", "url": "${SITE_URL}", "image": "https://www.mirrormedia.mg/assets/mirrormedia/logo.svg", "logo": "https://www.mirrormedia.mg/assets/mirrormedia/logo.svg", "description": "${SITE_DESCRIPTION}" }
        }`
      },
      latestList () {
        return _.get(this.$store.state.latestArticle, [ 'items' ], [])
      },
      popularlist () {
        const { report = [] } = _.get(this.$store, [ 'state', 'articlesPopList' ])
        return report
      },
      projectlist () {
        const items = _.get(this.$store.state, [ 'commonData', 'projects', 'items' ])
        return items
      },
      recommendlist () {
        return _.get(this.$store, [ 'state', 'articlesRecommendList', 'relatedNews' ], [])
      },
      relateds () {
        return _.get(this.articleData, [ 'relateds' ], [])
      },
      sectionId () {
        const _sectionId = _.get(this.articleData, [ 'sections', 0, 'id' ])
        return this.dfpUnits[ _sectionId ] ? _sectionId : 'other'
      },
      styleDfpAd () {
        return (this.viewport < 321) ? 'ad-fit' : ''
      }
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
      getTruncatedVal,
      getValue (o = {}, p = [], d = '') {
        return _.get(o, p, d)
      },
      initializeFBComments () {
        if (window.FB) {
          window.FB && window.FB.init({
            appId: this.fbAppId,
            xfbml: true,
            version: 'v2.0'
          })
          window.FB && window.FB.XFBML.parse()
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
      insertMatchedContentScript () {
        const matchedContentStart = document.createElement('script')
        const matchedContentContent = document.createElement('ins')
        const matchedContentEnd = document.createElement('script')
        matchedContentStart.setAttribute('id', 'matchedContentStart')
        matchedContentStart.setAttribute('async', 'true')
        matchedContentStart.setAttribute('src', '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
        matchedContentContent.setAttribute('id', 'matchedContentContent')
        matchedContentContent.setAttribute('class', 'adsbygoogle')
        matchedContentContent.setAttribute('style', 'display:block')
        matchedContentContent.setAttribute('data-ad-format', 'autorelaxed')
        matchedContentContent.setAttribute('data-ad-client', MATCHED_CONTENT_AD_CLIENT)
        matchedContentContent.setAttribute('data-ad-slot', MATCHED_CONTENT_AD_SLOT)
        matchedContentEnd.setAttribute('id', 'matchedContentEnd')
        matchedContentEnd.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({});`

        /**/
        /* photography article may not have this container */
        const container = document.querySelector('#matchedContentContainer')
        /**/

        if (!document.querySelector('#matchedContentStart')) {
          container && container.appendChild(matchedContentStart)
        }
        if (!document.querySelector('#matchedContentContent')) {
          container && container.appendChild(matchedContentContent)
        }
        if (!document.querySelector('#matchedContentEnd')) {
          container && container.appendChild(matchedContentEnd)
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
        if (_.get(articleData, [ 'sections', 'length' ]) === 0) {
          window.ga('set', 'contentGroup1', '')
          window.ga('set', 'contentGroup2', '')
          // window.ga('set', 'contentGroup3', '')
          window.ga('set', 'contentGroup3', `article${this.abIndicator}`)
        } else {
          window.ga('set', 'contentGroup1', `${_.get(articleData, [ 'sections', '0', 'name' ])}`)
          window.ga('set', 'contentGroup2', `${_.get(articleData, [ 'categories', '0', 'name' ])}`)
          // window.ga('set', 'contentGroup3', '')
          window.ga('set', 'contentGroup3', `article${this.abIndicator}`)
        }
        window.ga('send', 'pageview', { title: `${_.get(articleData, [ 'title' ], '')} - ${SITE_TITLE_SHORT}`, location: document.location.href })
      },
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
      updateMatchedContentScript () {
        const matchedContentStart = document.querySelector('#matchedContentStart')
        const matchedContentContent = document.querySelector('#matchedContentContent')
        const matchedContentEnd = document.querySelector('#matchedContentEnd')
        if (matchedContentStart) {
          document.querySelector('#matchedContentContainer').removeChild(matchedContentStart)
          document.querySelector('#matchedContentContainer').removeChild(matchedContentContent)
          document.querySelector('#matchedContentContainer').removeChild(matchedContentEnd)
        }
        this.insertMatchedContentScript()
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
      },
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
      this.abIndicator = this.getMmid()
      const scrollTriggerRegister = new ScrollTriggerRegister([
        { target: '#matchedContentContainer', offset: 400, cb: this.insertMatchedContentScript },
        { target: '#matchedContentContainer', offset: 400, cb: this.initializeFBComments }
      ])
      scrollTriggerRegister.init()

      if (!_.isEmpty(this.articleData)) {
        this.sendGA(this.articleData)
        this.hasSentFirstEnterGA = true
      }
    },
    updated () {
      this.updateSysStage()
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
        this.updateMatchedContentScript()

        this.updateMediafarmersScript()
        this.sendGA(this.articleData)
      },
      articleData: function () {
        if (!this.hasSentFirstEnterGA) {
          this.sendGA(this.articleData)
          this.hasSentFirstEnterGA = true
        }
        this.updateJSONLDScript()
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

  @media (min-width 0px) and (max-width 499px)
    .article-container
      .article
        padding 30px 0 0

  @media (min-width 321px) and (max-width 499px)
    .article-container
      .article
        padding 30px 25px 0
  
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
