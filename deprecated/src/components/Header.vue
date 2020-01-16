<template>
  <header id="header" class="header">

    <section class="headerContainer">
      <div id="menubar" class="headerContainer__menu" @click="$_header_openSideBar"></div>
      <div class="headerContainer__logo">
        <router-link id="header-logo" class="headerContainer__logo--orig" :to="'/'"><img src="/assets/mirrormedia/logo.svg" alt="鏡週刊 Mirror Media"></router-link>
        <a v-show="logoEventImg && !showDfpHeaderLogo" class="headerContainer__logo--event" :href="logoEventHref" target="_blank"><img :src="logoEventImg"></a>
        <vue-dfp :is="props.vueDfp" v-if="props" ref="logoDfp" class="headerContainer__logo--dfp"  pos="LOGO" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" :config="props.config"/>
      </div>
      <div class="headerContainer__search--mobile" @click="$_header_openSearchBar"><img src="/assets/mirrormedia/icon/search.svg" alt="開啟搜尋列"></div>
      <div class="headerContainer__search--desktop">
        <input type="search" v-model="searchVal" @input="$_header_searchValueChange" @keyup.enter="$_header_searchDesktop(searchVal)" placeholder="">
        <button @click="$_header_searchDesktop(searchVal)">
          <img class="" src="/assets/mirrormedia/icon/search.svg" alt="搜尋"/>
        </button>
        <div class="headerContainer__more" @click.prevent="$_header_openMoreService">
          <img src="/assets/mirrormedia/icon/more_grey@2x.png" alt="更多">
          <div ref="moreServiceList">
            <a class="headerContainer__more--item" :href="socialLink.SUBSCRIBE" target="_blank">訂閱鏡週刊</a>
            <a class="headerContainer__more--item" :href="socialLink.MAGAZINE" target="_blank">訂閱電子雜誌</a>
            <a class="headerContainer__more--item" :href="socialLink.AUTH" target="_blank">內容授權</a>
            <a class="headerContainer__more--item" :href="socialLink.AD" target="_blank">廣告合作</a>
            <a class="headerContainer__more--item" href="/category/campaign" target="_blank">活動專區</a>
            <a class="headerContainer__more--item" :href="socialLink.DOWNLOADAPP" target="_blank">下載APP</a>
          </div>
        </div>
      </div>
    </section>

    <nav class="header-menu--section">
      <div class="header-menu">
        <template v-for="item in sections">
          <div v-if="item.categories.length !== 0" :key="`menu-${item.name}`" class="header-menu__item dropdown" :class="item.name" :style="{ width: `calc( 100% / ${headerAmount + 1} )`, borderTopColor: $_header_getColor(item) }">
            <router-link :id="`header-${item.id}-menu`" :to="`/section/${item.name}`" v-text="item.title"></router-link>
            <div class="dropdown-content" :class="item.name">
              <router-link :to="`/category/${c.name}`" :id="`header-${c.id}-menu`" v-for="(c, i) in item.categories" v-text="c.title" :key="`${item.id}-menu-${i}`" />
            </div>
          </div>
          <router-link v-else :key="`menu-${item.name}`" :to="`/section/${item.name}`" class="header-menu__item" :class="item.name" v-text="item.title" :style="{ width: `calc( 100% / ${headerAmount + 1} )`, borderTopColor: $_header_getColor(item) }"></router-link>
        </template>
        <div class="header-menu__item dropdown external" :style="{ width: `calc( 100% / ${headerAmount + 1} )` }">
          <a>健康醫療</a>
          <div class="dropdown-content external">
            <router-link v-for="p in partners" :id="`header-${p.id}-menu`" :key="`${p.id}-menu`" :to="`/externals/${p.name}`" v-text="getValue(p, [ 'display' ])"></router-link>
          </div>
        </div>
      </div>
    </nav>

    <nav class="header-menu--topic">
      <div>
        <div class="header-menu">
          <router-link :to="`/topic/${getValue(item, [ 'id' ])}`" :id="`header-${item.id}-menu`" v-for="(item, i) in topics" v-text="item.name" :key="`${item.id}-menu`" />
          <router-link to="/section/topic">更多</router-link>
        </div>
        <div class="header-menu-wrapper">
          <a href="https://www.mirrorfiction.com/" id="header-mirrorfiction-menu" class="header-menu__item mirrorfiction" target="_blank" :style="{ width: `calc( 100% / ${headerAmount} )` }">
            <img src="/assets/mirrormedia/icon/mirrorfiction.png" alt="鏡文學"/>
          </a>
          <a href="https://www.readr.tw/" id="header-readr-menu" class="header-menu__item readr" target="_blank" :style="{ width: `calc( 100% / ${headerAmount} )` }">
            <img src="/assets/mirrormedia/icon/readrlogo-gary.png" :alt="$t('HEADER.READR')"/>
          </a>
        </div>
      </div>
    </nav>

    <nav class="header-sidebar" :class="{ open: openSide }">
      <div class="header-sidebar__close">
        <img @click="$_header_closeSideBar" src="/assets/mirrormedia/icon/close_white@2x.png" alt="關閉側邊欄" >
      </div>
      <div class="header-sidebar__topic">
        <a :href="`/topic/${getValue(item, [ 'id' ])}`" :id="`header-${item.id}-sidebar`" v-for="(item, i) in topics" v-text="item.name" :key="`${item.id}-sidebar-${i}`"></a>
        <a href="/section/topic">更多</a>
      </div>
      <div class="header-sidebar__sections">
        <div class="header-sidebar__section" v-for="(item, i) in sections" :style="{ borderLeftColor: $_header_getColor(item) }" :key="`${item.id}-sidebar-${i}`">
          <a :href="`/section/${item.name}`" v-text="item.title"></a>
          <div class="header-sidebar__categories" v-if="item.categories.length !== 0">
            <a :href="`/category/${c.name}`" :id="`header-${c.id}-sidebar`" v-for="(c, i) in item.categories" v-text="c.title" :key="`${item.id}-sidebar-${i}`"></a>
          </div>
        </div>
        <div class="header-sidebar__section external">
          <a>健康醫療</a>
          <div class="header-sidebar__categories">
            <a v-for="p in partners" :id="`header-${p.id}-sidebar`" :key="`${p.id}-sidebar`" :href="`/externals/${p.name}`" v-text="getValue(p, [ 'display' ])"></a>
          </div>
        </div>
        <div class="header-sidebar__section mirrorfiction">
          <a href="https://www.mirrorfiction.com/" id="header-mirrorfiction-sidebar" target="_blank">鏡文學</a>
        </div>
        <div class="header-sidebar__section readr">
          <a href="https://www.readr.tw/" id="header-readr-sidebar" target="_blank" v-text="$t('HEADER.READR')"></a>
        </div>
      </div>
      <div class="header-sidebar__other">
        <a :href="socialLink.SUBSCRIBE" target="_blank">訂閱鏡週刊</a>
        <a :href="socialLink.MAGAZINE" target="_blank">訂閱電子雜誌</a>
        <a :href="socialLink.AUTH" target="_blank">內容授權</a>
        <a :href="socialLink.AD" target="_blank">廣告合作</a>
        <a href="/category/campaign" target="_blank">活動專區</a>
        <a :href="socialLink.DOWNLOADAPP" target="_blank">下載APP</a>
      </div>
      <div class="header-sidebar__socialMedia">
        <a id="footer-line-sidebar" :href="socialLink.LINE" target="_blank"><img class="sprite sprite-line" src="/assets/mirrormedia/transperent.png" alt="Line"></a>
        <a id="footer-weibo-sidebar" :href="socialLink.WEIBO" target="_blank"><img class="sprite sprite-weibo" src="/assets/mirrormedia/transperent.png" alt="微博"></a>
        <a id="footer-fb-sidebar" :href="socialLink.FACEBOOK" target="_blank"><img class="sprite sprite-facebook" src="/assets/mirrormedia/transperent.png" alt="Facebook"></a>
        <a id="footer-ig-sidebar" :href="socialLink.INSTAGRAM" target="_blank"><img class="sprite sprite-instagram" src="/assets/mirrormedia/transperent.png" alt="Instagram"></a>
        <a id="footer-feed-sidebar" :href="socialLink.FEED" target="_blank"><img class="sprite sprite-rss" src="/assets/mirrormedia/transperent.png" alt="RSS"></a>
        <a id="footer-mail-sidebar" :href="socialLink.EMAIL" target="_blank"><img class="sprite sprite-mail" src="/assets/mirrormedia/transperent.png" alt="Email"></a>
      </div>
    </nav>

    <section class="header-searchbar mobile-only" :class="{ open: openSearch }">
      <form action="." v-on:submit.prevent="$_header_searchMobile(searchVal)" >
        <input type="search" v-model="searchVal" @input="$_header_searchValueChange" @focusout="$_header_searchMobile(searchVal)" placeholder="搜尋">
      </form>
      <a @click="$_header_closeSearchBar"><img src="/assets/mirrormedia/icon/close.png" alt="關閉搜尋列"></a>
    </section>
    <section class="header-scrolled mobile-only" v-show="isScrolled">
      <a @click="$_header_openSideBar"><img src="/assets/mirrormedia/icon/hamburger@2x.png" alt="開啟側邊欄"></a>
      <div>
        <a href="/"><img src="/assets/mirrormedia/icon/logo@2x.png" alt="鏡週刊 Mirror Media"></a>
        <a @click="$_header_openSearchBar"><img src="/assets/mirrormedia/icon/search.svg" alt="開啟搜尋列"></a>
      </div>
    </section>
  </header>
