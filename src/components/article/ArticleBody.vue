<template>
  <div class="article_body" v-if="articleData">
    <div class="article_basic-info">
      <div class="category">
        <span class="categorySquare" :style="category[ 'style' ]" v-text="category[ 'categoryTitle' ]"></span>
      </div>
      <div class="date" v-text="date"></div>
    </div>
    <div class="article_title"><h2 v-text="title"></h2></div>
    <div class="article_credit" v-html="credit"></div>
    <main class="article_main">
      <div class="brief" v-html="getContent('brief')"></div>
      <div class="split-line"></div>
      <div class="content" v-html="getContent('content')"></div>
      <div class="article_main_tags">
        <i class="tags_icon"></i>
        <div class="tags" v-text="tags"></div>
      </div>
      <div class="split-line"></div>
      <div style="display: flex; justify-content: space-around;">
        <!-- <vue-dfp :is="props.vueDfp" pos="PCE1"></vue-dfp>
        <vue-dfp :is="props.vueDfp" pos="PCE2"></vue-dfp> -->
      </div>
      <div class="article_main_pop">
        <pop-list :pop="poplistData"></pop-list>
      </div>
      <div style="margin: 1.5em 0;">
        <div class="fb-comments" v-bind:data-href="articleUrl" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>
      </div>
        <!-- <slider :pages="pages" :sliderinit="sliderinit" v-show="showSlides"> -->
          <!-- slot  -->
        <!-- </slider> -->
    </main>
    <slot name="aside"></slot>
  </div>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP, DFP_UNITS } from '../../constants'
import { getHref, getTruncatedVal, getValue } from '../../utils/comm'
import PopList from './PopList.vue'

