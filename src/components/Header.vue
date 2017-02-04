<template>
  <header class="header">
    <section class="header-logoSearch">
      <a href="" class="mobile-only"><img src="~public/icon/hamburger@2x.png" class="header-icon"></a>
      <a href="/"><img src="~public/logo.svg" class="header-logoSearch--logo"></a>
      <div class="header-logoSearch__search">
        <input type="text" placeholder="">
        <button>
          <img class="header-logoSearch__search--icon" src="~public/icon/search.svg" />
        </button>
      </div>
    </section>
    <nav class="header-menu--section">
      <div class="header-menu">
        <div v-for="item in headerItem.section" class="dropdown" :class="item.name">
          <a :href="item.href"><span v-text="item.title"></span></a>
          <div class="dropdown-content">
            <a v-for="c in item.categories" v-text="c.title" :href="c.href"></a>
          </div>
        </div>
        <a :href="item.href" v-for="item in headerItem.category" v-text="item.title"></a>
      </div>
    </nav>
    <nav class="header-menu--topic">
      <div class="header-menu">
        <a :href="item.href" v-for="item in headerItem.topic" v-text="item.title"></a>
      </div>
      <a href="">更多 ▾</a>
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

$color-main = #064f77
$color-news = #30bac8
$color-entertainment = #bf3284
$color-foodtravel = #eac151
$color-watch = #c1d16e

.header
  position relative
  top 0
  left 0
  right 0
  background-color #f5f5f5

  a
    display inline-block
    vertical-align middle

  &-logoSearch
    display flex
    justify-content space-between
    width 100%
    height 90px
    padding 24px 18px

    &__search
      position relative
      top 13.5px
      width 250px
      height 35px

      input
        float left
        width 200px
        height 35px
        padding 0 10px
        text-align right
        border 1px solid rgb(238, 238, 238)
        border-radius: 2px
        border-right none

      button
        padding 0
        margin 0
        background-color #fff
        border 1px solid rgb(238, 238, 238)
        border-radius: 2px
        border-left none


      &--icon
        float left
        width 49px
        height 33px

    &--logo
      width 128px

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

    span
      color #fff
      line-height: 43px

    &--section
      background-color $color-main

      a
        color #fff

    &--topic
      position relative
      /*margin-bottom 40px*/
      background-color #fff
      box-shadow:0 0 5px 0 #cccccc

      .header-menu
        > a
          border-bottom 3px solid #000


      > a
        position absolute
        top 0
        right 0

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

.dropdown
  width 90px
  text-align: center

  > a
    padding 0

  &-content
    display none
    position: absolute
    z-index: 1
    width 110px
    color #fff
    background-color: #333
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)


.dropdown:hover .dropdown-content
  display: block

.news-people
  border-top 3px solid $color-news
  a:hover
    color $color-news


.entertainment
  border-top 3px solid $color-entertainment
  a:hover
    color $color-entertainment

.foodtravel
  border-top 3px solid $color-foodtravel
  a:hover
    color $color-foodtravel

.watch
  border-top 3px solid $color-watch
  a:hover
    color $color-watch


@media (min-width 1200px)
  .header
    &-logoSearch
      width 1024px
      margin 0 auto
      padding 14px 0

  nav
    > div
      width 1024px
      margin 0 auto
    a
      min-width 90px
      padding 14.5px 15px
      text-align center
      color rgba(0,0,0,.5)

</style>
