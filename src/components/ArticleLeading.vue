<template>
  <section class="article-leading">
    <div v-for="(article, index) in highlightArticle">
      <figure class="article-leading-img">
        <a :href="getHref(article)" :id="`leading-${article.id}-img`" target="_blank">
          <img :src="getImage(article, 'desktop')" :alt="getValue(article, [ 'title' ])">
        </a>
      </figure>
      <div class="article-leading-post">
        <div class="article-leading-post__meta">
          <span class="article-leading-post__meta--author" v-html="getAuthor(article)"></span>
          <span class="article-leading-post__meta--date" v-text="moment(new Date(article.publishedDate)).format('Y.MM.DD')"></span>
        </div>
        <div class="article-leading-post__content">
          <h2><a :href="getHref(article)" :id="`leading-${article.id}-title`" target="_blank" v-text="article.title"></a></h2>
          <p><a :href="getHref(article)" :id="`leading-${article.id}-content`" target="_blank" v-text="`${getBrief(article, 200)} <More>`"></a></p>
        </div>
        <div class="article-leading-post__dfp dfp-l1 dfp-l2">
          <vue-dfp v-if="index === 0 && !isMobile" :is="props.vueDfp" pos="SPCR1" :config="props.config" />
          <vue-dfp v-if="index === 1 && !isMobile" :is="props.vueDfp" pos="SPCR2" :config="props.config" />
          <vue-dfp v-if="index === 0 && isMobile" :is="props.vueDfp" pos="SMBL1" :config="props.config" />
          <vue-dfp v-if="index === 1 && isMobile" :is="props.vueDfp" pos="SMBL2" :config="props.config" />
        </div>
      </div>
      <div class="article-leading-related" v-if="hasRelated(article)">
        <div>
          <span>相關文章 Related Stories</span>
          <template v-for="related in getRelated(article)">
            <div class="article-leading-related-post">
              <figure class="article-leading-related-post__img" :style="{ backgroundImage: 'url(' + getImage(related, 'mobile') + ')' }" :title="getValue(related, [ 'title' ])">
                <a :href="getHref(related)" :id="`related-${related.id}-img`" target="_blank">
                </a>
              </figure>
              <div class="article-leading-related-post__content">
                <h3><a :href="getHref(related)" :id="`related-${related.id}-title`" target="_blank" v-text="related.title"></a></h3>
                <p><a :href="getHref(related)" :id="`related-${related.id}-content`" target="_blank" v-html="getBrief(related, 55)"></a></p>
                <div class="article-leading-related-post__content--meta">
                  <span class="article-leading-related-post__content--author" 
                        v-html="getAuthor(related, 'writers')"></span>
                  <span class="article-leading-related-post__content--date" 
                        v-text="moment(new Date(related.publishedDate)).format('Y.MM.DD')"></span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import { getAuthor, getBrief, getHref, getImage, getTruncatedVal, getValue } from '../util/comm'
import _ from 'lodash'
import moment from 'moment'
import objectFitImages from 'object-fit-images'

export default {
  name: 'article-leading',
  props: [ 'articles', 'isMobile', 'props' ],
  methods: {
    getAuthor,
    getBrief,
    getHref,
    getImage,
    getTruncatedVal,
    getValue,
    moment,
    hasRelated (article) {
      return _.get(article, [ 'relateds', 'length' ]) > 0
    },
    getRelated (article) {
      return _.take(article.relateds, 2)
    }
  },
  computed: {
    highlightArticle () {
      return _.take(this.articles, 2)
    }
  },
  mounted () {
    objectFitImages()
  }
}

</script>
<style lang="stylus" scoped>

.article-leading
  a
    margin 0
  figure
    margin 0
  &-img
    position relative
    width 100%
    height auto
    padding-top 66.66%
    overflow hidden
    img
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      font-family 'object-fit: cover; object-position: 50% 50%;'
      object-fit cover
      object-position 50% 50%
      transform scale(1)
      transition .3s ease-in-out

  &-img:hover
    img
      transform scale(1.05)

  &-post
    display flex
    flex-direction column
    justify-content space-between
    padding 20px 0 30px

    &__meta
      margin-bottom 25px
      padding 0 32px
      &--author
        font-size 13px
      &--date
        font-size 12px
        color #999
  
    &__content
      padding 0 32px
      h2, p
        margin 0
        text-align justify
      h2
        margin-bottom 25px
        font-size 25px
        font-weight 700
        color #222
        line-height 30px
      p
        margin-bottom 30px
        font-size 16px
        font-weight 300
        color #222
        line-height 30px
    &__dfp
      width 300px
      height auto
      margin 0 auto

  &-related
    padding 0 32px 35px
    > div
      margin 0 auto
      overflow hidden
      > span
        margin-bottom 23px
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
      display flex
      margin-top 23px
      &__img
        width 100px
        min-width 100px
        height 100px
        min-height 100px
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
          
      &__content
        display flex
        flex-direction column
        flex-grow 1
        margin-left 15px
        h3
          margin 0 0 15px
          font-size 18px
          color #222
          text-align justify
        p
          display none
          font-size 15px
          color #222
          line-height 20px
          text-align justify

        &--meta
          display flex
          flex-direction column
          > span
            text-align justify

        &--author
          margin-bottom 5px
          font-size 12px
          color #222

        &--date
          font-size 12px
          color #999

@media (min-width: 600px)
  .article-leading
    &-related
      &-post
        &__img
          width 140px
          min-width 140px
          height 140px
          min-height 140px

@media (min-width: 1200px)
  .article-leading

    &-img
      height calc(100vh - 200px)
      padding 0

    &-post
      flex-direction row
      padding 40px 40px 50px
      &__meta
        width 170px
        padding 0
        > span
          display block
          font-size 12px
          line-height 20px

      &__content
        width 600px
        padding 0
        h2
          margin-bottom 20px
          font-size 36px
          line-height 45px
        p
          margin 0
      &__dfp
        margin 0

    &-related
      padding 0 340px 60px 210px
      > div
        width 600px
        > span
          margin-bottom 27px
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
          
        &__content
          margin-left 22px
          justify-content space-between
          h3
            margin 0
          > span
            display block

</style>
