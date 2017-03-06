<template>
  <section class="article-leading">
    <div v-for="article in highlightArticle">
      <a :href="getHref(article)" class="article-leading-post__img">
        <figure>
          <img :src="getImage(article, 'desktop')">
        </figure>
      </a>
      <div class="article-leading-post">
        <div class="article-leading-post__meta">
          <span class="article-leading-post__meta--author" v-html="getAuthor(article)"></span>
          <span class="article-leading-post__meta--date" v-text="moment(article.publishedDate).format('Y.MM.DD')"></span>
        </div>
        <div class="article-leading-post__content">
          <a :href="getHref(article)"><h2 v-text="article.title"></h2></a>
          <a :href="getHref(article)"><p v-text="getBrief(article, 200) + ' <More>' "></p></a>
        </div>
        <div class="article-leading-post__dfp">
          
        </div>
      </div>
      <div class="article-leading-related" v-if="hasRelated(article)">
        <div>
          <span>相關文章 Related Stories</span>
          <template v-for="related in getRelated(article)">
            <div class="article-leading-related-post">
              <a :href="getHref(related)" class="article-leading-related-post__img">
                <figure :style="{ backgroundImage: 'url(' + getImage(related, 'mobile') + ')' }"></figure>
              </a>
              <div class="article-leading-related-post__content">
                <a href=""><h3 v-text="related.title"></h3></a>
                <a href=""><p v-html="getBrief(related, 55)"></p></a>
                <span class="article-leading-related-post__content--author" v-html="getAuthor(related, 'writers')"></span>
                <span class="article-leading-related-post__content--date" v-text="moment(related.publishedDate).format('Y.MM.DD')"></span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import { SOCIAL_LINK } from '../constants/index'
import { getAuthor, getBrief, getHref, getImage, getTruncatedVal } from '../utils/comm'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'article-leading',
  props: {
    articles: {},
  },
  
  methods: {
    getAuthor,
    getBrief,
    getHref,
    getImage,
    getTruncatedVal,
    moment,
    hasRelated (article) {
      return article.relateds.length > 0 ? true : false
    },
    getRelated (article) {
      return _.take(article.relateds, 2)
    }
  },
  computed: {
    highlightArticle () {
      return _.take(this.articles, 2)
    },
  }
}

</script>
<style lang="stylus" scoped>

.article-leading
  a
    display block
    margin 0

  &-post
    display flex
    justify-content space-between

    &__img
      height calc(100vh - 200px)
      overflow hidden

      > figure
        margin 0
        > img
          width 100%
          transform scale(1)
          transition .3s ease-in-out
        > img:hover
          transform scale(1.05)
    &__content
      h2, p
        margin 0
        text-align justify
      h2
        margin-bottom 20px
        font-size 36px
        font-weight 700
        color #222
        line-height 45px
      p
        font-size 16px
        font-weight 300
        color #222
        line-height 30px
    &__dfp
      width 300px
      height 250px
      background-color #247ba0

  &-related
    &-post
      display flex
      &__content
        display flex
        h3
          margin 0
          font-size 18px
          color #222
          text-align justify
        p
          font-size 15px
          color #222
          line-height 20px
          text-align justify

        &--author
          font-size 12px
          color #222

        &--date
          font-size 12px
          color #999


@media (min-width: 1200px)
  .article-leading

    &-post
      padding 40px 40px 50px
      &__meta
        width 170px
        > span
          display block
          font-size 12px
          line-height 20px
        &--date
          color #999

      &__content
        width 600px
    &-related
      padding 0 340px 60px 210px
      > div
        width 600px
        margin 0 auto
        overflow hidden
        > span
          margin-bottom 27px
          font-size 22px
          color #222
          overflow hidden
        > span:after
          content ""
          display inline-block
          width 100%
          height 100%
          margin 0 -100% 0 5px
          border-bottom 2px solid #222
      &-post
        height 140px
        margin-top 30px
        &__img
          width 140px
          height 140px
          > figure
            width 140px
            height 140px
            margin 0
            background-position 50% 50%
            background-repeat no-repeat
            background-size cover
        &__content
          flex-grow 1
          flex-direction column
          justify-content space-between
          margin-left 22px
          > span
            display block


</style>
