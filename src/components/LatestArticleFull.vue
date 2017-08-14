<template>
  <section class="latestArticle-full">
    <vue-dfp v-if="isMobile" :is="props.vueDfp" pos="SMBL3" extClass="center" :config="props.config" />
    <div class="latestArticle-full-post-container">
      <h2>最新新聞 Latest Stories</h2>
      <div class="latestArticle-full-posts">
        <template v-for="article in latestArticle">
          <div class="latestArticle-full-post">
            <a :href="getHref(article)" :id="`latest-${article.id}-img`" target="_blank" class="latestArticle-full-post__img">
              <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }" :title="getValue(article, [ 'title' ])"></figure>
            </a>
            <div class="latestArticle-full-post__content">
              <a :href="getHref(article)" :id="`latest-${article.id}-title`" target="_blank"><h2 v-text="article.title"></h2></a>
              <div class="latestArticle-full-post__meta">
                <span class="latestArticle-full-post__meta--author" v-show="getAuthor(article, 'writers')" v-html="getAuthor(article, 'writers') + ' ｜ '"></span>
                <span class="latestArticle-full-post__meta--date" v-text="moment(new Date(article.publishedDate)).format('Y.MM.DD')"></span>
              </div>
              <a :href="getHref(article)" :id="`latest-${article.id}-content`" target="_blank"><p v-html="getBrief(article, 70)"></p></a>
            </div>
          </div>
        </template>
      </div>
      
    </div>
    <div class="latestArticle-full-dfp dfp-R desktop-only">
      <vue-dfp v-if="!isMobile" :is="props.vueDfp" pos="SPCR3" :config="props.config" />
      <vue-dfp v-if="!isMobile" :is="props.vueDfp" pos="SPCR4" :config="props.config" />
    </div>
  </section>
</template>
<script>

import { getAuthor, getBrief, getHref, getImage, getTruncatedVal, getValue } from '../util/comm'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'latestArticle-full',
  props: [ 'articles', 'isMobile', 'props' ],
  methods: {
    getAuthor,
    getBrief,
    getHref,
    getImage,
    getTruncatedVal,
    getValue,
    moment
  },
  computed: {
    latestArticle () {
      return _.slice(this.articles, 2)
    }
  }
}

</script>
<style lang="stylus" scoped>

.latestArticle-full
  display flex
  flex-direction column
  justify-content space-between
  align-items flex-start
  padding 35px 0

  a
    display block

  &-posts
    > div
      padding 0
      margin 0 0 30px 
    > div:last-child
      margin 0
  
  &-post-container
    flex-grow 1
    padding 0 32px
    > h2
      position relative
      left 15px
      margin 0 0 20px
      font-size 22px
      font-weight 300
      color #000
    > h2:before
      content ""
      position absolute
      top 2px
      left -15px
      display inline-block
      width 5px
      height 20px
      background-color #000

  &-post
    display flex
    flex-direction column
    padding 25px 0
    
    &__img
      position relative
      left -32px
      width calc(100% + 64px)
      figure
        width 100%
        padding-top 66.66%
        margin 0
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
    &__content
      flex-grow 1
      margin-left 0
      h2 
        margin 13px 0 0
        font-size 26px
        line-height 35px
        color #222
      p
        margin 0
        font-size 17px
        line-height 25px
        color #444
        text-align justify
    &__meta
      margin 10px 0
      &--author
        font-size 13px
        color #222
      &--date
        font-size 13px
        color #999
    
  &-dfp
    flex-direction column
    width 300px
    min-width 300px
    margin 0 auto
    > div
      height 250px    

@media (min-width: 1200px)
  .latestArticle-full
    flex-direction row
    padding 40px 40px 70px
    &-posts
      > div
        margin 0
        padding 25px 0
      > div:first-child
        padding-top 0
      > div:last-child
        border none
        padding-bottom 0
    &-post-container
      margin-right 50px
      padding 0
      > h2
        margin 0 0 35px
        font-size 25px
      > h2:before
        height 23px
    &-post
      flex-direction row
      border-bottom 1px solid #ccc
      &__img
        width 380px
        height 280px
        left auto
        figure
          width 380px
          height 280px
          margin 0
          padding 0
      &__content
        margin-left 25px
        h2
          margin 0
      &__meta
        margin 25px 0
    &-dfp
      &.dfp-l3
        display none


</style>
