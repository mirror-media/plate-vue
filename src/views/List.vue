<template>
  <VueDfpProvider
    :dfp-units="DFP_UNITS"
    :dfpid="DFP_ID"
    :section="sectionId"
    :options="dfpOptions"
    :mode="dfpMode"
  >
    <template
      slot="dfpPos"
      slot-scope="props"
    >
      <div
        v-if="pageStyle === 'video'"
        class="foodtravel-redesign"
      >
        <section>
          <HeaderFoodTravel
            :common-data="commonData"
            :section-name="sectionName"
            :sections="commonData.sections"
          />
        </section>
        <HeroImageFoodTravel
          :common-data="commonData"
          :section-name="sectionName"
        />
        <EditorChoiceFoodTravel
          :sectionfeatured="sectionfeatured"
          :viewport="viewportWidth"
        />
        <LatestArticleFoodTravel
          v-if="type === 'SECTION'"
          id="articleList"
          ref="articleList"
          :articles="autoScrollArticles"
          :common-data="commonData"
          :props="props"
          :show-latest-only="false"
        />
        <LatestArticleFoodTravel
          v-if="type === 'SECTION'"
          v-show="hasAutoScroll"
          id="articleListAutoScroll"
          ref="articleListAutoScroll"
          :articles="autoScrollArticlesLoadMore"
          :common-data="commonData"
          :props="props"
          :show-latest-only="true"
        />
        <MoreFull
          v-if="hasMore && (!loading)"
          :class-name="'moreFoodTravel'"
          @loadMore="loadMore"
        />
        <Loading :show="loading" />
        <ClientOnly>
          <LazyItemWrapper
            :position="verge.viewportH()"
            :strict="true"
          >
            <vue-dfp
              :is="props.vueDfp"
              v-if="isMobile"
              :config="props.config"
              :size="get($store, 'getters.adSize')"
              pos="LMBSFT"
            />
            <vue-dfp
              :is="props.vueDfp"
              v-else
              :config="props.config"
              pos="LPCSFT"
            />
          </LazyItemWrapper>
        </ClientOnly>
        <FooterFoodTravel
          :common-data="commonData"
          :section-name="sectionName"
        />
      </div>

      <div
        v-else-if="pageStyle === 'grand-seiko-2018'"
        class="list-view"
      >
        <Header
          :active-section="sectionName"
          :dfp-header-logo-loaded="dfpHeaderLogoLoaded"
          :props="props"
          :show-dfp-header-logo="showDfpHeaderLogo"
        />
        <ListSlider
          v-if="imagesForGS.length > 0"
          :images="imagesForGS"
          class="gs"
        />
        <ArticleList
          id="articleList"
          ref="articleList"
          :articles="autoScrollArticles"
          :has-d-f-p="hasDFP"
          :curr-env="dfpMode"
        />
        <ClientOnly>
          <LazyItemWrapper
            :position="verge.viewportH()"
            :strict="true"
          >
            <div v-if="isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                :size="get($store, 'getters.adSize')"
                pos="LMBFT"
                unit-id="mirror_RWD_GS_970250-300250_FT"
              />
            </div>
            <div v-else>
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                pos="LPCFT"
                unit-id="mirror_RWD_GS_970250-300250_FT"
              />
            </div>
          </LazyItemWrapper>
        </ClientOnly>
        <ArticleList
          v-show="hasAutoScroll"
          id="articleListAutoScroll"
          ref="articleListAutoScroll"
          :articles="autoScrollArticlesLoadMore"
          :has-d-f-p="false"
        />
        <Loading :show="loading" />
        <section class="footer container">
          <Footer />
        </section>
        <Share
          right="20px"
          bottom="20px"
        />
      </div>

      <div
        v-else-if="pageStyle === 'light'"
        class="list-view"
      >
        <Header
          :active-section="sectionName"
          :dfp-header-logo-loaded="dfpHeaderLogoLoaded"
          :props="props"
          :show-dfp-header-logo="showDfpHeaderLogo"
        />
        <ClientOnly>
          <LazyItemWrapper :load-after-page-loaded="true">
            <div v-if="hasDFP && isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                :size="get($store, 'getters.adSize')"
                pos="LMBHD"
              />
            </div>
            <div v-if="hasDFP && !isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                pos="LPCHD"
              />
            </div>
          </LazyItemWrapper>
        </ClientOnly>
        <div class="list-title container">
          <a
            :href="get(section, 'website')"
            :style="{ color: sectionColor }"
            class="list-title__text"
            target="_blank"
            v-text="title"
          />
        </div>
        <ArticleListLight
          id="articleList"
          ref="articleList"
          :articles="autoScrollArticles"
          :latest="latestList"
          :show-latest="true"
          :viewport="viewportWidth"
        />
        <ArticleListLight
          v-show="hasAutoScroll"
          id="articleListAutoScroll"
          ref="articleListAutoScroll"
          :articles="autoScrollArticlesLoadMore"
          :latest="latestList"
          :viewport="viewportWidth"
        />
        <ClientOnly>
          <LazyItemWrapper
            :position="verge.viewportH()"
            :strict="true"
          >
            <div v-if="title !== 'Topic' && isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                :size="get($store, 'getters.adSize')"
                pos="LMBFT"
              />
            </div>
            <div v-if="title !== 'Topic' && !isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                pos="LPCFT"
              />
            </div>
          </LazyItemWrapper>
        </ClientOnly>
        <Loading :show="loading" />
        <section class="footer container">
          <Footer />
        </section>
        <Share
          :right="`20px`"
          :bottom="`20px`"
        />
      </div>

      <div
        v-else-if="$route.path === '/category/watchsingle'"
      >
        <Header
          :active-section="sectionName"
          :dfp-header-logo-loaded="dfpHeaderLogoLoaded"
          :props="props"
          :show-dfp-header-logo="showDfpHeaderLogo"
        />
        <ListWatch />
        <section class="footer container">
          <Footer />
        </section>
      </div>

      <div
        v-else
        class="list-view"
      >
        <Header
          :active-section="sectionName"
          :dfp-header-logo-loaded="dfpHeaderLogoLoaded"
          :props="props"
          :show-dfp-header-logo="showDfpHeaderLogo"
        />
        <ClientOnly>
          <LazyItemWrapper
            :load-after-page-loaded="true"
          >
            <div v-if="hasDFP && isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                :size="get($store, 'getters.adSize')"
                pos="LMBHD"
              />
            </div>
            <div v-if="hasDFP && !isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                pos="LPCHD"
              />
            </div>
          </LazyItemWrapper>
        </ClientOnly>
        <div
          class="list-title container"
          :style="{ color: sectionColor }"
        >
          <span
            class="list-title__text"
            v-text="title"
          />
        </div>
        <ArticleList
          id="articleList"
          ref="articleList"
          :articles="autoScrollArticles"
          :has-d-f-p="hasDFP"
          :curr-env="dfpMode"
        >
          <ClientOnly>
            <LazyItemWrapper
              slot="dfpL1"
              :position="verge.viewportH()"
              :strict="true"
            >
              <vue-dfp
                :is="props.vueDfp"
                v-if="hasDFP && isMobile"
                pos="LMBL1"
                :config="props.config"
                :size="get($store, 'getters.adSize')"
              />
            </LazyItemWrapper>
          </ClientOnly>
          <template v-for="(a, i) in get(microAds, 'listing')">
            <MicroAd
              v-if="hasDFP"
              :id="`${get(a, 'pcId')}`"
              :key="`${get(a, 'pcId')}`"
              :slot="`microAd${i}`"
              :curr-env="dfpMode"
              :curr-url="currUrl"
              class="listArticleBlock nativeDFP margin-top-0"
            />
          </template>
        </ArticleList>
        <ClientOnly>
          <LazyItemWrapper
            :position="verge.viewportH()"
            :strict="true"
          >
            <div v-if="title !== 'Topic' && !isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                pos="LPCFT"
              />
            </div>
            <div v-if="title !== 'Topic' && isMobile">
              <vue-dfp
                :is="props.vueDfp"
                :config="props.config"
                :size="get($store, 'getters.adSize')"
                pos="LMBFT"
              />
            </div>
          </LazyItemWrapper>
        </ClientOnly>
        <ArticleList
          v-show="hasAutoScroll"
          id="articleListAutoScroll"
          ref="articleListAutoScroll"
          :articles="autoScrollArticlesLoadMore"
          :has-d-f-p="false"
        />
        <Loading :show="loading" />
        <section class="footer container">
          <Footer />
        </section>
        <Share
          :right="`20px`"
          :bottom="`20px`"
        />
      </div>
      <ClientOnly>
        <LazyItemWrapper
          v-if="isMobile && !needWineWarning"
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
      </ClientOnly>
      <WineWarning v-if="needWineWarning" />
      <ClientOnly>
        <DfpCover
          v-if="isMobile && !needWineWarning"
          v-show="showDfpCoverAdFlag"
        >
          <vue-dfp
            :is="props.vueDfp"
            slot="ad-cover"
            :config="props.config"
            pos="LMBCVR"
          />
        </DfpCover>
        <DfpCover
          v-if="!needWineWarning && showDfpCoverAd2Flag && isMobile"
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
          v-if="!needWineWarning && showDfpCoverInnityFlag && isMobile"
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
      </ClientOnly>
    </template>
  </VueDfpProvider>
