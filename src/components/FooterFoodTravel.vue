<template>
  <footer class="footer-foodtravel">
    <div class="footer-foodtravel__logo">
      <router-link :to="'/section/' + this.sectionName" :id="'footer-' + this.sectionName + '-backToTop'">
        <img :src="getSectionLogoUrl()"/>
      </router-link>
    </div>

    <div class="footer-foodtravel__menu">
      <router-link :to="item.href" v-for="(item, i) in menuItem.section" v-text="item.title" :id="'footer-' + item.href" :key="`${i}-${Date.now()}`"></router-link>
      <router-link :to="item.href" v-for="(item, i) in menuItem.category" v-text="item.title" :id="'footer-' + item.href" :key="`${i}-${Date.now()}`"></router-link>
    </div>

    <div class="footer-foodtravel__vertDivider"></div>

    <div class="footer-foodtravel--horizDivider"></div>

    <div class="footer-foodtravel__link">
      <div class="footer-foodtravel__link--subscribe">
        <a :href="socialLink.SUBSCRIBE" target="_blank" id="footer-subscribe">訂閱鏡週刊</a> - <a :href="socialLink.AD">廣告合作</a>
      </div>
      <div class="footer-foodtravel__link--socialMedia">
        <a :href="socialLink.FACEBOOK" target="_blank" id="footer-facebook"><img class="facebook" src="/assets/mirrormedia/icon/facebook_white.png" alt="Facebook"></a>
        <a :href="socialLink.LINE" target="_blank" id="footer-line"><img class="line" src="/assets/mirrormedia/icon/line_white.png" alt="Line"></a>
        <a :href="socialLink.WEIBO" target="_blank" id="footer-weibo"><img class="weibo" src="/assets/mirrormedia/icon/weibo_white.png" alt="微博"></a>
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
    sectionName: ''
  },
  data () {
    return {
      socialLink: SOCIAL_LINK
    }
  },
  computed: {
    menuItem () {
      const menuItem = {}
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
      return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { name: this.sectionName }), [ 'image' ], null)
    }
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
  }
}
</script>
<style lang="stylus" scoped>

.footer-foodtravel
  display flex
  flex-direction column
  justify-content space-between
  align-items stretch
  padding 40px 5%
  margin-top 50px
  background-color #4d4d4d

  a
    display block

  &__logo
    display flex
    justify-content center
    align-items center
    margin-bottom 40px
    width 60%
    a
      img
        width 100%

  &__menu
    display flex
    flex-wrap wrap
    flex-direction column
    justify-content flex-start
    width 100%
    height 200px
    margin-bottom 35px
    > a
      width 28%
      margin 15px 0
      font-size 18px
      font-weight 300
      color #fff
      text-align left

  &__vertDivider
    display none
    width 1px
    background-color #fff

  &--horizDivider
    display block
    width 100%
    height 1px
    margin-bottom 25px
    background-color #fff
  &__link
    display flex
    justify-content flex-start
    align-items flex-start
    flex-direction column
    &--subscribe
      margin-bottom 35px
      color #fff
      font-size 18px
      a
        display inline-block
        color #fff
        font-size 18px
    &--socialMedia
      display flex
      justify-content flex-start
      width 100%

      > a
        height 40px
      a + a
        margin-left 10px

      .facebook, .line, .weibo
        height 22px
      .line, .weibo  
        margin-left 10px
      
@media (min-width 600px)
  .footer-foodtravel
    &__menu
      margin-bottom 0
      flex-direction row
      justify-content flex-start
      > a
        width 25%
        font-size 15px
        text-align left
    &__link
      flex-direction row
      justify-content center
      align-items center
      &--subscribe
        margin-bottom 0
        width 300px
      &--socialMedia
        align-items center
        > a
          height 20px
        a + a
          margin-left 30px

@media (min-width 1200px)
  .footer-foodtravel
    flex-direction row
    align-items stretch
    padding 25px 8.3%
    &__logo
      width 20%
      margin-bottom 0
      a
        img
          width 100%
    &__menu
      width 445px
      margin-bottom 0
      flex-direction row
      justify-content flex-start
      > a
        width 25%
        font-size 20px
        text-align left
    &__vertDivider
      display block
    &--horizDivider
      display none
    &__link
      width 180px
      flex-direction column
      justify-content center
      align-items center
      &--subscribe
        margin-bottom 25px
        width initial
      &--socialMedia
        justify-content space-between
        .facebook, .line, .weibo
          height 22px

</style>
