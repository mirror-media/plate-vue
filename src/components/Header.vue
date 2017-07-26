<template>
  <header id="header" class="header">

    <section class="header-logoSearch">
      <a @click="openSideBar()" id="menubar" class="mobile-only"><img src="/public/icon/hamburger@2x.png" alt="選單" class="header-icon"></a>
      <div class="header-logoSearch__logoAd">
        <router-link :to="'/'" id="header-logo"><img :src="logoImage" class="header-logoSearch__logoAd--logo" alt="鏡週刊 Mirror Media"></router-link>
        <vue-dfp class="header-logoSearch__logoAd--ad" :is="props.vueDfp" pos="LOGO" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" :config="props.config"/>
      </div>
      <div class="header-logoSearch__search desktop-only">
        <input type="search" v-model="searchVal" @keyup.enter="search(searchVal)" @change="hasChanged()" placeholder="">
        <button @click="search(searchVal)">
          <img class="header-logoSearch__search--icon" src="/public/icon/search.svg" alt="搜尋"/>
        </button>
      </div>
      <a @click="openSearchBar()" class="header-logoSearch__search mobile-only">
        <img src="/public/icon/search.svg" alt="開啟搜尋列">
      </a>
    </section>

    <nav class="header-menu--section">
      <div class="header-menu">
        <template v-for="item in sections">
          <div v-if="item.categories.length !== 0" class="header-menu__item dropdown" :class="item.name" :style="{ width: `calc( 100% / ${headerAmount + 1} )`, borderTopColor: getColor(item) }">
            <router-link :id="`header-${item.id}-menu`" :to="getHref(item)" v-text="item.title"></router-link>
            <div class="dropdown-content" :class="item.name">
              <router-link :to="`/category/${c.name}`" :id="`header-${c.id}-menu`" v-for="(c, i) in item.categories" v-text="c.title" :key="item.id" />
            </div>
          </div>
          <router-link v-if="item.categories.length === 0" :to="getHref(item)" class="header-menu__item" :class="item.name" v-text="item.title" :style="{ width: `calc( 100% / ${headerAmount + 1} )`, borderTopColor: getColor(item) }"></router-link>
        </template>
        <a href="https://www.mirrorfiction.com/" id="header-mirrorfiction-menu" class="header-menu__item mirrorfiction" target="_blank" :style="{ width: `calc( 100% / ${headerAmount + 1} )` }">鏡文學</a>
      </div>
    </nav>

    <nav class="header-menu--topic">
      <div>
        <div class="header-menu">
          <router-link :to="getValue(item, [ 'href' ])" :id="`header-${item.id}-menu`" v-for="(item, i) in topics" v-text="item.name" :key="item.id" />
        </div>
        <router-link to="/section/topic">更多</router-link>
      </div>
    </nav>

    <nav class="header-sidebar" :class="{ open: openSide }">
      <div class="header-sidebar__close">
        <img @click="closeSideBar()" src="/public/icon/close_white@2x.png" alt="關閉側邊欄" >
      </div>
      <div class="header-sidebar__topic">
        <router-link :to="getValue(item, [ 'href' ])" :id="`header-${item.id}-sidebar`" v-for="(item, i) in topics" v-text="item.name" :key="item.id" />
      </div>
      <div class="header-sidebar__sections">
        <div class="header-sidebar__section" v-for="(item, index) in sections" :style="[ index === (sections.length - 1) ? { borderBottom : 'none' } : {}, { borderLeftColor: getColor(item) } ]">
          <router-link :to="getHref(item)" v-text="item.title"></router-link>
          <div class="header-sidebar__categories" v-if="item.categories.length !== 0">
            <router-link :to="`/category/${c.name}`" :id="`header-${c.id}-sidebar`" v-for="(c, i) in item.categories" v-text="c.title" :key="item.id" />
          </div>
        </div>
      </div>
      <div class="header-sidebar__other">
        <a :href="socialLink.SUBSCRIBE" target="_blank">訂閱鏡週刊</a>
        <a :href="socialLink.AD" target="_blank">廣告合作</a>
        <a href="/category/campaign" target="_blank">活動專區</a>
        <a :href="socialLink.DOWNLOADAPP" target="_blank">下載APP</a>
      </div>
      <div class="header-sidebar__socialMedia">
        <a id="footer-line-sidebar" :href="socialLink.LINE" target="_blank"><img class="sprite sprite-line" src="/public/transperent.png" alt="Line"></a>
        <a id="footer-weibo-sidebar" :href="socialLink.WEIBO" target="_blank"><img class="sprite sprite-weibo" src="/public/transperent.png" alt="微博"></a>
        <a id="footer-fb-sidebar" :href="socialLink.FACEBOOK" target="_blank"><img class="sprite sprite-facebook" src="/public/transperent.png" alt="Facebook"></a>
        <a id="footer-ig-sidebar" :href="socialLink.INSTAGRAM" target="_blank"><img class="sprite sprite-instagram" src="/public/transperent.png" alt="Instagram"></a>
        <a id="footer-feed-sidebar" :href="socialLink.FEED" target="_blank"><img class="sprite sprite-rss" src="/public/transperent.png" alt="RSS"></a>
        <a id="footer-mail-sidebar" :href="socialLink.EMAIL" target="_blank"><img class="sprite sprite-mail" src="/public/transperent.png" alt="Email"></a>
      </div>
    </nav>

    <section class="header-searchbar mobile-only" :class="{ open: openSearch }">
      <form action="." v-on:submit.prevent="search(searchVal)">
        <input type="search" v-model="searchVal"  @change="hasChanged()" placeholder="搜尋">
      </form>
      <a @click="closeSearchBar()"><img src="/public/icon/close.png" alt="關閉搜尋列"></a>
    </section>
    <section class="header-scrolled mobile-only" v-show="isScrolled">
      <a @click="openSideBar()"><img src="/public/icon/hamburger@2x.png" alt="開啟側邊欄"></a>
      <div>
        <a href="/"><img src="/public/icon/logo@2x.png" alt="鏡週刊 Mirror Media"></a>
        <a @click="openSearchBar()"><img src="/public/icon/search.svg" alt="開啟搜尋列"></a>
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
  name: 'app-header',
  props: [ 'commonData', 'eventLogo', 'viewport', 'props' ],
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
    logoImage () {
      const eventLogo = _.get(this.eventLogo, [ 'image', 'image', 'resizedTargets', 'desktop', 'url' ], null)
      return eventLogo || '/public/logo.svg'
    },
    sections () {
      return _.filter(_.get(this.commonData, [ 'sections', 'items' ]), function (o) {
        return o.name !== 'hotvideo'
      })
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
  methods: {
    closeSearchBar () {
      this.openSearch = false
    },
    closeSideBar () {
      this.openSide = false
    },
    getColor (item) {
      return _.get(SECTION_MAP, [ _.get(item, [ 'id' ]), 'bgcolor' ])
    },
    getHref (item) {
      return `/section/${_.get(item, [ 'name' ], '')}`
    },
    getValue,
    handleScroll () {
      window.addEventListener('scroll', () => {
        currentYPosition() > 69 ? this.isScrolled = true : this.isScrolled = false
      })
    },
    hasChanged () {
      this.isChanged = true
    },
    openSearchBar () {
      this.openSearch = true
    },
    openSideBar () {
      this.openSide = true
    },
    search (searchVal = '') {
      if (this.isChanged && searchVal !== '') {
        this.$router.push('/search/' + this.searchVal)
        this.openSearch = false
      }
    }
  },
  mounted () {
    this.handleScroll()
  }
}

