<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId" :options="dfpOptions">
    <template scope="props" slot="dfpPos">
      <section style="width: 100%;">
        <app-header :commonData="commonData" v-if="(articleStyle !== 'photography')"></app-header>
      </section>
      <div class="article-container" v-if="(articleStyle !== 'photography')" >
        <vue-dfp :is="props.vueDfp" pos="PCHD" extClass="full mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <vue-dfp :is="props.vueDfp" pos="MBHD" extClass="full mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <div class="split-line"></div>
        <div class="article-heromedia" v-if="heroVideo" >
          <video class="heroimg video" width="100%" height="100%" controls controlsList="nodownload"
          :poster="heroVideo.poster">
            <source :src="getValue(heroVideo, [ 'video', 'url' ])" :type="getValue(heroVideo, [ 'video', 'filetype' ])">
            Your browser does not support the video tag.
          </video>
          <div class="playpause play" @click="doPlayVideoByBtn" target=".heroimg.video"></div>
          <div class="heroimg-caption" v-text="heroCaption" v-show="(heroCaption && heroCaption.length > 0)"></div>
        </div>
        <div class="article-heromedia" v-else-if="heroImage">
          <img v-if="heroImage && heroImage.image" class="heroimg" :src="getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ])"
          :srcset="getValue(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ]) + ' 800w, ' +
          getValue(heroImage, [ 'image', 'resizedTargets', 'tablet', 'url' ]) + ' 1200w, ' +
          getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ]) + ' 2000w'" />
          <div class="heroimg-caption" v-text="heroCaption" v-show="(heroCaption && heroCaption.length > 0)"></div>
        </div>
        <div class="article" v-if="articleData">
          <article-body :articleData="articleData" :poplistData="popularlist" :projlistData="projectlist" :viewport="viewport">
            <aside class="article_aside mobile-hidden" slot="aside" v-if="!ifSingleCol">
              <vue-dfp :is="props.vueDfp" pos="PCR1" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" ></vue-dfp>
              <latest-list :latest="latestList" :currArticleSlug="currArticleSlug" v-if="ifRenderAside" />
              <vue-dfp :is="props.vueDfp" pos="PCR2" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" ></vue-dfp>
              <related-list :relateds="relateds" v-if="(relateds.length > 0) && ifRenderAside" />
            </aside>
            <vue-dfp :is="props.vueDfp" pos="PCE1" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad-set" :dfpId="props.dfpId" />
            <vue-dfp :is="props.vueDfp" pos="PCE2" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad-set" :dfpId="props.dfpId" />
            <vue-dfp :is="props.vueDfp" pos="MBE1" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad-set" :dfpId="props.dfpId" />
            <vue-dfp :is="props.vueDfp" pos="PCAR" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad-AR1" :dfpId="props.dfpId" />
            <vue-dfp :is="props.vueDfp" pos="MBAR1" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad-AR1" :dfpId="props.dfpId" />
            <vue-dfp :is="props.vueDfp" pos="MBAR2" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad-AR2" :dfpId="props.dfpId" />
            <pop-list :pop="popularlist" slot="poplist" v-if="ifShowPoplist">
              <vue-dfp :is="props.vueDfp" pos="PCPOP3" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" slot="dfpNA3"/>
              <vue-dfp :is="props.vueDfp" pos="PCPOP5" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" slot="dfpNA5"/>
              <vue-dfp :is="props.vueDfp" pos="PCPOP7" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" slot="dfpNA7"/>
            </pop-list>
            <related-list-one-col :relateds="relateds" v-if="(relateds.length > 0) && (!ifRenderAside || articleStyle === 'wide')" slot="relatedlistBottom" />
            <div class="article_fb_comment" style="margin: 1.5em 0;" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
          </article-body>
          <div class="article_footer">
            <vue-dfp :is="props.vueDfp" pos="PCFT" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
            <vue-dfp :is="props.vueDfp" pos="MBFT" :extClass="`full mobile-only ${styleDfpAd}`" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
            <div style="width: 100%; height: 100%;">
              <app-footer />
            </div>
          </div>
        </div>
        <share-tools v-if="viewport > 767" />
      </div>
      <div v-else-if="(articleStyle === 'photography')">
        <article-body-photography :articleData="articleData" :viewport="viewport">
          <div class="article_fb_comment" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
        </article-body-photography>
      </div>
      <div class="dfp-cover" v-show="showDfpCoverAdFlag && viewport < 1199">
        <div class="ad">
          <vue-dfp :is="props.vueDfp" pos="MBCVR" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
          <div class="close" @click="closeCoverAd"></div>
        </div>
      </div>
      <dfp-fixed v-if="hasDfpFixed" v-show="showDfpFixedBtn" v-on:closeDfpFixed="closeDfpFixed">
        <vue-dfp :is="props.vueDfp" pos="PCFF" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" slot="dfpFF"/>
      </dfp-fixed>
    </template>
  </vue-dfp-provider>
