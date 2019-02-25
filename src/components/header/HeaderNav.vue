<template>
  <section class="header-nav">
    <nav class="header-nav__sections">
      <div
        v-for="section in activeSections"
        :key="`section-${section.id}`"
        :style="{ minWidth: `calc(100% / ${sections.length + 1})`,borderTopColor: getColor(section) }"
        :class="[ section.name, 'section' ]">
        <router-link
          v-if="section.name !== 'videohub'"
          :to="`/section/${section.name}`"
          :data-gtm="`section ${section.name}`"
          data-gtm-category="header">
          <span v-text="section.title"></span>
        </router-link>
        <a
          v-else
          :href="`/section/${section.name}`"
          :data-gtm="`section ${section.name}`"
          data-gtm-category="header">
          <span v-text="section.title"></span>
        </a>
        <div class="dropdown">
          <template v-if="section.name === 'videohub'">
            <a
              v-for="category in filterSectionCategories(section)"
              :key="`dropdown-${category.id}`"
              :href="`/category/${category.name}`"
              :data-gtm="`category ${category.name}`"
              data-gtm-category="header"
              v-text="category.title"></a>
          </template>
          <template v-else>
            <router-link
              v-for="category in filterSectionCategories(section)"
              :key="`dropdown-${category.id}`"
              :to="`/category/${category.name}`"
              :data-gtm="`category ${category.name}`"
              data-gtm-category="header"
              v-text="category.title"></router-link>
          </template>
        </div>
      </div>
      <div :style="{ minWidth: `calc(100% / ${sections.length + 1})` }" class="section external">
        <a>
          <span v-text="$t('HEADER.EXTERNAL')"></span>
        </a>
        <div class="dropdown">
          <router-link
            v-for="partner in activePartners"
            :key="`dropdown-${partner.id}`"
            :to="`/externals/${partner.name}`"
            :data-gtm="`external ${partner.name}`"
            data-gtm-category="header"
            v-text="partner.display"></router-link>
        </div>
      </div>
    </nav>
    <nav class="header-nav__topics">
      <div class="topics-container">
        <router-link
          v-for="topic in activeTopics"
          :key="`topic-${topic.id}`"
          :to="`/topic/${topic.id}`"
          :data-gtm="`topic ${topic.name}`"
          data-gtm-category="header"
          v-text="topic.name">
        </router-link>
      </div>
      <router-link to="/section/topic" :data-gtm="`topic ${$t('HEADER.MORE')}`" class="more" data-gtm-category="header" v-text="$t('HEADER.MORE')"></router-link>
      <a href="https://www.mirrorfiction.com/" class="link--external mirrorfiction" data-gtm="section mirrorfiction" data-gtm-category="header" target="_blank">
        <LazyImage src="/assets/mirrormedia/icon/mirrorfiction.png" :caption="$t('HEADER.MIRRORFICTION')" />
      </a>
      <a href="https://www.readr.tw/" class="link--external readr" data-gtm="section readr" data-gtm-category="header" target="_blank">
        <LazyImage src="/assets/mirrormedia/icon/readrlogo-gary.png" :caption="$t('HEADER.READR')" />
      </a>
    </nav>
  </section>
</template>
<script>
import LazyImage from 'src/components/common/LazyImage.vue'
import { SECTION_MAP } from '../../constants'
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
  components: {
    LazyImage,
  },
  computed: {
    activePartners () {
      return this.partners.filter(partner => partner.public && partner.id && partner.display)
    },
    activeSections () {
      return this.sections.filter(section => section.id && section.name)
    },
    activeTopics () {
      return this.topics.filter(topic => topic.id && topic.name)
    }
  },
  methods: {
    filterSectionCategories (section) {
      const categories = section.categories || []
      return categories.filter(category => category.id && category.title)
    },
    getColor (section) {
      return get(SECTION_MAP, [ section.id, 'bgcolor' ]) 
    }
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
$color-carandwatch = #003153
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
        a
          display block
        span
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
            background-color $color-news
      &.entertainment
        background-color $color-entertainment
        .dropdown
          > a:hover
            background-color $color-entertainment
      &.businessmoney
        background-color $color-businessmoney
        .dropdown
          > a:hover
            background-color $color-businessmoney
      &.people
        background-color $color-people
        .dropdown
          > a:hover
            background-color $color-people
      &.videohub
        background-color $color-videohub
        .dropdown
          > a:hover
            background-color $color-videohub
      &.international
        background-color $color-international
        .dropdown
          > a:hover
            background-color $color-international
      &.foodtravel
        background-color $color-foodtravel
        .dropdown
          > a:hover
            background-color $color-foodtravel
      &.mafalda
        background-color $color-mafalda
        .dropdown
          > a:hover
            background-color $color-mafalda
      &.culture
        background-color $color-culture
        .dropdown
          > a:hover
            background-color $color-culture
      &.carandwatch
        background-color $color-carandwatch
        .dropdown
          > a:hover
            background-color $color-carandwatch
      &.external
        background-color $color-external
        .dropdown
          > a:hover
            background-color $color-external
          
</style>