export default {
  components: {
    'pop-list': PopList
  },

  computed: {
    componentPop() {
      return PopList
    },
    articleUrl() {
      const { slug } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
      return `https://www.mirrormedia.mg/story/${slug}`
    },

    category() {
      const categoryId =  _.get(this.articleData, [ 'categories', 0, 'id' ])
      const categoryTitle =  _.get(this.articleData, [ 'categories', 0, 'title' ])
      const sectionId = _.get(this.articleData, [ 'sections', 0, 'id' ])
      const style = { borderLeft: _.get( SECTION_MAP, [sectionId, 'borderLeft'], '7px solid #414141;') }
      return { categoryId, categoryTitle, style }
    },
    credit() {
      const { cameraMan, designers, engineers, photographers, writers } = this.articleData
      const creditWriterStr = (writers.length > 0) ? '文｜' + writers.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditPhotoStr = (photographers.length > 0) ? '攝影｜' + photographers.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditDesignStr = (designers.length > 0) ? '設計｜' + designers.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditEnginStr = (engineers.length > 0) ? '工程｜' + engineers.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditCamStr = (cameraMan.length > 0) ? '影音｜' + cameraMan.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      return [ creditWriterStr, creditPhotoStr, creditDesignStr, creditEnginStr, creditCamStr ].filter((o) => (o.length > 0)).join('&nbsp;&nbsp;&nbsp;&nbsp;')
      return ''
    },
    date() {
      const { publishedDate = '' } = this.articleData
      const normalizedDt = new Date(publishedDate)
      const mm = normalizedDt.getMonth() + 1;
      const dd = normalizedDt.getDate();

      return [ normalizedDt.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd ].join('.')
    },
    popularlist() {
      const { report = [] } = _.get(this.$store, [ 'state', 'articlesPopList' ], {})
      return report
    },
    purePoplistData() {
      console.log('call');
      return this.popularlist
    },
    title() {
      const { title } = this.articleData
      return title
    },
    tags() {
      const { tags } = this.articleData
      return tags.map((o) => (_.get(o, [ 'name' ], ''))).join('、')
    },

  },
  methods: {
    getHref,
    getTruncatedVal,
    getValue,
    getContent(targ) {
      const { brief : { apiData: briefApiData = [] }, content : { apiData: ContentApiData = [] }, tags, title } = this.articleData
      // console.log('this.data.popularlist:', this.data.popularlist);
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
          case 'blockquote':
            return `<blockquote class="quote"><i class="quoteIcon"></i><div class="quote-content">${_.get(o.content, [ 0 ], '')}</div></blockquote>`
          case 'embeddedcode':
            return `<div class=\"embedded\">${_.get(o.content, [ 0, 'embeddedCode' ], '')}</div>`
          case 'header-two':
            return `<h2>${o.content.toString()}</h2>`
          case 'image':
            return `<div class=\"innerImg ${_.get(o.content, [ 0, 'alignment' ], '')}\"><img src=${_.get(o.content, [ 0, 'url' ], '')} width=\"\" srcset=\"${_.get(o.content, [ 0, 'mobile', 'url' ], '')} 800w, ${_.get(o.content, [ 0, 'tablet', 'url' ], '')} 1200w, ${_.get(o.content, [ 0, 'desktop', 'url' ], '')} 2000w\"/><div class=\"caption\">${_.get(o.content, [ 0, 'description' ], '')}</div></div>`
          case 'infobox':
            return `<div class="info-box-container ${_.get(o.content, [ 0, 'alignment' ], '')}">
                      <span class="info-box-icon"></span>
                      <div class="info-box">
                        <div class="info-box-title">${_.get(o.content, [ 0, 'title' ], '')}</div>
                        <div class="info-box-body">${_.get(o.content, [ 0, 'body' ], '')}</div>
                      </div>
                    </div>`
          // case 'slideshow':
          //   return o.content.map((i) => {
          //     return `<img src=${_.get(i, [ 'url' ], '')} srcset=\"${_.get(i, [ 'mobile', 'url' ], '')} 800w, ${_.get(i, [ 'tablet', 'url' ], '')} 1200w, ${_.get(i, [ 'desktop', 'url' ], '')} 2000w\"/>`
          //   }).join('')
          case "quoteby":
            const quoteBody = _.get(o.content, [ 0, 'quote' ], '')
            const quoteBy = _.get(o.content, [ 0, 'quoteBy' ], '')
            return `<blockquote class="blockquote">
                      <div class="content">
                        <span class="triangle"></span><div class="quote-body">${_.get(o.content, [ 0, 'quote' ], '').replace(/\n/g, '<br>')}</div>
                        ${(quoteBy.length > 0) ? `<div class="quote-by">${quoteBy}</div>` : ``}
                      </div>
                    </blockquote>`
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
    test(o) {
      console.log(o);
      return o
    },
  },
  name: 'article-body',
  props: {
    articleData: {
      default: () => { return {} }
    },
    poplistData: {
      default: () => { return {} }
    },
  },
}
</script>
<style lang="stylus">
  .article_body {
    width: 100%;
    .article_basic-info {
      display: flex;
      margin-top: 20px;
      justify-content: space-between;
      .category {
        font-size: 21px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .categorySquare {
          display: inline-block;
          height: 24px;
          padding-left: 10px;
        }
      }
      .date {
        font-style: italic;
        font-size: 17px;
        color: #a1a1a1;
        font-weight: normal;
      }

    }
    .article_title {
      width: 100%;
      h2 {
        font-size: 40px;
        font-weight: 400;
        margin: 15px 0;
      }
    }
    .article_credit {
      a.blue:hover, a.blue:link, a.blue:visited {
        color: #74afd2;
      }
    }
    .article_main {
      width: 695px;
      display: inline-block;
      max-width: 695px;
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
          border-bottom: 2px solid #255577;
          margin-bottom: 30px;
          padding-bottom: 10px;
        }
        &.left {
          float: left;
          width: 300px;
          margin-right: 20px;
          border-bottom: 2px solid #255577;
          margin-bottom: 30px;
          padding-bottom: 10px;
        }
      }
      .article_main_pop {
        clear: both;
        margin-top: 50px;
      }
      .article_main_tags {
        clear: both;
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
        line-height: 36px;
        font-size: 18px;
        color: rgba(65, 65, 65, 0.61);
        p {
          strong {
            color: #000;
          }
        }
      }
      & > .content {
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
          padding-bottom: 56.25%;
          padding-top: 25px;
          position: relative;
          iframe {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
      a, a:hover, a:link, a:visited {
        color: #3195b3;
        text-decoration: none;
        cursor: pointer;
        border-bottom: 1px solid #3195b3;
        padding-bottom: 5px;
      }
      code {
        background-color: #85faff;
        font-size: 18px;
        padding: 4px 0;
      }
      blockquote.blockquote {
        clear: both;
        padding: 10px 35px;
        margin-top: 50px;
        .content {
          border-top: 3px solid #255577;
          padding-top: 20px;
          padding-left: 30px;
          border-left: 3px solid #255577;
          font-size: 24px;
          color: #3a759e;
          .triangle::before{
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 50px 0 0 70px;
            position: relative;
            top: -70px;
            left: 30px;
            display: block;
            border-color: transparent transparent transparent #255577;
          }
          .triangle::after{
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 50px 0 0 70px;
            position: relative;
            top: -114px;
            left: 33px;
            display: block;
            border-color: transparent transparent transparent #ffffff;
          }
          .quote-body {
            margin-top: -95px;
            line-height: 44px;
          }
          .quote-by {
            text-align: right;
            font-size: 18px;
            margin-top: 18px;
            &::before {
              content: '';
              display: inline-block;
              height: 100%;
              vertical-align: super;
              width: 36px;
              margin-right: 5px;
              border-top: 1px solid #3a759e;
            }
          }
        }
      }
      blockquote.quote {
        clear: both;
        display: flex;
        margin: 30px 0;
        i {
          background-image: url(https://mirrormedia.mg/assets/images/quote.png);
          width: 45px;
          height: 45px;
          background-repeat: no-repeat;
          background-size: contain;
          display: block;
          margin-right: 20px;
        }
        .quote-content {
          font-size: 24px;
          color: #3a759e;
        }
      }
      .info-box-container {
        clear: both;
        width: 100%;
        .info-box-icon {
          &::before {
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 12px 18px;
            position: relative;
            left: 0;
            top: 60px;
            display: block;
            border-color: #255577;
          }
          &::after {
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 10px 0px 0px 18px;
            position: relative;
            left: 0;
            top: 60px;
            display: block;
            border-color: #7b7b7b transparent transparent transparent;
          }
        }
        .info-box {
          border: 1px solid #eaeaea;
          padding: 30px 50px;
          box-shadow: 0 0 14px rgba(146, 146, 146, 0.52);
          width: 95%;
          margin: 0 auto;
          .info-box-title {
            color: #3a6888;
            font-size: 25px;
            margin-bottom: 15px;
          }
          .info-box-body {
            p, li {
              color: rgba(0, 0, 0, 0.64);
              font-size: 16px;
            }
          }
        }
      }
      h2 {
        font-size: 32px;
      }
      h3 {
        font-size: 26px;
      }
      ul {
        font-family: "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif;
        font-size: 16px;
        line-height: 2.2;
        letter-spacing: 0.3px;
        color: rgba(0, 0, 0, 0.701961);
        padding-left: 26px;
        text-indent: -26px;
        margin-left: 16px;
        list-style: none;
        li {
          &::before {
            content: "• ";
            color: #2d5b7b;
            font-size: 30px;
            line-height: 1;
            top: 6px;
            position: relative;
          }
        }
      }
    }
  }
</style>
