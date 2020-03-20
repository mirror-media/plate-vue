<template>
  <vue-dfp-provider
    :dfp-units="dfpUnits"
    :dfpid="dfpid"
    :mode="dfpMode"
    :section="'other'"
  >
    <template
      slot="dfpPos"
      slot-scope="props"
    >
      <Header
        :dfp-header-logo-loaded="dfpHeaderLogoLoaded"
        :props="props"
        :show-dfp-header-logo="showDfpHeaderLogo"
      />
      <article-body-external :article-data="articleData">
        <vue-dfp
          :is="props.vueDfp"
          slot="dfp-PCHD"
          :config="props.config"
          :dfp-id="props.dfpId"
          pos="PCHD"
          class="dfp dfp--desktop"
          style="margin: 0 auto; padding: 20px 0;"
        />
        <vue-dfp
          :is="props.vueDfp"
          slot="dfp-MBHD"
          :config="props.config"
          :dfp-id="props.dfpId"
          :size="getValue($store, 'getters.adSize')"
          pos="MBHD"
          class="dfp dfp--mobile"
          style="margin: 0 auto; padding: 20px 0;"
        />
        <vue-dfp
          :is="props.vueDfp"
          v-if="viewport > 1200"
          slot="dfp-AT1"
          :config="props.config"
          :dfp-id="props.dfpId"
          pos="PCAR"
          class="dfp dfp--desktop"
        />
        <vue-dfp
          :is="props.vueDfp"
          v-if="viewport < 1199"
          slot="dfp-AT1"
          :config="props.config"
          :dfp-id="props.dfpId"
          :size="getValue($store, 'getters.adSize')"
          pos="MBAR1"
          class="dfp dfp--mobile"
        />
        <vue-dfp
          :is="props.vueDfp"
          slot="dfp-AT2"
          :config="props.config"
          :dfp-id="props.dfpId"
          pos="MBAR2"
          class="dfp dfp--mobile"
        />
        <vue-dfp
          :is="props.vueDfp"
          slot="dfp-MBE1"
          pos="MBE1"
          :dfp-id="props.dfpId"
          :config="props.config"
          :size="getValue($store, 'getters.adSize')"
          class="dfp dfp--mobile"
        />
        <div
          slot="dfp-PCE1E2"
          class="dfp--PCE1E2 dfp--desktop"
        >
          <vue-dfp
            :is="props.vueDfp"
            pos="PCE1"
            :dfp-id="props.dfpId"
            :config="props.config"
          />
          <vue-dfp
            :is="props.vueDfp"
            pos="PCE2"
            :dfp-id="props.dfpId"
            :config="props.config"
          />
        </div>
        <vue-dfp
          :is="props.vueDfp"
          slot="dfp-PCR1"
          pos="PCR1"
          class="dfp--desktop"
          :config="props.config"
        />
        <vue-dfp
          :is="props.vueDfp"
          slot="dfp-PCR2"
          pos="PCR2"
          class="dfp--desktop"
          :config="props.config"
        />
        <pop-list
          slot="popularList"
          class="popularList"
          :pop="popularList"
        />
        <div
          slot="footer"
          class="footer"
        >
          <vue-dfp
            :is="props.vueDfp"
            :config="props.config"
            pos="PCFT"
            class="dfp dfp--desktop"
          />
          <vue-dfp
            :is="props.vueDfp"
            :config="props.config"
            pos="MBFT"
            class="dfp dfp--mobile"
            :ext-class="`${styleDfpAd}`"
            :size="getValue($store, 'getters.adSize')"
          />
          <app-footer />
        </div>
        <template slot="recommendList">
          <div
            id="dablewidget_GlYwenoy"
            class="dable-widget"
            data-widget_id="GlYwenoy"
          />
        </template>
        <FbSocialPlugins
          v-if="viewport < 1199"
          slot="fbPage"
        />
        <article-aside-fixed
          v-if="viewport > 1200"
          slot="articleAsideFixed"
        >
          <FbSocialPlugins slot="fbPage" />
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpR2"
            pos="PCR2"
            class="dfp--desktop"
            :config="props.config"
          />
          <pop-list-vert
            slot="popListVert"
            :pop="popularList"
          />
        </article-aside-fixed>
      </article-body-external>
      <share-tools v-if="viewport > 1200" />
      <LazyItemWrapper
        v-if="(viewport < 550)"
        :load-after-page-loaded="true"
      >
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
        v-if="isTimeToShowAdCover"
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
    </template>
  </vue-dfp-provider>
