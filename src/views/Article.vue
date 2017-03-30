<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId">
    <template scope="props" slot="dfpPos">
      <section style="width: 100%;">
        <app-header :commonData="commonData" v-if="(articleStyle !== 'photography')"></app-header>
      </section>
      <div class="article-container" v-if="(articleStyle !== 'photography')" >
        <vue-dfp :is="props.vueDfp" pos="PCHD" extClass="full mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <div class="split-line"></div>
        <div class="article-heromedia" v-if="heroVideo" >
          <video class="heroimg video" width="100%" height="100%" :src="getValue(heroVideo, [ 'video', 'url' ])" type="video/mp4" controls
          :poster="heroVideo.poster">
            Your browser does not support the video tag.
          </video>
          <div class="playpause"></div>
          <div class="heroimg-caption" v-text="heroCaption" v-show="(heroCaption && heroCaption.length > 0)"></div>
        </div>
        <div class="article-heromedia" v-else="heroImage">
          <img v-if="heroImage.image" class="heroimg" :src="getValue(heroImage, [ 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ])"
          :srcset="getValue(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ]) + ' 800w, ' +
          getValue(heroImage, [ 'image', 'resizedTargets', 'tablet', 'url' ]) + ' 1200w, ' +
          getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ]) + ' 2000w'" />
          <div class="heroimg-caption" v-text="heroCaption" v-show="(heroCaption && heroCaption.length > 0)"></div>
        </div>
        <div class="article" v-if="articleData">
          <article-body :articleData="articleData" :poplistData="popularlist" :projlistData="projectlist" :viewport="viewport">
            <aside class="article_aside mobile-hidden" slot="aside" v-if="ifSingleCol">
              <vue-dfp :is="props.vueDfp" pos="PCR1" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" ></vue-dfp>
              <latest-list :latest="latestList" :currArticleSlug="currArticleSlug" v-if="ifRenderAside" />
              <vue-dfp :is="props.vueDfp" pos="PCR2" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" ></vue-dfp>
              <related-list :relateds="relateds" v-if="(relateds.length > 0) && ifRenderAside" />
            </aside>
            <vue-dfp :is="props.vueDfp" pos="PCE1" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad-set" :dfpId="props.dfpId" />
            <vue-dfp :is="props.vueDfp" pos="PCE2" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad-set" :dfpId="props.dfpId" />
            <pop-list :pop="popularlist" slot="poplist" v-if="ifShowPoplist">
              <vue-dfp :is="props.vueDfp" pos="PCPOP3" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" slot="dfpNA3"/>
              <vue-dfp :is="props.vueDfp" pos="PCPOP5" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" slot="dfpNA5"/>
              <vue-dfp :is="props.vueDfp" pos="PCPOP7" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" slot="dfpNA9"/>
            </pop-list>
            <related-list-one-col :relateds="relateds" v-if="(relateds.length > 0) && (!ifRenderAside || articleStyle === 'photography')" slot="relatedlistBottom" />
            <div class="article_fb_comment" style="margin: 1.5em 0;" slot="slot_fb_comment" v-html="fbCommentDiv"></div>
          </article-body>
          <div class="article_footer">
            <vue-dfp :is="props.vueDfp" pos="PCFT" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
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
    </template>
  </vue-dfp-provider>
