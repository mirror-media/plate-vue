<template>
  <vue-dfp-provider>
    <template scope="props" slot="dfpPos">
      <div class="article">
        <div id="fb-root"></div>
        <vue-dfp :is="props.vueDfp" pos="PCHD"></vue-dfp>
        <div class="split-line"></div>
        <div class="article_basic-info">
          <div class="category">
            <span class="categorySquare" :style="category[ 'style' ]"></span>{{ category[ 'categoryTitle' ] }}
          </div>
          <div class="date">{{ date }}</div>
        </div>
        <div class="article_title"><h2>{{ title }}</h2></div>
        <div class="article_credit" v-html="credit"></div>
        <div class="article_heromedia" v-if="heroVideo" >
          <video class="heroimg video" width="100%" height="100%" :src="getValue(heroVideo, [ 'video', 'url' ])" type="video/mp4" controls
                  :poster="heroVideo.poster">
            Your browser does not support the video tag.
          </video>
          <div class="playpause"></div>
        </div>
        <div class="article_heromedia" v-else="heroImage">
          <img v-if="heroImage.image" class="heroimg" :src="getValue(heroImage, [ 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ])"
                :srcset="getValue(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ]) + ' 800w, ' +
                          getValue(heroImage, [ 'image', 'resizedTargets', 'tablet', 'url' ]) + ' 1200w, ' +
                          getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ]) + ' 2000w'"/>
          <div class="heroimg-caption"></div>
        </div>
        <main class="article_main">
          <div class="brief" v-html="getContent('brief')"></div>
          <div class="split-line"></div>
          <div class="content" v-html="getContent('content')"></div>
          <div class="article_main_tags">
            <i class="tags_icon"></i>
            <div class="tags">
              {{ tags }}
            </div>
          </div>
          <vue-dfp :is="props.vueDfp" pos="PCAR"></vue-dfp>
          <div class="split-line"></div>
          <div style="display: flex; justify-content: space-around;">
            <vue-dfp :is="props.vueDfp" pos="PCE1"></vue-dfp>
            <vue-dfp :is="props.vueDfp" pos="PCE2"></vue-dfp>
          </div>
          <div class="article_main_pop">
            <div class="pop_title"><h3>熱門文章：</h3></div>
            <div class="pop_list">
              <div class="pop_item" v-for="(o, i) in popularlist">
                <div><a href=""><div class="pop_item_img" :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '') + ')' }"></div></a></div>
                <div class="pop_item_title"><a href="">{{ o.title }}</a></div>
              </div>
            </div>
          </div>
          <div style="margin: 1.5em 0;">
            <div class="fb-comments" v-bind:data-href="articleUrl" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>
          </div>
        </main>
        <aside class="article_aside">
          <vue-dfp :is="props.vueDfp" pos="PCR1"></vue-dfp>
          <latest-list :latest="popularlist"></latest-list>
          <vue-dfp :is="props.vueDfp" pos="PCR2"></vue-dfp>
          <related-list :relateds="relateds"></related-list>
        </aside>
        <div class="article_footer">
          <vue-dfp :is="props.vueDfp" pos="PCFT" dimensions="970x90"></vue-dfp>
        </div>
      </div>
    </template>
  </vue-dfp-provider>