</template>
<script>

import {
  AUTHOR, CAMPAIGN_ID, CATEGORY, CATEGORY_INTERVIEW_ID, CATEGORY_ORALREADING_ID, EXTERNALS,
  MARKETING_ID, SECTION, SECTION_FOODTRAVEL_ID, SECTION_MAP, TAG, TAG_INTERVIEW_ID, TAG_ORALREADING_ID
  , SITE_MOBILE_URL, SITE_DESCRIPTION, SITE_OGIMAGE, SITE_TITLE, SITE_URL, DFP_ID, DFP_UNITS, DFP_OPTIONS, DFP_SIZE_MAPPING
} from 'src/constants'

import { adtracker } from 'src/util/adtracking'
import { camelize } from 'humps'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { currEnv, getTruncatedVal, unLockJS, sendAdCoverGA, updateCookie } from 'src/util/comm'
import { getRole } from 'src/util/mmABRoleAssign'
import { microAds } from 'src/constants/microAds'
import { find, get, pick, slice, split, take, toUpper, uniqBy, xorBy } from 'lodash'
import ArticleList from 'src/components/ArticleList.vue'
import ArticleListLight from 'src/components/ArticleListLight.vue'
import ClientOnly from 'vue-client-only'
import Cookie from 'vue-cookie'
import DfpCover from 'src/components/DfpCover.vue'
import DfpST from 'src/components/DfpST.vue'
import EditorChoiceFoodTravel from 'src/components/EditorChoiceFoodTravel.vue'
import Footer from 'src/components/Footer.vue'
import FooterFoodTravel from 'src/components/FooterFoodTravel.vue'
import HeaderFoodTravel from 'src/components/HeaderFoodTravel.vue'
import Header from 'src/components/Header.vue'
import HeroImageFoodTravel from 'src/components/HeroImageFoodTravel.vue'
import LatestArticleFoodTravel from 'src/components/LatestArticleFoodTravel.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import ListSlider from 'src/components/list/ListSlider.vue'
import Loading from 'src/components/Loading.vue'
import MicroAd from 'src/components/MicroAd.vue'
import MoreFull from 'src/components/MoreFull.vue'
import Share from 'src/components/Share.vue'
import WineWarning from 'src/components/WineWarning.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import verge from 'verge'
import ListWatch from 'src/components/listWatch/ContainerListing.vue'

