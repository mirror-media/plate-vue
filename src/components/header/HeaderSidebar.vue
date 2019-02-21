<template>
  <section class="header-sidebar">
    <button class="header-sidebar__close" @click="$emit('closeSidebar')"><img src="/assets/mirrormedia/icon/close_white@2x.png" :alt="$t('HEADER.CLOSE')" data-gtm="menu close" data-gtm-category="header"></button>
    <div v-if="topics.length > 0" class="topics">
      <router-link
        v-for="topic in activeTopics"
        :key="`sidebar-topic-${topic.id}`"
        :to="`/topic/${topic.id}`"
        :data-gtm="`topic ${topic.name}`"
        data-gtm-category="header"
        v-text="topic.name">
      </router-link>
      <router-link to="/section/topic" class="topic--more" :data-gtm="`topic ${$t('HEADER.MORE')}`" data-gtm-category="header" v-text="$t('HEADER.MORE')"></router-link>
    </div>
    <div class="sections">
      <div
        v-for="section in activeSections"
        :key="`sidebar-section-${section.id}`"
        :style="{ borderLeftColor: getColor(section) }"
        class="section">
        <router-link v-if="section.name !== 'videohub'" :to="`/section/${section.name}`" :data-gtm="`section ${section.name}`" data-gtm-category="header" v-text="section.title"></router-link>
        <a v-else :href="`/section/${section.name}`" :data-gtm="`section ${section.name}`" data-gtm-category="header" v-text="section.title"></a>
        <div class="categories">
          <template v-if="section.name === 'videohub'">
            <a
              v-for="category in filterSectionCategories(section)"
              :key="`sidebar-category-${category.id}`"
              :href="`/category/${category.name}`"
              :data-gtm="`category ${category.name}`"
              data-gtm-category="header"
              v-text="category.title">
            </a>
          </template>
          <template v-else>
            <router-link
              v-for="category in filterSectionCategories(section)"
              :key="`sidebar-category-${category.id}`"
              :to="`/category/${category.name}`"
              :data-gtm="`category ${category.name}`"
              data-gtm-category="header"
              v-text="category.title">
            </router-link>
          </template>
        </div>
      </div>
      <div class="section external">
        <a v-text="$t('HEADER.EXTERNAL')"></a>
        <div v-if="partners.length > 0" class="categories">
          <router-link
            v-for="partner in activePartners"
            :key="`sidebar-partner-${partner.id}`"
            :to="`/externals/${partner.name}`"
            :data-gtm="`external ${partner.name}`"
            data-gtm-category="header"
            v-text="partner.display">
          </router-link>
        </div>
      </div>
      <div class="section mirrorfiction">
        <a href="https://www.mirrorfiction.com/" class="link--external mirrorfiction" data-gtm="section mirrorfiction" data-gtm-category="header" target="_blank" v-text="$t('HEADER.MIRRORFICTION')"></a>
      </div>
      <div class="section">
        <a href="https://www.readr.tw/" class="link--external readr" data-gtm="section readr" data-gtm-category="header" target="_blank" v-text="$t('HEADER.READR')"></a>
      </div>
    </div>
    <div class="others">
      <a :href="SOCIAL_LINK.SUBSCRIBE" data-gtm="more subscribe" data-gtm-category="header" target="_blank" v-text="$t('HEADER.SUBSCRIBE')"></a>
      <a :href="SOCIAL_LINK.MAGAZINE" data-gtm="more magazine" data-gtm-category="header" target="_blank" v-text="$t('HEADER.MAGAZINE')"></a>
      <a :href="SOCIAL_LINK.AUTH" data-gtm="more auth" data-gtm-category="header" target="_blank" v-text="$t('HEADER.AUTH')"></a>
      <a :href="SOCIAL_LINK.AD" data-gtm="more ad" data-gtm-category="header" target="_blank" v-text="$t('HEADER.AD')"></a>
      <a href="/category/campaign" data-gtm="more campaign" data-gtm-category="header" target="_blank" v-text="$t('HEADER.CAMPAIGN')"></a>
      <a :href="SOCIAL_LINK.DOWNLOADAPP" data-gtm="more download" data-gtm-category="header" target="_blank" v-text="$t('HEADER.DOWNLOADAPP')"></a>
    </div>
    <div class="social-media">
      <a :href="SOCIAL_LINK.LINE" data-gtm="social line" data-gtm-category="header" target="_blank"><img class="sprite sprite-line" src="/assets/mirrormedia/transperent.png" :alt="$t('HEADER.LINE')"></a>
      <a :href="SOCIAL_LINK.WEIBO" data-gtm="social weibo" data-gtm-category="header" target="_blank"><img class="sprite sprite-weibo" src="/assets/mirrormedia/transperent.png" :alt="$t('HEADER.WEIBO')"></a>
      <a :href="SOCIAL_LINK.FACEBOOK" data-gtm="social facebook" data-gtm-category="header" target="_blank"><img class="sprite sprite-facebook" src="/assets/mirrormedia/transperent.png" :alt="$t('HEADER.FACEBOOK')"></a>
      <a :href="SOCIAL_LINK.INSTAGRAM" data-gtm="social instagram" data-gtm-category="header" target="_blank"><img class="sprite sprite-instagram" src="/assets/mirrormedia/transperent.png" :alt="$t('HEADER.INSTAGRAM')"></a>
      <a :href="SOCIAL_LINK.FEED" data-gtm="social rss" data-gtm-category="header" target="_blank"><img class="sprite sprite-rss" src="/assets/mirrormedia/transperent.png" :alt="$t('HEADER.RSS')"></a>
      <a :href="SOCIAL_LINK.EMAIL" data-gtm="social mail" data-gtm-category="header" target="_blank"><img class="sprite sprite-mail" src="/assets/mirrormedia/transperent.png" :alt="$t('HEADER.EMAIL')"></a>
    </div>
  </section>