</script>

<style lang="stylus" scoped>

$color-news = #30bac8
$color-entertainment = #bf3284
$color-businessmoney = #009045
$color-people = #efa256
$color-international = #911f27
$color-foodtravel = #eac151
$color-mafalda = #662d8e
$color-culture = #009245
$color-watch = #c1d16e
$color-mirrorfiction = #968375


.header-menu__item
  border-top 3px solid #000
.header-menu__item.mirrorfiction
  border-color #968375

.header-menu
  > a:hover, > div:hover
    &.news-people
      background-color $color-news
    &.entertainment
      background-color $color-entertainment
    &.businessmoney
      background-color $color-businessmoney
    &.people
      background-color $color-people
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
    &.mirrorfiction
      background-color $color-mirrorfiction
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
  &.news-people
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
  &.mirrorfiction
    a:hover
      color $color-mirrorfiction

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

.header-logoSearch__logoAd
  display flex
  align-items flex-end
  &--ad
    display flex
    align-items flex-end

.sprite
  background-image url('/public/icon/socialMedia_white@2x.png')
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
  .header-sidebar
    display flex
    flex-direction column
    justify-content space-between

@media (min-width: 1200px)
  .header-sidebar
    display none
    
@media (max-width: 350px)
  .header-logoSearch
    padding 10px 8px
</style>