const MAXRESULT = 12
const PAGE = 1
const debug = require('debug')('CLIENT:LIST')

const GS_CATEGORY_NAME = 'grand-seiko-2018' // dev gslecture
const GS_TAG_ID = '5bbf08301e598f1000fc8e52' // dev 5bbc2069f39162100007c8bc

const fetchCommonData = (store, route) => Promise.all([
  store.dispatch('FETCH_COMMONDATA', { endpoints: ['sectionfeatured', 'sections', 'topics'] }),
  fetchPartners(store)
]).then(() => {
  const jobs = []
  const type = toUpper(split(route.path, '/')[1])
  type === TAG && jobs.push(fetchTag(store, route.params.tagId))
  type === AUTHOR && jobs.push(fetchAuthor(store, route.params.authorId))
  type === CATEGORY && route.params.title === GS_CATEGORY_NAME && jobs.push(fetchImages(store, GS_TAG_ID))
  return jobs.length > 0 ? Promise.all(jobs) : Promise.resolve()
}).catch(err => {
  if (err.status === 404) {
    const e = new Error()
    e.massage = 'Page Not Found'
    e.code = '404'
    throw e
  } else {
    throw err
  }
})

const fetchImages = (store, uuid) => store.dispatch('FETCH_IMAGES', {
  uuid: uuid,
  type: TAG,
  params: {
    max_results: 25
  }
})

