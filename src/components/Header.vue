<template>
  <header id="header" class="header">
    <section class="header-logoSearch">
      <a @click="openSideBar()" class="mobile-only"><img src="~public/icon/hamburger@2x.png" class="header-icon"></a>
      <router-link :to="'/'"><img src="~public/logo.svg" class="header-logoSearch--logo"></router-link>
      <div class="header-logoSearch__search desktop-only">
        <input type="text" v-model="searchVal" @keyup.enter="search(searchVal)" placeholder="">
        <button @click="search(searchVal)">
          <img class="header-logoSearch__search--icon" src="~public/icon/search.svg" />
        </button>
      </div>
      <a @click="openSearchBar()" class="header-logoSearch__search mobile-only">
        <img src="~public/icon/search.svg">
      </a>
    </section>
    <nav class="header-menu--section">
      <div class="header-menu">
        <div v-for="item in headerItem.section" class="dropdown" :class="item.name" :style="{ width: 'calc( 100% /' + headerAmount + ')'}">
          <router-link :to="item.href" v-text="item.title"/>
          <div class="dropdown-content">
            <router-link :to="c.href" v-for="c in item.categories" v-text="c.title"/>
          </div>
        </div>
        <router-link :to="item.href" v-for="item in headerItem.category" v-text="item.title" :class="item.section" :style="{ width: 'calc( 100% /' + headerAmount + ')'}" />
      </div>
    </nav>
    <nav class="header-menu--topic">
      <div>
        <div class="header-menu">
          <router-link :to="item.href" v-for="item in headerItem.topic" v-text="item.title"/>
        </div>
        <a href="">更多</a>
      </div>
    </nav>
    <nav class="header-sidebar mobile-only" :class="{ open: openSide }">
      <div class="header-sidebar__close">
        <a @click="closeSideBar()"><img src="~public/icon/close_white.png"></a>
      </div>
      <div class="header-sidebar__menu">
        <a :href="item.href" v-for="item in headerItem.topic" v-text="item.title"></a>
        <a :href="item.href" v-for="item in headerItem.section" v-text="item.title"></a>
        <a :href="item.href" v-for="item in headerItem.category" v-text="item.title"></a>
        <a :href="socialLink.SUBSCRIBE" target="_bank" class="header-sidebar__menu--subscribe">訂閱鏡週刊</a>
        <a :href="socialLink.DOWNLOADAPP" target="_bank" class="header-sidebar__menu--download">下載APP</a>
      </div>
    </nav>
    <section class="header-searchbar mobile-only" :class="{ open: openSearch }">
      <input type="text" v-model="searchVal" @keyup.enter="search(searchVal)" placeholder="搜尋">
      <a @click="closeSearchBar()"><img src="~public/icon/close.png"></a>
    </section>
    <section class="header-scrolled mobile-only" v-show="isScrolled">
      <a @click="openSideBar()"><img src="~public/icon/hamburger@2x.png"></a>
      <div>
        <a href="/"><img src="~public/icon/logo@2x.png"></a>
        <a @click="openSearchBar()"><img src="~public/icon/search.svg"></a>
      </div>
    </section>
  </header>
</template>
<script>

import { SOCIAL_LINK } from '../constants/index'
import { currentYPosition } from 'kc-scroll'
import _ from 'lodash'

export default {
  name: 'app-header',
  props: ['commonData'],
  data () {
    return {
      isScrolled: false,
      searchVal: '',
      openSearch: false,
      openSide: false,
    }
  },
  methods: {
    closeSearchBar () {
      this.openSearch = false
    },
    closeSideBar () {
      this.openSide = false
    },
    handleScroll () {
      window.addEventListener('scroll', () => {
        currentYPosition() > 69 ? this.isScrolled = true : this.isScrolled = false
      })
    },
    openSearchBar () {
      this.openSearch = true
    },
    openSideBar () {
      this.openSide = true
    },
    search (searchVal = '') {
      this.$router.push('/search/'+ this.searchVal)
    },
  },
  computed: {
    headerItem () {
      let headerItem = {}
      headerItem.section = []
      headerItem.category = []
      headerItem.topic = []
      _.forEach(_.get(this.commonData, ['sections', 'items']), (s) => {
        s.href = '/section/' + s.name
        s.isFeatured ? headerItem.section.push(s) : ''
        _.forEach(s.categories, (c) => {
          c.href = '/category/' + c.name
          c.section = s.name
          c.isFeatured ? headerItem.category.push(c) : ''
        })
      })
      _.forEach(_.get(this.commonData, ['topics', 'items']), (t) => {
        t.href = '/topic/' + t.id
        t.title = t.name
        t.isFeatured && headerItem.topic.length < 7 ? headerItem.topic.push(t) : ''
      })
      return headerItem
    },
    headerAmount () {
      return this.headerItem.section.length + this.headerItem.category.length
    },
    socialLink () {
      return SOCIAL_LINK
    }
  },
  mounted() {
    this.handleScroll()
  }
}