</template>
<script>

import { SECTION_MAP, SOCIAL_LINK } from '../constants/index'
import { currentYPosition } from 'kc-scroll'
import { getValue } from '../util/comm'
import _ from 'lodash'

export default {
  name: 'AppHeader',
  props: {
    commonData: {
      type: Object,
      required: true
    },
    eventLogo: {
      type: Object
    },
    props: {
      type: Object
    },
    showDfpHeaderLogo: {
      type: Boolean,
      default: false
    },
    viewport: {
      type: Number
    }
  },
  data () {
    return {
      isChanged: false,
      isScrolled: false,
      openSearch: false,
      openSide: false,
      searchVal: _.get(this.$route, [ 'params', 'keyword' ])
    }
  },
  computed: {
    headerAmount () {
      return _.get(this.sections, [ 'length' ])
    },
    logoEventImg () {
      return _.get(this.eventLogo, [ 'image', 'image', 'resizedTargets', 'desktop', 'url' ], null)
    },
    logoEventHref () {
      return _.get(this.eventLogo, [ 'link' ], '/')
    },
    partners () {
      return _.filter(_.get(this.commonData, [ 'partners', 'items' ]), 'public')
    },
    sections () {
      return _.filter(_.get(this.commonData, [ 'sections', 'items' ]), 'isFeatured')
    },
    socialLink () {
      return SOCIAL_LINK
    },
    topics () {
      return _.take(_.filter(_.get(this.commonData, [ 'topics', 'items' ]), 'isFeatured'), 7)
    },
    viewportTarget () {
      if (this.viewport < 600) {
        return 'mobile'
      } else if (this.viewport > 600 && this.viewport < 1200) {
        return 'tablet'
      } else {
        return 'desktop'
      }
    }
  },
  mounted () {
    this.$_header_handleScroll()
  },
  methods: {
    $_header_closeMoreServiceList (e) {
      if (e.target.className === 'headerContainer__more--item') {
        window.open(e.target.href)
      }
      e.stopPropagation()
      e.preventDefault()
      this.$refs.moreServiceList.classList.remove('active')
      this.$_header_enableScroll()
      window.removeEventListener('click', this.$_header_closeMoreServiceList, true)
    },
    $_header_closeSearchBar () {
      this.openSearch = false
    },
    $_header_closeSideBar () {
      this.openSide = false
    },
    $_header_disableScroll () {
      if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', this.$_header_preventDefault, false)
      }
      window.onwheel = this.$_header_preventDefault
      window.onmousewheel = document.onmousewheel = this.$_header_preventDefault
      window.ontouchmove = this.$_header_preventDefault
      document.onkeydown = this.$_header_preventDefaultForScrollKeys
    },
    $_header_enableScroll () {
      if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', this.$_header_preventDefault, false)
      }
      window.onmousewheel = document.onmousewheel = null
      window.onwheel = null
      window.ontouchmove = null
      document.onkeydown = null
    },
    $_header_getColor (item) {
      return _.get(SECTION_MAP, [ _.get(item, [ 'id' ]), 'bgcolor' ])
    },
    $_header_handleScroll () {
      window.addEventListener('scroll', () => {
        currentYPosition() > 69 ? this.isScrolled = true : this.isScrolled = false
      })
    },
    $_header_openMoreService () {
      this.$_header_disableScroll()
      this.$refs.moreServiceList.classList.add('active')
      window.addEventListener('click', this.$_header_closeMoreServiceList, true)
    },
    $_header_openSearchBar () {
      this.openSearch = true
    },
    $_header_openSideBar () {
      this.openSide = true
    },
    $_header_preventDefault (e) {
      e = e || window.event
      if (e.preventDefault) {
        e.preventDefault()
      }
      e.returnValue = false
    },
    $_header_preventDefaultForScrollKeys (e) {
      if (e.keyCode === 40) {
        e.preventDefault(e)
        return false
      }
    },
    $_header_searchDesktop () {
      if (this.isChanged) {
        this.$router.push('/search/' + this.searchVal)
        this.openSearch = false
      } else {
        this.openSearch = false
      }
    },
    $_header_searchMobile () {
      if (this.isChanged) {
        document.activeElement.blur()
        this.$router.push('/search/' + this.searchVal)
        this.openSearch = false
      } else {
        document.activeElement.blur()
        this.openSearch = false
      }
    },
    $_header_searchValueChange () {
      const currentKeyword = _.get(this.$route, [ 'params', 'keyword' ])
      if (this.searchVal !== currentKeyword && this.searchVal !== '') {
        this.isChanged = true
      } else {
        this.isChanged = false
      }
    },
    getValue
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
$color-watch = #003153
$color-external = #ee5a24
$color-mirrorfiction = #968375
$color-readr = #968375

