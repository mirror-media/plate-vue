<template>
  <section class="post-body">
    <div class="post-body-container article">
      <LazyItemWrapper :loadAfterPageLoaded="true">
        <slot name="dfpPCHD" />
        <slot name="dfpMBHD" />
      </LazyItemWrapper>
      <slot name="shareTools" />
      <div class="post-main-container">
        <main class="article__main">
          <div class="post-category-date space-between">
            <p
              v-if="!isAd"
              :style="{ borderLeftColor: sectionColor }"
              class="category"
              v-text="category.title"
            />
            <p
              class="date"
              v-text="publishedDate"
            />
          </div>
          <h1 v-text="post.title" />
          <h2
            v-if="post.subtitle"
            v-text="post.subtitle"
          />
          <div class="post-credits">
            <PostBodyCredit
              v-if="post.writers.length > 0"
              :people="post.writers" 
              title="文"
            />
            <PostBodyCredit
              v-if="post.photographers.length > 0"
              :people="post.photographers" 
              title="攝影"
            />
            <PostBodyCredit
              v-if="post.designers.length > 0"
              :people="post.designers" 
              title="設計"
            />
            <PostBodyCredit
              v-if="post.engineers.length > 0"
              :people="post.engineers" 
              title="工程"
            />
            <PostBodyCredit
              v-if="post.cameraMan.length > 0"
              :people="post.cameraMan" 
              title="影音"
            />
            <span
              v-if="post.extendByline"
              v-text="post.extendByline"
            />
          </div>
          <div class="space-between">
            <AudioPlayer :post="post" />
            <ShareLight gtmCategory="article" />
          </div>
          <template>
            <HeroVideo
              v-if="heroVideo"
              class="post-hero-video"
              :heroCaption="post.heroCaption"
              :video="heroVideo"
            />
            <HeroImage
              v-else
              class="full-width"
              :heroCaption="post.heroCaption"
              :heroImage="post.heroImage"
            />
          </template>
          <div
            v-if="briefs.length > 0"
            :style="{ backgroundColor: sectionColor }"
            class="post-brief"
          >
            <p
              v-for="(brief, index) in briefs"
              :key="`${post.slug}-brief-${index}`"
              v-text="brief"
            />
          </div>
          <article
            id="article-body-content"
            class="post-content full-width"
          >
            <!-- post content ref: ArticleBody.vue -->
            <div
              :is="blockWrapper(index)"
              v-for="(p, index) in contents"
              :key="`${post.slug}-content-${index}`"
            >
              <ArticleImg
                v-if="p.type === 'image'"
                :image="get(p, 'content.0')"
                :class="`innerImg ${get(p.content, [ 0, 'alignment' ], '')}`"
              />
              <div
                is="ArticleVideo" 
                v-else-if="p.type === 'video'" 
                :video="get(p, 'content.0', {})"
                :class="`video ${get(p, 'alignment', '')}`"
              />
              <div
                is="AudioBox"
                v-else-if="p.type === 'audio'"
                :audio="get(p, 'content.0', {})"
              />
              <div
                is="Slider"
                v-else-if="p.type === 'slideshow'"
                :option="sliderOption"
                :slideId="p.id"
                class="per-slide"
              >
                <template slot-scope="props">
                  <swiper-slide
                    :is="props.slide"
                    v-for="(o, i) in get(p, 'content', [])"
                    :key="`${i}-${Date.now()}`"
                  >
                    <div>
                      <div class="slideshowImg">
                        <img
                          :alt="get(o, 'description', '')"
                          :src="get(o, 'url', '')"
                          :srcset="`${get(o, 'mobile.url', '')} 800w, ${get(o, 'tablet.url', '')} 1200w, ${get(o, 'desktop.url', '')} 2000w`">
                        <div
                          class="img-caption"
                          v-text="get(o, 'description', '')"
                        />
                      </div>
                    </div>
                  </swiper-slide>
                </template>
              </div>
              <div v-else-if="p.type === 'annotation'">
                <Annotation :annotationStr="get(p, 'content')" />
              </div>
              <div
                v-else
                v-html="paragraphComposer(p)"
              />
              <RelatedListInContent
                v-if="index === lastUnstyledParagraph - 1"
                :relateds="relateds"
                class="post-relateds-in-content"
              >
                <slot name="microAdInRelateds"/>
                <slot name="popInAdInRelateds"/>
              </RelatedListInContent>
              <div
                v-if="shouldShowADAR1 && index === nonEmptyParagraphsIndexs[0]"
                class="ad"
              >
                <slot name="dfpMBAR1" />
              </div>
              <div
                v-if="index === nonEmptyParagraphsIndexs[0]"
                class="ad"
              >
                <slot name="dfpPCAR1" />
              </div>
              <div
                v-if="shouldShowADAR1 && index === nonEmptyParagraphsIndexs[4]"
                class="ad"
              >
                <slot name="dfpMBAR2" />
              </div>
            </div>
            <!-- end -->
            <p
              v-if="showUpdatedAt"
              class="updated-time"
            >
              更新時間｜<span>{{ moment(post.updatedAt).format('YYYY.MM.DD HH:mm') }}</span>
            </p>
          </article>
          <slot name="recommendList"/>
          <div>
            <slot name="dfpAR3"/>
          </div>
          <Newsletter class="post-newsletter"/>
          <p>
            更多內容，歡迎
            <a :href="SOCIAL_LINK.SUBSCRIBE" target="_blank">訂閱鏡週刊</a>、
            <a :href="SOCIAL_LINK.AUTH" target="_blank">了解內容授權資訊</a>。
          </p>
          <div
            v-if="tags.length > 0"
            class="post-tags"
          >
            <p>相關關鍵字：</p>
            <a
              v-for="tag in tags"
              :key="tag.id"
              :href="`/tag/${tag.id}`"
              target="_blank"
              @click="sendGaClickEvent('article', 'tag')"
              v-text="tag.name"
            />
          </div>
          <MediaFarmer />
          <slot name="dfpMBE1" />
          <slot name="dfpPCE1E2" />
          <slot name="dableMB" />
          <PopList
            v-if="isMobile && isShowPoplist"
            :pop="popularList"
          />
          <div>
            <div
              class="fb-comments"
              :data-href="postUrl"
              data-numposts="5"
              data-width="100%"
              data-order-by="reverse_time"
            />
          </div>
          <slot name="dablePC" />
        </main>
        <PostBodyAside
          v-if="!isMobile"
          class="post-aside article_aside"
        >
          <slot name="dfpPCR1" />
          <LatestList
            v-if="latestPosts.length > 0"
            :latest="latestPosts"
            :currArticleSlug="post.slug"
          />
          <div class="readr-embedded-promotions"></div>
          <ArticleAsideFixed class="post-aside-fixed">
            <slot slot="dfpR2" name="dfpPCR2" />
            <PopListVert
              v-if="popularList.length > 0"
              slot="popListVert"
              :pop="popularList"
            />
          </ArticleAsideFixed>
        </PostBodyAside>
      </div>
      <LazyItemWrapper :loadAfterPageLoaded="true">
        <slot name="dfpPCFT" />
        <slot name="dfpMBFT" />
      </LazyItemWrapper>
      <slot name="footer" />
    </div>
  </section>
