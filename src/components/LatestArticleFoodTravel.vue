<template>
  <section class="latestArticle-foodtravel">

  <div class="topicsArticle-foodtravel-container mobile-only" v-if="!this.showLatestOnly">
    <!--<vue-dfp :is="props.vueDfp" pos="LMBSL1" extClass="desktop-hide" :config="props.config" />-->
    <div class="topicsArticle-full-posts">
    <template v-for="(article, index) in topics">
      <div class="topicsArticle-full-post">
      <a :href="'/topic/' + article.id" :id="'topics-' + article.id + '-image'" target="_blank" class="topicsArticle-full-post__img" >
        <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></figure>
      </a>
      <div class="topicsArticle-full-post__content">
        <a :href="'/topic/' + article.id" :id="'topics-' + article.id + '-title'" target="_blank">
          <h2 v-text="article.name"></h2>
        </a>
        <a :href="'/topic/' + article.id" :id="'topics-' + article.id + '-brief'" target="_blank">
          <p v-html="getTruncatedVal(article.ogDescription, 45)"></p>
        </a>
      </div>
      </div>
    </template>
    </div>
  </div>

  <div class="latestArticle-foodtravel-container">
    <items-title-rect class="header-rect" v-if="!this.showLatestOnly">最新文章</items-title-rect>
    <div class="latestArticle-full-posts">
    <template v-for="(article, index) in latestArticle">
      <div :class="'latestArticle-full-post-' + (index % 2)">
      <a :href="getHref(article)" :id="'latest-' + article.id + '-image'" target="_blank" class="latestArticle-full-post__img" >
        <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></figure>
      </a>
      <div class="latestArticle-full-post__content">
        <a :href="getHref(article)" :id="'latest-' + article.id + '-title'" target="_blank">
          <h2 v-text="getTruncatedVal(article.title, 20)"></h2>
        </a>
        <a :href="getHref(article)" :id="'latest-' + article.id + '-brief'" target="_blank">
          <p v-html="getBrief(article, 55)"></p>
        </a>
        <div class="latestArticle-full-post__meta">
          <span class="latestArticle-full-post__meta--author" v-if="getAuthor(article, 'writers', '／')" v-html="getAuthor(article, 'writers', '／')"></span>
        </div>
      </div>
      </div>
      <vue-dfp v-if="index === 2" :is="props.vueDfp" pos="LMBSL1" extClass="mobile-only" :config="props.config" />
    </template>
    </div>
  </div>

  <div class="topicsArticle-foodtravel-container desktop-only" v-if="!this.showLatestOnly">
    <vue-dfp :is="props.vueDfp" pos="LPCSR1" extClass="mobile-hide" :config="props.config" />
    <div class="topicsArticle-full-posts">
    <template v-for="(article, index) in topics">
      <div class="topicsArticle-full-post">
      <a :href="'/topic/' + article.id" :id="'topics-' + article.id + '-image'" target="_blank" class="topicsArticle-full-post__img" >
        <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></figure>
      </a>
      <div class="topicsArticle-full-post__content">
        <a :href="'/topic/' + article.id" :id="'topics-' + article.id + '-title'" target="_blank">
          <h2 v-text="article.name"></h2>
        </a>
        <a :href="'/topic/' + article.id" :id="'topics-' + article.id + '-brief'" target="_blank">
          <p v-html="getTruncatedVal(article.ogDescription, 45)"></p>
        </a>
      </div>
      </div>
    </template>
    </div>
  </div>

  </section>
</template>