const fetchListData = (store, type, pageStyle, uuid, isLoadMore, hasPrefetch = false) => {
  const page = isLoadMore || PAGE
  switch (type) {
    case AUTHOR:
      if (!hasPrefetch) {
        return fetchAuthor(store, uuid).then(() => {
          return fetchArticlesByAuthor(store, uuid, {
            page: page,
            max_results: MAXRESULT
          })
        })
      } else {
        return fetchArticlesByAuthor(store, uuid, {
          page: page,
          max_results: MAXRESULT
        })
      }

    case CATEGORY:
      switch (uuid) {
        case CATEGORY_ORALREADING_ID:
          return fetchAudios(store, {
            page: page,
            max_results: MAXRESULT,
            sort: '-createTime',
            where: {
              tags: TAG_ORALREADING_ID
            }
          })
        case CATEGORY_INTERVIEW_ID:
          return fetchAudios(store, {
            page: page,
            max_results: MAXRESULT,
            sort: '-createTime',
            where: {
              tags: TAG_INTERVIEW_ID
            }
          })
        default:
          return fetchArticlesByUuid(store, uuid, CATEGORY, {
            page: page,
            max_results: MAXRESULT,
            where: { isAudioSiteOnly: false }
          })
      }
    case SECTION:
      switch (pageStyle) {
        case 'video':
          return fetchArticlesByUuid(store, uuid, SECTION, {
            page: page,
            max_results: MAXRESULT,
            related: 'full',
            where: { isAudioSiteOnly: false }
          })
        default:
          if (uuid === 'topic' && isLoadMore) {
            return fetchTopics(store, {
              page: page,
              max_results: MAXRESULT
            })
          }
          if (uuid !== 'topic') {
            return fetchArticlesByUuid(store, uuid, SECTION, {
              page: page,
              max_results: MAXRESULT,
              where: { isAudioSiteOnly: false }
            })
          }
          return Promise.resolve()
      }
    case TAG:
      if (!hasPrefetch) {
        return fetchTag(store, uuid).then(() => {
          return fetchArticlesByUuid(store, uuid, TAG, {
            page: page,
            max_results: MAXRESULT,
            where: { isAudioSiteOnly: false }
          })
        })
      } else {
        return fetchArticlesByUuid(store, uuid, TAG, {
          page: page,
          max_results: MAXRESULT,
          where: { isAudioSiteOnly: false }
        })
      }
    case EXTERNALS:
      if (uuid !== 'external') {
        const partner = find(get(store.state, ['commonData', 'partners', 'items']), { name: uuid })
        const partnerId = get(partner, ['id'])
        if (isLoadMore) {
          return fetchExternals(store, {
            page: page,
            max_results: MAXRESULT,
            sort: '-publishedDate',
            where: {
              partner: partnerId
            }
          })
        }
        return Promise.all([
          fetchExternals(store, {
            page: page,
            max_results: MAXRESULT,
            sort: '-publishedDate',
            where: {
              partner: partnerId
            }
          }),
          fetchLatestArticle(store)
        ])
      } else {
        if (isLoadMore) {
          return fetchExternals(store, {
            page: page,
            max_results: MAXRESULT,
            sort: '-publishedDate'
          })
        }
        return Promise.all([
          fetchExternals(store, {
            page: page,
            max_results: MAXRESULT,
            sort: '-publishedDate'
          }),
          fetchLatestArticle(store)
        ])
      }
  }
}

const fetchArticlesByAuthor = (store, uuid, params) => store.dispatch('FETCH_ARTICLES', {
  params: Object.assign({
    page: PAGE,
    max_results: MAXRESULT,
    where: {
      $or: [
        { writers: uuid },
        { photographers: uuid },
        { camera_man: uuid },
        { designers: uuid },
        { engineers: uuid }
      ]
    },
    sort: '-publishedDate'
  }, params)
})

const fetchArticlesByUuid = (store, uuid, type, params) => store.dispatch('FETCH_ARTICLES_BY_UUID', {
  uuid,
  type,
  params
})

const fetchAudios = (store, params = {}) => store.dispatch('FETCH_AUDIOS', {
  params
})

const fetchAuthor = (store, uuid) => store.dispatch('FETCH_CONTACT', {
  params: {
    where: {
      _id: uuid
    }
  }
})

const fetchEvent = (store, eventType = 'embedded') => store.dispatch('FETCH_EVENT', {
  params: {
    max_results: 1,
    where: {
      isFeatured: true,
      eventType: eventType
    }
  }
})

const fetchExternals = (store, params = {}) => store.dispatch('FETCH_EXTERNALS', {
  params
})

const fetchLatestArticle = (store) => store.dispatch('FETCH_LATESTARTICLE', {
  params: {
    sort: '-publishedDate'
  }
})

const fetchPartners = store => {
  const page = (get(store.state, 'partners.meta.page') || 0) + 1
  return store.dispatch('FETCH_PARTNERS', {
    params: {
      max_results: 25,
      page: page
    }
  }).then(() => {
    const amount = get(store.state, 'partners.items.length')
    const total = get(store.state, 'partners.meta.total')
    if (amount < total) {
      return fetchPartners(store)
    }
    return Promise.resolve()
  })
}

const fetchTag = (store, id) => store.dispatch('FETCH_TAG', {
  id
})

const fetchTopics = (store, params) => store.dispatch('FETCH_TOPICS', {
  params
})

