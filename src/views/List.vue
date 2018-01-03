<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId" :options="dfpOptions" :mode="dfpMode">
    <template slot-scope="props" slot="dfpPos">
      <div class="foodtravel-redesign" v-if="pageStyle === 'video'">
        <section>
          <header-foodtravel :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' />
        </section>
        <heroImage-foodtravel :commonData='commonData' :sectionName='sectionName'/>
        <editor-foodtravel :sectionfeatured='sectionfeatured' :viewport="viewport"></editor-foodtravel>
        <!--<featuredStory-foodtravel :sectionfeatured='sectionfeatured' :viewport="viewport"/>-->
        <latestArticle-foodtravel :articles='autoScrollArticles' :commonData='commonData' :props="props" v-if="type === 'SECTION'" ref="articleList" id="articleList" :showLatestOnly="false"/>
        <latestArticle-foodtravel :articles='autoScrollArticlesLoadMore' :commonData='commonData' :props="props" v-if="type === 'SECTION'" v-show="hasAutoScroll" ref="articleListAutoScroll" id="articleListAutoScroll" :showLatestOnly="true"/>
        <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" :className="'moreFoodTravel'" />
        <loading :show="loading" />
        <vue-dfp :is="props.vueDfp" pos="LPCSFT" extClass="desktop-only" :config="props.config" />
        <vue-dfp :is="props.vueDfp" pos="LMBSFT" extClass="mobile-only" :config="props.config" />
        <footer-foodtravel :commonData='commonData' :sectionName='sectionName' />
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
      </div>

      <div class="listFull-view" v-else-if="pageStyle === 'full'">
        <!--div v-if="!isMobile"><vue-dfp :is="props.vueDfp" pos="SPCHD" :config="props.config" /></div-->
        <!--div v-if="isMobile"><vue-dfp :is="props.vueDfp" pos="SMBHD" :config="props.config" /></div-->
        <header-full :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' />
        <article-leading :articles='articles' :isMobile="isMobile" :props="props" v-if="type === 'SECTION'"/>
        <editorChoice-full :sectionfeatured='sectionfeatured' v-if="type === 'SECTION'"/>
        <latestArticle-full :articles='articles' :isMobile="isMobile" :props="props" v-if="type === 'SECTION'" />
        <leading-watch v-if="type == 'TAG'" :tag='tag' :type='type'/>
        <article-list-full :articles='articles' v-if="type === 'TAG'" />
        <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" />
        <loading :show="loading" />
        <div v-if="!isMobile"><vue-dfp :is="props.vueDfp" pos="SPCFT" :config="props.config" /></div>
        <div v-if="isMobile" :style="{ width: '100%' }"><vue-dfp :is="props.vueDfp" pos="SMBFT" :config="props.config" /></div>
        <footer-full :commonData='commonData' :sectionName='sectionName' />
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
      </div>
      <div class="list-view" v-else-if="pageStyle === 'watch101'">
        <watch101-list :viewport="viewport">
          <header-full :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' :showLogo="false" class="watch101" slot="header"/>
          <footer-full :commonData='commonData' :sectionName='sectionName' slot="footer" />
          <vue-dfp v-if="!isMobile" :is="props.vueDfp" pos="PCHD" :config="props.config" slot="ad-hd"/>
          <vue-dfp v-if="isMobile" :is="props.vueDfp" pos="MBHD" :config="props.config" slot="ad-hd" />
          <vue-dfp :is="props.vueDfp" pos="NA1" :config="props.config" slot="ad-na1" />
        </watch101-list>
      </div>

      <div class="list-view" v-else-if="pageStyle === 'light'">
        <app-header :commonData= 'commonData' :eventLogo="eventLogo" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" :props="props"/>
        <div><vue-dfp v-if="hasDFP && !isMobile" :is="props.vueDfp" pos="LPCHD" :config="props.config" /></div>
        <div><vue-dfp v-if="hasDFP && isMobile" :is="props.vueDfp" pos="LMBHD" :config="props.config" /></div>
        <div class="list-title container" :style="{ color: sectionColor }">
          <span class="list-title__text" v-text="title"></span>
        </div>
        <article-list-light id="articleList" ref="articleList" :articles="autoScrollArticles" :latest="latestList" :showLatest="true" :viewport="viewport"></article-list-light>
        <article-list-light v-show="hasAutoScroll" id="articleListAutoScroll" ref="articleListAutoScroll" :articles="autoScrollArticlesLoadMore" :latest="latestList" :viewport="viewport"></article-list-light>
        <div><vue-dfp v-if="title !== 'Topic' && !isMobile" :is="props.vueDfp" pos="LPCFT" :config="props.config" /></div>
        <div><vue-dfp v-if="title !== 'Topic' && isMobile" :is="props.vueDfp" pos="LMBFT" :config="props.config" /></div>
        <loading :show="loading" />
        <section class="footer container">
          <app-footer />
        </section>
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
        <share :right="`20px`" :bottom="`20px`" />
      </div>

      <div class="list-view" v-else>
        <app-header :commonData= 'commonData' :eventLogo="eventLogo" :showDfpHeaderLogo="showDfpHeaderLogo" :viewport="viewport" :props="props"/>
        <div><vue-dfp v-if="hasDFP && !isMobile" :is="props.vueDfp" pos="LPCHD" :config="props.config" /></div>
        <div><vue-dfp v-if="hasDFP && isMobile" :is="props.vueDfp" pos="LMBHD" :config="props.config" /></div>
        <!--<list-choice v-if="type === `SECTION` && sectionfeatured && title !== 'Topic' && title !== '影音'" :abIndicator="abIndicator" :initialSection="section" :initialSectionfeatured="sectionfeatured" :viewport="viewport" />-->
        <div class="list-title container" :style="{ color: sectionColor }">
          <span class="list-title__text" v-text="title"></span>
        </div>
        <article-list ref="articleList" id="articleList" :articles='autoScrollArticles' :hasDFP='hasDFP' :currEnv = "dfpMode">
          <vue-dfp v-if="hasDFP && isMobile" :is="props.vueDfp" pos="LMBL1" slot="dfpL1" :config="props.config" />
          <micro-ad v-for="(a, i) in getValue(microAds, [ 'listing' ])" :currEnv="dfpMode" :currUrl="currUrl"
                  :id="`${getValue(a, [ 'pcId' ])}`" :key="`${getValue(a, [ 'pcId' ])}`"
                  class="listArticleBlock nativeDFP margin-top-0" v-if="hasDFP" :slot="`microAd${i}`"></micro-ad>
        </article-list>
        <div><vue-dfp v-if="title !== 'Topic' && !isMobile" :is="props.vueDfp" pos="LPCFT" :config="props.config" /></div>
        <div><vue-dfp v-if="title !== 'Topic' && isMobile" :is="props.vueDfp" pos="LMBFT" :config="props.config" /></div>
        <article-list ref="articleListAutoScroll" id="articleListAutoScroll" :articles='autoScrollArticlesLoadMore' :hasDFP='false'
          v-show="hasAutoScroll"/>
        <loading :show="loading" />
        <section class="footer container">
          <app-footer />
        </section>
        <live-stream :mediaData="eventEmbedded" v-if="hasEventEmbedded" />
        <share :right="`20px`" :bottom="`20px`" />
      </div>

      <DfpCover v-show="showDfpCoverAdFlag && viewport < 1199">
        <vue-dfp :is="props.vueDfp" pos="LMBCVR" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" />
      </DfpCover>
      <DfpCover v-if="showDfpCoverAd2Flag && viewport < 1199" :showCloseBtn="false" class="raw">
        <vue-dfp :is="props.vueDfp" pos="LMBCVR2" v-if="(viewport < 550)" :config="props.config" slot="ad-cover" />
      </DfpCover>
      <div class="dfp-cover vpon" v-if="showDfpCoverAdVponFlag && (viewport < 550)" v-html="vponHtml()"></div>
    </template>
  </vue-dfp-provider>