</template>

<script>
import { DFP_ID, DFP_SIZE_MAPPING, DFP_UNITS, DFP_OPTIONS, SITE_MOBILE_URL, SITE_DESCRIPTION, SITE_OGIMAGE, SITE_TITLE_SHORT, SITE_URL } from '../constants'

import { adtracker } from 'src/util/adtracking'
import { consoleLogOnDev, currEnv, getValue, sendAdCoverGA, updateCookie } from '../util/comm'
import { getRole } from '../util/mmABRoleAssign'
import _ from 'lodash'
import ArticleAsideFixed from '../components/article/ArticleAsideFixed.vue'
import ArticleBodyExternal from '../components/article/ArticleBodyExternal.vue'
import Cookie from 'vue-cookie'
import DfpCover from '../components/DfpCover.vue'
import DfpST from '../components/DfpST.vue'
import FbSocialPlugins from 'src/components/FbSocialPlugins.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import PopList from '../components/article/PopList.vue'
import PopListVert from '../components/article/PopListVert.vue'
import ShareTools from '../components/article/ShareTools.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import truncate from 'truncate'

const fetchData = (store, slug) => {
  return Promise.all([fetchSSRData(store), fetchPartners(store), fetchExternal(store, slug)])
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

const fetchPartners = (store) => {
  const page = _.get(store.state, ['partners', 'meta', 'page'], 0) + 1
  return store.dispatch('FETCH_PARTNERS', {
    params: {
      max_results: 25,
      page: page
    }
  }).then(() => {
    if (_.get(store.state, ['partners', 'items', 'length']) < _.get(store.state, ['partners', 'meta', 'total'])) {
      fetchPartners(store)
    }
  })
}

const fetchPop = (store) => {
  return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
}

const fetchSSRData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { endpoints: ['sections', 'topics'] })
}