const getUUID = (store, type, to) => {
  switch (type) {
    case AUTHOR:
      return to.params.authorId
    case CATEGORY:
      switch (to.params.title) {
        case 'campaign':
          return CAMPAIGN_ID
        case 'interview':
          return CATEGORY_INTERVIEW_ID
        case 'marketing':
          return MARKETING_ID
        case 'oralreading':
          return CATEGORY_ORALREADING_ID
        default:
          return get(find(get(store.state.commonData, ['categories']), { name: to.params.title }), ['id'])
      }
    case EXTERNALS:
      return to.params.title
    case SECTION:
      if (to.params.title === 'topic') {
        return 'topic'
      }
      return get(find(get(store.state.commonData, ['sections', 'items']), { name: to.params.title }), ['id'])
    case TAG:
      return to.params.tagId
  }
}

export default {
  name: 'AppList',
  components: {
    ArticleList,
    ArticleListLight,
    ClientOnly,
    DfpCover,
    DfpST,
    EditorChoiceFoodTravel,
    Footer,
    FooterFoodTravel,
    Header,
    HeaderFoodTravel,
    HeroImageFoodTravel,
    LazyItemWrapper,
    LatestArticleFoodTravel,
    ListSlider,
    Loading,
    MicroAd,
    MoreFull,
    Share,
    VueDfpProvider,
    WineWarning,
    ListWatch
  },
  asyncData ({ store, route }) {
    return fetchCommonData(store, route)
  },
  metaInfo () {
    const type = this.type
    const ogUrl = `${SITE_URL}${this.$route.path}`
    const relUrl = `${SITE_MOBILE_URL}${this.$route.path}`

    const getTitle = {
      SECTION: get(this.section, 'ogTitle') || get(this.section, 'title', this.title),
      default: this.title || ''
    }

    const getDescription = {
      SECTION: get(this.section, 'ogDescription') || get(this.section, 'description'),
      CATEGORY: get(find(get(this.commonData, 'categories'), { name: this.$route.params.title }), 'ogDescription'),
      default: SITE_DESCRIPTION
    }

    const getOgImage = {
      SECTION: get(this.section, 'ogImage.image.resizedTargets.desktop.url') || get(this.section, 'heroImage.image.resizedTargets.desktop.url'),
      CATEGORY: get(this.$store, 'state.ogimage.image.resizedTargets.desktop.url'),
      default: SITE_OGIMAGE
    }

    const getSectionName = {
      SECTION: this.sectionName,
      CATEGORY: this.sectionName,
      default: ''
    }

    const ogTitle = getTruncatedVal((getTitle[type] || getTitle.default), 11)
    const title = ogTitle ? `${ogTitle} - ${SITE_TITLE}` : SITE_TITLE
    const ogDescription = getTruncatedVal((getDescription[type] || getDescription.default), 197)
    const ogImage = getOgImage[type] || getOgImage.default
    const sectionName = getSectionName[type] || getSectionName.default

    if (!ogTitle && process.env.VUE_ENV === 'server') {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    }

    return {
      title,
      titleTemplate: null,
      meta: [
        { name: 'robots', content: 'index' },
        { vmid: 'description', name: 'description', content: ogDescription },
        { vmid: 'og:title', property: 'og:title', content: title },
        { vmid: 'og:description', property: 'og:description', content: ogDescription },
        { vmid: 'og:url', property: 'og:url', content: ogUrl },
        { vmid: 'og:image', property: 'og:image', content: ogImage },
        { name: 'section-name', content: sectionName },
        { vmid: 'twitter:title', name: 'twitter:title', content: title },
        { vmid: 'twitter:description', name: 'twitter:description', content: ogDescription },
        { vmid: 'twitter:image', name: 'twitter:image', content: ogImage }
      ],
      link: [
        { rel: 'alternate', href: relUrl }
      ]
    }
  },
  data () {
    return {
      DFP_ID,
      DFP_UNITS,
      abIndicator: '',
      articleListAutoScrollHeight: 0,
      canScrollLoadMord: true,
      dfpHeaderLogoLoaded: false,
      dfpMode: 'prod',
      loading: false,
      microAds,
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverInnityFlag: false,
      showDfpHeaderLogo: false,
      verge
    }
  },
  computed: {
    articles () {
      switch (this.type) {
        case AUTHOR:
          return get(this.$store, 'state.articles.items')
        case EXTERNALS:
          return uniqBy(get(this.$store, 'state.externals.items'), 'id')
        default:
          if (this.$route.params.title === 'topic') {
            return uniqBy(get(this.$store, 'state.topics.items'), 'id')
          }
          if (this.$route.params.title === 'oralreading' || this.$route.params.title === 'interview') {
            return uniqBy(get(this.$store, 'state.audios.items'), 'id')
          }
          if (this.$route.params.title === 'foodtravel') {
            return uniqBy(xorBy(get(this.$store, `state.articlesByUUID.${this.type}.${this.uuid}.items`), get(this, 'sectionfeatured'), 'slug'), 'slug')
          }
          return uniqBy(get(this.$store, `state.articlesByUUID.${this.type}.${this.uuid}.items`), 'slug')
      }
    },
    autoScrollArticles () {
      return this.uuid === SECTION_FOODTRAVEL_ID ? take(this.articles, 8) : take(this.articles, 9)
    },
    autoScrollArticlesLoadMore () {
      return this.uuid === SECTION_FOODTRAVEL_ID ? slice(this.articles, 8) : slice(this.articles, 9)
    },
    commonData () {
      return this.$store.state.commonData
    },
    currUrl () {
      return this.$route.fullPath
    },
    customCSS () {
      switch (this.type) {
        case SECTION:
          return get(find(get(this.commonData, 'sections.items'), { name: this.$route.params.title }), 'css', null)
        case TAG:
          return get(this.tag, 'css')
        default:
          return null
      }
    },
    customJS () {
      return this.type === SECTION ? get(find(get(this.commonData, 'sections.items'), { name: this.$route.params.title }), 'javascript', null) : ''
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
          debug('this.sessionId', this.sessionId, elSessionId)
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
              sendAdCoverGA('ad2')
              debug('ad2 loaded')
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
    hasAutoScroll () {
      switch (this.type) {
        case AUTHOR:
          return get(this.$store, 'state.articles.meta.page', PAGE) !== 1
        case EXTERNALS:
          return get(this.$store, 'state.externals.meta.page', PAGE) !== 1
        default:
          if (this.$route.params.title === 'topic') {
            return get(this.$store, 'state.topics.meta.total', 0) > 9
          }
          if (this.$route.params.title === 'interview' || this.$route.params.title === 'oralreading') {
            return get(this.$store, 'state.audios.meta.page', PAGE) !== 1
          }
          return get(this.$store.state, `articlesByUUID.${this.type}.${this.uuid}.meta.page`, PAGE) !== 1
      }
    },
    hasDFP () {
      return !(this.$route.params.title === 'interview' || this.$route.params.title === 'oralreading' || this.$route.params.title === 'topic')
    },
    hasMore () {
      switch (this.$route.params.title) {
        case 'interview':
        case 'oralreading':
          return get(this.articles, 'length', 0) < get(this.$store, 'state.audios.meta.total', 0)
        case 'topic':
          return get(this.articles, 'length', 0) < get(this.$store, 'state.topics.meta.total', 0)
        default:
          if (this.type === AUTHOR) {
            return get(this.articles, 'length', 0) < get(this.$store, 'state.articles.meta.total', 0)
          }
          if (this.type === EXTERNALS) {
            return get(this.articles, 'length', 0) < get(this.$store, 'state.externals.meta.total', 0)
          }
          return get(this.articles, 'length', 0) < get(this.$store, `state.articlesByUUID.${this.type}.${this.uuid}.meta.total`, 0)
      }
    },
    imagesForGS () {
      return get(this.$store, `state.images.${GS_TAG_ID}.items`) || []
    },
    isMobile () {
      return this.viewportWidth < 1200
    },
    latestList () {
      return get(this.$store, 'state.latestArticle.items') || []
    },
    needWineWarning () {
      return this.$route.params.title === 'wine'
    },
    page () {
      switch (this.type) {
        case AUTHOR:
          return get(this.$store, 'state.articles.meta.page', PAGE)
        case EXTERNALS:
          return get(this.$store, 'state.externals.meta.page', PAGE)
        default:
          if (this.$route.params.title === 'topic') {
            return get(this.$store, 'state.topics.meta.page', PAGE)
          }
          if (this.$route.params.title === 'interview' || this.$route.params.title === 'oralreading') {
            return get(this.$store, 'state.audios.meta.page', PAGE)
          }
          return get(this.$store, `state.articlesByUUID.${this.type}.${this.uuid}.meta.page`, PAGE)
      }
    },
    pageStyle () {
      switch (this.type) {
        case TAG:
          return get(this.$store.state, 'tag.style', 'feature')
        case CATEGORY:
          if (this.$route.params.title === GS_CATEGORY_NAME) {
            return this.$route.params.title
          }
          return get(find(get(this.commonData, 'sections.items'), { name: this.$route.params.title }), 'style', 'feature')
        case EXTERNALS:
          return 'light'
        default:
          return get(find(get(this.commonData, 'sections.items'), { name: this.$route.params.title }), 'style', 'feature')
      }
    },
    section () {
      return this.type === EXTERNALS
        ? find(get(this.commonData, 'partners.items'), { name: this.$route.params.title })
        : find(get(this.commonData, 'sections.items'), { name: this.$route.params.title })
    },
    sectionColor () {
      return this.type === EXTERNALS
        ? get(SECTION_MAP, 'external.bgcolor', '#bcbcbc')
        : get(SECTION_MAP, `${this.sectionId}.bgcolor`, '#bcbcbc')
    },
    sectionfeatured () {
      return this.pageStyle === 'video'
        ? take(get(pick(get(this.$store.state.commonData, 'sectionfeatured.items'), this.camelize(this.sectionName)), this.camelize(this.sectionName)), 5)
        : take(get(pick(get(this.$store.state.commonData, 'sectionfeatured.items'), this.camelize(this.sectionName)), this.camelize(this.sectionName)), 3)
    },
    sectionId () {
      let _sectionId
      switch (this.type) {
        case CATEGORY:
          _sectionId = get(find(get(this.commonData, 'sections.items'), (s) => {
            return find(s.categories, { id: this.uuid })
          }), 'id')
          break
        case SECTION:
          _sectionId = get(find(get(this.commonData, 'sections.items'), { name: this.$route.params.title }), 'id')
          break
        default:
          _sectionId = 'other'
      }
      return DFP_UNITS[_sectionId] ? _sectionId : 'other'
    },
    sectionName () {
      switch (this.type) {
        case CATEGORY:
          return get(find(get(this.commonData, 'sections.items'), (s) => {
            return find(s.categories, { id: this.uuid })
          }), 'name', 'other')
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'other'
          } else {
            return this.$route.params.title
          }
        case TAG:
          return get(this.$store.state, 'tag.sections.0.name', 'other')
        default:
          return 'other'
      }
    },
    tag () {
      return get(this.$store, 'state.tag')
    },
    title () {
      switch (this.type) {
        case AUTHOR:
          return get(this.$store.state, 'contact.items.0.name')
        case CATEGORY:
          switch (this.$route.params.title) {
            case 'marketing':
              return '企劃特輯'
            case 'campaign':
              return '活動專區'
            default:
              return get(find(get(this.commonData, 'categories'), { name: this.$route.params.title }), 'title')
          }
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'Topic'
          } else {
            return get(find(get(this.commonData, 'sections.items'), { name: this.$route.params.title }), 'title')
          }
        case TAG:
          return get(this.$store.state, 'tag.name')
        case EXTERNALS:
          if (this.$route.params.title === 'external') {
            return '校園'
          }
          return get(this.section, 'display')
        default:
          return ''
      }
    },
    type () {
      return toUpper(split(this.$store.state.route.path, '/')[1])
    },
    uuid () {
      switch (this.type) {
        case AUTHOR:
          return this.$route.params.authorId
        case CATEGORY:
          switch (this.$route.params.title) {
            case 'marketing':
              return MARKETING_ID
            case 'campaign':
              return CAMPAIGN_ID
            default:
              return get(find(get(this.commonData, 'categories'), { name: this.$route.params.title }), 'id')
          }
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'topic'
          } else {
            return get(find(get(this.commonData, 'sections.items'), { name: this.$route.params.title }), 'id')
          }
        case TAG:
          return this.$route.params.tagId
        default:
          return this.$route.params.title
      }
    },
    viewportWidth () {
      return get(this.$store, 'state.viewport.width') || 0
    }
  },
  watch: {
    // abIndicator: function () {
    //   this.$forceUpdate()
    // },
    articleListAutoScrollHeight: function () {
      if (this.uuid === SECTION_FOODTRAVEL_ID && this.page >= 2) {
        this.canScrollLoadMord = false
      } else {
        this.canScrollLoadMord = true
      }
      // this.canScrollLoadMord = true
    },
    customCSS: function () {
      this.updateCustomizedMarkup()
    },
    uuid: function () {
      this.articleListAutoScrollHeight = 0
      if (process.env.VUE_ENV === 'client') {
        if (this.sectionName === 'other') {
          window.ga('set', 'contentGroup1', '')
        } else {
          window.ga('set', 'contentGroup1', this.sectionName)
        }
        window.ga('send', 'pageview', { title: `${this.title} - ${SITE_TITLE}`, location: document.location.href })
      }
    }
  },
  beforeMount () {
    // only fetch at first time after preFetch
    fetchListData(this.$store, this.type, this.pageStyle, this.uuid, false, false)
    fetchEvent(this.$store, 'logo')
    // this.abIndicator = this.getMmid()
  },
  mounted () {
    unLockJS()
    this.updateSysStage()
    this.insertCustomizedMarkup()
    window.addEventListener('scroll', this.scrollHandler)
    if (this.type === EXTERNALS) {
      window.ga('set', 'contentGroup1', 'external')
      window.ga('set', 'contentGroup2', this.uuid)
    } else if (this.sectionName === 'other') {
      window.ga('set', 'contentGroup1', '')
      window.ga('set', 'contentGroup2', '')
    } else {
      window.ga('set', 'contentGroup1', this.sectionName)
      window.ga('set', 'contentGroup2', '')
    }
    window.ga('set', 'contentGroup3', '')
    // window.ga('set', 'contentGroup3', `list${this.abIndicator}`)
    window.ga('send', 'pageview', { title: `${this.title} - ${SITE_TITLE}`, location: document.location.href })
  },
  updated () {
    this.updateSysStage()
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    currentYPosition,
    camelize,
    elmYPosition,
    get,
    getMmid () {
      const mmid = Cookie.get('mmid')
      let assisgnedRole = get(this.$route, ['query', 'ab'])
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
    insertCustomizedMarkup () {
      const custCss = document.createElement('style')
      const custScript = document.createElement('script')
      custCss.setAttribute('id', 'custCSS')
      custScript.setAttribute('id', 'custJS')
      if (this.customCSS) {
        custCss.appendChild(document.createTextNode(this.customCSS))
      }
      if (this.customJS) {
        custScript.appendChild(document.createTextNode(this.customJS))
      }
      if (!document.getElementById('custCSS') || !document.getElementById('custJS')) {
        document.querySelector('body').appendChild(custCss)
        document.querySelector('body').appendChild(custScript)
      } else {
        document.querySelector('#custCSS').innerHTML = this.customCSS
        document.querySelector('#custJS').innerHTML = this.customJS
      }
    },
    loadMore () {
      let currentPage = this.page
      currentPage += 1
      this.loading = true
      return fetchListData(this.$store, this.type, this.pageStyle, this.uuid, currentPage, false)
        .then(() => {
          this.loading = false
        })
    },
    scrollHandler () {
      if (this.$refs.articleList) {
        const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        const currentBottom = this.currentYPosition() + vh
        const articleListBottom = this.elmYPosition('#articleList') + this.$refs.articleList.$el.offsetHeight
        this.articleListAutoScrollHeight = this.$refs.articleListAutoScroll.$el.offsetHeight
        const articleListAutoScrollBottom = this.elmYPosition('#articleListAutoScroll') + this.articleListAutoScrollHeight

        if (currentBottom > (articleListBottom - 300) && this.canScrollLoadMord && (this.page === 1) && this.hasMore) {
          this.canScrollLoadMord = false
          this.loadMore()
        }
        if (currentBottom > (articleListAutoScrollBottom - 300) && this.canScrollLoadMord && (this.page > 1) && this.hasMore) {
          this.canScrollLoadMord = false
          this.loadMore()
        }
      }
    },
    updateCustomizedMarkup () {
      if (process.env.VUE_ENV === 'client') {
        const custCss = document.querySelector('#custCSS')
        const custScript = document.querySelector('#custJS')
        custCss.innerHTML = ''
        custScript.innerHTML = ''
        if (this.customCSS) {
          custCss.innerHTML = this.customCSS
        }
        if (this.customJS) {
          custScript.innerHTML = this.customJS
        }
      }
    },
    updateSysStage () {
      this.dfpMode = currEnv()
    }
  },
  beforeRouteUpdate (to, from, next) {
    const type = toUpper(split(to.path, '/')[1])
    const pageStyle = get(find(get(this.$store, 'state.commonData.sections.items'), { name: to.params.title }), 'style', 'feature')
    fetchListData(this.$store, type, pageStyle, getUUID(this.$store, type, to), false, false)
      .then(() => next())
  },
  beforeRouteLeave (to, from, next) {
    if (process.env.VUE_ENV === 'client') {
      const custCss = document.querySelector('#custCSS')
      const custScript = document.querySelector('#custJS')
      custCss.innerHTML = ''
      custScript.innerHTML = ''
    }
    next()
  }
}

</script>
<style lang="stylus" scoped>

.list
  &-view
    background-color #f2f2f2
  &-title
    &.container
      position relative
      justify-content flex-start
      align-items center
      flex-direction row
      margin-top .5em
      padding 0 2em

    &__text
      font-size 1.5rem

.listFull
  &-view
    background-color #f5f5f5

.foodtravel-redesign
  background-image url("/assets/mirrormedia/foodtravelbg.jpg")

@media (min-width: 600px)
  .list
    &-title
      &.container
        padding-left 0

@media (min-width: 1200px)
  .listFull
    &-dfp
      width 970px
      &.dfp-FT
        height 90px

.footer
  &.container
    flex-direction column
    align-items stretch
</style>
