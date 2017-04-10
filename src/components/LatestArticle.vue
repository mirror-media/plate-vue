<template>
  <section id="latestArticle" class="latestArticle">
    <template v-for="(item, index) in articles">
      <article-right :article="item" :briefAmount="briefAmount" :props="props" 
        :hasDFP="index === 0" v-if="(index+1)%3 == 1"/>
      <article-center :article="item" :briefAmount="briefAmount" :props="props" 
        :hasDFP="index === 1" v-if="(index+1)%3 == 2"/>
      <article-left :article="item" :briefAmount="briefAmount" :props="props" 
        :hasDFP="index === 2" v-if="(index+1)%3 == 0"/>
    </template>
  </section>
</template>
<script>

import _ from 'lodash'
import ArticleCenter from '../components/article/ArticleCenter.vue'
import ArticleLeft from '../components/article/ArticleLeft.vue'
import ArticleRight from '../components/article/ArticleRight.vue'

const briefAmount = 40

export default {
  name: 'latestArticle',
  components: {
    'article-center': ArticleCenter,
    'article-left': ArticleLeft,
    'article-right': ArticleRight
  },
  data () {
    return {
      briefAmount: briefAmount
    }
  },
  props: [ 'latestArticle', 'dfpUnits', 'props', 'section', 'vueDfp' ],
  computed: {
    articles () {
      const showArticles = _.take(this.latestArticle, 5 * Math.floor(this.latestArticle.length / 5))
      return _.chunk(showArticles, 5)
    }
  }
}

</script>
<style lang="stylus">

$color-news = #30bac8
$color-entertainment = #bf3284
$color-foodtravel = #eac151
$color-watch = #c1d16e
$color-projects = #000
$color-other = #bcbcbc

.latestArticle
  display: flex
  flex-direction: column
  width 100%
  a
    display block
  > section
    .list-narrow, .list-wide
      &__title
        p
          display none
        h2
          font-size 1.25rem
          line-height 1.6rem
          padding .5em
          margin 0
      
      &__brief
        display none

  > section:first-child
    margin-bottom 50px
    .list-narrow, .list-wide
      &__img
        width 100%
        padding-top 56.25%
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
    .list-narrow
      > a
        margin-bottom 10px
      &__title
        width 90%
        margin 0 auto
      
    .list-wide
      &__title
        width 100%
        padding 0 5%
        background-color #fff
     
  > section:not(:first-child)
    padding 0 5%
    .list-narrow, .list-wide
      &__img
        width 80px
        height 80px
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
      &__title
        h2
          width 100%
          height 100%
          margin 0
          padding 0
          padding-left .5em
    .list-narrow
      > a
        margin-bottom 15px
        > div
          display flex
          justify-content space-between
      
      &__title
        flex-grow 1
        width calc( 100% - 90px )
        max-width calc( 100% - 90px )
        
    .list-wide
      position relative
      margin-bottom 15px
      
      &__title
        position absolute
        top 0
        left 90px
        width calc(100% - 90px)
        height 80px
        
@media (min-width: 600px)  
  .latestArticle
    > section
      .list-narrow, .list-wide
        &__title
          p
            display block
            margin 10px 0 0
            text-align justify
            font-size 1.2rem
            line-height 1.7rem
          h2
            width 100%
            height auto
            padding 0
            font-size 1.6rem
            line-height 2rem
            border-left none
          &.news-people
            border-left 7px solid $color-news

          &.entertainment
            border-left 7px solid $color-entertainment

          &.foodtravel
            border-left 7px solid $color-foodtravel

          &.watch
            border-left 7px solid $color-watch

          &.projects
            border-left 7px solid $color-projects

          &.other
            border-left 7px solid $color-other

      .list-narrow
        > a
          > div
            display flex
            justify-content space-between
        
    > section:first-child
      margin-bottom 20px
      .list-narrow, .list-wide
        &__img
          width calc( 100% / 3)
          padding-top calc( 100% / 3 * .6666)

      .list-narrow
        > a
          margin-bottom 20px
        &__title
          width calc( (100% - 30px) / 3 * 2)
          margin 0
          padding .5em 1em
          
      .list-wide
        position relative
        &__title
          position absolute
          top 50%
          left calc( 100% / 3)
          transform translateY(-50%)
          width calc( (100% - 30px) / 3 * 2)
          height 100%
          padding .5em 1em
          margin-left 20px

    > section:not(:first-child)
      padding 0
      .list-narrow, .list-wide
        &__img
          width calc( 100% / 3)
          padding-top calc( 100% / 3 * .6666)
        &__title
          h2
            width 100%
            height auto
            padding 0
            border-left none
      .list-narrow
        > a
          margin-bottom 20px
        &__title
          flex-grow 0
          width calc( (100% - 30px) / 3 * 2)
          margin 0
          padding .5em 1em
          
      .list-wide
        margin-bottom 20px
        &__title
          position absolute
          top 50%
          left calc( 100% / 3)
          transform translateY(-50%)
          width calc( (100% - 30px) / 3 * 2)
          height 100%
          padding 0
          padding .5em 1em
          margin-left 20px
          

@media (min-width: 1200px)
  .latestArticle
    width 80%
    > section
      .list-narrow, .list-wide
        &__title
          margin 0 !important
          p
            display none !important
          &.news-people
            border-left 7px solid $color-news
          &.entertainment
            border-left 7px solid $color-entertainment
          &.foodtravel
            border-left 7px solid $color-foodtravel
          &.watch
            border-left 7px solid $color-watch
          &.projects
            border-left 7px solid $color-projects
          &.other
            border-left 7px solid $color-other
      .list-narrow
        &__title
          h2
            height auto
            padding .2em 0 .2em .5em !important
            margin 0
            font-weight normal
            font-size .9rem
            line-height 1.2rem
            border-left none


  .list-container
    display flex
    justify-content space-between
    width 100%
    > div
      float left
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover
    a
      display block
      margin-bottom 20px
  .list
    &-wide
      position relative
      display block
      width calc(50% - 15px)
      padding-top calc(50% - 15px)
      &__img
        position absolute
        top: 0
        left: 0
        bottom: 0
        right: 0
        width 100% !important
        height 100% !important
        padding-top 0 !important
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
      &__title
        position absolute
        top auto !important
        left 0 !important
        bottom 0
        width 70% !important
        height auto !important
        padding 1em .5em 1em .5em !important
        font-size 1.5rem
        background-color rgba(255,255,255,.8) !important
        transform translateY(0) !important
        > h2
          padding 0 !important
          border-left none !important
        
    &-narrow
      display flex
      flex-direction column
      justify-content space-between
      width calc(25% - 15px)
      > a
        > div
          display block !important
      &__img
        width 100% !important
        padding-top 75% !important
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
      &__title
        width 100% !important
        max-width 100% !important
        min-height 40px
        padding 0 !important
        
          
.list-narrow__title, .list-wide__title
  > h2
    &.news-people
      border-left 7px solid $color-news

    &.entertainment
      border-left 7px solid $color-entertainment

    &.foodtravel
      border-left 7px solid $color-foodtravel

    &.watch
      border-left 7px solid $color-watch

    &.projects
      border-left 7px solid $color-projects

    &.other
      border-left 7px solid $color-other
</style>