export default {
  name: 'External',
  components: {
    'app-footer': Footer,
    'article-aside-fixed': ArticleAsideFixed,
    'article-body-external': ArticleBodyExternal,
    'pop-list': PopList,
    'pop-list-vert': PopListVert,
    'share-tools': ShareTools,
    'vue-dfp-provider': VueDfpProvider,
    DfpCover,
    DfpST,
    FbSocialPlugins,
    Header,
    LazyItemWrapper
  },
  asyncData ({ store, route: { params: { name } } }) {
    return fetchData(store, name)
  },
  metaInfo () {
    const {
      title = '',
      brief = '',
      name = '',
      partner = {},
      publishedDate = '',
      thumb = ''
    } = this.articleData

    if (!name && process.env.VUE_ENV === 'server') {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    }

    const ogTitle = `${title} - ${SITE_TITLE_SHORT}`
    const category = _.get(partner, 'name') || ''
    const ogDescription = truncate(brief, 197) || SITE_DESCRIPTION
    const imageUrl = thumb || SITE_OGIMAGE
    const partnerDisplay = _.get(partner, 'display') || ''
    const publishedTime = publishedDate ? new Date(publishedDate).toISOString() : ''

    return {
      title,
      meta: [
        { name: 'robots', content: 'index' },
        { vmid: 'description', name: 'description', content: ogDescription },
        { vmid: 'og:title', property: 'og:title', content: ogTitle },
        { vmid: 'og:description', property: 'og:description', content: ogDescription },
        { vmid: 'og:url', property: 'og:url', content: `${SITE_URL}/external/${name}/` },
        { vmid: 'og:image', property: 'og:image', content: imageUrl },
        { vmid: 'twitter:title', name: 'twitter:title', content: ogTitle },
        { vmid: 'twitter:description', name: 'twitter:description', content: ogDescription },
        { vmid: 'twitter:image', name: 'twitter:image', content: imageUrl },
        { name: 'section-name', content: 'externals' },
        { name: 'category-name', content: category },
        { property: 'dable:item_id', content: name },
        { property: 'article:section', content: this.$t('HEADER.EXTERNAL') },
        { property: 'article:section2', content: partnerDisplay },
        { property: 'article:published_time', content: publishedTime }
      ],
      link: [
        { rel: 'alternate', href: `${SITE_MOBILE_URL}/external/${name}/` }
      ]
    }
  },
  data () {
    return {
      abIndicator: '',
      clientSideFlag: false,
      dfpid: DFP_ID,
      dfpHeaderLogoLoaded: false,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      hasSentFirstEnterGA: false,
      isVponSDKLoaded: false,
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverInnityFlag: false,
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
      return _.get(this.$store, ['state', 'external', this.currArticleSlug], {})
    },
    commonData () {
      return this.$store.state.commonData
    },
    currArticleSlug () {
      return this.$store.state.route.params.name
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
            // debug('Event "noad2" is detected!!')
            if (currentInstance.showDfpCoverAd2Flag && !currentInstance.showDfpCoverInnityFlag) {
              sendAdCoverGA('innity')
              // debug('noad2 detected and go innity')
              currentInstance.showDfpCoverInnityFlag = true
            }
          }
          window.addEventListener('noad2', loadInnityAd)
          window.parent.addEventListener('noad2', loadInnityAd)
          switch (position) {
            case 'MBCVR':
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
            case 'MBCVR2':
              consoleLogOnDev({ msg: 'ad2 loaded' })
              sendAdCoverGA('ad2')
              if (adDisplayStatus === 'none') {
                consoleLogOnDev({ msg: 'dfp response no ad2' })
              }
              break
            case 'MBCVR3':
              // debug('adInnity loaded')
              sendAdCoverGA('innity')
              if (adDisplayStatus === 'none') {
                // debug('dfp response no innity')
              }
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
      return _.get(this.$store.state.eventLogo, ['items', '0'])
    },
    fbAppId () {
      return _.get(this.$store, ['state', 'fbAppId'])
    },
    isTimeToShowAdCover () {
      return _.get(this.$store, 'state.isTimeToShowAdCover', false)
    },
    popularList () {
      return _.get(this.$store, ['state', 'articlesPopList', 'report'], [])
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
    fetchPop(this.$store)
    fetchEvent(this.$store, 'logo')
  },
  mounted () {
    this.clientSideFlag = process.env.VUE_ENV === 'client'
    // this.abIndicator = this.$_external_getMmid()
    this.$_external_updateViewport()
    this.$_external_updateSysStage()
    this.$_external_insertMediafarmersScript()

    if (!_.isEmpty(this.articleData)) {
      this.$_external_sendGA(this.articleData)
      this.hasSentFirstEnterGA = true
    }

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
      let assisgnedRole = _.get(this.$route, ['query', 'ab'])
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
    $_external_insertMediafarmersScript () {
      const mediafarmersScript = document.createElement('script')
      mediafarmersScript.setAttribute('id', 'mediafarmersJS')
      mediafarmersScript.setAttribute('src', 'https://mediafarmers.org/api/api.js')
      if (!document.getElementById('mediafarmersJS')) {
        document.querySelector('body').appendChild(mediafarmersScript)
      }
    },
    $_external_sendGA (articleData) {
      window.ga('set', 'contentGroup1', 'external')
      window.ga('set', 'contentGroup2', `${_.get(articleData, ['partner', 'name'], '')}`)
      window.ga('set', 'contentGroup3', '')
      // window.ga('set', 'contentGroup3', `external${this.abIndicator}`)
      window.ga('send', 'pageview', { title: `${_.get(articleData, ['title'], '')} - ${SITE_TITLE_SHORT}`, location: document.location.href })
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
    getValue
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
