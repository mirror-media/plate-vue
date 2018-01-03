<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId" :options="dfpOptions" :mode="dfpMode">
    <template slot-scope="props" slot="dfpPos">
      <div class="article-container" v-if="(articleStyle !== 'photography')" >
        <vue-dfp :is="props.vueDfp" pos="PCHD" extClass="full mobile-hide" :config="props.config"/>
        <vue-dfp :is="props.vueDfp" pos="MBHD" extClass="full mobile-only" :config="props.config"/>
        <div class="split-line"></div>
        <div class="article-heromedia" v-if="heroVideo" >
          <article-video :video="heroVideo" class="heroimg" />
          <div class="heroimg-caption" v-text="heroCaption" v-show="(heroCaption && heroCaption.length > 0)"></div>
        </div>
        <div class="article-heromedia" v-else-if="heroImage">
          <img v-if="heroImage && heroImage.image" class="heroimg" :alt="heroCaption" :src="getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ])"
          :srcset="getValue(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ]) + ' 800w, ' +
          getValue(heroImage, [ 'image', 'resizedTargets', 'tablet', 'url' ]) + ' 1200w, ' +
          getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ]) + ' 2000w'" />
          <div class="heroimg-caption" v-text="heroCaption" v-show="(heroCaption && heroCaption.length > 0)"></div>
        </div>
        <div class="article" v-if="articleData">
          <article-body :articleData="articleData" :poplistData="popularlist" :viewport="viewport">
            <aside class="article_aside mobile-hidden" slot="aside" v-if="!ifSingleCol">
              <vue-dfp :is="props.vueDfp" pos="PCR1" extClass="mobile-hide" :config="props.config"></vue-dfp>
              <latest-list :latest="latestList" :currArticleSlug="currArticleSlug" v-if="ifRenderAside" />
              <vue-dfp :is="props.vueDfp" pos="PCR2" extClass="mobile-hide" :config="props.config"></vue-dfp>
            </aside>
            <vue-dfp :is="props.vueDfp" pos="PCE1" extClass="mobile-hide" slot="dfpad-set" :dfpId="props.dfpId" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="PCE2" extClass="mobile-hide" slot="dfpad-set" :dfpId="props.dfpId" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="MBE1" extClass="mobile-only" slot="dfpad-set" :dfpId="props.dfpId" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="PCAR" extClass="mobile-hide" slot="dfpad-AR1" :dfpId="props.dfpId" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="MBAR1" extClass="mobile-only" slot="dfpad-AR1" :dfpId="props.dfpId" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="MBAR2" extClass="mobile-only" slot="dfpad-AR2" :dfpId="props.dfpId" :config="props.config"/>
            
            <related-list-one-col :isApp="true" :relateds="relateds" v-if="(relateds.length > 0)" slot="relatedlistBottom" :sectionId="sectionId" />
            <div class="article_fb_comment" style="margin: 1.5em 0;" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
            <template slot="recommendList">
              <div v-if="abIndicator === 'A' || (abIndicator === 'B' && recommendlist.lenth > 0)"><h3>推薦文章</h3></div>
              <div id="matchedContentContainer" class="matchedContentContainer" v-if="abIndicator === 'A'" ></div>
              <RecommendList id="matchedContent" class="matchedContent" v-else="abIndicator === 'B'" :recommendList="recommendlist :excludingArticles="relateds" :excludingArticle="routeUpateReferrerSlug""></RecommendList>
            </template>
          </article-body>
          <div class="article_footer">
            <vue-dfp :is="props.vueDfp" pos="PCFT" extClass="mobile-hide" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="MBFT" :extClass="`full mobile-only ${styleDfpAd}`" :config="props.config"/>
          </div>
        </div>
      </div>
      <div v-else-if="(articleStyle === 'photography')">
        <article-body-photography :articleData="articleData" :viewport="viewport" :initFBComment="initializeFBComments" :isApp="true">
          <div class="article_fb_comment" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
          <div slot="slot_dfpFT">
            <vue-dfp :is="props.vueDfp" pos="PCFT" extClass="mobile-hide" :config="props.config"/>
            <vue-dfp :is="props.vueDfp" pos="MBFT" :extClass="`full mobile-only`" :config="props.config" v-if="viewport < 767" />
          </div>
        </article-body-photography>
      </div>
      <DfpCover v-show="showDfpCoverAdFlag && viewport < 1199"> 
        <vue-dfp :is="props.vueDfp" pos="MBCVR" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" /> 
      </DfpCover> 
      <DfpCover v-if="showDfpCoverAd2Flag && viewport < 1199" :showCloseBtn="false" class="raw"> 
        <vue-dfp :is="props.vueDfp" pos="MBCVR2" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" /> 
      </DfpCover> 
      <div class="dfp-cover vpon" v-if="showDfpCoverAdVponFlag && (viewport < 550)" v-html="vponHtml()"></div>
      <dfp-fixed v-if="hasDfpFixed" v-show="showDfpFixedBtn" v-on:closeDfpFixed="closeDfpFixed">
        <vue-dfp :is="props.vueDfp" pos="PCFF" :dfpId="props.dfpId" slot="dfpFF" :config="props.config"/>
      </dfp-fixed>
      <adult-content-alert v-if="isAdultContent" />
      <div class="fb-quote"></div>
    </template>
  </vue-dfp-provider>
