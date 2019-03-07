<template>
  <ArticleBodyLayout class="article_body" v-if="!isArticleEmpty()" :class="styleForCurrArticle">
    <main class="article_main">
      <div class="article_basic-info">
        <div class="category">
          <span v-if="!isAd" class="categorySquare" :style="category[ 'style' ]" v-text="category[ 'categoryTitle' ]"></span>
        </div>
        <div class="date" v-text="date"></div>
      </div>
      <h1 v-text="title"></h1>
      <h2 v-if="subtitle.length > 0" v-text="subtitle"></h2>
      <div class="article__basic-info">
        <div class="article__basic-info-wrapper">
          <div class="article__credit" v-html="credit"></div>
          <div class="article__share">
            <ShareLight :gtmCategory="'article'" />
          </div>
        </div>
      </div>
      <slot name="hero"></slot>
      <div class="brief fb-quotable">
        <div v-for="p in briefArr">
          <ArticleImg v-if="p.type === 'image'"
            :viewport="viewport"
            :image="getValue(p, [ 'content', 0 ])"
            :class="`innerImg ${getValue(p.content, [ 0, 'alignment' ], '')}`"></ArticleImg>            
          <div v-else-if="p.type === 'video'" is="article-video" 
            :id="'latest-'+ p.id" 
            :video="getValue(p, [ 'content', 0], {})" :class="`video ${getValue(p, [ 'alignment' ], '')}`"></div>
          <div v-else-if="p.type === 'audio'" is="audio-box" 
            :id="'latest-'+ p.id" 
            :audio="getValue(p, [ 'content', 0], {})"></div>
          <div v-else-if="p.type === 'slideshow'" is="app-slider" class="per-slide" :option="sliderOption" :slideId="p.id">
            <template slot-scope="props">
              <swiper-slide :is="props.slide" v-for="(o, i) in getValue(p, [ 'content'], [])" :key="`${i}-${Date.now()}`">
                <div>
                  <div class="slideshowImg">
                    <img :alt="getValue(o, [ 'description' ], '')"
                          :src="getValue(o, [ 'url' ], '')"
                          :srcset="`${getValue(o, [ 'mobile', 'url' ], '')} 800w,
                                      ${getValue(o, [ 'tablet', 'url' ], '')} 1200w,
                                      ${getValue(o, [ 'desktop', 'url' ], '')} 2000w`">
                    <div class="img-caption" v-text="getValue(o, [ 'description' ], '')"></div>
                  </div>
                </div>
              </swiper-slide>
            </template>
          </div>
          <div v-else-if="p.type === 'annotation'">
            <annotation :annotationStr="getValue(p, [ 'content' ])"></annotation>
          </div>
          <div v-else :style="{ backgroundColor: category.color || '#bcbcbc' }" v-html="paragraphComposer(p)"></div>
        </div>        
      </div>
      <div class="split-line"></div>
      <article class="content" id="article-body-content">
        <LazyItemWrapper>
          <div v-for="(p, index) in contArr" :key="`${articleData.slug}-content-${index}`">
            <ArticleImg v-if="p.type === 'image'"
              :viewport="viewport"
              :image="getValue(p, [ 'content', 0 ])"
              :class="`innerImg ${getValue(p.content, [ 0, 'alignment' ], '')}`"></ArticleImg>
            <div v-else-if="p.type === 'video'" is="article-video" 
              :id="'latest-'+ p.id" 
              :video="getValue(p, [ 'content', 0], {})" :class="`video ${getValue(p, [ 'alignment' ], '')}`"></div>
            <div v-else-if="p.type === 'audio'" is="audio-box" 
              :id="'latest-'+ p.id" 
              :audio="getValue(p, [ 'content', 0], {})"></div>
            <div v-else-if="p.type === 'slideshow'" is="app-slider" class="per-slide" :option="sliderOption" :slideId="p.id">
              <template slot-scope="props">
                <swiper-slide :is="props.slide" v-for="(o, i) in getValue(p, [ 'content'], [])" :key="`${i}-${Date.now()}`">
                  <div>
                    <div class="slideshowImg">
                      <img :alt="getValue(o, [ 'description' ], '')"
                            :src="getValue(o, [ 'url' ], '')"
                            :srcset="`${getValue(o, [ 'mobile', 'url' ], '')} 800w,
                                        ${getValue(o, [ 'tablet', 'url' ], '')} 1200w,
                                        ${getValue(o, [ 'desktop', 'url' ], '')} 2000w`">
                      <div class="img-caption" v-text="getValue(o, [ 'description' ], '')"></div>
                    </div>
                  </div>
                </swiper-slide>
              </template>
            </div>
            <div v-else-if="p.type === 'annotation'" class="content--annotation">
              <annotation :annotationStr="getValue(p, [ 'content' ])"></annotation>
            </div>
            <div v-else v-html="paragraphComposer(p)"></div>
            <slot name="dfpad-AR1" v-if="index === firstTwoUnstyledParagraph[ 0 ]"></slot>
            <slot name="dfpad-AR2" v-if="index === firstTwoUnstyledParagraph[ 1 ]"></slot>
            <slot v-if="index === lastUnstyledParagraph - 1" name="relatedListInContent"></slot>
          </div>
        </LazyItemWrapper>
      </article>
      <div class="article_main_related_bottom">
        <slot name="relatedlistBottom"></slot>
      </div>
      <newsletter></newsletter>
      <div>更多內容，歡迎<a :href="socialLink.SUBSCRIBE" target="_blank">訂閱鏡週刊</a>、<a :href="socialLink.AUTH" target="_blank">了解內容授權資訊</a>。</div>
      <div class="article_main_tags">
        <p>相關關鍵字：</p>
        <div class="tags" v-html="tags" v-if="tags.length > 0"></div>
      </div>
      <div class="split-line"></div>
      <div class="fbPagePlugin">
        <div class="fb-page" data-href="https://www.facebook.com/mirrormediamg/" data-adapt-container-width="true" data-small-header="true" data-hide-cover="true" data-show-facepile="false">
          <blockquote cite="https://www.facebook.com/mirrormediamg/" class="fb-xfbml-parse-ignore">
            <a href="https://www.facebook.com/mirrormediamg/">鏡週刊</a>
          </blockquote>
        </div>
      </div>
      <div class="herbsapi">
        <div id="herbsapi" hb-width="100" hb-height="auto" hb-icon="https://mediafarmers.org/api/images/icon_2.png"></div>
        <div>喜歡這篇文章嗎？<br>歡迎灌溉支持喔！</div>
      </div>
      <div class="dfpad-set" :class="{ mobile: viewport < 1000 }">
        <slot name="dfpad-set"></slot>
      </div>
      <slot name="recommendList"></slot>
      <div class="article_main_pop">
        <slot name="poplist"></slot>
      </div>
      <slot name="slot_fb_comment"></slot>
    </main>
    <slot name="aside"></slot>
  </ArticleBodyLayout>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP, SOCIAL_LINK } from '../../constants'
import { getValue } from '../../util/comm'
// import { getRole } from '../../util/mmABRoleAssign'
import ArticleBodyLayout from 'src/components/article/ArticleBodyLayout.vue'
import Annotation from './Annotation.vue'
import ArticleVideo from './Video.vue'
import AudioBox from '../../components/AudioBox.vue'
// import Cookie from 'vue-cookie'
import ArticleImg from 'src/components/article/ArticleImg.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import Newsletter from '../../components/Newsletter.vue'
import ProjectList from './ProjectList.vue'
import ShareLight from 'src/components/share/ShareLight.vue'
import Slider from '../Slider.vue'
import moment from 'moment'

// const debug = require('debug')('CLIENT:ArticleBody')
export default {
  components: {
    'app-slider': Slider,
    'audio-box': AudioBox,
    'newsletter': Newsletter,
    'proj-list': ProjectList,
    Annotation,
    ArticleBodyLayout,
    ArticleVideo,
    ArticleImg,
    LazyItemWrapper,
    ShareLight
  },
  computed: {
    articleStyle () {
      return _.get(this.articleData, [ 'style' ], '')
    },
    briefArr () {
      return _.filter(_.get(this.articleData, [ 'brief', 'apiData' ], []), p => {
        const content = p.content || []
        const reduce = _.reduce(content, (sum, n) => sum + _.isObject(n) ? '(OBJECT)' : n.trim(), '')
        return reduce ? p : undefined
      })
    },
    category () {
      const sectionId = _.get(this.articleData, [ 'sections', 0, 'id' ], '')
      const sectionTitle = _.get(this.articleData, [ 'sections', 0, 'title' ], '')
      const categoryId = _.get(this.articleData, [ 'categories', 0, 'id' ], '')
      const categoryTitle = _.get(this.articleData, [ 'categories', 0, 'title' ], sectionTitle)
      const shouldShow = !_.get(this.articleData, [ 'isAdvertised' ], false) ? {} : { display: 'none;' }
      const style = { borderLeft: `7px solid ${_.get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#bcbcbc')}` }
      const color = _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#bcbcbc')
      return { categoryId, categoryTitle, style: Object.assign(style, shouldShow), color }
    },
    contArr () {
      return _.get(this.articleData, [ 'content', 'apiData' ], [])
    },
    credit () {
      const { cameraMan = [], designers = [], engineers = [], extendByline = '', photographers = [], writers = [] } = this.articleData
      const creditWriterStr = (writers.length > 0) ? '文｜' + writers.filter((o) => (o !== null && o !== undefined)).map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditPhotoStr = (photographers.length > 0) ? '攝影｜' + photographers.filter((o) => (o !== null && o !== undefined)).map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditDesignStr = (designers.length > 0) ? '設計｜' + designers.filter((o) => (o !== null && o !== undefined)).map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditEnginStr = (engineers.length > 0) ? '工程｜' + engineers.filter((o) => (o !== null && o !== undefined)).map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditCamStr = (cameraMan.length > 0) ? '影音｜' + cameraMan.filter((o) => (o !== null && o !== undefined)).map((o) => (`<a class=\"blue\" href=\"/author/${o.id}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditElse = (extendByline.length > 0) ? extendByline + '&nbsp;' : ''
      return [ creditWriterStr, creditPhotoStr, creditDesignStr, creditEnginStr, creditCamStr, creditElse ].filter((o) => (o.length > 0)).join('&nbsp;&nbsp;&nbsp;&nbsp;')
    },
    date () {
      const { publishedDate = '' } = this.articleData
      const normalizedDt = new Date(publishedDate)
      const datetime = moment(normalizedDt).format('YYYY.MM.DD HH:mm')
      return datetime
    },
    popularlist () {
      const { report } = _.get(this.$store, [ 'state', 'articlesPopList' ], { report: [] })
      return report
    },
    styleForCurrArticle () {
      switch (this.articleStyle) {
        case 'wide':
          return {
            'single-col': (this.viewport > 1199)
          }
        default:
          return {
            'single-col': false
          }
      }
    },
    sliderOption () {
      return {
        initialSlide: 0,
        lazyLoadingInPrevNextAmount: 2,
        paginationable: false,
        paginationClickable: true,
        paginationHide: false,
        setNavBtn: true
      }
    },
    socialLink () {
      return SOCIAL_LINK
    },
    subtitle () {
      const { subtitle = [] } = this.articleData
      return subtitle
    },
    title () {
      const { title } = this.articleData
      return title
    },
    tags () {
      const { tags = [] } = this.articleData
      const separator = ''
      return tags.map(tag => `<a href=\"/tag/${_.get(tag, 'id', '')}\" id=\"tag-${_.get(tag, 'id', '')}\">${_.get(tag, 'name', '')}</a>`).join(separator)
    },
    firstTwoUnstyledParagraph () {
      const { content } = this.articleData
      const records = []
      let count = 0
      let index = 0
      let lastUnstyled = 0
      while (count < 2 && index < content[ 'apiData' ].length) {
        if (content[ 'apiData' ][ index ][ 'type' ] === 'unstyled' && (lastUnstyled + 4) < index) {
          count++
          lastUnstyled = index
          records.push(index)
        }
        index++
      }
      return records
    },
    lastUnstyledParagraph () {
      const regex = /^<\s*a[^>]*>/
      let last = this.contArr.length - 1
      this.contArr.map((content, index) => {
        if (content.type === 'unstyled' && content.content[0] && !content.content[0].match(regex)) {
          last = index
        }
      })
      return last
    }
  },
  data () {
    return {
      isAdCoverCalledYet: false,
      renderingStartTime: undefined
    }
  },
  methods: {
    getValue,
    isArticleEmpty () {
      return _.isEmpty(this.articleData)
    },
    moment,
    paragraphComposer (item) {
      switch (item.type) {
        case 'blockquote':
          return `<blockquote class="quote"><i class="quoteIcon"></i><div class="quote-content">${_.get(item.content, [ 0 ], '')}</div></blockquote>`
        case 'code-block':
          return `<code>${_.get(item.content, [ 0 ], '')}</code>`
        case 'embeddedcode':
          return `<div class=\"embedded\ ${_.get(item.content, [ 0, 'alignment' ], '')}">${_.get(item.content, [ 0, 'embeddedCode' ], '')}<div class=\"caption\">${_.get(item.content, [ 0, 'caption' ], '')}</div></div>`
        case 'header-two':
          return `<h2>${item.content.toString()}</h2>`
        case 'infobox':
          return `<div class="info-box-container ${_.get(item, [ 'alignment' ], '')}">
                    <span class="info-box-icon"></span>
                    <div class="info-box">
                      <div class="info-box-title">${_.get(item.content, [ 0, 'title' ], '')}</div>
                      <div class="info-box-body">${_.get(item.content, [ 0, 'body' ], '')}</div>
                    </div>
                  </div>`
        case 'ordered-list-item':
          const _liStrOrdered = item.content.map((i) => {
            if (typeof i !== 'object') {
              return `<li>${i}</li>`
            } else {
              return i.map((j) => (`<li>${j}</li>`)).join('')
            }
          }).join('')
          return `<ol class="${_.get(item, [ 'alignment' ], '')} ordered-list-item">${_liStrOrdered}</ol>`
        case 'quoteby':
          const quoteBy = _.get(item.content, [ 0, 'quoteBy' ], '')
          return `<blockquote class="blockquote">
                    <div class="content">
                      <span class="triangle"></span><div class="quote-body">${_.get(item.content, [ 0, 'quote' ], '').replace(/\n/g, '<br>')}</div>
                      ${(quoteBy.length > 0) ? `<div class="quote-by">${quoteBy}</div>` : ``}
                    </div>
                  </blockquote>`
        case 'slideshow':
          return `<div class=\"slideshowImg\">
                    <img alt="${_.get(item.content, [ 0, 'description' ], '')}" src="${_.get(item.content, [ 0, 'url' ], '')}" width=\"\"
                         srcset=\"${_.get(item.content, [ 0, 'mobile', 'url' ], '')} 800w,
                                       ${_.get(item.content, [ 0, 'tablet', 'url' ], '')} 1200w,
                                       ${_.get(item.content, [ 0, 'desktop', 'url' ], '')} 2000w\" />
                    <div class=\"img-caption\">${_.get(item.content, [ 0, 'description' ], '')}</div>
                  </div>`
        case 'unordered-list-item':
          const _liStrUnordered = item.content.map((i) => {
            if (typeof i !== 'object') {
              return `<li>${i}</li>`
            } else {
              return i.map((j) => (`<li>${j}</li>`)).join('')
            }
          }).join('')
          return `<ul class="${_.get(item, [ 'alignment' ], '')} unordered-list-item">${_liStrUnordered}</ul>`
        case 'unstyled':
          return (item.content.toString().length > 0) ? `<p>${item.content.toString()}</p>` : ''

        case 'youtube':
          return `<div class=\"youtube\">
                    <div class=\"youtube-container\">
                      <iframe width=\"560\" alt=\"\" height=\"315\" src=\"https://www.youtube.com/embed/${_.get(item.content, [ 0, 'youtubeId' ], '')}\" frameborder=\"0\" allowfullscreen> </iframe>
                    </div>
                    <div class=\"caption\">${_.get(item.content, [ 0, 'description' ], '')}</div>
                  </div>`
        default:
          return
      }
    },
  },
  mounted () {
    /*global twttr*/
    window.addEventListener('load', () => {
      window.twttr && twttr.widgets.load() 
    })
  },
  name: 'article-body',
  props: {
    articleData: {
      default: () => { return {} }
    },
    projlistData: {
      default: () => { return [] }
    },
    viewport: {
      default: () => { return undefined }
    },
    isAd: {
      default: () => false
    }
  }
}
</script>
