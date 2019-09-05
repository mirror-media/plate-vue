<template>
  <VueDfpProvider
    :dfpUnits="DFP_UNITS"
    :dfpid="DFP_ID"
    :options="dfpOptions"
    :section="sectionId"
    mode="dev"
  >
    <template slot-scope="props" slot="dfpPos">
      <Header
        :activeSection="sectionName"
        :dfpHeaderLogoLoaded="dfpHeaderLogoLoaded"
        :props="props"
        :showDfpHeaderLogo="showDfpHeaderLogo"
      />
      <section
        :is="component"
        :isMobile="isMobile"
        :post="post"
        :postUrl="postUrl"
      >
        <template v-if="isMobile && !hiddenAdvertised">
          <!-- HD -->
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpMBHD"
            :config="props.config"
            pos="MBHD"
            class="dfp dfp-full dfp-margin-btm"
          />
          <!-- AT1 -->
          <template>
            <span
              id="innity-custom-adnetwork-span-63518"
              slot="dfpMBAR1"
            />
            <span
              id="innity-custom-premium-span-12738"
              slot="dfpMBAR1"
            />     
            <vue-dfp
              :is="props.vueDfp"
              slot="dfpMBAR1"
              :config="props.config"
              pos="MBAR1"
              key="MBAR1"
            />
          </template>
          <!-- AT2 -->
          <template>
            <span
              id="innity-custom-adnetwork-span-68557"
              slot="dfpMBAR2"
            />
            <span
              id="innity-custom-premium-span-12739"
              slot="dfpMBAR2"
            />     
            <vue-dfp
              :is="props.vueDfp"
              slot="dfpMBAR2"
              :config="props.config"
              pos="MBAR2"
              key="MBAR2"
            />
          </template>
          <!-- AT3 -->
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpAR3"
            :config="props.config"
            pos="MBAR3"
          />
          <!-- E1 -->
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpMBE1"
            :config="props.config"
            pos="MBE1"
            class="dfp dfp-full"
          />
          <!-- FT -->
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpMBFT"
            :config="props.config"
            pos="MBFT"
            class="dfp dfp-full"
          />
        </template>
        <template v-if="!isMobile">
          <!-- HD -->
          <vue-dfp
            :is="props.vueDfp"
            v-if="!hiddenAdvertised"
            slot="dfpPCHD"
            pos="PCHD"
            class="dfp dfp-full dfp-margin-btm"
            :config="props.config"
          />
          <!-- AT1 -->
          <template>
            <span
              id="innity-custom-adnetwork-span-63518"
              slot="dfpPCAR1"
            />
            <span
              id="innity-custom-premium-span-12738"
              slot="dfpPCAR1"
            />     
            <vue-dfp
              :is="props.vueDfp"
              slot="dfpPCAR1"
              :config="props.config"
              pos="PCAR"
            />
          </template>
          <!-- E1 E2 -->
          <div
            class="dfp-space-around"
            slot="dfpPCE1E2"
          >
            <vue-dfp
              :is="props.vueDfp"
              :config="props.config"
              pos="PCE1"
            />
            <vue-dfp
              :is="props.vueDfp"
              :config="props.config"
              pos="PCE2"
            />
          </div>
          <!-- R1 -->
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpPCR1"
            :config="props.config"
            pos="PCR1"
            class="dfp"
          />
          <!--  -->
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpPCR2"
            pos="PCR2"
            :config="props.config"
            class="dfp dfp-margin-btm"
          />
          <!-- FT -->
          <vue-dfp
            :is="props.vueDfp"
            v-if="!hiddenAdvertised"
            slot="dfpPCFT"
            pos="PCFT"
            class="dfp dfp-full"
            :config="props.config"
          />
        </template>
        <MicroAd
          v-for="ad in get(microAds, 'article')"
          :key="`${get(ad, 'pcId')}`"
          slot="microAdInRelateds"
          :id="`${get(ad, 'pcId')}`"
          :currEnv="dfpMode"
          :currUrl="postUrl"
          class="related"
        />
        <PopInAd
          slot="popInAdInRelateds"
        >
          <div id="_popIn_recommend"></div>
        </PopInAd>
        <Footer
          slot="footer"
          class="footer"
        />
      </section>
      <template v-if="isMobile && !hiddenAdvertised">
        <DfpST :props="props">
          <vue-dfp
            :is="props.vueDfp"
            slot="dfpST"
            :config="props.config"
            pos="MBST"
          />
        </DfpST>
        <DfpCover
          v-show="showDfpCoverAdFlag"
        > 
          <vue-dfp
            :is="props.vueDfp"
            slot="ad-cover"
            :config="props.config"
            pos="MBCVR"
          /> 
        </DfpCover>
        <DfpCover
          v-if="showDfpCoverAd2Flag"
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
          v-if="showDfpCoverInnityFlag"
          :showCloseBtn="false"
          class="raw"
        >
          <vue-dfp
            :is="props.vueDfp"
            slot="ad-cover"
            :config="props.config"
            pos="MBCVR3"
          />
        </DfpCover>
        <dfp-fixed
          v-if="sectionId === SECTION_WATCH_ID"
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
        </dfp-fixed>
      </template>
    </template>
  </VueDfpProvider>