</template>
<script>
  import _ from 'lodash'
  import { DFP_ID, DFP_SIZE_MAPPING, DFP_UNITS, DFP_OPTIONS, FB_APP_ID, FB_PAGE_ID, SECTION_MAP, SECTION_WATCH_ID, SITE_DESCRIPTION, SITE_TITLE, SITE_TITLE_SHORT, SITE_URL } from '../constants'
  import { consoleLogOnDev, currEnv, getTruncatedVal, lockJS, unLockJS, insertMicroAd, insertVponAdSDK, sendAdCoverGA, updateCookie, vponHtml } from '../util/comm'
  import { getRole } from '../util/mmABRoleAssign'
  import { microAds } from '../constants/microAds'
  import AdultContentAlert from '../components/AdultContentAlert.vue'
  import ArticleBody from '../components/article/ArticleBodyForApp.vue'
  import ArticleBodyPhotography from '../components/article/ArticleBodyPhotographyForApp.vue'
  import ArticleVideo from '../components/article/Video.vue'
  import Cookie from 'vue-cookie'
  import DfpCover from '../components/DfpCover.vue'
  import DfpFixed from '../components/DfpFixed.vue'
  import Footer from '../components/Footer.vue'
  import Header from '../components/Header.vue'
  import LatestList from '../components/article/LatestList.vue'
  import LiveStream from '../components/LiveStream.vue'
  import PopList from '../components/article/PopList.vue'
  import RecommendList from '../components/article/RecommendList.vue'
  // import RelatedList from '../components/article/RelatedList.vue'
  import RelatedListOneCol from '../components/article/RelatedListOneCol.vue'
  import ShareTools from '../components/article/ShareTools.vue'
  import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
  import moment from 'moment'
  import sanitizeHtml from 'sanitize-html'
  import titleMetaMixin from '../util/mixinTitleMeta'
  import truncate from 'truncate'

  const fetchArticles = (store, slug) => {
    return store.dispatch('FETCH_ARTICLES', {
      params: {
        related: 'full',
        clean: 'content',
        where: {
          'slug': {
            '$in': [
              slug
            ]
          }
        }
      }
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

  const fetchLatestArticle = (store, params) => {
    return store.dispatch('FETCH_LATESTARTICLE', { params: params })
  }

  const fetchSSRData = (store) => {
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'topics' ] })
  }

  const fetchCommonData = (store) => {
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'projects' ] })
  }

  const fetchData = (store) => {
    return Promise.all([ fetchSSRData(store), fetchArticles(store, store.state.route.params.slug).then(() => {
      const id = _.get(_.find(_.get(store, [ 'state', 'articles', 'items' ]), { 'slug': store.state.route.params.slug }), [ 'id' ], '')
      return fetchRecommendList(store, id)
    }) ])
  }

  export default {
    name: 'article-view',
    preFetch: fetchData,
    asyncData ({ store, route: { params: { id }}}) {
      return fetchData(store)
    },
    mixins: [ titleMetaMixin ],
    metaSet () {
      if (!this.articleData.slug && process.env.VUE_ENV === 'server') {
        const e = new Error()
        e.massage = 'Page Not Found'
        e.code = '404'
        throw e
      }
      const {
        brief = {},
        categories = {},
        heroImage = {},
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
      const ogImageUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const pureBrief = truncate(sanitizeHtml(_.map(_.get(brief, [ 'apiData' ], []), (o, i) => (_.map(_.get(o, [ 'content' ], []), (str) => (str)))).join(''), { allowedTags: [] }), 197)
      const pureTags = _.map(tags, (t) => (_.get(t, [ 'name' ], '')))
      const sectionName = _.get(sections, [ 0, 'name' ], '')
      const topicId = _.get(topics, [ '_id' ], '')

      let abIndicator
      if (process.env.VUE_ENV === 'client') {
        abIndicator = this.getMmid()
      }

      return {
        url: `${SITE_URL}/story/${slug}/`,
        title: truncate(title, 21) + ` - ${SITE_TITLE_SHORT}`,
        meta: `
          <meta name="mm-opt" content="article${abIndicator}">
          <meta name="keywords" content="${_.get(categories, [ 0, 'title' ]) + ',' + pureTags.toString()}">
          <meta name="description" content="${pureBrief}">
          <meta name="section-name" content="${sectionName}">
          <meta name="category-name" content="${categorieName}">
          <meta name="topic-id" content="${topicId}">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${(ogTitle.length > 0) ? truncate(ogTitle, 21) + ' - ' + SITE_TITLE_SHORT : truncate(title, 21) + ' - ' + SITE_TITLE_SHORT}">
          <meta name="twitter:description" content="${(ogDescription.length > 0) ? truncate(ogDescription, 197) : pureBrief}">
          <meta name="twitter:image" content="${(ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png')}">
          <meta property="fb:app_id" content="${FB_APP_ID}">
          <meta property="fb:pages" content="${FB_PAGE_ID}">
          <meta property="og:site_name" content="${SITE_TITLE}">
          <meta property="og:locale" content="zh_TW">
          <meta property="og:type" content="article">
          <meta property="og:title" content="${(ogTitle.length > 0) ? truncate(ogTitle, 21) + ' - ' + SITE_TITLE_SHORT : truncate(title, 21) + ' - ' + SITE_TITLE_SHORT}">
          <meta property="og:description" content="${(ogDescription.length > 0) ? truncate(ogDescription, 197) : pureBrief}">
          <meta property="og:url" content="${SITE_URL}/story/${slug}/">
          <meta property="og:image" content="${(ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png')}">
        `,
        link: `<link rel="canonical" href="${SITE_URL}/story/${slug}/" />`
      }
    },
    beforeRouteEnter (to, from, next) {
      if (process.env.VUE_ENV === 'client' && to.path !== from.path && from.matched && from.matched.length > 0) {
        next(vm => {
          const _targetArticle = _.find(_.get(vm.$store, [ 'state', 'articles', 'items' ]), { slug: to.params.slug })
          if (!_targetArticle) {
            Promise.all([
              fetchArticles(vm.$store, to.params.slug).then(() => {
                const { sections } = _.get(vm.$store, [ 'state', 'articles', 'items', 0 ], {})
                return fetchLatestArticle(vm.$store, {
                  sort: '-publishedDate',
                  where: {
                    'sections': _.get(sections, [ 0, 'id' ])
                  }
                })
              }).then(() => {
                const id = _.get(_.find(_.get(vm.$store, [ 'state', 'articles', 'items' ]), { 'slug': vm.$store.state.route.params.slug }), [ 'id' ], '')
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
        const sections = _.get(_.find(_.get(this.$store, [ 'state', 'articles', 'items' ]), { slug: to.params.slug }), [ 'sections' ])
        return fetchLatestArticle(this.$store, {
          sort: '-publishedDate',
          where: {
            'sections': _.get(sections, [ 0, 'id' ])
          }
        }).then(() => {
          next()
        })
      }).then(() => {
        const id = _.get(_.find(_.get(this.$store, [ 'state', 'articles', 'items' ]), { 'slug': this.$store.state.route.params.slug }), [ 'id' ], '')
        this.routeUpateReferrerSlug = _.get(from, [ 'params', 'slug' ], 'N/A')
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
    beforeMount () {
      const { sections } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ], {})
      fetchLatestArticle(this.$store, {
        sort: '-publishedDate',
        where: {
          'sections': _.get(sections, [ 0, 'id' ])
        }
      })
      fetchPop(this.$store)
      fetchCommonData(this.$store)
      fetchEvent(this.$store, 'embedded')
      fetchEvent(this.$store, 'logo')
    },
    components: {
      'adult-content-alert': AdultContentAlert,
      'article-body': ArticleBody,
      'article-body-photography': ArticleBodyPhotography,
      'app-footer': Footer,
      'app-header': Header,
      'dfp-fixed': DfpFixed,
      'latest-list': LatestList,
      'live-stream': LiveStream,
      'pop-list': PopList,
      // 'related-list': RelatedList,
      'related-list-one-col': RelatedListOneCol,
      'share-tools': ShareTools,
      'vue-dfp-provider': VueDfpProvider,
      ArticleVideo,
      DfpCover,
      RecommendList
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
        showDfpCoverAdVponFlag: false,
        showDfpFixedBtn: false,
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
      commonData () {
        return this.$store.state.commonData
      },
      dfpOptions () {
        return Object.assign({}, DFP_OPTIONS, {
          afterEachAdLoaded: (event) => {
            const dfpCurrAd = document.querySelector(`#${event.slot.getSlotElementId()}`)
            const position = dfpCurrAd.getAttribute('pos')

            const adDisplayStatus = dfpCurrAd.currentStyle ? dfpCurrAd.currentStyle.display : window.getComputedStyle(dfpCurrAd, null).display
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
              case 'PCFF':
                this.showDfpFixedBtn = !(adDisplayStatus === 'none')
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
        return _.get(this.articleData, [ 'heroImage' ])
      },
      heroVideo () {
        const { heroImage, heroVideo, ogImage } = this.articleData
        const heroImgUrl = _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], undefined)
        const ogImgUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], undefined)
        const poster = ogImgUrl || (heroImgUrl || '/public/notImage.png')
        return (heroVideo && heroVideo.video) ? Object.assign(_.get(heroVideo, [ 'video' ], {}), { id: _.get(heroVideo, [ 'id' ], '') }, { poster }) : heroVideo
      },
      ifLockJS () {
        return _.get(this.articleData, [ 'lockJS' ])
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
        return _.get(SECTION_MAP, [ this.sectionId, 'ifShowPoplist' ], true)
      },
      ifSingleCol () {
        return (this.articleStyle === 'wide' || !this.ifRenderAside)
      },
      isAdultContent () {
        return _.get(this.articleData, [ 'isAdult' ], false)
      },
      isCategoryBusinessMoney () {
        const categories = _.flatten(_.map(_.get(this.articleData, [ 'categories' ]), (o) => _.get(o, [ 'name' ])))
        return _.includes(categories, 'business') || _.includes(categories, 'money')
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
          "brand": { "@type": "Brand", "name": "${SITE_TITLE}", "url": "${SITE_URL}", "image": "https://www.mirrormedia.mg/public/logo.svg", "logo": "https://www.mirrormedia.mg/public/logo.svg", "description": "${SITE_DESCRIPTION}" }
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
        const role = getRole({ mmid, distribution: [
          { id: 'A', weight: 50 },
          { id: 'B', weight: 50 } ]
        })
        return role
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
      insertMediafarmersScript () {
        const mediafarmersScript = document.createElement('script')
        mediafarmersScript.setAttribute('id', 'mediafarmersJS')
        mediafarmersScript.setAttribute('src', 'https://mediafarmers.org/api/api.js')
        if (!document.getElementById('mediafarmersJS')) {
          document.querySelector('body').appendChild(mediafarmersScript)
        }
      },
      insertVponAdSDK,
      runMicroAd (adId) {
        this.microAdLoded[adId] = insertMicroAd({ adId, currEnv: this.dfpMode, microAdLoded: this.microAdLoded[adId] })
        return true
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
      vponHtml
    },
    mounted () {
      this.initializeFBComments()
      this.insertMediafarmersScript()
      this.updateViewport()
      this.clientSideFlag = process.env.VUE_ENV === 'client'
      window.addEventListener('resize', () => {
        this.updateViewport()
      })
      this.checkIfLockJS()
      this.updateSysStage()
      this.abIndicator = this.getMmid()
      this.sendGA(this.articleData)

      if (this.recommendlist.length > 0 && this.abIndicator === 'B') {
        window.ga && window.ga('send', 'event', 'article', 'visible', 'matchedcontent', {
          location: document.location.href,
          nonInteraction: false
        })
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
        this.updateMediafarmersScript()
        this.sendGA(this.articleData)

        // call getMmab to send related ab test ga
        // and will remove it after ab test got finished
        // this.getMmab()
        if (this.recommendlist.length > 0 && this.abIndicator === 'B') {
          window.ga && window.ga('send', 'event', 'article', 'visible', 'matchedcontent', {
            location: document.location.href,
            nonInteraction: false
          })
        }
      },
      articleData: function () {
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
      max-width 1160px
      background-color #fff
      margin 0 auto
      padding 20px 0

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
