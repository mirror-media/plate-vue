<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId">
    <template scope="props" slot="dfpPos">
      <div id="fb-root"></div>
      <app-header :commonData= 'commonData' v-if="(articleStyle !== 'photography')"/>
      <div class="article-container" v-if="(articleStyle !== 'photography')" >
        <vue-dfp :is="props.vueDfp" pos="PCHD" extClass="full" :dfpUnits="props.dfpUnits" :section="props.section"></vue-dfp> 
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
          <article-body :articleData="articleData" :poplistData="popularlist" :projlistData="projectlist">
            <aside class="article_aside desktop-only" v-if="ifRenderAside" slot="aside">
              <vue-dfp :is="props.vueDfp" pos="PCR1" :dfpUnits="props.dfpUnits" :section="props.section"></vue-dfp> 
              <latest-list :latest="latestList" :currArticleSlug="currArticleSlug" />
              <vue-dfp :is="props.vueDfp" pos="PCR2" :dfpUnits="props.dfpUnits" :section="props.section"></vue-dfp> 
              <related-list :relateds="relateds" v-if="relateds.length > 0" />
            </aside>
            <pop-list :pop="popularlist" slot="poplist" v-if="ifShowPoplist">
              <vue-dfp :is="props.vueDfp" pos="PCPOP" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpad"/>
            </pop-list>
          </article-body>
          <div class="article_footer">
            <vue-dfp :is="props.vueDfp" pos="PCFT" :dfpUnits="props.dfpUnits" :section="props.section"></vue-dfp> 
            <div style="width: 100%; height: 100%;">
              <app-footer />
            </div>
          </div>
        </div>
        <share-tools />
      </div>
      <div v-else>
        <article-body-photography :articleData="articleData" />
      </div>
    </template>
  </vue-dfp-provider>
