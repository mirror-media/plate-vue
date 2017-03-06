<template>
  <section class="latestArticle-full">
    <div class="latestArticle-full-post-container">
      <h2>最新新聞 Latest Stories</h2>
      <div class="latestArticle-full-posts">
        <template v-for="article in latestArticle">
          <div class="latestArticle-full-post">
            <a :href="getHref(article)" class="latestArticle-full-post__img">
              <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></figure>
            </a>
            <div class="latestArticle-full-post__content">
              <a :href="getHref(article)"><h2 v-text="article.title"></h2></a>
              <div class="latestArticle-full-post__meta">
                <span class="latestArticle-full-post__meta--author" v-show="getAuthor(article, 'writers')" v-html="getAuthor(article, 'writers') + ' ｜ '"></span>
                <span class="latestArticle-full-post__meta--date" v-text="moment(article.publishedDate).format('Y.MM.DD')"></span>
              </div>
              <a :href="getHref(article)"><p v-html="getBrief(article, 70)"></p></a>
            </div>
          </div>
        </template>
      </div>
      
    </div>
    <div class="latestArticle-full-dfp desktop-only">
      <div></div>
    </div>
  </section>
</template>
<script>

import { getAuthor, getBrief, getHref, getImage, getTruncatedVal } from '../utils/comm'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'latestArticle-full',
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
  justify-content space-between
  align-items flex-start
  padding 40px 40px 70px

  a
    display block

  &-posts
    > div:first-child
      padding-top 0
    > div:last-child
      border none
      padding-bottom 0

  
  &-post-container
    flex-grow 1
    margin-right 50px
    
    > h2
      position relative
      left 15px
      margin 0 0 35px
      font-weight 300
      color #000
    > h2:before
      content ""
      position absolute
      top 2px
      left -15px
      display inline-block
      width 5px
      height 23px
      background-color #000

  &-post
    display flex
    padding 25px 0
    border-bottom 1px solid #ccc
    &__img
      width 380px
      height 280px
      figure
        width 380px
        height 280px
        margin 0
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
    &__content
      flex-grow 1
      margin-left 25px
      h2 
        margin 0
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
      margin 25px 0
      &--author
        font-size 13px
        color #222
      &--date
        font-size 13px
        color #999
    
  &-dfp
    width 300px
    min-width 300px

    > div
      height 250px
      background-color #ffe066



</style>
