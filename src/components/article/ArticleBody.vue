<template>
  <div class="article_body" v-if="articleData" :class="styleForCurrArticle">
    <div class="article_basic-info">
      <div class="category">
        <span class="categorySquare" :style="category[ 'style' ]" v-text="category[ 'categoryTitle' ]"></span>
      </div>
      <div class="date" v-text="date"></div>
    </div>
    <div class="article_title"><h1 v-text="title"></h1></div>
    <div class="article_subtitle" v-if="subtitle.length > 0"><h2 v-text="subtitle"></h2></div>
    <div class="article_credit" v-html="credit"></div>
    <main class="article_main">
      <div class="brief">
        <div v-for="p in briefArr">
          <div v-if="p.type !== 'slideshow' && p.type !== 'audio'" v-html="paragraphComposer(p)"></div>
          <div v-else-if="p.type === 'audio'" is="audio-box" 
                  :sources="getAudioSource(getValue(p, [ 'content', 0], {}))" 
                  :id="'latest-'+ p.id" 
                  :item="getValue(p, [ 'content', 0], {})"></div>
          <div v-else is="app-slider" class="per-slide" :option="sliderOption">
            <template scope="props">
              <swiper-slide :is="props.slide" v-for="(o, i) in getValue(p, [ 'content'], [])">
                <div v-html="paragraphComposer({ type: 'slideshow', content: [ o ] })"></div>
                <div class="swiper-lazy-preloader"></div>
              </swiper-slide>
            </template>
          </div>
        </div>        
      </div>
      <div class="split-line"></div>
      <div class="content">
        <div v-for="(p, index) in contArr">
          <div v-if="p.type !== 'slideshow' && p.type !== 'audio'" v-html="paragraphComposer(p)"></div>
          <div v-else-if="p.type === 'audio'" is="audio-box" 
                  :sources="getAudioSource(getValue(p, [ 'content', 0], {}))" 
                  :id="'latest-'+ p.id" 
                  :item="getValue(p, [ 'content', 0], {})"></div>
          <div v-else is="app-slider" class="per-slide" :option="sliderOption" :slideId="p.id">
            <template scope="props">
              <swiper-slide :is="props.slide" v-for="(o, i) in getValue(p, [ 'content'], [])">
                <div v-html="paragraphComposer({ type: 'slideshow', content: [ o ] })"></div>
                <div class="swiper-lazy-preloader"></div>
              </swiper-slide>
            </template>
          </div>
          <slot name="dfpad-AR1" v-if="index === firstTwoUnstyledParagraph[ 0 ]"></slot>
          <slot name="dfpad-AR2" v-if="index === firstTwoUnstyledParagraph[ 1 ]"></slot>
        </div>
      </div>
      <div class="article_main_tags" v-if="tags.length > 0">
        <i class="tags_icon"></i>
        <div class="tags" v-html="tags"></div>
      </div>
      <div class="split-line"></div>
      <div class="dfpad-set" style="display: flex; justify-content: space-around;">
        <slot name="dfpad-set"></slot>
      </div>
      <div class="article_main_related_bottom">
        <slot name="relatedlistBottom"></slot>
      </div>
      <div class="article_main_pop">
        <slot name="poplist"></slot>
      </div>
      <div class="article_main_proj">
        <proj-list :projects="projlistData" :viewport="viewport" />
      </div>
      <slot name="slot_fb_comment"></slot>
    </main>
    <slot name="aside"></slot>
  </div>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP } from '../../constants'
import { getHref, getTruncatedVal, getValue } from '../../utils/comm'
import AudioBox from '../../components/AudioBox.vue'
import ProjectList from './ProjectList.vue'
import Slider from '../Slider.vue'
import moment from 'moment'