</template>
<script>
import AdultContentAlert from 'src/components/AdultContentAlert.vue'
import ArticleBodyPhotography from 'src/components/article/ArticleBodyPhotography.vue'
import DfpCover from 'src/components/DfpCover.vue'
import DfpFixed from 'src/components/DfpFixed.vue'
import DfpST from 'src/components/DfpST.vue'
import Footer from 'src/components/Footer.vue'
import Header from 'src/components/Header.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import MicroAd from 'src/components/MicroAd.vue'
import PopInAd from 'src/components/PopInAd.vue'
import PostBody from '../components/post/PostBody.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import WineWarning from 'src/components/WineWarning.vue'
import sanitizeHtml from 'sanitize-html'
import titleMetaMixin from 'src/util/mixinTitleMeta'
import truncate from 'truncate'
import {
  DFP_ID,
  DFP_SIZE_MAPPING,
  DFP_UNITS,
  DFP_OPTIONS,
  FB_APP_ID,
  FB_PAGE_ID,
  SECTION_WATCH_ID,
  SITE_MOBILE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_TITLE_SHORT,
  SITE_URL,
  SITE_OGIMAGE
} from 'src/constants'
import { adtracker } from 'src/util/adtracking'
import { createNamespacedHelpers } from 'vuex'
import {
  currEnv,
  getImage,
  lockJS,
  sendAdCoverGA,
  sendGaClickEvent,
  unLockJS,
  updateCookie 
} from 'src/util/comm'
import { find, get } from 'lodash'
import { microAds } from 'src/constants/microAds'


const debugDFP = require('debug')('CLIENT:DFP')