</template>
<script>

import { AUTHOR, CAMPAIGN_ID, CATEGORY, CATEGORY＿INTERVIEW_ID, CATEGORY＿ORALREADING_ID, EXTERNALS, FB_APP_ID,
  FB_PAGE_ID, MARKETING_ID, SECTION, SECTION_FOODTRAVEL_ID, SECTION_MAP, SITE_DESCRIPTION, SITE_KEYWORDS,
  SITE_OGIMAGE, SITE_TITLE, SITE_URL, TAG, TAG_INTERVIEW_ID, TAG_ORALREADING_ID, VIDEOHUB_ID } from '../constants'
import { DFP_ID, DFP_UNITS, DFP_OPTIONS } from '../constants'
import { camelize } from 'humps'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import { consoleLogOnDev, currEnv, getTruncatedVal, getValue, unLockJS, insertVponAdSDK, sendAdCoverGA, updateCookie, vponHtml } from '../util/comm'
import { getRole } from '../util/mmABRoleAssign'
import { microAds } from '../constants/microAds'
import _ from 'lodash'
import ArticleLeading from '../components/ArticleLeading.vue'
import ArticleList from '../components/ArticleList.vue'
import ArticleListFull from '../components/ArticleListFull.vue'
import ArticleListLight from '../components/ArticleListLight.vue'
import AudioList from '../components/AudioList.vue'
import Cookie from 'vue-cookie'
import DfpCover from '../components/DfpCover.vue'
import EditorChoiceFull from '../components/EditorChoiceFull.vue'
import EditorChoiceFoodTravel from '../components/EditorChoiceFoodTravel.vue'
import FeaturedStoryFoodTravel from '../components/FeaturedStoryFoodTravel.vue'
import Footer from '../components/Footer.vue'
import FooterFull from '../components/FooterFull.vue'
import FooterFoodTravel from '../components/FooterFoodTravel.vue'
import Header from '../components/Header.vue'
import HeaderFull from '../components/HeaderFull.vue'
import HeaderFoodTravel from '../components/HeaderFoodTravel.vue'
import HeroImageFoodTravel from '../components/HeroImageFoodTravel.vue'
import LatestArticleFull from '../components/LatestArticleFull.vue'
import LatestArticleFoodTravel from '../components/LatestArticleFoodTravel.vue'
import Leading from '../components/Leading.vue'
import LeadingWatch from '../components/LeadingWatch.vue'
import ListChoice from '../components/ListChoice.vue'
import LiveStream from '../components/LiveStream.vue'
import Loading from '../components/Loading.vue'
import MicroAd from '../components/MicroAd.vue'
import More from '../components/More.vue'
import MoreFull from '../components/MoreFull.vue'
import Share from '../components/Share.vue'
import VideoList from '../components/VideoList.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import Watch101 from '../components/watch101/Watch101.vue'
import moment from 'moment'
import titleMetaMixin from '../util/mixinTitleMeta'