export default {
  components: {
    'app-slider': Slider,
    'audio-box': AudioBox,
    'proj-list': ProjectList
  },
  computed: {
    articleStyle () {
      return _.get(this.articleData, [ 'style' ], '')
    },
    briefArr () {
      return _.get(this.articleData, [ 'brief', 'apiData' ], [])
    },
    category () {
      const categoryId = _.get(this.articleData, [ 'categories', 0, 'id' ])
      const categoryTitle = _.get(this.articleData, [ 'categories', 0, 'title' ])
      const sectionId = _.get(this.articleData, [ 'sections', 0, 'id' ])
      const style = { borderLeft: _.get(SECTION_MAP, [ sectionId, 'borderLeft' ], '7px solid #bcbcbc;') }
      return { categoryId, categoryTitle, style }
    },
    contArr () {
      return _.get(this.articleData, [ 'content', 'apiData' ], [])
    },
    credit () {
      const { cameraMan, designers, engineers, extendByline, photographers, writers } = this.articleData
      const creditWriterStr = (writers.length > 0) ? '文｜' + writers.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditPhotoStr = (photographers.length > 0) ? '攝影｜' + photographers.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditDesignStr = (designers.length > 0) ? '設計｜' + designers.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditEnginStr = (engineers.length > 0) ? '工程｜' + engineers.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
      const creditCamStr = (cameraMan.length > 0) ? '影音｜' + cameraMan.map((o) => (`<a class=\"blue\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
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
      const { report } = _.get(this.$store, [ 'state', 'articlesPopList' ], { report : []} )
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
        paginationable: false,
        paginationClickable: true,
        paginationHide: false,
        setNavBtn: true
      }
    },
    subtitle () {
      const { subtitle } = this.articleData
      return subtitle
    },
    title () {
      const { title } = this.articleData
      return title
    },
    tags () {
      const { tags } = this.articleData
      return tags.map((o) => {
        return `<a href=\"/tag/${_.get(o, [ 'id' ], '')}/${_.get(o, [ 'name' ], '')}\" id=\"tag-${_.get(o, [ 'id' ], '')}\">${_.get(o, [ 'name' ], '')}</a>`
      }).join('、')
    },
    firstTwoUnstyledParagraph () {
      const { content } = this.articleData
      let count = 0
      let index = 0
      let lastUnstyled = 0
      let records = []
      while(count < 2 && index < content[ 'apiData' ].length) {
        if(content[ 'apiData' ][ index ][ 'type' ] ===  'unstyled' && (lastUnstyled + 4) < index) {
          count ++
          lastUnstyled = index
          records.push(index)
        }
        index ++
      }
      return records
    }
  },
  methods: {
    getAudioSource (item) {
      const audioURL = []
      audioURL.push(_.get(item, [ 'url' ]))
      return audioURL
    },
    getHref,
    getTruncatedVal,
    getValue,
    moment,
    paragraphComposer (item) {
      switch (item.type) {
        case 'blockquote':
          return `<blockquote class="quote"><i class="quoteIcon"></i><div class="quote-content">${_.get(item.content, [ 0 ], '')}</div></blockquote>`
        case 'code-block':
          return `<code>${_.get(item.content, [ 0 ], '')}</code>`
        case 'embeddedcode':
          return `<div class=\"embedded\">${_.get(item.content, [ 0, 'embeddedCode' ], '')}</div>`
        case 'header-two':
          return `<h2>${item.content.toString()}</h2>`
        case 'image':
          return `<div class=\"innerImg ${_.get(item.content, [ 0, 'alignment' ], '')}\"><img src=${_.get(item.content, [ 0, 'url' ], '')} width=\"\" srcset=\"${_.get(item.content, [ 0, 'mobile', 'url' ], '')} 800w, ${_.get(item.content, [ 0, 'tablet', 'url' ], '')} 1200w, ${_.get(item.content, [ 0, 'desktop', 'url' ], '')} 2000w\"/><div class=\"caption\">${_.get(item.content, [ 0, 'description' ], '')}</div></div>`
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
                    <img data-src=${_.get(item.content, [ 0, 'url' ], '')} width=\"\"
                         data-srcset=\"${_.get(item.content, [ 0, 'mobile', 'url' ], '')} 800w,
                                       ${_.get(item.content, [ 0, 'tablet', 'url' ], '')} 1200w,
                                       ${_.get(item.content, [ 0, 'desktop', 'url' ], '')} 2000w\"
                         class=\"swiper-lazy\"/>
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
          return `<div class=\"youtube\"><div class=\"youtube-container\"><iframe width=\"560\" alt=\"\" height=\"315\" src=\"https://www.youtube.com/embed/${_.get(item.content, [ 0, 'youtubeId' ], '')}\" frameborder=\"0\" allowfullscreen> </iframe></div></div>`
        default:
          return
      }
    }
  },
  mounted () {},
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
    }
  }
}
</script>
<style lang="stylus">
  .article_body 
    width 100%

    .article_basic-info 
      display flex
      margin-top 20px
      justify-content space-between

      .category 
        font-size 21px
        display flex
        justify-content flex-start
        align-items center

        .categorySquare 
          display inline-flex
          height 24px
          padding-left 10px
          justify-content center
          align-items center
        
      .date 
        font-style italic
        font-size 17px
        color #a1a1a1
        font-weight normal
      

    
    .article_title 
      width 100%
      margin 15px 0

      h1 
        font-size 40px
        font-weight 400
        margin 0

    .article_subtitle  
      width 695px
      display inline-block
      max-width 695px
      margin 0 0 15px

      h2
        font-size 1.5rem
        font-weight 400
        margin 0

    .article_credit 
      width 695px
      display inline-block
      max-width 695px

      a.blue:hover, a.blue:link, a.blue:visited 
        color #74afd2
    
    .article_main 
      width 695px
      display inline-block
      max-width 695px
      overflow hidden

      .innerImg 
        clear both
        margin 1.5em 0

        img 
          width 100%
        
        .caption 
          font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
          font-size 15px
          line-height 1.7
          letter-spacing 0.3px
          color rgba(0, 0, 0, 0.498039)
          padding-top 10px
          padding-bottom 10px
        
        &.right 
          float right
          width 300px
          margin-left 20px
          border-bottom 2px solid #255577
          margin-bottom 30px
          padding-bottom 10px
        
        &.left 
          float left
          width 300px
          margin-right 20px
          border-bottom 2px solid #255577
          margin-bottom 30px
          padding-bottom 10px
        
        &.center 
          margin-top 20px
          width 100%
        
      
      .article_main_pop 
        clear both
        margin-top 40px
      
      .article_main_tags 
        clear both
        margin-top 3em

        .tags_icon 
          background-image url(/public/icon/sprite@3x.png)
          background-position -733px -741px
          background-repeat no-repeat
          background-size 866px 862px
          display inline-block
          vertical-align middle
          zoom .65

          width 45px
          height 45px
        
        .tags 
          display inline-block
          color rgba(2, 2, 2, 0.5)
          font-size 18px

          a, a:hover, a:link, a:visited 
            color rgba(2, 2, 2, 0.5)
            text-decoration none
            cursor pointer
            border-bottom none
                
      .brief 
        margin-top 30px
        line-height 36px
        font-size 18px
        color rgba(65, 65, 65, 0.61)

        p 
          strong 
            color rgba(65, 65, 65, 0.61)
            font-weight normal
          
          i, cite, em, var, address, dfn 
            font-style normal        
      
      > .content 
        h2 
          color #000
          margin-top 40px
        
        p 
          color #171717
          font-size 18px
          line-height 36px
          margin 1.5em 0
        
        .youtube 
          clear both
          .youtube-container 
            align-items center
            display flex
            justify-content center
            margin 25px 0
            padding-bottom 56.25%
            padding-top 25px
            position relative

            iframe 
              width 100%
              height 100%
              position absolute
              top 0
              left 0
                    
        .embedded 
          text-align center
          margin 1.5em 0

        .audioBox
          width 100%
          
          .audioBox-content
            h2
              margin-top 10px
              display flex
              justify-content center
              align-items center
              font-size 1.5rem
        
      a, a:hover, a:link, a:visited 
        color #3195b3
        text-decoration none
        cursor pointer
        border-bottom 1px solid #3195b3
        padding-bottom 5px
      
      code 
        line-height 2rem
      
      blockquote.blockquote 
        clear both
        padding 10px 35px
        margin 70px 0

        .content 
          border-top 3px solid #255577
          padding-top 20px
          padding-left 30px
          border-left 3px solid #255577
          font-size 24px
          color #3a759e

          .triangle::before
            content ''
            width 0
            height 0
            border-style solid
            border-width 50px 0 0 70px
            position relative
            top -70px
            left 30px
            display block
            border-color transparent transparent transparent #255577
          
          .triangle::after
            content ''
            width 0
            height 0
            border-style solid
            border-width 50px 0 0 70px
            position relative
            top -114px
            left 33px
            display block
            border-color transparent transparent transparent #ffffff
          
          .quote-body 
            margin-top -95px
            line-height 44px
          
          .quote-by 
            text-align right
            font-size 18px
            margin-top 18px

            &::before 
              content ''
              display inline-block
              height 100%
              vertical-align super
              width 36px
              margin-right 5px
              border-top 1px solid #3a759e
                  
      blockquote.quote 
        clear both
        display flex
        margin 3em 0

        i 
          background-image url(/public/icon/quote.png)
          width 45px
          height 45px
          background-repeat no-repeat
          background-size contain
          display block
          margin-right 20px
          max-width 45px
          flex 3
        
        .quote-content 
          font-size 24px
          color #3a759e
          flex 10
        
      
      .info-box-container 
        width 100%
        margin-bottom 3em

        .info-box-icon 
          &::before 
            content ''
            width 0
            height 0
            border-style solid
            border-width 12px 18px
            position relative
            left 0
            top 30px
            display block
            border-color #255577
          
          &::after 
            content ''
            width 0
            height 0
            border-style solid
            border-width 10px 0px 0px 18px
            position relative
            left 0
            top 30px
            display block
            border-color #7b7b7b transparent transparent transparent
          
        
        .info-box 
          border 1px solid #eaeaea
          padding 30px 50px
          box-shadow 0 0 14px rgba(146, 146, 146, 0.52)
          width 90%
          margin-top -35px
          margin-left 18px

          .info-box-title 
            color #3a6888
            font-size 25px
            margin-bottom 15px
          
          .info-box-body 
            p, li 
              color rgba(0, 0, 0, 0.64)
              font-size 16px
        
        &.right 
          float right
          width 300px
        
        &.left 
          float left
          width 300px
        
        &.center 
          clear both
          margin 3em 0

          .info-box 
            width 95%
          
      h2 
        font-size 32px
      
      h3 
        font-size 26px
      
      ul 
        font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
        font-size 1rem
        line-height 2.2
        letter-spacing 0.3px
        color rgba(0, 0, 0, 0.701961)
        padding-left 45px
        text-indent -26px
        margin-left 16px
        list-style none

        &.unordered-list-item
          li 
            &::before 
              content "• "
              color #2d5b7b
              font-size 30px
              line-height 1
              top 6px
              position relative

      ol
        font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
        font-size 1rem
        line-height 2.2
        letter-spacing 0.3px
        color rgba(0, 0, 0, 0.701961)
        counter-reset item 0
        list-style none

        &.ordered-list-item
          li
            &::before
              content counter(item) ". "
              counter-increment item
              color #004ea2
              padding-left 10px
              padding-right 10px
              line-height 1

          
    &.single-col 
      margin-top 50px

      .article_basic-info
        width 660px
        margin 0 auto

      .article_title
        margin 15px auto
        width 660px

      .article_credit 
        display block
        width 660px
        margin 0 auto
      
      .article_main 
        width 950px
        margin 0 auto
        max-width 950px
        display block

        p, h2, .split-line, .embedded, .article_main_pop, .article_main_proj, .article_main_related_bottom, .article_fb_comment, ul, .youtube, .dfpad-set
          padding 0 145px

        .article_main_pop
          margin-top 40px
        
        blockquote
          padding 0 145px

        .innerImg 
          padding 0 145px 1.5em
          
          &.left 
            margin-right 50px
            padding 0
          
          &.right 
            margin-left 50px
            padding 0
                  
        .article_main_tags 
          padding 0 145px
        
        .info-box-container 
          &.center 
            padding 0 145px
          
          .info-box 
            p, ul 
              padding 0
                
    .per-slide 
      // height 500px
      width 100%
      margin 1.5em 0

      .swiper-wrapper 
        // height 450px
        display flex
        align-items center

        .swiper-slide 
          display flex
          align-items center
          justify-content center

          > div
            width 100%

          .slideshowImg 
            img 
              width 100%
              object-fit contain
              object-position center center
              max-height 450px

            .img-caption
              width 70%
              margin 0 auto
              padding 8px
              color rgba(0,0,0,0.498)
              font-size 1rem
              text-align center

      .swiper-pagination
        .swiper-pagination-bullet.swiper-pagination-bullet-active
          background-color rgba(179, 179, 179, 0.61)

  @media (min-width 0px) and (max-width 499px)
    .article_body
      .article_basic-info
        .category
          font-size 1.3rem
          
          .categorySquare
            height 1.3rem
        
        .date
          font-size 1rem
      
      .article_title
        h2
          font-size 1.7rem

      .article_main
        .article_main_tags
          .tags
            line-height 1.6rem
            font-size 1rem
        
        .info-box-container        
          &, &.center, &.right, &.left
            float none
            margin 3em 0
            width 100%

            .info-box
              width 90%
              padding 30px 24px
          
              .info-box-body
                ul
                  text-indent 0
                  line-height 2rem
                  letter-spacing 0.05rem
                  padding-left 0
                  margin-left 1rem

                  li
                    overflow-wrap break-word

                    &::before
                      font-size 3rem
                      top 1rem
                      left 10px
              
              .info-box-title
                font-size 1.4rem
          
        ul
          text-indent -40px
          padding-left 15px
          margin-left 10px

          li
            &::before
              font-size 3rem
              top 15px
              left 10px

  @media (min-width 0px) and (max-width 767px)
    .article_body
      .article_main, .article_credit, .article_subtitle
        width 100%
        max-width 100%

        & > .content
          .innerImg
            &.right, &.left
              float none
              width 100%
              margin 0
              border-bottom none
              padding-bottom 0
        
        blockquote.blockquote
          padding 0

    .article_fb_comment
      margin-bottom 60px!important


  @media (max-width 899px) and (min-width 768px)
    .article_body
      .article_basic-info, .article_credit, .article_main, .article_subtitle
        width 645px
        max-width 645px
        margin 0 auto
        
      .article_title
        width 645px
        max-width 645px
        margin 15px auto

      .article_subtitle
        width 645px
        max-width 645px
        margin 0 auto 15px
      
  @media (min-width 900px) and (max-width 1199px)
    .article_body
      .article_basic-info
        width 695px
        max-width 695px
        margin 0 auto

      .article_credit, .article_main
        width 695px
        max-width 695px
        margin 0 auto
      .article_title
        width 695px
        max-width 695px
        margin 15px auto

      .article_subtitle
        width 695px
        max-width 695px
        margin 0 auto 15px

  @media (max-width 1199px)
    .article_body
      .article_main, .article_credit, .article_subtitle
        display block

</style>