.header
  width 100%
  background-color #f5f5f5
  a
    display block
    font-size 0
    vertical-align middle
  img
    image-rendering optimize-contrast
  
  &-icon
    width 32px
  &-menu
    &--section
      display none
    &--topic
      display none
    &__item
      border-top 3px solid #000
      &.external
        border-color $color-external
      &.mirrorfiction
        padding 9.5px 0
        font-size 0
        line-height 1
        border none
        img
          width auto
          height 30px
      &.readr
        padding 9.5px 0
        font-size 0
        line-height 1
        border none
        img
          width auto
          height 30px
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
    form
      width 100%
      margin-right 15px
      font-size 1.5rem
    input
      width 100%
      background-color transparent
      border none
    > a
      width 22px
    &.open
      transform translate3d(0,0,0)
      transition .5s ease
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

.headerContainer
  display flex
  justify-content space-between
  align-items center
  width 90%
  margin 0 auto
  padding 20px 0
  > div
    cursor pointer
  &__menu
    display inline-block
    width 34px
    height 34px
    background-image url('/assets/mirrormedia/icon/hamburger@2x.png')
    background-repeat no-repeat
    background-size 24px 24px
    background-position center center
      
  &__logo
    display inline-flex
    align-items center
    max-width 195px
    overflow hidden
    > a
      display inline-block
    &--orig
      > img
        max-width 95px
        width auto
        height 50px
    &--event
      margin-left 5px
      > img
        max-width 95px
        max-height 50px
    &--dfp
      max-width 95px
      margin-left 5px
  &__search
    &--mobile
      display inline-block
      padding 2px
      font-size 0
      > img
        width 30px
        height 30px
    &--desktop
      display none