export default {
  name: 'AppPost',
  components: {
    AdultContentAlert,
    ArticleBodyPhotography,
    DfpCover,
    DfpFixed,
    DfpST,
    Footer,
    Header,
    LazyItemWrapper,
    MicroAd,
    PopInAd,
    PostBody,
    VueDfpProvider,
    WineWarning
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
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
      writers = []
    } = this.post

    const tagsString = tags.map(tag => tag.name).join(',')
    const firstCategory = get(categories, '0.title')
    const keywords = firstCategory ? `${firstCategory},${tagsString}` : tagsString
    const metaTitle = ogTitle || title
    const description = truncate(ogDescription || sanitizeHtml((get(brief, 'apiData') || []).map(brief => brief.content.join('')).join(''), { allowedTags: [] }), 197) || SITE_DESCRIPTION
    const metaImage = get(ogImage, 'image.resizedTargets.mobile.url') || get(heroImage, 'image.resizedTargets.mobile.url') || SITE_OGIMAGE
    const publishedTime = publishedDate ? new Date(publishedDate).toISOString() : ''

    return {
      title: metaTitle,
      meta: `
        <meta name="robots" content="${isAdult ? 'noindex' : 'index'}">
        <meta name="keywords" content="${keywords}">
        <meta name="description" content="${description}">
        <meta name="section-name" content="${get(sections, '0.name', '')}">
        <meta name="category-name" content="${get(categories, '0.name', '')}">
        <meta property="og:title" content="${metaTitle}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${metaTitle}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${metaImage}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="${SITE_TITLE}">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${metaTitle}">
        <meta property="og:description" content="${description}">
        <meta property="og:url" content="${SITE_URL}/story/${slug}/">
        <meta property="og:image" content="${metaImage}">
        <meta property="dable:item_id" content="${slug}">
        <meta property="dable:author" content="${get(writers, '0.name', '')}">
        <meta property="article:section" content="${get(sections, '0.title', '')}">
        <meta property="article:section2" content="${get(categories, '0.title', '')}">
        <meta property="article:published_time" content="${publishedTime}">
      `,
      link: `<link rel="amphtml" href="${SITE_URL}/story/amp/${slug}/">`,
      adTrace: adTrace
    }
  },
  asyncData ({ store, route }) {
    return Promise.all([
      store.dispatch('DataPost/FETCH_POST', { slug: route.params.slug }),
      store.dispatch('FETCH_COMMONDATA', { endpoints: [ 'sections', 'topics' ] }),
      store.dispatch('FETCH_COMMONDATA', { endpoints: [ 'projects' ] })
    ])
  },
  data () {
    return {
      DFP_ID,
      DFP_UNITS,
      SECTION_WATCH_ID,
      abIndicator: '',
      dfpHeaderLogoLoaded: false,
      dfpMode: 'prod',
      microAds,
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverInnityFlag: false,
      showDfpFixedBtn: false,
      showDfpHeaderLogo: false,
    }
  },
  computed: {
    component () {
      return this.postStyle === 'photography' ? 'ArticleBodyPhotography' : 'PostBody'
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
            debugDFP('Event "noad2" is detected!!')
            if (currentInstance.showDfpCoverAd2Flag && !currentInstance.showDfpCoverInnityFlag) {
              sendAdCoverGA('innity')
              debugDFP('noad2 detected and go innity')
              currentInstance.showDfpCoverInnityFlag = true
            }
          }
          console.log('dfpOptions', position)
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
    hiddenAdvertised () {
      return get(this.post, 'hiddenAdvertised')
    },
    isMobile () {
      return get(this.$store, 'state.viewport.width') <= 768
    },
    post () {
      return find(this.$store.state.DataPost.posts, { slug: this.slug })
    },
    postStyle () {
      return get(this.post, 'style')
    },
    postUrl () {
      return `${SITE_URL}/story/${this.slug}/`
    },
    relateds () {
      return get(this.post, 'relateds') || []
    },
    sectionId () {
      const postSectionId = get(this.post, 'sections.0.id')
      return DFP_UNITS[postSectionId] ? postSectionId : 'other'
    },
    sectionName () {
      return get(this.post, 'sections.0.name')
    },
    slug () {
      return this.$route.params.slug
    }
  },
  mounted () {
    if (this.relateds.length > 0) {
      this.fetchRelatedImages()
    }

    window.addEventListener('load', () => {
      this.$store.dispatch('FETCH_LATESTARTICLE', {
        params: {
          sort: '-publishedDate',
          where: {
            sections: this.sectionId
          }
        }
      })
    })
    this.$store.dispatch('FETCH_ARTICLES_POP_LIST', {})
  },
  methods: {
    fetchRelatedImages () {
      const relatedImages = this.relateds
        .filter(related => related)
        .map(related => related.heroImage)
      this.$store.dispatch('FETCH_IMAGES_BY_ID', { ids: relatedImages, max_results: relatedImages.length })
    },
    get
  }
}
</script>
<style lang="stylus" scoped>
.dfp
  margin-top 0
  text-align center
  &-margin-btm
    margin-bottom 20px
  &-full
    width 100% !important
  &-space-around
    display flex
    justify-content space-around
</style>
