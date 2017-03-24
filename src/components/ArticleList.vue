<template>
  <section class="articleList container">
    <router-link :to="getHref(item)" :id="'latest-'+ item.name" v-for="item in articlesBeforeDFPNA3" class="articleList-block">
      <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
      </div>
      <div class="articleList__content" :class="getSection(item)">
        <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
        <p v-text="getBrief(item, 45)"></p>
      </div>
    </router-link>
    <vue-dfp :is="props.vueDfp" pos="LPCNA3" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
    <router-link :to="getHref(item)" :id="'latest-'+ item.name" v-for="item in articlesBeforeDFPNA5" class="articleList-block">
      <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
      </div>
      <div class="articleList__content" :class="getSection(item)">
        <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
        <p v-text="getBrief(item, 45)"></p>
      </div>
    </router-link>
    <vue-dfp :is="props.vueDfp" pos="LPCNA5" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
    <router-link :to="getHref(item)" :id="'latest-'+ item.name" v-for="item in articlesBeforeDFPNA9" class="articleList-block">
      <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
      </div>
      <div class="articleList__content" :class="getSection(item)">
        <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
        <p v-text="getBrief(item, 45)"></p>
      </div>
    </router-link>
    <vue-dfp :is="props.vueDfp" pos="LPCNA9" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
    <router-link :to="getHref(item)" :id="'latest-'+ item.name" v-for="item in articlesAfterDFPNA9" class="articleList-block">
      <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
      </div>
      <div class="articleList__content" :class="getSection(item)">
        <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
        <p v-text="getBrief(item, 45)"></p>
      </div>
    </router-link>
  </section>
</template>

<script>

import { getBrief, getHref, getImage, getSection, getTruncatedVal } from '../utils/comm'
import _ from 'lodash'

export default {
  name: 'articleList',
  components: {
  },
  props: ['articles', 'props'],
  computed: {
    articlesBeforeDFPNA3 () {
      return _.take(this.articles, 2)
    },
    articlesBeforeDFPNA5 () {
      return _.slice(this.articles, 2, 3)
    },
    articlesBeforeDFPNA9 () {
      return _.slice(this.articles, 3, 6)
    },
    articlesAfterDFPNA9 () {
      return _.slice(this.articles, 6)
    }
  },
  methods: {
    getBrief,
    getHref,
    getImage,
    getSection,
    getTruncatedVal,
  },
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
    margin-top 30px
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
    height 183px
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover

  &__content
    height 91.5px
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
      width 5px
      
    p
      display none
      margin 0
      padding 1em 0
      color #999
      font-weight 300
      line-height 1.3rem

@media (min-width: 600px)
  .articleList
    &.container
      flex-direction row
      justify-content flex-start
    &-block
      width calc( (100% - 40px) / 2 )
      margin 0 10px 40px
    &__img
      padding-top: 66.66%
    &__content
      height auto
      p
        display block

@media (min-width: 1200px)
  .articleList
    &-block
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