</template>
<script>
  import _ from 'lodash'
  import { DFP_ID, DFP_SIZE_MAPPING, DFP_UNITS, FB_APP_ID, FB_PAGE_ID, SECTION_MAP, SECTION_WATCH_ID, SITE_KEYWORDS, SITE_TITLE, SITE_URL } from '../constants'
  import { getTruncatedVal, lockJS, unLockJS } from '../utils/comm'
  import ArticleBody from '../components/article/ArticleBody.vue'
  import ArticleBodyPhotography from '../components/article/ArticleBodyPhotography.vue'
  import Cookie from 'vue-cookie'
  import DfpFixed from '../components/DfpFixed.vue'
  import Footer from '../components/Footer.vue'
  import Header from '../components/Header.vue'
  import LatestList from '../components/article/LatestList.vue'
  import PopList from '../components/article/PopList.vue'
  import RelatedList from '../components/article/RelatedList.vue'
  import RelatedListOneCol from '../components/article/RelatedListOneCol.vue'
  import ShareTools from '../components/article/ShareTools.vue'
  import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
  import sanitizeHtml from 'sanitize-html'
  import store from '../store'
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

  const fetchPop = (store) => {
    return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
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
    return Promise.all([ fetchSSRData(store), fetchArticles(store, store.state.route.params.slug) ])
  }

  export default {
    name: 'article-view',
    preFetch: fetchData,
    beforeRouteEnter (to, from, next) {
      if (process.env.VUE_ENV === 'client' && to.path !== from.path && from.matched && from.matched.length > 0) {
        const _targetArticle = _.find(_.get(store, [ 'state', 'articles', 'items' ]), { slug: to.params.slug })
        if (!_targetArticle) {
          fetchArticles(store, to.params.slug).then(() => {
            const { sections } = _.get(store, [ 'state', 'articles', 'items', 0 ], {})
            return fetchLatestArticle(store, {
              sort: '-publishedDate',
              where: {
                'sections': _.get(sections, [ 0, 'id' ])
              }
            }).then(() => {
              next(vm => {})
            })
          })
          fetchPop(store)
        } else {
          next()
        }
      } else {
        next()
      }
    },
    beforeRouteUpdate (to, from, next) {
      fetchArticles(this.$store, to.params.slug).then(() => {
        const sections = _.get(_.find(_.get(store, [ 'state', 'articles', 'items' ]), { slug: to.params.slug }), [ 'sections' ])
        return fetchLatestArticle(store, {
          sort: '-publishedDate',
          where: {
            'sections': _.get(sections, [ 0, 'id' ])
          }
        }).then(() => {
          next()
        })
      })
    },
    beforeMount () {
      const { sections } = _.get(store, [ 'state', 'articles', 'items', 0 ], {})
      fetchLatestArticle(store, {
        sort: '-publishedDate',
        where: {
          'sections': _.get(sections, [ 0, 'id' ])
        }
      })
      fetchPop(store)
      fetchCommonData(store)
    },
    components: {
      'article-body': ArticleBody,
      'article-body-photography': ArticleBodyPhotography,
      'app-footer': Footer,
      'app-header': Header,
      'dfp-fixed': DfpFixed,
      'latest-list': LatestList,
      'pop-list': PopList,
      'related-list': RelatedList,
      'related-list-one-col': RelatedListOneCol,
      'share-tools': ShareTools,
      'vue-dfp-provider': VueDfpProvider
    },
    data () {
      return {
        clientSideFlag: false,
        dfpid: DFP_ID,
        dfpUnits: DFP_UNITS,
        state: {},
        showDfpCoverAdFlag: false,
        showDfpFixedBtn: false,
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
        return {
          afterEachAdLoaded: (event) => {
            const dfpCurrAd = document.querySelector(`#${event.slot.getSlotElementId()}`)
            const position = dfpCurrAd.getAttribute('pos')
            if (position === 'LMBCVR' || position === 'MBCVR') {
              const adDisplayStatus = dfpCurrAd.currentStyle ? dfpCurrAd.currentStyle.display : window.getComputedStyle(dfpCurrAd, null).display
              if (adDisplayStatus === 'none') {
                this.showDfpCoverAdFlag = false
              } else {
                this.updateCookie()
              }
            }
            if (position === 'PCFF') {
              const adDisplayStatus = dfpCurrAd.currentStyle ? dfpCurrAd.currentStyle.display : window.getComputedStyle(dfpCurrAd, null).display
              if (adDisplayStatus === 'none') {
                this.showDfpFixedBtn = false
              } else {
                this.showDfpFixedBtn = true
              }
            }
          },
          setCentering: true,
          sizeMapping: DFP_SIZE_MAPPING
        }
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
        const poster = ogImgUrl || (heroImgUrl || '/asset/review.png')
        return (heroVideo) ? Object.assign(heroVideo, { poster }) : heroVideo
      },
      ifLockJS () {
        return _.get(this.articleData, [ 'lockJS' ])
      },
      ifRenderAside () {
        return this.viewport >= 1200
      },
      ifShowPoplist () {
        return _.get(SECTION_MAP, [ this.sectionId, 'ifShowPoplist' ], true)
      },
      ifSingleCol () {
        return (this.articleStyle === 'wide' || !this.ifRenderAside)
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
      relateds () {
        return _.get(this.articleData, [ 'relateds' ])
      },
      sectionId () {
        return _.get(this.articleData, [ 'sections', 0, 'id' ]) ? _.get(this.articleData, [ 'sections', 0, 'id' ]) : 'other'
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
      closeCoverAd () {
        this.showDfpCoverAdFlag = false
      },
      closeDfpFixed () {
        this.showDfpFixedBtn = false
      },
      doPlayVideoByBtn (e) {
        const source = e.target
        const targ = source.getAttribute('target')
        const targDOM = document.querySelector(targ)
        const sourceClass = source.getAttribute('class')
        const ifPlay = sourceClass.indexOf(' play') > -1
        source.setAttribute('class', ifPlay ? `${sourceClass.replace(' play', '')} pause` : `${sourceClass.replace(' pause', '')} play`)
        targDOM && ifPlay && targDOM.play()
        targDOM.removeEventListener('pause', this.heroVideoPausedHandler)
        targDOM.addEventListener('pause', this.heroVideoPausedHandler)
      },
      heroVideoPausedHandler (e) {
        const source = document.querySelector('.article-heromedia > .playpause')
        const sourceClass = source.getAttribute('class')
        const ifPlay = sourceClass.indexOf(' play') > -1
        source.setAttribute('class', ifPlay ? `${sourceClass.replace(' play', '')} pause` : `${sourceClass.replace(' pause', '')} play`)
      },
      getTruncatedVal,
      getValue (o = {}, p = [], d = '') {
        return _.get(o, p, d)
      },
      insertFbSdkScript () {
        if (!window.FB) {
          const fbSdkScript = document.createElement('script')
          fbSdkScript.setAttribute('id', 'fbsdk')
          fbSdkScript.innerHTML = '(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.8&appId=' + this.fbAppId + '\"; fjs.parentNode.insertBefore(js, fjs); }(document, \'script\', \'facebook-jssdk\'));'
          fbSdkScript.async = true
          fbSdkScript.type = 'text/javascript'
          document.querySelector('body').insertBefore(fbSdkScript, document.querySelector('body').children[0])
        } else {
          window.FB && window.FB.init({
            appId: this.fbAppId,
            xfbml: true,
            version: 'v2.0'
          })
          window.FB && window.FB.XFBML.parse()
        }
      },
      updateCookie () {
        const cookie = Cookie.get('visited')
        if (!cookie) {
          Cookie.set('visited', 'true', { expires: '10m' })
          this.showDfpCoverAdFlag = true
        } else {
          this.showDfpCoverAdFlag = false
        }
      },
      updateViewport () {
        const browser = typeof window !== 'undefined'
        if (browser) {
          this.viewport = document.querySelector('body').offsetWidth
        }
      }
    },
    mounted () {
      this.insertFbSdkScript()
      this.updateViewport()
      this.clientSideFlag = process.env.VUE_ENV === 'client'
      window.addEventListener('resize', () => {
        this.updateViewport()
      })
      this.checkIfLockJS()
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
      const pureBrief = truncate(sanitizeHtml(_.map(_.get(brief, [ 'apiData' ], []), (o, i) => (_.map(_.get(o, [ 'content' ], []), (str) => (str)))).join(''), { allowedTags: [ 'em' ] }), 200)
      const pureTags = _.map(tags, (t) => (_.get(t, [ 'name' ], '')))
      const sectionName = _.get(sections, [ 0, 'name' ], '')
      const topicId = _.get(topics, [ '_id' ], '')

      return {
        title: title + ` － ${SITE_TITLE}`,
        meta: [
          { name: 'keywords', content: SITE_KEYWORDS + ',' + pureTags.toString() },
          { name: 'description', content: pureBrief },
          { name: 'section-name', content: sectionName },
          { name: 'category-name', content: categorieName },
          { name: 'topic-id', content: topicId },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: (ogTitle.length > 0) ? ogTitle + ' － 鏡週刊 Mirror Media' : title + ' － 鏡週刊 Mirror Media' },
          { name: 'twitter:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { name: 'twitter:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
          { property: 'fb:app_id', content: FB_APP_ID },
          { property: 'fb:pages', content: FB_PAGE_ID },
          { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: (ogTitle.length > 0) ? ogTitle + ' － 鏡週刊 Mirror Media' : title + ' － 鏡週刊 Mirror Media' },
          { property: 'og:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { property: 'og:url', content: SITE_URL + '/story/' + slug + '/' },
          { property: 'og:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') }
        ]
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

      .playpause
        background-repeat no-repeat
        width 60px
        height 60px
        position absolute
        margin auto
        background-size contain
        background-position center
        top 50%
        left 50%
        margin-left -30px
        margin-top -30px
        cursor pointer
        background-image url('/public/icon/play-btn@2x.png')

        &.play
          display block
          
        &.pause
          display none
    
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
        padding 30px 25px 0

  @media (min-width 0px) and (max-width 767px)  
    .article-container
      .article-heromedia, .article
         max-width 100%
  
  @media (min-width 768px)
    .article-container
      .article-heromedia
        .playpause
          margin-left -50px
          margin-top -50px
          width 100px
          height 100px

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
