<template>
  <section class="latestArticle grid grid-4-fifth">
    <template v-for="item in test">
      <article-right :article='item'/>
      <article-center :article='item'/>
      <article-left :article='item'/>
    </template>
  </section>
</template>
<script>

import _ from 'lodash'
import ArticleCenter from '../components/article/ArticleCenter.vue'
import ArticleLeft from '../components/article/ArticleLeft.vue'
import ArticleRight from '../components/article/ArticleRight.vue'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export default {
  name: 'latestArticle',
  components: {
    'article-center': ArticleCenter,
    'article-left': ArticleLeft,
    'article-right': ArticleRight,
  },
  data () {
    return {
    }
  },
  props: {
    latestArticle: this.latestArticle
  },
  computed: {
    test() {
      return _.chunk(this.latestArticle.items, 15)
    }
  },
  methods: {
    
  },
  beforeMount () {
   
  },
  mounted() {
  }
}

</script>
<style lang="stylus">

$color-news = #30bac8
$color-entertainment = #bf3284
$color-foodtravel = #eac151
$color-watch = #c1d16e

.list-container
  display flex
  justify-content space-between
  width 100%
  margin-bottom 20px
  > div
    float left
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover
  a
    display block
  
.list
  &-wide
    position relative
    display block
    width calc(50% - 10px)
    padding-top calc(50% - 10px)

    &__img
      position absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover


    &__title
      position absolute
      left 0
      bottom 0
      width 70%
      padding 1em .5em 1em .5em
      font-size 1.5rem
      background-color rgba(255,255,255,.8)

  &-narrow
    display flex
    flex-direction column
    justify-content space-between
    width calc(25% - 10px)

    > div
      height calc(50% - 10px)

    &__title
      h2
        padding .2em 0 .2em .5em
        margin 0
        font-size .9rem

    &__img
      padding-top 75%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover

.list-wide__title, .list-narrow__title
  &.news-people
    border-left 3px solid $color-news

  &.entertainment
    border-left 3px solid $color-entertainment

  &.foodtravel
    border-left 3px solid $color-foodtravel

  &.watch
    border-left 3px solid $color-watch

.list-container
  a:hover
    .list-wide__img
      transform: scaleZ(-1)


</style>