</template>
<script>

import { SECTION_MAP, SOCIAL_LINK } from '../../constants'
import { get, } from 'lodash'

export default {
  name: 'HeaderSidebar',
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
  data () {
    return {
      SOCIAL_LINK
    }
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
.header-sidebar
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 1000
  padding calc(5% + 30px) 5% 5%
  background-color #333
  overflow-y auto
  &__close
    position absolute
    top 1em
    right 1em
    width 20px
    height 20px
    padding 0
    background-color transparent
    border none
    img
      width 100%
      height 100%

.topics
  position relative
  left -0.5em
  width calc(100% + 1em)
  display flex
  flex-wrap wrap
  a
    margin .5em 0
    padding 0 .5em
    color #fff
    font-size 1rem
    border-right 1px solid #fff
    &:last-child
      border-right none

.sections
  margin-top 1em
  .section
    padding 1em 0 1em 1em
    border-left 3px solid #000
    border-bottom 1px solid #7e7e7e
    &:last-of-type
      border-bottom none
    &.external
      border-left-color #ee5a24
    &.mirrorfiction
      border-left-color #968375
    > a
      color #fff
      font-size 1.2rem
      font-weight 300
  .categories
    display flex
    flex-wrap wrap
    margin-top 1em
    > a
      margin .2em 1em .2em 0
      color #969696
      font-size 1.1rem
      font-weight 300
      &:last-child
        margin-right 0
.others
  display flex
  justify-content space-between
  flex-wrap wrap
  margin-top 1em
  > a
    width calc(50% - 5px)
    margin .5em 0
    padding .2em 0
    color #969696
    font-size 1rem
    font-weight 300
    text-align center
    border 1px solid #969696

.social-media
  display flex
  justify-content space-between
  margin-top 1em

.sprite
  background-image url('/assets/mirrormedia/icon/socialMedia_white@2x.png')
  background-repeat no-repeat
  background-size 126px 120px
  display block
  &-facebook
    width 20px
    height 20px
    background-position -106px -100px
  &-instagram
    width 20px
    height 20px
    background-position -46px -40px
  &-line
    width 20px
    height 20px
    background-position -86px -80px
  &-mail
    width 26px
    height 20px
    background-position 0 0
  &-rss
    width 20px
    height 20px
    background-position -26px -20px
  &-weibo
    width 20px
    height 20px
    background-position -66px -60px

</style>
