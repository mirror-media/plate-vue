<template>
  <header class="header">
    <div class="header-logoSearch">
      <a href="" class="mobile-only"><img src="~public/icon/hamburger@2x.png" class="header-icon"></a>
      <a href="/"><img src="~public/logo.svg" class="header-logoSearch--logo"></a>
      <div class="header-socialMedia">
        <span class="mobile-hide">訂閱：</span>
        <a :href="socialLink.LINE" class="mobile-hide"><img src="~public/icon/line@2x.png" class="header-icon line"></a>
        <a :href="socialLink.WEIBO" class="mobile-hide"><img src="~public/icon/weibo@2x.png" class="header-icon weibo"></a>
        <a :href="socialLink.FACEBOOK" class="mobile-hide"><img src="~public/icon/facebook@2x.png" class="header-icon facebook"></a>
        <a :href="socialLink.INSTAGRAM" class="mobile-hide"><img src="~public/icon/instagram@2x.png" class="header-icon instagram"></a>
        <a :href="socialLink.SUBSCRIBE" class="mobile-hide"><img src="~public/icon/book@2x.png" class="header-icon book"></a>
        <div class="line-vertical"></div>
        <a ><img src="~public/icon/search@2x.png" class="header-icon"></a>
      </div>
    </div>
    <nav class="mobile-hide">
      <div class="header-menu">
        <a :href="item.href" v-for="item in headerItem.section" v-html="item.title"></a>
        <a :href="item.href" v-for="item in headerItem.category" v-html="item.title"></a>
        <a :href="item.href" v-for="item in headerItem.topic" v-html="item.title"></a>    
      </div>
    </nav>
  </header>
</template>
<script>
import { SOCIAL_LINK } from '../constants/index'
import _ from 'lodash'
export default {
  name: 'app-header',
  props: {
    commonData: {},
  },
  computed: {
    headerItem() {
      let headerItem = {}
      headerItem.section = []
      headerItem.category = []
      headerItem.topic = []
      _.forEach(this.commonData.sectionList.endpoints.sections.items, (s) => {
        s.href = '/section/' + s.name
        s.isFeatured ? headerItem.section.push(s) : ''
      })
      _.forEach(this.commonData.sectionList.endpoints.sections.items, (s) => {
        s.href = '/section/' + s.name
        _.forEach(s.categories, (c) => {
          c.href = '/category/' + c.name
          c.isFeatured ? headerItem.category.push(c) : ''
        })
      })
      _.forEach(this.commonData.topic.items, (t) => {
        t.href = t.links.self.href
        t.title = t.name
        t.isFeatured ? headerItem.topic.push(t) : ''
      })
      return headerItem
    },
    socialLink() {
      return SOCIAL_LINK
    }
  }
}
</script>
<style lang="stylus" scoped>
.header
  position relative
  top 0
  left 0
  right 0

  a
    display inline-block
    vertical-align middle

  &-logoSearch
    display flex
    justify-content space-between
    width 100%
    height 110px
    padding 24px 18px

    &--logo
      width 128px

  &-socialMedia
    span
      margin-right 15px
      font-size 15px
      letter-spacing .7px
      vertical-align middle
      color rgba(0,0,0,.3)
    a
      height 62px
      margin-right 15px

  &-icon
    width 24px
    padding 19px 0

    &.line
      width 45px
      padding 21px 0
    &.weibo
      width 23px
      padding 21px 0
    &.facebook, &.instagram
      width 20px
      padding 21px 0
    &.book
      width 18px
      padding 17.5px 0

  &-menu
    display flex
    flex-wrap wrap
    justify-content center

.logo
  width 24px
  margin-right 10px
  display inline-block
  vertical-align middle

.line-vertical
  display inline-block
  width 2px
  height 14px
  margin-left 20px
  margin-right 30px
  vertical-align middle
  border 1px solid #979797

@media (min-width 1200px)
  .header
    &-logoSearch
      width 1024px
      margin 0 auto
      padding 24px 0

  nav
    margin-bottom 25px
    border 1px solid #000
    border-left none
    border-right none
    div
      width 1024px
      margin 0 auto
    a
      min-width 80px
      padding 17px 15px
      text-align center 
      color rgba(0,0,0,.5)

</style>
