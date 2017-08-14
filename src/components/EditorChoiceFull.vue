<template>
  <section class="editorChoice-full">
    <h2>編輯精選 Editor's Picks</h2>
    <div class="editorChoice-full-post-container">
      <template v-for="article in highlightArticle">
        <div class="editorChoice-full-post">
          <router-link :to="getHref(article)" :id="`choice-${article.id}-img`" target="_blank" class="editorChoice-full-post__img">
            <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }" :title="getValue(article, [ 'title' ])"></figure>
          </router-link>
          <div class="editorChoice-full-post__content">
            <h2><router-link :to="getHref(article)" :id="`choice-${article.id}-title`" target="_blank" v-text="article.title"></router-link></h2>
            <p><router-link :to="getHref(article)" :id="`choice-${article.id}-brief`" target="_blank" v-html="getBrief(article, 100)"></router-link></p>
          </div>
          <div class="editorChoice-full-post__meta">
            <span class="editorChoice-full-post__meta--author" v-show="getAuthor(article, 'writers')" v-html="getAuthor(article, 'writers')"></span>
            <span class="editorChoice-full-post__meta--date" v-text="moment(new Date(article.publishedDate)).format('Y.MM.DD')"></span>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
<script>

import { getAuthor, getBrief, getHref, getImage, getTruncatedVal, getValue } from '../util/comm'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'editorChoice-full',
  props: {
    sectionfeatured: {}
  },
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
    highlightArticle () {
      return _.take(this.sectionfeatured, 3)
    }
  }
}
</script>
<style lang="stylus" scoped>

.editorChoice-full
  padding 25px 32px
  background-color #ddd
  a
    display block
  > h2
    position relative
    left 15px
    margin 0
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
  &-post-container
    display flex
    flex-direction column
    justify-content space-between
    margin-top 18px
    > div:first-child
      margin 0
  &-post
    margin-top 35px
    &__img
      position relative
      left -32px
      width calc(100% + 64px)
      > figure
        width 100%
        padding-top 66.66%
        margin 0
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
    &__content
      h2, p 
        color #000
        text-align justify
      h2
        margin 20px 0 16px
        font-size 23px
        
      p
        margin 0 0 30px
        font-size 15px
        line-height 25px
    &__meta
      display flex
      justify-content space-between
        
      &--author
        margin-right 10px
        font-size 12px
        color #000
      &--date
        font-size 12px
        color #999
      


@media (min-width: 1200px)
  .editorChoice-full
    padding 50px 40px 60px
    > h2
      font-size 25px
    > h2:before
      height 23px
    &-post-container
      flex-direction row
      margin-top 30px
    &-post
      width calc((100% - 40px)/3)
      margin-top 0
      &__img
        width 100%
        left auto
      &__content
        h2
          height 78px
        p
          height 100px
      &__meta
        justify-content  flex-start

</style>
