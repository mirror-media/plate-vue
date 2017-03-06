<template>
  <footer class="footerFull">
    <div class="footerFull__logo">
      <a :href="'/section/' + this.section" :style="{ height: getSectionLogoHeight() + 'px' }">
        <img :src="getSectionLogoUrl()" :style="{ width: getSectionLogoWidth() + 'px', height: getSectionLogoHeight() + 'px' }">
      </a>
    </div>
    <div class="footerFull__menu">
      <a :href="item.href" v-for="item in menuItem.section" v-text="item.title"></a>
      <a :href="item.href" v-for="item in menuItem.category" v-text="item.title"></a>
    </div>
    <div class="footerFull__vertDivider"></div>
    <div class="footerFull__link">
      <div class="footerFull__link--subscribe">
        <a href="">訂閱鏡週刊</a> - <a href="">廣告合作</a>
      </div>
      <div class="footerFull__link--horizDivider"></div>
      <div class="footerFull__link--socialMedia">
        <a href=""><img class="facebook" src="~public/icon/facebook_white.png"></a>
        <a href=""><img class="line" src="~public/icon/line_white.png"></a>
        <a href=""><img class="weibo" src="~public/icon/weibo_white.png"></a>
      </div>
    </div>
  </footer>
</template>
<script>

import { SOCIAL_LINK } from '../constants/index'
import _ from 'lodash'

export default {
  name: 'footer-full',
  props: {
    commonData: {},
    section: ''
  },
  data () {
    return {
      socialLink: SOCIAL_LINK,
    }
  },
  computed: {
    menuItem () {
      let menuItem = {}
      menuItem.section = []
      menuItem.category = []
      _.forEach(this.commonData.sections.items, (s) => {
        s.href = '/section/' + s.name
        s.isFeatured ? menuItem.section.push(s) : ''
        _.forEach(s.categories, (c) => {
          c.href = '/category/' + c.name
          c.section = s.name
          c.isFeatured ? menuItem.category.push(c) : ''
        })
      })
      return menuItem
    },
    sectionLogo () {
      return _.get( _.find( _.get(this.commonData, [ 'sections', 'items' ]), { name: this.section }), [ 'image' ], null)
    },
  },
  methods: {
    getSectionLogoUrl () {
      return _.get(this.sectionLogo, [ 'image', 'url' ]) ? _.get(this.sectionLogo, [ 'image', 'url' ]) : '/asset/logo.png'
    },
    getSectionLogoWidth () {
      return _.get(this.sectionLogo, [ 'image', 'width' ])
    },
    getSectionLogoHeight () {
      return _.get(this.sectionLogo, [ 'image', 'height' ])
    }
  },
}
</script>
<style lang="stylus" scoped>

.footerFull
  display flex
  justify-content space-between
  padding 25px 95px
  background-color #000

  a
    display block

  &__logo
    display flex
    justify-content center
    align-items center

  &__menu
    display flex
    flex-wrap wrap
    width 445px
    > a
      font-size 15px
      font-weight 300
      color #fff

  &__vertDivider
    display none
    width 1px
    background-color #6e6e6e

  &__link
    display flex
    justify-content center
    align-items center
    flex-direction column
    width 180px
    &--subscribe
      margin-bottom 25px
      a
        display inline-block
        color #9fa1a0
        font-size 15px
    &--horizDivider
      display block
    &--socialMedia
      display flex
      justify-content space-between
      width 100%

      .facebook, .line, .weibo
        height 22px
      

@media (min-width 1200px)
  .footerFull
    &__menu
      > a
        width 25%
        margin 15px 0
    &__vertDivider
      display block
    &__link
      &--horizDivider
        display none

</style>