</template>
<script>
import Annotation from 'src/components/article/Annotation.vue'
import ArticleAsideFixed from 'src/components/article/ArticleAsideFixed.vue'
import ArticleImg from 'src/components/article/ArticleImg.vue'
import ArticleVideo from 'src/components/article/Video.vue'
import AudioBox from 'src/components/AudioBox.vue'
import AudioPlayer from 'src/components/audioPlayer/Container.vue'
import HeroImage from 'src/components/article/HeroImage.vue'
import HeroVideo from 'src/components/article/HeroVideo.vue'
import LatestList from 'src/components/article/LatestList.vue'
import LazyItemWrapper from 'src/components/common/LazyItemWrapper.vue'
import MediaFarmer from '../../../next/components/MediaFarmer.vue'
import Newsletter from 'src/components/Newsletter.vue'
import PopList from 'src/components/article/PopList.vue'
import PopListVert from 'src/components/article/PopListVert.vue'
import PostBodyAside from './PostBodyAside.vue'
import PostBodyCredit from './PostBodyCredit.vue'
import RelatedListInContent from 'src/components/article/RelatedListInContent.vue'
import ShareLight from 'src/components/share/ShareLight.vue'
import Slider from 'src/components/Slider.vue'
import moment from 'moment'
import { SECTION_MAP, SOCIAL_LINK } from '../../../src/constants'
import { get } from 'lodash'
import { getImage } from 'src/util/comm'
import { sendGaClickEvent } from '../../../src/util/comm'