</template>
<script>
  import _ from 'lodash'
  import { DFP_ID, DFP_UNITS, SECTION_MAP, SITE_URL } from '../constants'
  import { getTruncatedVal } from '../utils/comm'
  import ArticleBody from '../components/article/ArticleBody.vue'
  import ArticleBodyPhotography from '../components/article/ArticleBodyPhotography.vue'
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
        where: {
          'slug': slug
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
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'topics' ] } )
  }

  const fetchCommonData = (store) => {
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'projects' ] } )
  }

  const fetchData = (store) => {
    return fetchSSRData(store).then(() => {
      return fetchArticles(store, store.state.route.params.slug)
    })
  }


  export default {
    name: 'article-view',
    preFetch: fetchData,
    beforeRouteEnter(to, from, next) {
      if(process.env.VUE_ENV === 'client' && to.path !== from.path && from.matched && from.matched.length > 0) {
        const _targetArticle = _.find(_.get(store, [ 'state', 'articles', 'items' ]), { slug: to.params.slug })
        if(!_targetArticle) {
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
    beforeRouteUpdate(to, from, next) {
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
    beforeMount() {
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
      'latest-list': LatestList,
      'pop-list': PopList,
      'related-list': RelatedList,
      'related-list-one-col': RelatedListOneCol,
      'share-tools': ShareTools,
      'vue-dfp-provider': VueDfpProvider,
    },
    data() {
      return {
        clientSideFlag: false,
        dfpid: DFP_ID,
        dfpUnits: DFP_UNITS,
        state: {},
        viewport: undefined,
      }
    },
    computed: {
      articleUrl() {
        return `${SITE_URL}/story/${this.currArticleSlug}/`
      },
      articleData() {
        const _data = _.find(_.get(this.$store, [ 'state', 'articles', 'items']), { 'slug' : this.currArticleSlug })
        return _data ? _data : {}
      },
      articleStyle() {
        return _.get(this.articleData, [ 'style' ], '')
      },
      currArticleSlug() {
        return this.$store.state.route.params.slug
      },
      commonData () { 
        return this.$store.state.commonData 
      },
      fbAppId() {
        return _.get(this.$store, [ 'state', 'fbAppId' ])
      }, 
      fbCommentDiv() {
        return `<div class="fb-comments" data-href="${this.articleUrl}" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>`
      },
      heroCaption() {
        return _.get(this.articleData, [ 'heroCaption' ], '')
      },
      heroImage() {
        return _.get(this.articleData, [ 'heroImage' ])
      },
      heroVideo() {
        const { heroImage, heroVideo, ogImage } = this.articleData
        const heroImgUrl= _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], undefined)
        const ogImgUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], undefined)
        const poster = (ogImgUrl) ? ogImgUrl : ((heroImgUrl) ? heroImgUrl : '/asset/review.png')
        return (heroVideo) ? Object.assign(heroVideo, { poster }) : heroVideo
      },
      ifRenderAside() {
        return (this.viewport < 1200) ? false : true
      },
      ifShowPoplist() {
        return _.get(SECTION_MAP, [ this.sectionId, 'ifShowPoplist' ], true)
      },
      ifSingleCol() {
        return (this.articleStyle === 'wide' || !this.ifRenderAside) ? false : true
      },
      latestList() {
        return _.get(this.$store.state.latestArticle, [ 'items' ], [])
      },
      photography() {
        const { style } = this.articleData;
      },
      popularlist() {
        const { report = [] } = _.get(this.$store, [ 'state', 'articlesPopList' ])
        return report
      },
      projectlist() {
        const items = _.get(this.$store.state, [ 'commonData', 'projects', 'items' ])
        return items
      },
      relateds() {
        return _.get(this.articleData, [ 'relateds' ])
      },
      sectionId() {
        return _.get(this.articleData, [ 'sections', 0, 'id' ])
      },
    },
    methods: {
      getTruncatedVal,
      getValue(o = {}, p = [], d = '') {
        return _.get(o, p, d);
      },
      insertFbSdkScript() {
        if(!window.FB) {
          const fbSdkScript = document.createElement('script')
          fbSdkScript.setAttribute('id', 'fbsdk')
          fbSdkScript.innerHTML = '(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.8&appId=' + this.fbAppId + '\"; fjs.parentNode.insertBefore(js, fjs); }(document, \'script\', \'facebook-jssdk\'));'
          fbSdkScript.async = true
          fbSdkScript.type = 'text/javascript'
          document.querySelector('body').insertBefore(fbSdkScript, document.querySelector('body').children[0])
        } else {
          window.FB && window.FB.init({
            appId      : this.fbAppId,
            xfbml      : true,
            version    : 'v2.0'
          })
          window.FB && window.FB.XFBML.parse()
        }
      },
      updateViewport() {
        const browser = typeof window !== 'undefined'
        if(browser) {
          this.viewport = document.querySelector('body').offsetWidth
        }
      },
    },
    mounted() {
      this.insertFbSdkScript()
      this.updateViewport()
      this.clientSideFlag = (process.env.VUE_ENV === 'client') ? true : false
      window.addEventListener('resize', () => {
        this.updateViewport()
      })
    },
    metaInfo() {
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
      const pureBrief = truncate(sanitizeHtml(_.get(brief, [ 'html' ], ''), { allowedTags: [ 'em' ] }), 200)
      const pureTags = _.map(tags, (t) => (_.get(t, [ 'name' ], '')))
      const sectionName = _.get(sections, [ 0, 'name' ], '')
      const topicId = _.get(topics, [ '_id' ], '')

      return {
        title: title + ' － 鏡週刊 Mirror Media',
        meta: [
          { name: 'keywords', content: '鏡週刊,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說,' + pureTags.toString() },
          { name: 'description', content: pureBrief },
          { name: 'section-name', content: sectionName },
          { name: 'category-name', content: categorieName },
          { name: 'topic-id', content: topicId },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: (ogTitle.length > 0) ? ogTitle + ' － 鏡週刊 Mirror Media' : title + ' － 鏡週刊 Mirror Media' },
          { name: 'twitter:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { name: 'twitter:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
          { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: (ogTitle.length > 0) ? ogTitle + ' － 鏡週刊 Mirror Media' : title + ' － 鏡週刊 Mirror Media' },
          { property: 'og:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { property: 'og:url', content: '/story/' + slug + '/' },
          { property: 'og:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
        ]
      }
    },
    watch: {
      articleUrl: () => {
        window.FB && window.FB.init({
          appId      : this.fbAppId,
          xfbml      : true,
          version    : 'v2.0'
        })
        window.FB && window.FB.XFBML.parse()
      }
    },
  }

</script>
<style lang="stylus">
  .article-container
    width 100%
    background-color #414141

    .article-heromedia
      margin 0 auto
      background-color #fff
      max-width 1160px

      .heroimg
        width 100%
      
      .heroimg-caption
        margin-top 5px
        padding 0 50px
      
    
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
          padding 0 25px
          line-height 1.3rem
      
      .article
        padding 30px 25px 0

  @media (min-width 0px) and (max-width 767px)  
    .article-container
      .article-heromedia, .article
         max-width 100%

  @media (min-width 768px) and (max-width 1199px)
    .article-container
      .article-heromedia
        .heroimg-caption
          text-align center
      
      .article
        padding 100px 50px 0


</style>
