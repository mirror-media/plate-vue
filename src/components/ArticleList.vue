<template>
  <section class="articleList container">
    <template v-for="item in articlesBeforeDFPNA3" v-if="hasDFP">
      <router-link :to="getHref(item)" :id="'latest-'+ item.name" class="articleList-block">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </router-link>
      <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style === 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </a>
    </template>

    <slot name="dfpNA3"/>

    <template v-for="item in articlesBeforeDFPNA5" v-if="hasDFP">
      <router-link :to="getHref(item)" :id="'latest-'+ item.name"  class="articleList-block" v-if="item.style !== 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </router-link>
      <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style === 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </a>
    </template>

    <slot name="dfpNA5"/>

    <template v-for="item in articlesBeforeDFPNA9BeforeL1" v-if="hasDFP">
      <router-link :to="getHref(item)" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style !== 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </router-link>
      <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style === 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </a>
    </template>

    <div class="articleList__dfp--l1 mobile-only" v-if="hasDFP">
      <slot name="dfpL1"/>
    </div>

    <template v-for="item in articlesBeforeDFPNA9AfterL1" v-if="hasDFP">
      <router-link :to="getHref(item)" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style !== 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </router-link>
      <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style === 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </a>
    </template>

    <slot name="dfpNA9"/>

    <template v-for="item in articlesAfterDFPNA9" v-if="hasDFP">
      <router-link :to="getHref(item)" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style !== 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </router-link>
      <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style === 'projects'">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </a>
    </template>

    <template v-for="item in sortedArticles" v-if="!hasDFP">
      <router-link :to="getHref(item)" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style !== 'projects' && !isSectionTopic">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </router-link>
      <router-link :to="getTopicHref(item)" :id="'latest-'+ item.name" class="articleList-block" v-if="isSectionTopic">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.name, 20)"></h2>
          <p v-text="getTruncatedVal(item.ogDescription, 45)"></p>
        </div>
      </router-link>
      <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'latest-'+ item.name" class="articleList-block" v-if="item.style === 'projects' && !isSectionTopic">
        <div class="articleList__img" :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }">
        </div>
        <div class="articleList__content" :class="getSection(item)">
          <h2 v-text="getTruncatedVal(item.title, 20)"></h2>
          <p v-text="getBrief(item, 45)"></p>
        </div>
      </a>
    </template>

  </section>
</template>

<script>

import { getBrief, getHref, getImage, getSection, getTruncatedVal } from '../utils/comm'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'articleList',
  components: {
  },
  props: [ 'articles', 'hasDFP' ],
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
      return _.slice(this.sortedArticles, 6)
    },
    isSectionTopic () {
      return (_.get(this.$route, [ 'params', 'title' ]) === 'topic')
    },
    sortedArticles () {
      if (_.get(this.$route, [ 'params', 'title' ]) === 'topic') {
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
    getTruncatedVal,
    moment
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

@media (min-width: 600px)
  .articleList
    &.container
      flex-direction row
      justify-content flex-start
      width 100%
    &-block
      width calc( (100% - 40px) / 2 )
      margin 0 10px 40px
    &__content
      height auto
      p
        display block

@media (min-width: 1200px)
  .articleList
    &.container
      width 1044px
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