.header-menu
  > a:hover, > div:hover
    &.news
      background-color $color-news
    &.entertainment
      background-color $color-entertainment
    &.businessmoney
      background-color $color-businessmoney
    &.people
      background-color $color-people
    &.videohub
      background-color $color-videohub
    &.international
      background-color $color-international
    &.foodtravel
      background-color $color-foodtravel
    &.mafalda
      background-color $color-mafalda
    &.culture
      background-color $color-culture
    &.watch
      background-color $color-watch
    &.external
      background-color $color-external
    &.mirrorfiction
      background-color $color-mirrorfiction
    &.readr
      background-color $color-readr
  &-wrapper
    display flex

  &__item
    &.dropdown
      position relative

.dropdown
  text-align center
  > a
    padding 0
    font-size 1rem
    line-height 43px
  &:hover
    .dropdown-content
      display block !important

.dropdown-content
  display none
  position absolute
  z-index 10
  width 110px
  color #fff
  background-color #333
  box-shadow 0px 8px 16px 0px rgba(0,0,0,0.2)
  > a
    font-size 1rem
    padding 14.5px 15px
  &.news
    a:hover
      color $color-news
  &.entertainment
    a:hover
      color $color-entertainment
  &.businessmoney
    a:hover
      color $color-businessmoney
  &.people
    a:hover
      color $color-people
  &.videohub
    a:hover
      color $color-videohub
  &.international
    a:hover
      color $color-international
  &.foodtravel
    a:hover
      color $color-foodtravel
  &.mafalda
    a:hover
      color $color-mafalda
  &.culture
    a:hover
      color $color-culture
  &.watch
    a:hover
      color $color-watch
  &.external
    a:hover
      color $color-external
  &.mirrorfiction
    a:hover
      color $color-mirrorfiction
  &.readr
    a:hover
      color $color-readr