</template>
<script>
  import _ from 'lodash'
  import { CATEGORY_MAP, DFP_UNITS } from '../constants'
  import LatestList from '../components/article/LatestList.vue'
  import RelatedList from '../components/article/RelatedList.vue'
  import VueDfpProvider from '../utils/plate-vue-dfp/PlateDfpProvider.vue'
  import sanitizeHtml from 'sanitize-html'
  import store from '../store'
  import truncate from 'truncate'

  const fetchArticles = (store) => {
    return store.dispatch('FETCH_ARTICLES', {
      params: {
        where: {
          'slug': store.state.route.params.slug
        }
      }
    }).then(() => {
      return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
    })
  }
  const fetchPop = (store) => {
    return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
  }

  export default {
    name: 'article-view',
    preFetch: fetchArticles,
    components: {
      'latest-list': LatestList,
      'related-list': RelatedList,
      'vue-dfp-provider': VueDfpProvider
    },
    data() {
      return {
        state: {},
        dfpConst: {
          adUnitPath: '/421342134/test_pc_np_ap_970x250_HD',
          adSize: [ [ 970, 250 ] ],
          adElementId: 'test_pc_np_ap_970x250_HD'
        }
      }
    },
    computed: {
      articleUrl() {
        const { slug } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return `https://www.mirrormedia.mg/story/${slug}`
      },
      brief() {
        const { brief : { apiData = [] } } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        const briefParagraphs = this.getParagraphs(apiData)
        return ''

      },
      category() {
        const categoryId =  _.get(this.$store, [ 'state', 'articles', 'items', 0, 'categories', 0, 'id' ])
        const categoryTitle =  _.get(this.$store, [ 'state', 'articles', 'items', 0, 'categories', 0, 'title' ])
        const style = { backgroundColor: _.get(CATEGORY_MAP, ['categoryId', 'bgcolor'], 'none;') }
        return { categoryId, categoryTitle, style }
      },
      credit() {
        const { cameraMan, designers, engineers, photographers, writers } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        const creditWriterStr = (writers.length > 0) ? '文｜' + writers.map((o) => (`<a href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditPhotoStr = (photographers.length > 0) ? '攝影｜' + photographers.map((o) => (`<a href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditDesignStr = (designers.length > 0) ? '設計｜' + designers.map((o) => (`<a href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditEnginStr = (engineers.length > 0) ? '工程｜' + engineers.map((o) => (`<a href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditCamStr = (cameraMan.length > 0) ? '影音｜' + cameraMan.map((o) => (`<a href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
        return [ creditWriterStr, creditPhotoStr, creditDesignStr, creditEnginStr, creditCamStr ].filter((o) => (o.length > 0)).join('&nbsp;&nbsp;&nbsp;&nbsp;')
      },
      date() {
        const { publishedDate } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        const normalizedDt = new Date(publishedDate)
        const mm = normalizedDt.getMonth() + 1;
        const dd = normalizedDt.getDate();

        return [ normalizedDt.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd ].join('.')
      },
      heroImage() {
        const { heroImage } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return heroImage
      },
      heroVideo() {
        const { heroImage, heroVideo, ogImage } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        const heroImgUrl= _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], undefined)
        const ogImgUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], undefined)
        const poster = (ogImgUrl) ? ogImgUrl : ((heroImgUrl) ? heroImgUrl : '/asset/review.png')
        return (heroVideo) ? Object.assign(heroVideo, { poster }) : heroVideo
      },
      popularlist() {
        const { report } = _.get(this.$store, [ 'state', 'articlesPopList' ])
        return report
      },
      relateds() {
        const { relateds } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return relateds
      },
      tags() {
        const { tags } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return tags.map((o) => (o.name)).join('、')
      },
      title() {
        const { title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return title
      },
    },
    beforeMount() {
    },
    methods: {
      getContent(targ) {
        const { brief : { apiData: briefApiData = [] }, content : { apiData: ContentApiData = [] }, tags, title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        let paragraphs = []
        switch(targ) {
          case 'brief':
            paragraphs = this.getParagraphs(briefApiData)
            break;
          case 'content':
            paragraphs = this.getParagraphs(ContentApiData)
            break;
        }
        return paragraphs.join('')
      },
      getParagraphs(data) {
        return data.map((o) => {
          switch(o.type) {
            case 'embeddedcode':
              return `<div class=\"embedded\">${_.get(o.content, [ 0, 'embeddedCode' ], '')}<div>`
            case 'header-two':
              return `<h2>${o.content.toString()}</h2>`
            case 'image':
              return `<div class=\"innerImg ${_.get(o.content, [ 0, 'alignment' ], '')}\"><img src=${_.get(o.content, [ 0, 'url' ], '')} srcset=\"${_.get(o.content, [ 0, 'mobile', 'url' ], '')} 800w, ${_.get(o.content, [ 0, 'tablet', 'url' ], '')} 1200w, ${_.get(o.content, [ 0, 'desktop', 'url' ], '')} 2000w\"/><div class=\"caption\">${_.get(o.content, [ 0, 'description' ], '')}</div></div>`
            case 'infobox':
              return `<div><h4>${_.get(o.content, [ 0, 'title' ], '')}</h4>${_.get(o.content, [ 0, 'body' ], '')}</div>`
            // case 'slideshow':
            //   return o.content.map((i) => {
            //     return `<img src=${_.get(i, [ 'url' ], '')} srcset=\"${_.get(i, [ 'mobile', 'url' ], '')} 800w, ${_.get(i, [ 'tablet', 'url' ], '')} 1200w, ${_.get(i, [ 'desktop', 'url' ], '')} 2000w\"/>`
            //   }).join('')
            case 'unordered-list-item':
              const _liStr = o.content.map((i) => {
                if(typeof(i) !== 'object') {
                  return `<li>${i}</li>`
                } else {
                  return i.map((j) => (`<li>${j}</li>`)).join('')
                }
              }).join('')
              return `<ul>${_liStr}</ul>`
            case 'unstyled':
              return `<p>${o.content.toString()}</p>`
            case 'youtube':
              return `<div class=\"youtube\"><iframe width=\"560\" alt=\"\" height=\"315\" src=\"https://www.youtube.com/embed/${_.get(o.content, [ 0, 'youtubeId' ], '')}\" frameborder=\"0\" allowfullscreen> </iframe></div>`
            default:
              return
          }
        })
      },
      getPopList() {
        console.log('got pop...');
      },
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
      const { brief, categories, dfpId, fbAppId, fbPagesId, heroImage, id, ogDescription, ogImage, ogTitle, sections, tags, title, topics } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
      const categorieId = _.get(categories, [ 0, 'id' ], '')
      const imageUrl = _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const ogImageUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const pureBrief = truncate(sanitizeHtml(_.get(brief, [ 'html' ], ''), { allowedTags: [ 'em' ] }), 200)
      const pureTags = tags.map((t) => (t.name))
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
  .article {
    font-family: "Noto Sans TC", STHeitiTC-Light, "Microsoft JhengHei", sans-serif;
    .article_title {
      width: 100%;
      h2 {
        font-size: 40px;
        font-weight: 400;
        margin: 15px 0;
      }
    }
    .article_basic-info {
      display: flex;
      margin-top: 20px;
      justify-content: space-between;
      .category {
        font-size: 18px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .categorySquare {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 6px;
          box-shadow: 0 0 2px #c1c1c1;
        }
      }
      .date {
        font-style: italic;
        font-size: 17px;
        color: #a1a1a1;
        font-weight: normal;
      }
    }
    .article_credit {
      a:hover, a:link, a:visited {
		    color: #9db6d6;
			}
    }
    .article_heromedia {
      margin-top: 30px;
      .heroimg {
        width: 100%;
      }
    }
    .article_main {
      width: 650px;
      display: inline-block;
      max-width: 650px;
      overflow: hidden;
      .innerImg {
        margin-bottom: 35px;
        img {
          width: 100%;
        }
        .caption {
          font-family: "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif;
          font-size: 15px;
          line-height: 1.7;
          letter-spacing: 0.3px;
          color: rgba(0, 0, 0, 0.498039);
          padding-top: 10px;
          padding-bottom: 10px;
        }
        &.right {
          float: right;
          width: 300px;
          margin-left: 20px;
        }
        &.left {
          float: left;
          width: 300px;
          margin-right: 20px;
        }
      }
      .article_main_pop {
        margin-top: 50px;
        font-size: 18px;
        .pop_list {
          margin-top: 10px;
          display: flex;
          align-content: flex-start;
          flex-wrap: wrap;
          justify-content: space-between;
          .pop_item {
            width: 31%;
            vertical-align: top;
            margin-bottom: 30px;
            .pop_item_img {
              width: 100%;
              height: 150px;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center center;
            }
            .pop_item_title {
              background-color: #fff;
              border: 1px solid #e0e0e0;
              line-height: 18px;
              padding: 10px 15px;
              font-size: 13px;
              height: 50px;
              display: flex;
              align-items: center;
              a:hover, a:link, a:visited {
                color: #8c8c8c;
                font-weight: normal;
        			}
            }
          }
        }
      }
      .article_main_tags {
        .tags_icon {
          background-image: url(https://www.mirrormedia.mg/story/img/icon/sprite@3x.png);
          background-position: -733px -741px;
          background-repeat: no-repeat;
          background-size: 866px 862px;
          display: inline-block;
          vertical-align: middle;
          zoom: .65;

          width: 45px;
          height: 45px;
        }
        .tags {
          display: inline-block;
          color: #afb0b2;
          font-size: 18px;
        }
      }
      .brief {
        margin-top: 30px;
        p {
          strong {
            color: #000;
          }
        }
      }
      .content {
        h2 {
          color: #000;
          margin-top: 40px;
        }
        p {
          color: #171717;
          font-size: 18px;
          line-height: 36px;
          margin: 0 0 1.5em;
        }
        .youtube {
          align-items: center;
          display: flex;
          justify-content: center;
          margin: 25px 0;
        }
      }
    }
    .article_aside {
      float: right;
      padding-top: 10px;
      width: 310px;
    }
    .split-line {
      overflow: hidden;
      &::after {
        content: "";
        display: inline-block;
        height: 0.5em;
        vertical-align: bottom;
        width: 100%;
        margin: 30px -100% 0 0;
        border-top: 1px solid #c5c5c5;
      }
    }
  }
</style>
