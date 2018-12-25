<template>
  <section class="header-nav">
    <nav class="header-nav__sections">
      <router-link
        v-for="section in sections"
        v-if="section.id && section.name"
        :key="`section-${section.id}`"
        :to="`/section/${section.name}`"
        :style="{ minWidth: `calc(100% / ${sections.length + 1})`,borderTopColor: getColor(section) }"
        :class="section.name"
        :data-gtm="`section ${section.name}`"
        class="section">
        <span v-text="section.title"></span>
        <div class="dropdown">
          <router-link
            v-for="category in section.categories"
            v-if="category.id && category.title"
            :key="`dropdown-${category.id}`"
            :to="`/category/${category.name}`"
            :data-gtm="`category ${category.name}`"
            v-text="category.title"></router-link>
        </div>
      </router-link>
      <a :style="{ minWidth: `calc(100% / ${sections.length + 1})` }" class="section external">
        <span v-text="$t('HEADER.EXTERNAL')"></span>
        <div class="dropdown">
          <router-link
            v-for="partner in partners"
            v-if="partner.id && partner.display"
            :key="`dropdown-${partner.id}`"
            :to="`/externals/${partner.name}`"
            :data-gtm="`external ${partner.name}`"
            v-text="partner.display"></router-link>
        </div>
      </a>
    </nav>
    <nav class="header-nav__topics">
      <div class="topics-container">
        <router-link
          v-for="topic in topics"
          v-if="topic.id && topic.name"
          :key="`topic-${topic.id}`"
          :to="`/topic/${topic.id}`"
          :data-gtm="`topic ${topic.name}`"
          v-text="topic.name">
        </router-link>
      </div>
      <router-link to="/section/topic" :data-gtm="`topic ${$t('HEADER.MORE')}`" class="more" v-text="$t('HEADER.MORE')"></router-link>
      <a href="https://www.mirrorfiction.com/" class="link--external mirrorfiction" data-gtm="section mirrorfiction" target="_blank"><img src="/assets/mirrormedia/icon/mirrorfiction.png" :alt="$t('HEADER.MIRRORFICTION')"/></a>
      <a href="https://www.readr.tw/" class="link--external readr" data-gtm="section readr" target="_blank"><img src="/assets/mirrormedia/icon/readrlogo-gary.png" :alt="$t('HEADER.READR')"/></a>
    </nav>
  </section>
</template>
<script>
import { SECTION_MAP } from '../../constants/index'
import { get, } from 'lodash'

export default {
  name: 'HeaderNav',
  props: {
    partners: {
      type: Array,
      default () {
        return []
      }
    },
    sections: {
      type: Array,
      default () {
        return []
      }
    },
    topics: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    getColor (section) {
      return get(SECTION_MAP, [ section.id, 'bgcolor' ]) 
    },
    // getTopicsWidth (index) {
    //   const topics = [ ...document.querySelectorAll('.topic') ].slice(0, index + 1)
    //   return topics.reduce((acc, cur) => acc + cur.clientWidth, 0)
    // }
  }
}
</script>
<style lang="stylus" scoped>
$color-news = #30bac8
$color-entertainment = #bf3284
$color-businessmoney = #009045
$color-people = #efa256
$color-videohub = #969696
$color-international = #911f27
$color-foodtravel = #eac151
$color-mafalda = #662d8e
$color-culture = #009245
$color-carandwatch = #c1d16e
$color-external = #ee5a24

.header-nav
  display none

@media (min-width: 1200px)
  .header-nav
    display block
    &__sections
      display flex
      height 45px
      padding 0 calc((100% - 1024px) / 2)
      background-color #064f77
      .section:hover
        .dropdown
          display block
      .section
        flex 1
        display inline-block // IE
        position relative
        text-align center
        border-top 3px solid #000
        &.external
          border-top-color $color-external
        > span
          color #fff
          line-height 42px
      .dropdown
        display none
        position absolute
        top 42px
        left 0
        z-index 10
        width 110px
        background-color #333
        > a
          display block
          padding 13px 10px // IE
          padding .8em .6em
          color #fff
          font-size 1rem
          text-align center
          line-height 1.3
    &__topics
      display flex
      height 45px
      padding 0 calc((100% - 1024px) / 2)
      background-color #fff
      box-shadow 0 0 5px 0 #ccc
      .topics-container
        display inline-block // IE
        max-width 754px
        vertical-align top // IE
        overflow hidden
        > a
          display inline-block // IE
          min-width 90px
          padding 0 .5em
          color rgba(0, 0, 0, .5)
          text-align center
          line-height 42px
          border-bottom 3px solid #000
          &:hover
            color #fff
            background-color #000
      .more
        display inline-block // IE
        min-width 90px
        padding 0 .5em
        margin 0 auto 0 0
        color rgba(0, 0, 0, .5)
        text-align center
        line-height 45px
        vertical-align top // IE
      .link--external
        display inline-block // IE
        min-width 90px
        padding 7.5px 0
        font-size 0
        text-align center
        vertical-align top // IE
        img
          width auto
          height 30px
  // hover color effect
  .header-nav__sections
    .section:hover
      &.news
        background-color $color-news
        .dropdown
          > a:hover
            color $color-news
      &.entertainment
        background-color $color-entertainment
        .dropdown
          > a:hover
            color $color-entertainment
      &.businessmoney
        background-color $color-businessmoney
        .dropdown
          > a:hover
            color $color-businessmoney
      &.people
        background-color $color-people
        .dropdown
          > a:hover
            color $color-people
      &.videohub
        background-color $color-videohub
        .dropdown
          > a:hover
            color $color-videohub
      &.international
        background-color $color-international
        .dropdown
          > a:hover
            color $color-international
      &.foodtravel
        background-color $color-foodtravel
        .dropdown
          > a:hover
            color $color-foodtravel
      &.mafalda
        background-color $color-mafalda
        .dropdown
          > a:hover
            color $color-mafalda
      &.culture
        background-color $color-culture
        .dropdown
          > a:hover
            color $color-culture
      &.carandwatch
        background-color $color-carandwatch
        .dropdown
          > a:hover
            color $color-carandwatch
      &.external
        background-color $color-external
        .dropdown
          > a:hover
            color $color-external
          
</style>
