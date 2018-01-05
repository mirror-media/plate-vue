<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :mode="dfpMode">
    <template slot-scope="props" slot="dfpPos">
      <app-header :commonData="commonData" :eventLogo="eventLogo" :props="props" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" ></app-header>
      <article-body-external :abIndicator="abIndicator" :articleData="articleData">
        <vue-dfp :is="props.vueDfp" slot="dfp-PCHD" :config="props.config" pos="PCHD" class="dfp dfp--desktop" style="margin: 0 auto 20px;"></vue-dfp>
        <vue-dfp :is="props.vueDfp" slot="dfp-MBHD" :config="props.config" pos="MBHD" class="dfp dfp--mobile" style="margin: 0 auto 20px;"></vue-dfp>
        <vue-dfp :is="props.vueDfp" slot="dfp-MBE1" pos="MBE1" :dfpId="props.dfpId" :config="props.config" class="dfp dfp--mobile"/>
        <div slot="dfp-PCE1E2" class="dfp--PCE1E2 dfp--desktop">
          <vue-dfp :is="props.vueDfp" pos="PCE1" :dfpId="props.dfpId" :config="props.config"></vue-dfp>
          <vue-dfp :is="props.vueDfp" pos="PCE2" :dfpId="props.dfpId" :config="props.config"></vue-dfp>
        </div>
        <vue-dfp :is="props.vueDfp" slot="dfp-PCR1" pos="PCR1" class="dfp--desktop" :config="props.config" ></vue-dfp>
        <latest-list slot="latestList" :latest="latestArticle"></latest-list>
        <vue-dfp :is="props.vueDfp" slot="dfp-PCR2" pos="PCR2" class="dfp--desktop" :config="props.config"></vue-dfp>
        <pop-list slot="popularList" class="popularList" :pop="popularList" >
          <micro-ad  v-for="(a, i) in getValue(microAds, [ 'article' ])" :currEnv="dfpMode" :currUrl="articleUrl"
            :id="`${getValue(a, [ 'pcId' ])}`" :key="`${getValue(a, [ 'pcId' ])}`"
            class="pop_item margin-top-0" :slot="`microAd${i}`"></micro-ad>
        </pop-list>
        <proj-list slot="projectList" :projects="projectList" :viewport="viewport"></proj-list>
        <div slot="fbComment" class="fbComment" v-html="fbCommentHtml"></div>
        <div slot="footer" class="footer">
          <vue-dfp :is="props.vueDfp" :config="props.config" pos="PCFT" class="dfp dfp--desktop"></vue-dfp>
          <vue-dfp :is="props.vueDfp" :config="props.config" pos="MBFT" class="dfp dfp--mobile" :extClass="`${styleDfpAd}`"></vue-dfp>
          <app-footer/>
        </div>
        <template slot="recommendList">
          <div><h3>推薦文章</h3></div>
          <div id="matchedContentContainer" class="matchedContentContainer"></div>
        </template>
        <article-aside-fixed :abIndicator="abIndicator" slot="articleAsideFixed">
          <vue-dfp :is="props.vueDfp" v-if="abIndicator === 'B'" slot="dfpR2" pos="PCR2B" class="dfp--desktop" :config="props.config"></vue-dfp>
          <div v-if="abIndicator === 'B'" slot="fbPage" class="article__aside--fbPage">
            <div class="fb-page" data-href="https://www.facebook.com/mirrormediamg/" data-adapt-container-width="true" data-small-header="true" data-hide-cover="true" data-show-facepile="false">
              <blockquote cite="https://www.facebook.com/mirrormediamg/" class="fb-xfbml-parse-ignore">
                <a href="https://www.facebook.com/mirrormediamg/">鏡週刊</a>
              </blockquote>
            </div>
          </div>
          <pop-list-vert :pop="popularList" slot="popListVert">
            <micro-ad  v-for="a in getValue(microAds, [ 'articleFixed' ])" :currEnv="dfpMode" :currUrl="articleUrl"
              :id="`${getValue(a, [ 'pcId' ])}`" :key="`${getValue(a, [ 'pcId' ])}`"
              class="popListVert-list__item" :slot="`microAd${getValue(a, [ 'pos' ])}`"></micro-ad>
          </pop-list-vert>
        </article-aside-fixed>
      </article-body-external>
      <share-tools v-if="viewport > 1200"></share-tools>
      <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded"></live-stream>
      <DfpCover v-show="showDfpCoverAdFlag && viewport < 1199"> 
        <vue-dfp :is="props.vueDfp" v-if="(viewport < 550)" slot="ad-cover" pos="MBCVR" :config="props.config"></vue-dfp>
      </DfpCover> 
      <DfpCover v-if="showDfpCoverAd2Flag && viewport < 1199" :showCloseBtn="false" class="raw"> 
        <vue-dfp :is="props.vueDfp" v-if="(viewport < 550)" slot="ad-cover" pos="MBCVR2" :config="props.config"></vue-dfp>
      </DfpCover>
    </template>
  </vue-dfp-provider>