const MAXRESULT = 12
const PAGE = 1

const fetchCommonData = (store) => {
  return Promise.all([
    store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] }),
    fetchPartners(store)
  ]).then(() => {
    if (_.toUpper(_.split(store.state.route.path, '/')[1]) === TAG) {
      return fetchTag(store, store.state.route.params.tagId)
    }
    if (_.toUpper(_.split(store.state.route.path, '/')[1]) === AUTHOR) {
      return fetchAuthor(store, store.state.route.params.authorId)
    }
    if (_.toUpper(_.split(store.state.route.path, '/')[1]) === CATEGORY) {
      return fetchCategoryOgImages(store, _.get(store, [ 'state', 'commonData', 'categories', _.split(store.state.route.path, '/')[2], 'ogImage' ], ''))
    }
  })
}

const fetchCategoryOgImages = (store, uuid) => {
  return store.dispatch('FETCH_IMAGE', {
    'uuid': uuid,
    'params': {
      max_results: 1
    },
    'type': 'OG'
  })
}

const fetchListData = (store, type, pageStyle, uuid, isLoadMore, hasPrefetch = false, pageToken = '') => {
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
        case CATEGORY＿ORALREADING_ID:
          return fetchAudios(store, {
            page: page,
            max_results: MAXRESULT,
            sort: '-createTime',
            where: {
              tags: TAG_ORALREADING_ID
            }
          })
        case CATEGORY＿INTERVIEW_ID:
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
            max_results: MAXRESULT
          })
      }
    case SECTION:
      switch (pageStyle) {
        case 'full':
        case 'video':
          return fetchArticlesByUuid(store, uuid, SECTION, {
            page: page,
            max_results: MAXRESULT,
            related: 'full'
          })
        default:
          if (uuid === VIDEOHUB_ID) {
            return fetchYoutubePlaylist(store, MAXRESULT, pageToken)
          }
          if (uuid === 'topic' && isLoadMore) {
            return fetchTopics(store, {
              page: page,
              max_results: MAXRESULT
            })
          }
          if (uuid !== 'topic') {
            return fetchArticlesByUuid(store, uuid, SECTION, {
              page: page,
              max_results: MAXRESULT
            })
          }
          return Promise.resolve()
      }
    case TAG:
      if (!hasPrefetch) {
        return fetchTag(store, uuid).then(() => {
          return fetchArticlesByUuid(store, uuid, TAG, {
            page: page,
            max_results: MAXRESULT
          })
        })
      } else {
        return fetchArticlesByUuid(store, uuid, TAG, {
          page: page,
          max_results: MAXRESULT
        })
      }
    case EXTERNALS:
      if (uuid !== 'external') {
        const partner = _.find(_.get(store.state, [ 'commonData', 'partners', 'items' ]), { 'name': uuid })
        const partnerId = _.get(partner, [ 'id' ])
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

const fetchArticlesByAuthor = (store, uuid, params) => {
  return store.dispatch('FETCH_ARTICLES', {
    params: Object.assign({
      page: PAGE,
      max_results: MAXRESULT,
      where: {
        '$or': [
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
}

const fetchArticlesByUuid = (store, uuid, type, params) => {
  return store.dispatch('FETCH_ARTICLES_BY_UUID', {
    'uuid': uuid,
    'type': type,
    'params': params
  })
}

const fetchAudios = (store, params = {}) => {
  return store.dispatch('FETCH_AUDIOS', {
    'params': params
  })
}

const fetchAuthor = (store, uuid) => {
  return store.dispatch('FETCH_CONTACT', {
    params: {
      where: {
        _id: uuid
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

const fetchExternals = (store, params = {}) => {
  return store.dispatch('FETCH_EXTERNALS', {
    'params': params
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

const fetchTag = (store, id) => {
  return store.dispatch('FETCH_TAG', {
    'id': id
  })
}

const fetchTopics = (store, params) => {
  return store.dispatch('FETCH_TOPICS', {
    'params': params
  })
}

const fetchYoutubePlaylist = (store, limit, pageToken = '') => {
  return store.dispatch('FETCH_YOUTUBE_PLAY_LIST', {
    'limit': limit,
    'pageToken': pageToken
  })
}

const getUUID = (store, type, to) => {
  switch (type) {
    case AUTHOR:
      return to.params.authorId
    case CATEGORY:
      switch (to.params.title) {
        case 'campaign':
          return CAMPAIGN_ID
        case 'interview':
          return CATEGORY＿INTERVIEW_ID
        case 'marketing':
          return MARKETING_ID
        case 'oralreading':
          return CATEGORY＿ORALREADING_ID
        case 'videohub':
          return VIDEOHUB_ID
        default:
          return _.get(_.find(_.get(store.state.commonData, [ 'categories' ]), { 'name': to.params.title }), [ 'id' ])
      }
    case EXTERNALS:
      return to.params.name
    case SECTION:
      if (to.params.title === 'topic') {
        return 'topic'
      }
      return _.get(_.find(_.get(store.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'id' ])
    case TAG:
      return to.params.tagId
  }
}

export default {
  name: 'list-view',
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-leading': ArticleLeading,
    'article-list': ArticleList,
    'article-list-full': ArticleListFull,
    'article-list-light': ArticleListLight,
    'audio-list': AudioList,
    'editor-foodtravel': EditorChoiceFoodTravel,
    'editorChoice-full': EditorChoiceFull,
    'featuredStory-foodtravel': FeaturedStoryFoodTravel,
    'footer-full': FooterFull,
    'footer-foodtravel': FooterFoodTravel,
    'header-full': HeaderFull,
    'header-foodtravel': HeaderFoodTravel,
    'heroImage-foodtravel': HeroImageFoodTravel,
    'latestArticle-full': LatestArticleFull,
    'latestArticle-foodtravel': LatestArticleFoodTravel,
    'leading': Leading,
    'leading-watch': LeadingWatch,
    'list-choice': ListChoice,
    'live-stream': LiveStream,
    'loading': Loading,
    'micro-ad': MicroAd,
    'more': More,
    'more-full': MoreFull,
    'share': Share,
    'video-list': VideoList,
    'vue-dfp-provider': VueDfpProvider,
    'watch101-list': Watch101,
    DfpCover
  },
  asyncData ({ store }) {
    return fetchCommonData(store)
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    const type = this.type
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`
    let ogImage
    let ogTitle
    let ogDescription
    let sectionName
    switch (type) {
      case SECTION:
        sectionName = this.sectionName
        const imageURL = _.get(this.section, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ], null) ? _.get(this.section, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) : _.get(this.section, [ 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ], null)
        ogImage = imageURL || SITE_OGIMAGE
        ogTitle = _.get(this.section, [ 'ogTitle' ]) ? this.getTruncatedVal(_.get(this.section, [ 'ogTitle' ]), 11) : this.getTruncatedVal(_.get(this.section, [ 'title' ], this.title), 11)
        ogDescription = _.get(this.section, [ 'ogDescription' ], null) ? this.getTruncatedVal(_.get(this.section, [ 'ogDescription' ]), 197) : _.get(this.section, [ 'description' ])
        ogDescription !== '' ? this.getTruncatedVal(ogDescription, 197) : SITE_DESCRIPTION
        break
      case CATEGORY:
        sectionName = this.sectionName
        ogTitle = this.getTruncatedVal(this.title, 11)
        const ogDesc = _.get(_.find(_.get(this.commonData, [ 'categories' ]), { 'name': this.$route.params.title }), [ 'ogDescription' ])
        const ogImg = _.get(this.$store, [ 'state', 'ogimage', 'image', 'resizedTargets', 'desktop', 'url' ])
        ogImage = ogImg || SITE_OGIMAGE
        ogDescription = ogDesc || SITE_DESCRIPTION
        break
      case EXTERNALS:
        sectionName = ''
        ogTitle = this.getTruncatedVal(this.title, 11)
        ogImage = SITE_OGIMAGE
        ogDescription = SITE_DESCRIPTION
        break
      default:
        ogTitle = this.getTruncatedVal(this.title, 11) || ''
        ogImage = SITE_OGIMAGE
        ogDescription = SITE_DESCRIPTION
    }

    // if (!ogTitle && process.env.VUE_ENV === 'server' && type !== AUTHOR) {
    //   const e = new Error()
    //   e.massage = 'Page Not Found'
    //   e.code = '404'
    //   throw e
    // }

    const title = ogTitle === '' ? SITE_TITLE : ogTitle + ` - ${SITE_TITLE}`
    this.titleBase = title
    return {
      url: ogUrl,
      title: title,
      meta: `
        <meta name="mm-opt" content="">
        <meta name="robots" content="index">
        <meta name="keywords" content="${SITE_KEYWORDS}">
        <meta name="description" content="${ogDescription}">
        <meta name="section-name" content="${sectionName}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${ogDescription}">
        <meta name="twitter:image" content="${ogImage}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="${SITE_TITLE}">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${ogDescription}">
        <meta property="og:url" content="${ogUrl}">
        <meta property="og:image" content="${ogImage}">
      `
    }
  },
  data () {
    return {
      abIndicator: 'A',
      articleListAutoScrollHeight: 0,
      canScrollLoadMord: true,
      dfpid: DFP_ID,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      isVponSDKLoaded: false,
      loading: false,
      microAds,
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverAdVponFlag: false,
      showDfpHeaderLogo: false,
      viewport: undefined
    }
  },
  computed: {
    articles () {
      switch (this.type) {
        case AUTHOR:
          return _.get(this.$store.state, [ 'articles', 'items' ])
        case EXTERNALS:
          return _.uniqBy(_.get(this.$store.state, [ 'externals', 'items' ]), 'id')
        default:
          if (this.$route.params.title === 'topic') {
            return _.uniqBy(_.get(this.$store.state, [ 'topics', 'items' ]), 'id')
          }
          if (this.$route.params.title === 'oralreading' || this.$route.params.title === 'interview') {
            return _.uniqBy(_.get(this.$store.state, [ 'audios', 'items' ]), 'id')
          }
          if (this.$route.params.title === 'videohub') {
            return _.uniqBy(_.get(this.$store.state, [ 'playlist', 'items' ]), 'id')
          }
          if (this.$route.params.title === 'foodtravel') {
            return _.uniqBy(_.xorBy(_.get(this.$store.state, [ 'articlesByUUID', this.type, this.uuid, 'items' ]), _.get(this, [ 'sectionfeatured' ]), 'slug'), 'slug')
          }
          return _.uniqBy(_.get(this.$store.state, [ 'articlesByUUID', this.type, this.uuid, 'items' ]), 'slug')
      }
    },
    audios () {
      return this.$store.state.audios
    },
    autoScrollArticles () {
      if (this.uuid === SECTION_FOODTRAVEL_ID) {
        return _.take(this.articles, 8)
      }
      return _.take(this.articles, 9)
    },
    autoScrollArticlesLoadMore () {
      if (this.uuid === SECTION_FOODTRAVEL_ID) {
        return _.slice(this.articles, 8)
      }
      return _.slice(this.articles, 9)
    },
    categoryName () {
      if (this.type === CATEGORY) {
        return _.get(this.$route, [ 'params', 'title' ])
      }
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
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'css' ], null)
        case TAG:
          return _.get(this.tag, [ 'css' ])
        default:
          return null
      }
    },
    customJS () {
      switch (this.type) {
        case SECTION:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'javascript' ], null)
        default:
          return null
      }
    },
    dfpOptions () {
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded: (event) => {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')

          const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
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
              sendAdCoverGA('ad2')
              consoleLogOnDev({ msg: 'ad2 loaded' })
              if (adDisplayStatus === 'none') {
                consoleLogOnDev({ msg: 'dfp response no ad2' })
              }
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
        setCentering: true
      })
    },
    eventEmbedded () {
      return _.get(this.$store.state.eventEmbedded, [ 'items', '0' ])
    },
    eventLogo () {
      return _.get(this.$store.state.eventLogo, [ 'items', '0' ])
    },
    hasAutoScroll () {
      switch (this.type) {
        case AUTHOR:
          return _.get(this.$store.state, [ 'articles', 'meta', 'page' ], PAGE) !== 1
        case EXTERNALS:
          return _.get(this.$store.state, [ 'externals', 'meta', 'page' ], PAGE) !== 1
        default:
          if (this.$route.params.title === 'topic') {
            return _.get(this.$store.state, [ 'topics', 'meta', 'total' ], 0) > 9
          }
          if (this.$route.params.title === 'interview' || this.$route.params.title === 'oralreading') {
            return _.get(this.$store.state, [ 'audios', 'meta', 'page' ], PAGE) !== 1
          }
          if (this.$route.params.title === 'videohub') {
            return _.get(this.$store.state, [ 'playlist', 'items', 'length' ], 0) > MAXRESULT
          }
          return _.get(this.$store.state, [ 'articlesByUUID', this.type, this.uuid, 'meta', 'page' ], PAGE) !== 1
      }
    },
    hasDFP () {
      return !(this.$route.params.title === 'interview' || this.$route.params.title === 'oralreading' || this.$route.params.title === 'topic' || this.$route.params.title === 'videohub')
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
    hasMore () {
      switch (this.$route.params.title) {
        case 'interview':
        case 'oralreading':
          return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'audios', 'meta', 'total' ], 0)
        case 'videohub':
          return _.get(this.playlist, [ 'length' ], 0) < _.get(this.$store.state, [ 'playlist', 'pageInfo', 'totalResults' ], 0)
        case 'topic':
          return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'topics', 'meta', 'total' ], 0)
        default:
          if (this.type === AUTHOR) {
            return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'articles', 'meta', 'total' ], 0)
          }
          if (this.type === EXTERNALS) {
            return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'externals', 'meta', 'total' ], 0)
          }
          return _.get(this.articles, [ 'length' ], 0) < _.get(this.$store.state, [ 'articlesByUUID', this.type, this.uuid, 'meta', 'total' ], 0)
      }
    },
    isMobile () {
      return this.viewport < 1200
    },
    latestList () {
      return _.get(this.$store.state.latestArticle, [ 'items' ], [])
    },
    page () {
      switch (this.type) {
        case AUTHOR:
          return _.get(this.$store.state, [ 'articles', 'meta', 'page' ], PAGE)
        case EXTERNALS:
          return _.get(this.$store.state, [ 'externals', 'meta', 'page' ], PAGE)
        default:
          if (this.$route.params.title === 'topic') {
            return _.get(this.$store.state, [ 'topics', 'meta', 'page' ], PAGE)
          }
          if (this.$route.params.title === 'interview' || this.$route.params.title === 'oralreading') {
            return _.get(this.$store.state, [ 'audios', 'meta', 'page' ], PAGE)
          }
          if (this.$route.params.title === 'videohub') {
            return Math.floor(_.get(this.$store.state, [ 'playlist', 'items', 'length' ], 0) / MAXRESULT)
          }
          return _.get(this.$store.state, [ 'articlesByUUID', this.type, this.uuid, 'meta', 'page' ], PAGE)
      }
    },
    pageStyle () {
      switch (this.type) {
        case TAG:
          return _.get(this.$store.state, [ 'tag', 'style' ], 'feature')
        case CATEGORY:
          return this.$route.params.title !== 'watch101' ? _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'style' ], 'feature') : 'watch101'
        case EXTERNALS:
          return 'light'
        default:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'style' ], 'feature')
      }
    },
    playlist () {
      return _.get(this.$store.state, [ 'playlist' ])
    },
    section () {
      switch (this.type) {
        case EXTERNALS:
          return _.find(_.get(this.commonData, [ 'partners', 'items' ]), { 'name': this.$route.params.name })
        default:
          return _.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title })
      }
    },
    sectionColor () {
      return _.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#bcbcbc')
    },
    sectionfeatured () {
      switch (this.pageStyle) {
        case 'video':
          return _.take(_.get(_.pick(_.get(this.$store.state.commonData, [ 'sectionfeatured', 'items' ]), this.camelize(this.sectionName)), [ this.camelize(this.sectionName) ]), 5)
        default:
          return _.take(_.get(_.pick(_.get(this.$store.state.commonData, [ 'sectionfeatured', 'items' ]), this.camelize(this.sectionName)), [ this.camelize(this.sectionName) ]), 3)
      }
    },
    sectionId () {
      let _sectionId
      switch (this.type) {
        case CATEGORY:
          if (this.$route.params.title !== 'watch101') {
            _sectionId = _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), (s) => {
              return _.find(s.categories, { 'id': this.uuid })
            }), [ 'id' ])
          } else {
            _sectionId = 'watch101'
          }
          break
        case SECTION:
          _sectionId = _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'id' ])
          break
        default:
          _sectionId = 'other'
      }
      return this.dfpUnits[ _sectionId ] ? _sectionId : 'other'
    },
    sectionName () {
      switch (this.type) {
        case CATEGORY:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), (s) => {
            return _.find(s.categories, { 'id': this.uuid })
          }), [ 'name' ], 'other')
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'other'
          } else {
            return this.$route.params.title
          }
        case TAG:
          return _.get(this.$store.state, [ 'tag', 'sections', '0', 'name' ], 'other')
        default:
          return 'other'
      }
    },
    tag () {
      return _.get(this.$store.state, [ 'tag' ])
    },
    title () {
      switch (this.type) {
        case AUTHOR:
          return _.get(this.$store.state, [ 'contact', 'items', '0', 'name' ])
        case CATEGORY:
          switch (this.$route.params.title) {
            case 'marketing':
              return '企劃特輯'
            case 'campaign':
              return '活動專區'
            default:
              return _.get(_.find(_.get(this.commonData, [ 'categories' ]), { 'name': this.$route.params.title }), [ 'title' ])
          }
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'Topic'
          } else {
            return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'title' ])
          }
        case TAG:
          return _.get(this.$store.state, [ 'tag', 'name' ])
        case EXTERNALS:
          if (this.$route.params.name === 'external') {
            return '校園'
          }
          return _.get(this.section, [ 'display' ])
      }
    },
    type () {
      return _.toUpper(_.split(this.$store.state.route.path, '/')[1])
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
              return _.get(_.find(_.get(this.commonData, [ 'categories' ]), { 'name': this.$route.params.title }), [ 'id' ])
          }
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'topic'
          } else {
            return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'id' ])
          }
        case TAG:
          return this.$route.params.tagId
        case EXTERNALS:
          return this.$route.params.name
      }
    }
  },
  methods: {
    currentYPosition,
    camelize,
    checkIfLockJS () {
      unLockJS()
    },
    elmYPosition,
    getRole,
    getTruncatedVal,
    getMmid () {
      const mmid = Cookie.get('mmid')
      const role = this.getRole({ mmid, distribution: [
        { id: 'A', weight: 50 },
        { id: 'B', weight: 50 } ]
      })
      return role
    },
    getValue,
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
      let pageToken
      let currentPage = this.page
      currentPage += 1
      this.loading = true
      if (this.uuid === VIDEOHUB_ID) {
        pageToken = _.get(this.$store.state.playlist, [ 'nextPageToken' ])
      }
      return fetchListData(this.$store, this.type, this.pageStyle, this.uuid, currentPage, false, pageToken)
      .then(() => {
        this.loading = false
      })
    },
    insertVponAdSDK,
    scrollHandler (e) {
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
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.documentElement.clientWidth || document.body.clientWidth
      }
    },
    updateSysStage () {
      this.dfpMode = currEnv()
    },
    vponHtml
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
  beforeRouteEnter (to, from, next) {
    if (from.matched.length !== 0) { // check whether first time
      next(vm => {
        return Promise.all([
          vm.$store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] }),
          fetchListData(vm.$store, vm.type, vm.pageStyle, getUUID(vm.$store, vm.type, to), false, false)
        ])
      })
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    const type = _.toUpper(_.split(to.path, '/')[1])
    const pageStyle = _.get(_.find(_.get(this.$store.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'style' ], 'feature')
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
  },
  beforeMount () {
    // only fetch at first time after preFetch
    fetchListData(this.$store, this.type, this.pageStyle, this.uuid, false, false)
    fetchEvent(this.$store, 'embedded')
    fetchEvent(this.$store, 'logo')
  },
  mounted () {
    this.updateViewport()
    window.addEventListener('resize', this.updateViewport)
    window.addEventListener('scroll', this.scrollHandler)
    this.checkIfLockJS()
    this.insertCustomizedMarkup()
    this.updateSysStage()
    // this.abIndicator = this.getMmid()
    if (this.type === EXTERNALS) {
      window.ga('set', 'contentGroup1', 'external')
      window.ga('set', 'contentGroup2', this.uuid)
      window.ga('set', 'contentGroup3', '')
      // window.ga('set', 'contentGroup3', `list${this.abIndicator}`)
    } else if (this.sectionName === 'other') {
      window.ga('set', 'contentGroup1', '')
      window.ga('set', 'contentGroup2', '')
      window.ga('set', 'contentGroup3', '')
    } else {
      window.ga('set', 'contentGroup1', this.sectionName)
      window.ga('set', 'contentGroup2', '')
      window.ga('set', 'contentGroup3', '')
      // window.ga('set', 'contentGroup3', `list${this.abIndicator}`)
    }
    window.ga('send', 'pageview', { title: `${this.title} - ${SITE_TITLE}`, location: document.location.href })
  },
  updated () {
    this.updateSysStage()
  },
  destroyed () {
    window.removeEventListener('resize', this.updateViewport)
    window.removeEventListener('scroll', this.scrollHandler)
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
  background-image url("/public/foodtravelbg.jpg")

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
