<template>
  <section class="articleList container">
    <template v-for="(item, index) in articlesBeforeDFPNA3" v-if="hasDFP">
      <listArticle-block :index="index" :initialArticle="item" :initialTogglePause="togglePause" v-on:pauseAllAudio="pauseAllAudio" />
    </template>

    <slot name="dfpNA3"/>

    <template v-for="(item, index) in articlesBeforeDFPNA5" v-if="hasDFP">
      <listArticle-block :index="index" :initialArticle="item" :initialTogglePause="togglePause" v-on:pauseAllAudio="pauseAllAudio" />
    </template>

    <slot name="dfpNA5"/>

    <template v-for="(item, index) in articlesBeforeDFPNA9BeforeL1" v-if="hasDFP">
      <listArticle-block :index="index" :initialArticle="item" :initialTogglePause="togglePause" v-on:pauseAllAudio="pauseAllAudio" />
    </template>

    <div class="articleList__dfp--l1 mobile-only" v-if="hasDFP">
      <slot name="dfpL1"/>
    </div>

    <template v-for="(item, index) in articlesBeforeDFPNA9AfterL1" v-if="hasDFP">
      <listArticle-block :index="index" :initialArticle="item" :initialTogglePause="togglePause" v-on:pauseAllAudio="pauseAllAudio" />
    </template>

    <slot name="dfpNA9"/>

    <template v-for="(item, index) in articlesAfterDFPNA9" v-if="hasDFP">
      <listArticle-block :index="index" :initialArticle="item" :initialTogglePause="togglePause" v-on:pauseAllAudio="pauseAllAudio" />
    </template>

    <template v-for="(item, index) in sortedArticles" v-if="!hasDFP">
      <listArticle-block :index="index" :initialArticle="item" :initialTogglePause="togglePause" v-on:pauseAllAudio="pauseAllAudio" />
    </template>

  </section>
</template>

<script>

import { getBrief, getHref, getImage, getSection, getTruncatedVal } from '../util/comm'
import _ from 'lodash'
import ListArticleBlock from './list/ListArticleBlock.vue'
import moment from 'moment'

const MAXTITLEAMOUNT = 28

export default {
  name: 'articleList',
  components: {
    'listArticle-block': ListArticleBlock
  },
  props: [ 'articles', 'hasDFP' ],
  data () {
    return {
      togglePause: undefined
    }
  },
  computed: {
    articlesBeforeDFPNA3 () {
      return _.take(this.sortedArticles, 2)
    },
    articlesBeforeDFPNA5 () {
      return _.slice(this.sortedArticles, 2, 3)
    },
    articlesBeforeDFPNA9BeforeL1 () {
      return _.slice(this.sortedArticles, 3, 4)
    },
    articlesBeforeDFPNA9AfterL1 () {
      return _.slice(this.sortedArticles, 4, 6)
    },
    articlesAfterDFPNA9 () {
      return _.slice(this.sortedArticles, 6, 12)
    },
    isSectionTopic () {
      return (_.get(this.$route, [ 'params', 'title' ]) === 'topic')
    },
    sortedArticles () {
      if (_.get(this.$route, [ 'params', 'title' ]) === 'topic' || _.get(this.$route, [ 'params', 'title' ]) === 'videohub') {
        return this.articles
      }
      return _.sortBy(_.filter(this.articles, 'title'), [ function (a) {
        return -moment(new Date(a.publishedDate)).unix()
      } ])
    }
  },
  methods: {
    getBrief,
    getHref,
    getImage,
    getSection,
    getTopicHref (item) {
      return `/topic/${_.get(item, [ 'id' ])}`
    },
    getTitle (title) {
      return this.getTruncatedVal(title, MAXTITLEAMOUNT)
    },
    getTruncatedVal,
    moment,
    pauseAllAudio (index) {
      this.togglePause = index
    }
  }
}
</script>
<style lang="stylus" scoped>

$color-news = #30bac8
$color-entertainment = #bf3284
$color-foodtravel = #eac151
$color-watch = #c1d16e
$color-projects = #000
$color-other = #bcbcbc

.articleList
  &.container
    flex-direction column
    flex-wrap wrap
    margin-top .5em
  &-block
    width 100%
    margin-bottom 40px
    background-color #fff
    box-shadow 5px 5px 5px #bcbcbc
    transition all .3s ease-in-out

  &-block:hover
    transform translateY(-20px)
    box-shadow 5px 15px 5px #bcbcbc

  &__img
    padding-top: 66.66%
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover

  &__content
    padding 0 15px 15px 30px
    text-align justify

    h2
      position relative
      margin 0
      padding .5em 0
      font-weight 300
      line-height 1.7rem

    h2:before
      content: ''
      display block
      position absolute
      top 0
      bottom 0
      left -15px
      width 7px
      
    p
      margin 0
      padding 1em 0
      color #999
      font-weight 300
      line-height 1.3rem

  &__dfp
    &--l1
      width calc( 100% - 20px )
      margin 0 10px 40px

.nativeDFP
  width 100%
  margin-bottom 40px
  background-color #f4f1e9
  box-shadow 5px 5px 5px #bcbcbc
  transition all .3s ease-in-out

@media (min-width: 600px)
  .articleList
    &.container
      flex-direction row
      justify-content flex-start
      width calc(100% - 30px)
    &-block
      width calc( (100% - 40px) / 2 )
      margin 0 10px 40px
    &__content
      height auto
      p
        display block
  .nativeDFP
    width calc( (100% - 40px) / 2 )
    margin 0 10px 40px
    &:hover
      transform translateY(-20px)
      box-shadow 5px 15px 5px #bcbcbc

@media (min-width: 1200px)
  .articleList
    &.container
      width 1044px
    &-block
      width calc( (100% - 60px) / 3 )
  .nativeDFP
    width calc( (100% - 60px) / 3 )

.news-people
  h2:before
    background-color $color-news

.entertainment
  h2:before
    background-color $color-entertainment

.foodtravel
  h2:before
    background-color $color-foodtravel

.watch
  h2:before
    background-color $color-watch

.projects
  h2:before
    background-color $color-projects

.other
  h2:before
    background-color $color-other

</style>