export default {
  name: 'PostBody',
  components: {
    Annotation,
    ArticleAsideFixed,
    ArticleImg,
    ArticleVideo,
    AudioBox,
    AudioPlayer,
    HeroImage,
    HeroVideo,
    LatestList,
    LazyItemWrapper,
    MediaFarmer,
    Newsletter,
    PopList,
    PopListVert,
    PostBodyAside,
    PostBodyCredit,
    RelatedListInContent,
    ShareLight,
    Slider
  },
  props: {
    isAd: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      required: true
    },
    isShowPoplist: {
      type: Boolean,
      default: true
    },
    post: {
      type: Object,
      required: true
    },
    postUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      SECTION_MAP,
      SOCIAL_LINK
    }
  },
  computed: {
    briefs () {
      const briefs = get(this.post, 'brief.apiData') || []
      return briefs
        .filter(brief => brief.type === 'unstyled')
        .map(brief => brief.content[0])
    },
    category () {
      const info = {
        id: get(this.post, 'categories.0.id'),
        name: get(this.post, 'categories.0.name'),
        title: get(this.post, 'categories.0.title')
      }
      return info
    },
    contents () {
      return get(this.post, 'content.apiData') || []
    },
    // origin code firstTwoUnstyledParagraph
    firstTwoUnstyledParagraph () {
      const { content } = this.post
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
    heroVideo () {
      const heroVideo = get(this.post, 'heroVideo')
      const poster = getImage(this.post)
      return get(heroVideo, 'video')
        ? Object.assign(get(heroVideo, 'video'), { id: get(heroVideo, 'id', '') }, { poster })
        : heroVideo
    },
    lastUnstyledParagraph () {
      return get(this.nonEmptyParagraphsIndexs, this.nonEmptyParagraphsIndexs.length - 1, 0)
    },
    latestPosts () {
      return get(this.$store, 'state.latestArticle.items') || []
    },
    nonEmptyParagraphsIndexs () {
      const isContentParagraph = obj => obj.type === 'unstyled' && obj.content.join('') !== ''
      return this.contents
        // Preserve original index
        .map((d, i) => ({ index: i, type: d.type, content: d.content || [] }))
        .filter(obj => isContentParagraph(obj))
        .map(d => d.index)
    },
    popularList () {
      return get(this.$store, 'state.articlesPopList.report') || []
    },
    publishedDate () {
      return moment(this.post.publishedDate).format('YYYY.MM.DD HH:mm')
    },
    relateds () {
      return (get(this.post, 'relateds') || []).filter(item => item)
    },
    sectionColor () {
      return SECTION_MAP[get(this.post, 'sections.0.id')].bgcolor || '#bcbcbc'
    },
    shouldShowADAR1 () {
      return get(this.nonEmptyParagraphsIndexs, 0, -1) !== -1
    },
    shouldShowADAR2 () {
      return get(this.nonEmptyParagraphsIndexs, 4, -1) !== -1
    },
    showUpdatedAt () {
      return this.post.updatedAt !== this.post.publishedDate
    },
    // origin code sliderOption
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
    tags () {
      return get(this.post, 'tags') || []
    }
  },
  methods: {
    // origin code blockWrapper
    blockWrapper (index) {
      switch (index) {
        case this.firstTwoUnstyledParagraph[ 0 ]:
        case this.firstTwoUnstyledParagraph[ 1 ]:
          return 'div'
        default:
          return LazyItemWrapper
      }
    },
    get,
    moment,
    // origin code paragraphComposer
    paragraphComposer (item) {
      switch (item.type) {
        case 'blockquote':
          return `<blockquote class="quote"><i class="quoteIcon"></i><div class="quote-content">${get(item.content, [ 0 ], '')}</div></blockquote>`
        case 'code-block':
          return `<code>${get(item.content, [ 0 ], '')}</code>`
        case 'embeddedcode':
          return `<div class=\"embedded\ ${get(item.content, [ 0, 'alignment' ], '')}">${get(item.content, [ 0, 'embeddedCode' ], '')}<div class=\"caption\">${get(item.content, [ 0, 'caption' ], '')}</div></div>`
        case 'header-two':
          return `<h2>${item.content.toString()}</h2>`
        case 'infobox':
          return `<div class="info-box-container ${get(item, [ 'alignment' ], '')}">
                    <span class="info-box-icon"></span>
                    <div class="info-box">
                      <div class="info-box-title">${get(item.content, [ 0, 'title' ], '')}</div>
                      <div class="info-box-body">${get(item.content, [ 0, 'body' ], '')}</div>
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
          return `<ol class="${get(item, [ 'alignment' ], '')} ordered-list-item">${_liStrOrdered}</ol>`
        case 'quoteby':
          const quoteBy = get(item.content, [ 0, 'quoteBy' ], '')
          return `<blockquote class="blockquote">
                    <div class="content">
                      <span class="triangle"></span><div class="quote-body">${get(item.content, [ 0, 'quote' ], '').replace(/\n/g, '<br>')}</div>
                      ${(quoteBy.length > 0) ? `<div class="quote-by">${quoteBy}</div>` : ``}
                    </div>
                  </blockquote>`
        case 'unordered-list-item':
          const _liStrUnordered = item.content.map((i) => {
            if (typeof i !== 'object') {
              return `<li>${i}</li>`
            } else {
              return i.map((j) => (`<li>${j}</li>`)).join('')
            }
          }).join('')
          return `<ul class="${get(item, [ 'alignment' ], '')} unordered-list-item">${_liStrUnordered}</ul>`
        case 'unstyled':
          return (item.content.toString().length > 0) ? `<p>${item.content.toString()}</p>` : ''

        case 'youtube':
          return `<div class=\"youtube\">
                    <div class=\"youtube-container\">
                      <iframe width=\"560\" alt=\"\" height=\"315\" src=\"https://www.youtube.com/embed/${get(item.content, [ 0, 'youtubeId' ], '')}\" frameborder=\"0\" allowfullscreen> </iframe>
                    </div>
                    <div class=\"caption\">${get(item.content, [ 0, 'description' ], '')}</div>
                  </div>`
        default:
          return
      }
    },
    sendGaClickEvent
  }
}
</script>
<style lang="stylus" scoped>
.post-body
  font-family "Noto Sans TC", STHeitiTC-Light, "Microsoft JhengHei", sans-serif
  background-color #414141
  h1, h2, p
    margin 0
  &-container
    max-width 1160px
    margin 0 auto
    padding 20px 0 50px
    background-color #fff
    h1, h2
      color #000
      font-weight 400
      line-height 1.25
      text-align justify
    h1
      font-size 1.75rem
    h2
      margin-top 5px !important
      font-size 1.5rem
  .post-body-container
    main
      > *
        width calc(100% - 40px)
        margin-left auto
        margin-right auto
        & + *
          margin-top 15px
    .post-aside
      flex 1
      display flex
      flex-direction column
      align-items center
      margin-right 40px
    .post-hero-video
      position static
      width 100%

  .post-category-date
    align-items flex-end
    .category
      padding-left 10px
      font-size 1.3125rem
      border-left 7px solid #bcbcbc
    .date
      color #a1a1a1
      font-size 1.0625rem
      font-style italic
  .post-credits
    span
      display inline
      & + span
        margin-left 10px
  .post-brief
    padding 1em
    color #fff
    font-size 1.2rem
    font-weight bold
    line-height 36px
    text-align justify
    p
      & + p
        margin-top .5em
  .post-content
    margin-top 25px
    > *
      & + *
        margin-top 1em
    // > h2, > p
    //   width calc(100% - 40px)
    //   margin-left auto
    //   margin-right auto
    // > p
    //   color #171717
    //   font-size 1.2rem
    //   line-height 36px
    //   text-align justify

    // for origin html 
    >>> h2, >>> p, >>> code, >>> .unordered-list-item
      width calc(100% - 40px)
      margin-left auto
      margin-right auto
    >>> h2
      color #000
    >>> p
      color #171717
      font-size 1.2rem
      line-height 36px
      text-align justify
      a
        cursor pointer
        border-bottom 1px solid #3195b3
        padding-bottom 5px
    >>> a
      color #3195b3
      cursor pointer
    >>> code
      display block
      a
        word-break break-all
        border none
    .updated-time
      color #064f77
      font-size 1rem
      line-height 1.5
      span
        color #61a4cd
  .post-relateds-in-content
    width calc(100% - 40px)
    margin-left auto
    margin-right auto
  .post-newsletter
    margin-top 75px !important

  .post-tags
    color #a0a0a0
    a
      display inline-block
      margin .6em .5em 0 0
      padding .2em .4em
      color #fff
      text-decoration none
      background-color #c8c8c8
      border-bottom none
      cursor pointer

  .footer
    width calc(100% - 40px)
    margin-left auto
    margin-right auto
  
.space-between
  display flex
  justify-content space-between

@media (min-width 768px)
  .post-body
    .post-body-container
      main
        > *
          width calc(100% - 80px)
    .post-relateds-in-content, .footer
      width calc(100% - 80px)
    .post-content
      >>> h2, >>> p, >>> code, >>> .unordered-list-item
        width calc(100% - 80px)
    .post-newsletter
      margin-top 15px !important
    

@media (max-width 1023px)
  .footer
    padding 0
    
  .full-width
    width 100% !important

@media (min-width 1024px)
  .post-body
    .post-body-container
      padding-bottom 0
      main
        width 775px
      .post-main-container
        position relative
        display flex
        flex-wrap wrap
        align-items flex-start
    .post-relateds-in-content
      width 100%
    .post-content
      >>> h2, >>> p, >>> code, >>> .unordered-list-item
        width 100%

// origin css from plate-vue ArticleBodyLayout.vue
// origin css from plate-vue-mobile ArticleBodyContent.vue
.post-body
  .post-content
    >>> .embedded 
      text-align center
      margin 1.5em auto
      clear both
      > div:not(.caption)
        margin 0 auto
      > .caption 
        font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
        font-size 15px
        line-height 1.7
        letter-spacing 0.3px
        color rgba(0, 0, 0, 0.498039)
        padding-top 10px
        padding-bottom 10px
      > iframe
        max-width 100%
        margin 0 auto

    >>> .video
      text-align center
      margin 1.5em auto
      clear both
      position relative

    >>> .youtube 
      clear both
      .youtube-container 
        align-items center
        display flex
        justify-content center
        margin 25px 0 5px
        padding-bottom 56.25%
        padding-top 25px
        position relative

        iframe 
          width 100%
          height 100%
          position absolute
          top 0
          left 0
      > .caption 
        font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
        font-size 15px
        line-height 1.7
        letter-spacing 0.3px
        color rgba(0, 0, 0, 0.498039)
        padding-top 10px
        padding-bottom 10px
    
    >>> .code 
      line-height 2rem

    >>> ul
      font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
      font-size 1rem
      line-height 2.2
      letter-spacing 0.3px
      color rgba(0, 0, 0, 0.701961)
      padding-left 45px
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

    >>> blockquote.blockquote
      clear both
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
    >>> blockquote.quote 
      clear both
      display flex
      margin 3em 0
      i 
        background-image url(/assets/mirrormedia/icon/quote.png)
        width 45px
        height 45px
        background-repeat no-repeat
        background-size contain
        display block
        margin-right 20px
        max-width 45px
        flex 3
      .quote-content 
        font-size 1.2rem
        color #3a759e
        flex 10
        text-align justify

    >>> .info-box-container
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
        box-shadow 0 0 14px rgba(146, 146, 146, 0.52)
        width 90%
        margin-top -35px
        margin-left 18px

        .info-box-title 
          color #3a6888
          font-size 25px
          margin-bottom 15px
        
        .info-box-body
          ol
            list-style decimal
          ul
            list-style disc
          p, li 
            color rgba(0, 0, 0, 0.64)
            font-size 1rem

    >>> ol
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

    >>> .swiper-wrapper
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
            padding 8px 0
            color rgba(0,0,0,0.498)
            font-size 1rem
            text-align left

// origin css only in plate-vue ArticleBodyLayout.vue
@media (min-width 769px)
  .post-body
    .post-content
      >>> .annotation
        position relative
        z-index 10
      >>> .audioBox
        width 100%
        margin-top 1em
      >>> blockquote.blockquote
        padding 10px 35px
      >>> blockquote.quote
        .quote-content
          line-height 2.2rem
      >>> .info-box-container
        .info-box 
          padding 30px 50px
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

      >>> .per-slide
        width 100%
        margin 1.5em 0
      >>> .swiper-wrapper
        .swiper-slide
          .slideshowImg
            .img-caption
              width 100%
              margin 0 auto
              line-height 1.4rem

// origin css only in plate-vue-mobile ArticleBodyContent.vue
@media (max-width 768px)
  .post-body
    .post-content
      >>> .annotation
        padding 0 20px
      >>> .audioBox
        width calc(100% - 40px)
        margin 0 auto
        padding 0

      >>> .code 
        padding 0 20px
        margin 20px

      >>> blockquote.blockquote 
        padding 0 20px

      >>> blockquote.quote
        padding 0 20px
        .quoteIcon
          height 40px
          width 40px
          max-width 30px
          margin-top 8px
        .quote-content 
          line-height 2.1rem

      >>> .info-box-container
        .info-box 
          padding 30px 24px
          width 90%

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
            color #3a6888
            font-size 1.4rem
            margin-bottom 15px
      
      >>> .swiper-wrapper 
        .swiper-slide 
          .slideshowImg 
            .img-caption
              margin 10px auto 0
              line-height 1.5rem
              padding 0 25px

@media (min-width 400px) and (max-width 768px)
  .post-body
    .post-content
      >>> blockquote.quote,
      >>> blockquote.blockquote,
      >>> .annotation,
      >>> .code 
        padding-right 40px
        padding-left 40px

</style>