.header-sidebar
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 510
  width 100%
  height 100vh
  padding 5%
  background-color #333
  transform translate3d(-100%,0,0)
  transition .5s ease
  overflow-y auto
  &.open
    transform translate3d(0,0,0)
  
  &__close
    width 100%
    text-align right
    img
      width 20px
      height 20px
  &__topic
    display flex
    flex-wrap wrap
    margin .5em 0
    a
      position relative
      display inline
      margin .5em 0
      padding 0 .5em 
      color #fff
      font-size 1rem
      border-right 1px solid rgba(255,255,255,.8)
    a:last-child
      border-right none
  &__section
    width calc(100% - .5em)
    margin-left .5em
    padding 1em 0 1em 1em
    border-left 3px solid #000
    border-bottom 1px solid #7e7e7e
    a
      display inline
      color #fff
      font-size 1.2rem
      font-weight 300
    &.external
      border-left-color $color-external
    &.mirrorfiction
      border-bottom none
      border-left-color $color-mirrorfiction
    
  &__categories
    display flex
    flex-wrap wrap
    margin-top .5em
    a
      margin .2em .8em .2em 0
      color #969696
      font-size 1.1rem
  &__other
    display flex
    justify-content space-between
    flex-wrap wrap
    padding 0 .5em
    margin 1em 0
    a
      width 47%
      margin .5em 0
      padding .2em 0
      color #969696
      font-size 1rem
      font-weight 300
      text-align center
      border 1px solid #969696
    
  &__socialMedia
    display flex
    justify-content space-between
    padding 0 .5em

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

@media (min-width: 600px)
  .headerContainer
    width calc(100% - 4em)

@media (min-width: 1200px)
  .header
    &-menu
      display flex
      flex-wrap wrap
      justify-content center
      width 1024px
      margin 0 auto
      > a
        text-align center
        color #fff
        line-height 43px
        font-size 1rem
      &--section
        display flex
        background-color #064f77
        a
          color #fff
      &--topic
        display flex
        justify-content space-between
        position relative
        background-color #fff
        box-shadow 0 0 5px 0 #ccc
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
            &:hover
              background-color #000
              color #fff
            &:last-of-type
              border none
    &-sidebar
      display none
  .headerContainer
    width 1024px
    padding 10px 0
    &__menu
      display none
    &__logo
      max-width none
      &--orig
        > img
          max-width none
      &--event
        > img
          max-width none
          max-height 50px
    &__search
      &--mobile
        display none
      &--desktop
        display flex
        align-items center
        input
          float left
          width 200px
          height 35px
          margin 0
          padding 0 10px
          text-align right
          border 1px solid rgb(238, 238, 238)
          border-radius 2px
          border-right none
        button
          height 35px
          padding 0
          margin 0
          background-color #fff
          border 1px solid rgb(238, 238, 238)
          border-radius 2px
          border-left none
    &__more
      display flex
      justify-content center
      align-items center
      position relative
      width 20px
      height 35px
      margin-left 10px
      cursor pointer
      img
        height 20px
      > div
        display none
        flex-direction column
        position absolute
        top 0
        left 0
        z-index 10
        width 130px
        background-color #fff
        border 1px solid #eee
        &.active
          display flex
        a
          padding .5em 1em
          font-size 1rem
          text-align center

</style>