</script>
<style lang="stylus" scoped>

$color-main = #064f77
$color-news = #30bac8
$color-entertainment = #bf3284
$color-foodtravel = #eac151
$color-watch = #c1d16e
$color-projects = #000
$color-other = #bcbcbc

.header
  width 100%
  background-color #f5f5f5
  a
    display block
    font-size 0
    vertical-align middle
  &-logoSearch
    display flex
    align-items: center
    justify-content space-between
    padding 20px
    &--logo
      width 128px
  &-icon
    width 32px
  &-menu
    &--section
      display none
  &-sidebar
    display flex
    flex-direction column
    position fixed
    top 0
    left 0
    z-index 510
    width 100%
    height 100vh
    padding 20px
    background-color #064f77
    overflow-y auto
    transform translate3d(-100%,0,0)
    transition .5s ease
    &.open
      transform translate3d(0,0,0)
      transition .5s ease
    &__close
      margin-bottom 20px
      > a
        float right
      img
        width 24px
        height 24px
    &__menu
      display flex
      flex-direction column
      align-items center
      > a
        margin-bottom 20px
        color #fff
        font-size 1rem
        font-weight 300
      &--subscribe, &--download
        width 100%
        padding 5px
        text-align center
        border 1px solid #fff
      &--subscribe
        margin-top 20px
  &-searchbar
    display flex
    justify-content space-between
    align-items center
    position fixed
    top 0
    left 0
    z-index 510
    width 100%
    height 69px
    padding 20px
    background-color hsla(0,0%,100%,.9)
    box-shadow 0 3px 2px 0 rgba(0,0,0,.1), 0 2px 0 0 #fff
    transform translate3d(0,-75px,0)
    transition .5s ease
    &.open
      transform translate3d(0,0,0)
      transition .5s ease
    > input
      width 100%
      margin-right 15px
      font-size 1.5rem
      background-color transparent
      border none
    > a
      width 22px
  &-scrolled
    display flex
    justify-content space-between
    align-items center
    position fixed
    top 0
    left 0
    z-index 500
    width 100%
    padding 5px 20px
    background-color #fff
    box-shadow 0 3px 2px 0 rgba(0,0,0,.1), 0 2px 0 0 #fff
    img
      height 32px
    > div
      display flex
      > a
        margin-left 10px

@media (min-width: 1200px)
  .header
    &-logoSearch
      width 1024px
      padding 20px 0
      margin 0 auto
      &__search
        &.desktop-only
          display flex !important
          align-items center
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
    &-menu
      display flex
      flex-wrap wrap
      justify-content center
      width 1024px
      margin 0 auto
      > a
        text-align center
        color #fff
        line-height: 46px
        font-size 1rem
      > a:hover
        &.news-people
          background-color $color-news
        &.entertainment
          background-color $color-entertainment
        &.foodtravel
          background-color $color-foodtravel
        &.watch
          background-color $color-watch
      header-menu
          width 1024px
          margin 0 auto
      &--section
        display flex
        background-color $color-main
        a
          color #fff
      &--topic
        display flex
        justify-content space-between
        position relative
        background-color #fff
        box-shadow:0 0 5px 0 #cccccc
        a
          min-width 90px
          font-size 1rem
          text-align center
          color rgba(0,0,0,.5)
          line-height 46px
        > div
          display flex
          justify-content space-between
          width 1024px
          margin 0 auto
        .header-menu
          width auto
          margin 0
          > a
            padding 0 .5em
            color rgba(0,0,0,.5)
            border-bottom 3px solid #000
          > a:hover
            background-color #000
            color #fff

  .dropdown
    text-align: center
    > a
      padding 0
      font-size 1rem
      line-height 43px
    &-content
      display none
      position: absolute
      z-index: 10
      width 110px
      color #fff
      background-color: #333
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)
      a
        font-size 1rem
        padding 14.5px 15px

  .dropdown:hover .dropdown-content
    display: block
  .dropdown.news-people
    border-top 3px solid $color-news
    > .dropdown-content
      a:hover
        color $color-news

    &:hover
      background-color $color-news


  .dropdown.entertainment
    border-top 3px solid $color-entertainment
    > .dropdown-content
      a:hover
        color $color-entertainment
    &:hover
      background-color $color-entertainment

  .dropdown.foodtravel
    border-top 3px solid $color-foodtravel
    > .dropdown-content
      a:hover
        color $color-foodtravel
    &:hover
      background-color $color-foodtravel

  .dropdown.watch
    border-top 3px solid $color-watch
    > .dropdown-content
      a:hover
        color $color-watch
    &:hover
      background-color $color-watch

</style>