</template>

<script>
  import { DFP_ID, DFP_SIZE_MAPPING, DFP_UNITS, DFP_OPTIONS, FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_OGIMAGE, SITE_TITLE, SITE_TITLE_SHORT, SITE_URL } from '../constants'
  import { ScrollTriggerRegister } from '../util/scrollTriggerRegister'
  import { consoleLogOnDev, currEnv, getValue, insertVponAdSDK, sendAdCoverGA, updateCookie, vponHtml } from '../util/comm'
  import { getRole } from '../util/mmABRoleAssign'
  import { microAds } from '../constants/microAds'
  import _ from 'lodash'
  import ArticleAsideFixed from '../components/article/ArticleAsideFixed.vue'
  import ArticleBodyExternal from '../components/article/ArticleBodyExternal.vue'
  import Cookie from 'vue-cookie'
  import DfpCover from '../components/DfpCover.vue'
  import Footer from '../components/Footer.vue'
  import Header from '../components/Header.vue'
  import LatestList from '../components/article/LatestList.vue'
  import LiveStream from '../components/LiveStream.vue'
  import MicroAd from '../components/MicroAd.vue'
  import PopList from '../components/article/PopList.vue'
  import PopListVert from '../components/article/PopListVert.vue'
  import ProjectList from '../components/article/ProjectList.vue'
  import ShareTools from '../components/article/ShareTools.vue'
  import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
  import moment from 'moment'
  import titleMetaMixin from '../util/mixinTitleMeta'
  import truncate from 'truncate'

  const fetchCommonData = (store) => {
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'projects' ] })
  }

  const fetchData = (store, slug) => {
    return Promise.all([ fetchSSRData(store), fetchPartners(store), fetchExternal(store, slug) ])
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

  const fetchExternal = (store, slug) => {
    return store.dispatch('FETCH_EXTERNAL', {
      params: {
        where: {
          name: {
            $in: [
              slug
            ]
          }
        }
      }
    })
  }

  const fetchLatestArticle = (store) => {
    return store.dispatch('FETCH_LATESTARTICLE', {
      params: {
        sort: '-publishedDate'
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

  export default {
    name: 'External',
    asyncData ({ store, route: { params: { name }}}) {
      return fetchData(store, name)
    },
    components: {
      'app-footer': Footer,
      'app-header': Header,
      'article-aside-fixed': ArticleAsideFixed,
      'article-body-external': ArticleBodyExternal,
      'latest-list': LatestList,
      'live-stream': LiveStream,
      'micro-ad': MicroAd,
      'pop-list': PopList,
      'pop-list-vert': PopListVert,
      'proj-list': ProjectList,
      'share-tools': ShareTools,
      'vue-dfp-provider': VueDfpProvider,
      DfpCover
    },
    mixins: [ titleMetaMixin ],
    metaSet () {
      if (!this.articleData.name && process.env.VUE_ENV === 'server') {
        const e = new Error()
        e.massage = 'Page Not Found'
        e.code = '404'
        throw e
      }
      const { brief, name, partner, thumb } = this.articleData
      const title = `${_.get(this.articleData, [ 'title' ])} - ${SITE_TITLE_SHORT}`
      const category = _.get(partner, [ 'name' ], '')
      const ogDescription = truncate(brief, 197) || SITE_DESCRIPTION
      const imageUrl = thumb || SITE_OGIMAGE
      let abIndicator
      if (process.env.VUE_ENV === 'client') {
        abIndicator = this.$_external_getMmid()
      }

      return {
        url: `${SITE_URL}/external/${name}/`,
        title: `${title} - ${SITE_TITLE_SHORT}`,
        meta: `
          <meta name="mm-opt" content="external${abIndicator}">
          <meta name="robots" content="index">
          <meta name="description" content="${ogDescription}">
          <meta name="section-name" content="externals">
          <meta name="category-name" content="${category}">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${ogDescription}">
          <meta name="twitter:image" content="${imageUrl}">
          <meta property="fb:app_id" content="${FB_APP_ID}">
          <meta property="fb:pages" content="${FB_PAGE_ID}">
          <meta property="og:site_name" content="${SITE_TITLE}">
          <meta property="og:locale" content="zh_TW">
          <meta property="og:type" content="article">
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${ogDescription}">
          <meta property="og:url" content="${SITE_URL}/external/${name}/">
          <meta property="og:image" content="${imageUrl}">
        `
      }
    },
    data () {
      return {
        abIndicator: 'A',
        clientSideFlag: false,
        dfpid: DFP_ID,
        dfpMode: 'prod',
        dfpUnits: DFP_UNITS,
        hasSentFirstEnterGA: false,
        isVponSDKLoaded: false,
        microAds,
        showDfpCoverAdFlag: false,
        showDfpCoverAd2Flag: false,
        showDfpCoverAdVponFlag: false,
        showDfpFixedBtn: false,
        showDfpHeaderLogo: false,
        viewport: undefined
      }
    },
    computed: {
      articleUrl () {
        return `${SITE_URL}/external/${this.currArticleSlug}/`
      },
      articleData () {
        return _.get(this.$store, [ 'state', 'external', this.currArticleSlug ], {})
      },
      commonData () {
        return this.$store.state.commonData
      },
      currArticleSlug () {
        return this.$store.state.route.params.name
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
      fbCommentHtml () {
        return `<div class="fb-comments" data-href="${SITE_URL}/external/${this.currArticleSlug}/" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>`
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
        return _.get(this.$store.state.latestArticle, [ 'items' ], [])
      },
      popularList () {
        return _.get(this.$store, [ 'state', 'articlesPopList', 'report' ], [])
      },
      projectList () {
        return _.get(this.$store.state, [ 'commonData', 'projects', 'items' ])
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
        this.$_external_updateMatchedContentScript()
        this.$_external_updateMediafarmersScript()
        this.$_external_sendGA(this.articleData)
      },
      articleData: function () {
        if (!this.hasSentFirstEnterGA) {
          this.$_external_sendGA(this.articleData)
          this.hasSentFirstEnterGA = true
        }
      }
    },
    beforeMount () {
      fetchCommonData(this.$store)
      fetchPop(this.$store)
      fetchLatestArticle(this.$store)
      fetchEvent(this.$store, 'embedded')
      fetchEvent(this.$store, 'logo')
    },
    mounted () {
      this.clientSideFlag = process.env.VUE_ENV === 'client'
      this.abIndicator = this.$_external_getMmid()
      this.$_external_updateViewport()
      this.$_external_updateSysStage()
      this.$_external_insertMediafarmersScript()

      if (!_.isEmpty(this.articleData)) {
        this.$_external_sendGA(this.articleData)
        this.hasSentFirstEnterGA = true
      }
      this.$_external_insertMatchedContentScript()
      const scrollTriggerRegister = new ScrollTriggerRegister([
        { target: '#matchedContentContainer', offset: 400, cb: this.$_external_insertMatchedContentScript },
        { target: '#matchedContentContainer', offset: 400, cb: this.$_external_initializeFBComments }
      ])
      scrollTriggerRegister.init()

      window.addEventListener('resize', () => {
        this.$_external_updateViewport()
      })
    },
    updated () {
      this.$_external_updateSysStage()
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
    methods: {
      $_external_getMmid () {
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
      $_external_initializeFBComments () {
        if (window.FB) {
          window.FB && window.FB.init({
            appId: this.fbAppId,
            xfbml: true,
            version: 'v2.0'
          })
          window.FB && window.FB.XFBML.parse()
        }
      },
      $_external_insertMediafarmersScript () {
        const mediafarmersScript = document.createElement('script')
        mediafarmersScript.setAttribute('id', 'mediafarmersJS')
        mediafarmersScript.setAttribute('src', 'https://mediafarmers.org/api/api.js')
        if (!document.getElementById('mediafarmersJS')) {
          document.querySelector('body').appendChild(mediafarmersScript)
        }
      },
      $_external_insertMatchedContentScript () {
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
        matchedContentContent.setAttribute('data-ad-client', 'ca-pub-7986335951683342')
        matchedContentContent.setAttribute('data-ad-slot', '3362911316')
        matchedContentEnd.setAttribute('id', 'matchedContentEnd')
        matchedContentEnd.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({});`

        const container = document.querySelector('#matchedContentContainer')
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
      $_external_sendGA (articleData) {
        window.ga('set', 'contentGroup1', 'external')
        window.ga('set', 'contentGroup2', `${_.get(articleData, [ 'partner', 'name' ], '')}`)
        // window.ga('set', 'contentGroup3', '')
        window.ga('set', 'contentGroup3', `external${this.abIndicator}`)
        window.ga('send', 'pageview', { title: `${_.get(articleData, [ 'title' ], '')} - ${SITE_TITLE_SHORT}`, location: document.location.href })
      },
      $_external_updateMediafarmersScript () {
        const mediafarmersScript = document.querySelector('#mediafarmersJS')
        document.querySelector('body').removeChild(mediafarmersScript)
        this.$_external_insertMediafarmersScript()
      },
      $_external_updateSysStage () {
        this.dfpMode = currEnv()
      },
      $_external_updateViewport () {
        const browser = typeof window !== 'undefined'
        if (browser) {
          this.viewport = document.documentElement.clientWidth || document.body.clientWidth
        }
      },
      $_external_updateMatchedContentScript () {
        const matchedContentStart = document.querySelector('#matchedContentStart')
        const matchedContentContent = document.querySelector('#matchedContentContent')
        const matchedContentEnd = document.querySelector('#matchedContentEnd')
        if (matchedContentStart) {
          document.querySelector('#matchedContentContainer').removeChild(matchedContentStart)
          document.querySelector('#matchedContentContainer').removeChild(matchedContentContent)
          document.querySelector('#matchedContentContainer').removeChild(matchedContentEnd)
        }
        this.$_external_insertMatchedContentScript()
      },
      getValue,
      insertVponAdSDK,
      vponHtml
    }
  }
</script>

<style lang="stylus" scoped>

.dfp
  margin 20px auto
  text-align center
  &--PCE1E2
    display flex
    justify-content space-around
    margin-bottom 15px
  &--PCHD
    width 1160px
    margin 0 auto

@media (max-width 999px)
  .dfp
    &--desktop
      display none !important
@media (min-width 1000px)
  .dfp
    &--mobile
      display none !important

</style>