</template>
<script>
  import _ from 'lodash'
  import { DFP_ID, DFP_UNITS, SECTION_MAP } from '../constants'
  import { getTruncatedVal } from '../utils/comm'
  import ArticleBody from '../components/article/ArticleBody.vue'
  import ArticleBodyPhotography from '../components/article/ArticleBodyPhotography.vue'
  import Footer from '../components/Footer.vue'
  import Header from '../components/Header.vue'
  import LatestList from '../components/article/LatestList.vue'
  import PopList from '../components/article/PopList.vue'
  import RelatedList from '../components/article/RelatedList.vue'
  import ShareTools from '../components/article/ShareTools.vue'
  import VueDfpProvider from 'kc-vue-dfp/DfpProvider.vue'
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

  const fetchCommonData = (store) => {
    return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'choices' ] } )
  }


  const fetchData = (store) => {
    return fetchCommonData(store).then(() => {
      return fetchArticles(store, store.state.route.params.slug).then(() => {
        const { sections } = _.get(store, [ 'state', 'articles', 'items', 0 ], {})
        return fetchLatestArticle(store, {
          sort: '-publishedDate',
          where: {
            'sections': _.get(sections, [ 0, 'id' ])
          }
        }).then(() => {
          return fetchPop(store)
        })
      })
    })
  }


  export default {
    name: 'article-view',
    preFetch: fetchData,
    components: {
      'article-body': ArticleBody,
      'article-body-photography': ArticleBodyPhotography,
      'app-footer': Footer,
      'app-header': Header,
      'latest-list': LatestList,
      'pop-list': PopList,
      'related-list': RelatedList,
      'share-tools': ShareTools,
      'vue-dfp-provider': VueDfpProvider,
    },
    data() {
      return {
        commonData: this.$store.state.commonData,
        dfpid: DFP_ID,
        dfpUnits: DFP_UNITS,
        editorChoice: this.$store.state.editorChoice,
        latestArticle: this.$store.state.latestArticle,
        state: {},
      }
    },
    computed: {
      articleData() {
        return _.find(_.get(this.$store, [ 'state', 'articles', 'items']), { 'slug' : this.currArticleSlug })
      },
      articleStyle() {
        return _.get(this.articleData, [ 'style' ], '')
      },
      currArticleSlug() {
        return this.$store.state.route.params.slug
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
        const browser = typeof window !== 'undefined'
        if(browser) {
          const viewport = document.querySelector('body').offsetWidth
          return (viewport < 1200) ? false : true
        } else {
          return false
        }
      },
      ifShowPoplist() {
        return _.get(SECTION_MAP, [ this.sectionId, 'ifShowPoplist' ], true)
      },
      latestList() {
        return _.get(this.latestArticle, [ 'items' ], [])
      },
      photography() {
        const { style } = this.articleData;
      },
      popularlist() {
        const { report = [] } = _.get(this.$store, [ 'state', 'articlesPopList' ])
        return report
      },
      projectlist() {
        const { items = [] } = _.get(this.commonData, [ 'projects' ])
        return items
      },
      relateds() {
        return _.get(this.articleData, [ 'relateds' ])
      },
      sectionId() {
        return _.get(this.articleData, [ 'sections', 0, 'id' ], '')
      },
    },
    beforeMount() {},
    beforeRouteUpdate(to, from, next) {
      fetchArticles(this.$store, to.params.slug).then(() => {
        const { sections } = _.get(store, [ 'state', 'articles', 'items', 0 ], {})
        return fetchLatestArticle(store, {
          sort: '-publishedDate',
          where: {
            'sections': _.get(sections, [ 0, 'id' ])
          }
        })
      }).then(() => {

        next()
      })
    },
    methods: {
      getTruncatedVal,
      getValue(o = {}, p = [], d = '') {
        return _.get(o, p, d);
      },
    },
    mounted() {
      const { fbAppId } = _.get(this.$store, [ 'state' ])
      const fbSdkScript = document.createElement('script')
      fbSdkScript.innerHTML = '(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.8&appId=' + fbAppId + '\"; fjs.parentNode.insertBefore(js, fjs); }(document, \'script\', \'facebook-jssdk\'));'
      fbSdkScript.async = true
      fbSdkScript.type = 'text/javascript'
      document.querySelector('body').insertBefore(fbSdkScript, document.querySelector('body').children[0])
    },
    metaInfo() {
      const { brief, categories, dfpId, fbAppId, fbPagesId, heroImage, id, ogDescription, ogImage, ogTitle, sections, tags, title, topics } = this.articleData
      const categorieId = _.get(categories, [ 0, 'id' ], '')
      const imageUrl = _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const ogImageUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const pureBrief = truncate(sanitizeHtml(_.get(brief, [ 'html' ], ''), { allowedTags: [ 'em' ] }), 200)
      const pureTags = tags.map((t) => (_.get(t, [ 'name' ], '')))
      const sectionId = _.get(sections, [ 0, 'id' ], '')
      const topicId = _.get(topics, [ '_id' ], '')

      return {
        title: title,
        meta: [
          { name: 'keywords', content: '鏡週刊,鏡傳媒,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說,' + pureTags.toString() },
          { name: 'description', content: pureBrief },
          { name: 'section-id', content: sectionId },
          { name: 'category-id', content: categorieId },
          { name: 'topic-id', content: topicId },
          { name: 'DFPIP', content: dfpId },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: (ogTitle.length > 0) ? ogTitle : title },
          { name: 'twitter:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { name: 'twitter:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
          { property: 'fb:app_id', content: fbAppId },
          { property: 'fb:pages', content: fbPagesId },
          { property: 'og:site_name', content: '鏡傳媒 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: (ogTitle.length > 0) ? ogTitle : title },
          { property: 'og:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { property: 'og:url', content: '/story/' + id },
          { property: 'og:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
        ]
      }
    }
  }

</script>
<style lang="stylus">
  .article-container
    width 100%
    background-color #414141

    .article-heromedia
      margin 0 auto
      padding-top 30px
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
      
      .article_footer
        text-align center
      
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
      padding-top 30px
    
</style>
