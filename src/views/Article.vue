<template>
  <vue-dfp-provider>
    <template scope="props" slot="dfpPos">
      <app-header :commonData= 'commonData'/>
      <div class="article-container">
        <div id="fb-root"></div>
        <!-- <vue-dfp :is="props.vueDfp" pos="PCHD" extClass="full"></vue-dfp> -->
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
          getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ]) + ' 2000w'"/>
          <div class="heroimg-caption" v-text="heroCaption" v-show="(heroCaption && heroCaption.length > 0)"></div>
        </div>
        <div class="article" v-if="articleData">
          <article-body :articleData="articleData" :poplistData="popularlist">
            <aside class="article_aside" slot="aside" v-if="(articleStyle !== 'photography')">
              <!-- <vue-dfp :is="props.vueDfp" pos="PCR1"></vue-dfp> -->
              <latest-list :latest="latestList" :currArticleSlug="currArticleSlug"></latest-list>
              <!-- <vue-dfp :is="props.vueDfp" pos="PCR2"></vue-dfp> -->
              <related-list :relateds="relateds" :ifshow="showRelated"></related-list>
            </aside>
          </article-body>
          <div class="article_footer">
            <!-- <vue-dfp :is="props.vueDfp" pos="PCFT" dimensions="970x90"></vue-dfp> -->
            <div style="width: 100%; height: 100%;">
              <app-footer></app-footer>
            </div>
          </div>
        </div>
      </div>
    </template>
  </vue-dfp-provider>
</template>
<script>
  import _ from 'lodash'
  import {  SECTION_MAP, DFP_UNITS } from '../constants'
  import { getTruncatedVal } from '../utils/comm'
  // import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import ArticleBody from '../components/article/ArticleBody.vue'
  import Footer from '../components/Footer.vue'
  import Header from '../components/Header.vue'
  import LatestList from '../components/article/LatestList.vue'
  import RelatedList from '../components/article/RelatedList.vue'
  import VueDfpProvider from '../utils/plate-vue-dfp/PlateDfpProvider.vue'
  import sanitizeHtml from 'sanitize-html'
  // import slider from 'vue-slider'
  import store from '../store'
  import truncate from 'truncate'



  const fetchArticles = (store) => {
    return store.dispatch('FETCH_ARTICLES', {
      params: {
        where: {
          'slug': store.state.route.params.slug
        }
      }
    })
  }
  const fetchPop = (store) => {
    return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
  }

  const fetchCommonData = (store) => {
    return store.dispatch('FETCH_COMMONDATA', { })
  }

  const fetchEditorChoice = (store) => {
    return store.dispatch('FETCH_EDITORCHOICE', { })
  }

  const fetchLatestArticle = (store, params) => {
    return store.dispatch('FETCH_LATESTARTICLE', { params: params })
  }


  const fetchData = (store) => {
    return fetchCommonData(store).then(() => {
      return fetchEditorChoice(store).then(() => {
        return fetchArticles(store).then(() => {
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
    })
  }

  // const slideC = (process.env.BROWSER)? slider : null

  export default {
    name: 'article-view',
    preFetch: fetchData,
    components: {
      'article-body': ArticleBody,
      'app-footer': Footer,
      'app-header': Header,
      'latest-list': LatestList,
      'related-list': RelatedList,
      'vue-dfp-provider': VueDfpProvider,
      // slider
    },
    data() {
      return {
        commonData: this.$store.state.commonData,
        dfpConst: {
          adUnitPath: '/421342134/test_pc_np_ap_970x250_HD',
          adSize: [ [ 970, 250 ] ],
          adElementId: 'test_pc_np_ap_970x250_HD'
        },
        editorChoice: this.$store.state.editorChoice,
        latestArticle: this.$store.state.latestArticle,
        state: {},
        pages:[
          {
            title: '',
            style:{
             background:'url(https://www.mirrormedia.mg/assets/images/20161004150408-ca738362e4bac35397aed564f47fd308-tablet.jpg)'
            }
          },
          {
           title: '',
           style:{
            background:'url(https://storage.googleapis.com/mirrormedia-files/assets/images/20161004150331-21776ff51173ea2320f015cbc50a270f-desktop.png)'
            }
          },
          {
            title: 'slide3',
            style:{
              background:'#4bbfc3',
            },
          }
        ],
      }
    },
    computed: {
      articleData() {
        return _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
      },
      articleStyle() {
        return _.get(this.articleData, [ 'style' ], '')
        // return 'photography'
      },
      currArticleSlug() {
        return _.get(this.articleData, [ 'slug' ], '')
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
      relateds() {
        return _.get(this.articleData, [ 'relateds' ])
      },
      showRelated() {
        const { relateds } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ], [])
        return (relateds.length > 0)
      },
      // showSlides() {
      //   console.log('false');
      //   return false
      // },
      // swiper() {
      //   return this.$refs.mySwiperA.swiper
      // },
    },
    beforeMount() {},
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

      // window.onload = (e) => {
      //   this.showSlides = true
      // }

    },
    metaInfo() {
      const { brief, categories, dfpId, fbAppId, fbPagesId, heroImage, id, ogDescription, ogImage, ogTitle, sections, tags, title, topics } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ], {})
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
          { property: 'og:url', content: '/posts/' + id },
          { property: 'og:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
        ]
      }
    }
  }

</script>
<style lang="stylus">
  .article-container {
    width: 100%;
    background-color: #414141;
    .article-heromedia {
      margin: 0 auto;
      padding-top: 30px;
      background-color: #fff;
      max-width: 1160px;

      .heroimg {
        width: 100%;
      }
      .heroimg-caption {
        margin-top: 5px;
        padding: 0 50px;
      }
    }
    .article {
      font-family: "Noto Sans TC", STHeitiTC-Light, "Microsoft JhengHei", sans-serif;
      max-width: 1160px;
      margin: 0 auto;
      background-color: #fff;
      padding: 30px 50px 0;

      .article_aside {
        float: right;
        padding-top: 10px;
        width: 310px;
      }
      .article_footer {
        text-align: center;
      }
      .split-line {
        overflow: hidden;
        &::after {
          content: "";
          display: inline-block;
          height: 0.5em;
          vertical-align: bottom;
          width: 100%;
          margin: 30px -100% 30px 0;
          border-top: 1px solid #c5c5c5;
        }
      }
    }
    .ad-container.full {
      max-width: 1160px;
      background-color: #fff;
      margin: 0 auto;
      padding-top: 30px;
    }
  }
</style>