<script>
import { SECTION_FOODTRAVEL_ID } from '../constants/index'
import ItemsTitleRect from './ItemsTitleRect.vue'
import {
  getAuthor,
  getBrief,
  getHref,
  getImage,
  getTruncatedVal
} from '../util/comm'
import moment from 'moment'
export default {
  name: 'latestArticle-foodtravel',
  props: [ 'articles', 'props', 'commonData', 'showLatestOnly' ],
  components: {
    'items-title-rect': ItemsTitleRect
  },
  methods: {
    getAuthor,
    getBrief,
    getHref,
    getImage,
    getTruncatedVal,
    moment
  },
  computed: {
    latestArticle () {
      return this.articles
    },
    topics () {
      return this.commonData.topics.items.filter((o) => {
        if (o.hasOwnProperty('sections')) return o.sections[0] === SECTION_FOODTRAVEL_ID // foodtravel
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.latestArticle-foodtravel
  display flex
  flex-direction column
  align-items center
  width 100%

  .topicsArticle-foodtravel-container
    margin-top 5%
    margin-bottom 50px
    .topicsArticle-full-posts
      margin-top 25px
      .topicsArticle-full-post
        img_width = 100%
        content_width = 90%
        
        display flex
        flex-direction column
        justify-content flex-start
        align-items center
        margin 50px 5% 0px 5%
        border 2px solid white

        .topicsArticle-full-post__content
          display flex
          flex-direction column
          justify-content center
          align-items flex-start

          width content_width
          height 200px
          padding 2%
          h2
            font-size 24px
            font-weight bold
            color black
            line-height 30px
            margin 0
          p, span
            font-size 16px
            font-weight normal
            color black
            line-height 24px

        &__img
          width img_width
          height 35vh
          figure
            width 100%
            height 100%
            margin 0
            background-repeat no-repeat
            background-size cover
            background-position center   

  .latestArticle-foodtravel-container
    .header-rect
      margin-left 5%

    .latestArticle-full-posts
      margin-top 25px
      .latestArticle-full-post
        img_width = 100%
        content_width = 90%
        border_style = 1px solid #4d4d4d
        
        
        // In mobile, there is no different between two classes below
        &-0, &-1
          display flex
          flex-direction column
          justify-content flex-start
          align-items center
          margin-top 25px
          .latestArticle-full-post__content
            display flex
            flex-direction column
            justify-content center
            align-items flex-start

            border-right border_style
            border-bottom border_style
            border-left border_style
            width content_width
            height 300px
            padding 0 5% 5% 5%
            h2
              font-size 24px
              font-weight bold
              color black
              line-height 30px
              margin 0
            p, span
              font-size 16px
              font-weight normal
              color black
              line-height 24px

        &__img
          box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
          width img_width
          height 45vh
          figure
            width 100%
            height 100%
            margin 0
            background-repeat no-repeat
            background-size cover
            background-position center  


// Tablet, or landscape of mobile
@media (min-width: 600px), (min-aspect-ratio: 13/9)
  .latestArticle-foodtravel
    align-items center
    .topicsArticle-foodtravel-container
      margin-bottom 50px
      .topicsArticle-full-posts
        .topicsArticle-full-post
          img_width = 80%
          content_width = 90%
          
          flex-direction row
          margin-top 50px

          .topicsArticle-full-post__content
            width content_width
            height 250px
          &__img
            width img_width
            height 200px

    .latestArticle-foodtravel-container
      margin-left 5%
      .header-rect
        margin 0

      .latestArticle-full-posts
        margin-top 0
        .latestArticle-full-post
          img_width = 48%
          content_width = 95% - img_width + 10%
          border_style = 1px solid #4d4d4d

          // Img at left side, content at right side
          &-0
            flex-direction row
            .latestArticle-full-post__content
              margin-left -10%
              border border_style
              width content_width
              height 350px
              padding 0 2% 0 12%
          
          // Img at right side, content at left side
          &-1
            flex-direction row-reverse
            justify-content flex-end
            align-items center
            .latestArticle-full-post__content
              margin-right -10%
              border border_style
              width content_width
              height 350px
              padding 0 12% 0 2%

          &__img
            z-index 1
            width img_width
            height 300px 

// PC
@media (min-width: 1200px)
  .latestArticle-foodtravel
    flex-direction row
    align-items flex-start
         
    .latestArticle-foodtravel-container
      margin-left 8.3%
      margin-right 4.3%
      width 88%
      .header-rect
        margin 0

      .latestArticle-full-posts
        margin-top 0
        .latestArticle-full-post
          img_width = 56%
          content_width = 100% - img_width
          border_style = 1px solid #4d4d4d

          // Img at left side, content at right side
          &-0
            width 60vw
            flex-direction row
            .latestArticle-full-post__content
              margin 0
              border-top border_style
              border-right border_style
              border-bottom border_style
              border-left none
              width content_width
              height auto
              height 38vh
              padding 0 2% 10px 2%
          
          // Img at right side, content at left side
          &-1
            width 60vw
            flex-direction row-reverse
            justify-content flex-end
            align-items center
            .latestArticle-full-post__content
              margin 0
              border-top border_style
              border-right none
              border-bottom border_style
              border-left border_style
              width content_width
              height 38vh
              padding 0 2% 0 2%

          &__img
            width img_width
            height 46vh

    .topicsArticle-foodtravel-container
      flex-direction column
      margin-top 50px
      margin-right 9.5%
      width 300px
      .topicsArticle-full-posts
        margin-top 5vh
        .topicsArticle-full-post
          margin 0
          margin-top 5vh
          // padding 0 0 50% 0
          flex-direction column

          img_width = 295px
          content_width = 90%

          .topicsArticle-full-post__content
            height auto
            padding 10% 1.5%
            width content_width
          &__img
            width img_width
            height 200px

</style>
