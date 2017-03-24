<template>
  <header>
    <nav class="headerFull" :style="{opacity: opacity}" v-show="defaultNav">
      <div class="headerFull__menu">
        <a @click="openSideBar()"><img src="/public/icon/hamburger_white.png"></a>
      </div>
      <div class="headerFull__logo">
        <router-link :to=" '/section/' + section "><img :src="getSectionLogoUrl()"></router-link>
      </div>
      <div class="headerFull__link">
        <router-link to="/">
          <img class="headerFull__link--icon desktop-only" src="/public/icon/logo_black@3x.png">
        </router-link>
        <a :href="socialLink.FACEBOOK" target="_blank">
          <img class="headerFull__link--icon desktop-only" src="/public/icon/facebook_white.png">
        </a>
        <a :href="socialLink.LINE" target="_blank">
          <img class="headerFull__link--icon desktop-only" src="/public/icon/line_white.png">
        </a>
        <a :href="socialLink.WEIBO" target="_blank">
          <img class="headerFull__link--icon desktop-only" src="/public/icon/weibo_white.png">
        </a>
        <a @click="openSearchBar()">
          <img class="headerFull__link--icon" src="/public/icon/search_white.png">
        </a>
      </div>
    </nav>
    <nav class="headerFull headerFull--black" :style="{opacity: 1-opacity}" v-show="blackNav">
      <div class="headerFull__menu">
        <a @click="openSideBar()"><img src="/public/icon/hamburger_white.png"></a>
      </div>
      <div class="headerFull__logo">
        <router-link :to=" '/section/' + section "><img :src="getSectionLogoUrl()"></router-link>
      </div>
      <div class="headerFull__link">
        <router-link to="/">
          <img class="headerFull__link--icon desktop-only" src="/public/icon/logo_black@3x.png">
        </router-link>
        <a :href="socialLink.FACEBOOK" target="_blank">
          <img class="headerFull__link--icon desktop-only" src="/public/icon/facebook_white.png">
        </a>
        <a :href="socialLink.LINE" target="_blank">
          <img class="headerFull__link--icon desktop-only" src="/public/icon/line_white.png">
        </a>
        <a :href="socialLink.WEIBO" target="_blank">
          <img class="headerFull__link--icon desktop-only" src="/public/icon/weibo_white.png">
        </a>
        <a @click="openSearchBar()">
          <img class="headerFull__link--icon" src="/public/icon/search_white.png">
        </a>
      </div>
    </nav>
    <div class="sidebarFull">
      <div class="sidebarFull-container" :class="{ open: openSide }">
        <div class="sidebarFull__close">
          <a class="sidebarFull__close--icon" @click="closeSideBar()">
            <img src="~public/icon/close.png">
          </a>
          <a class="sidebarFull__close--text" @click="closeSideBar()">CLOSE THE MENU</a>
        </div>
        <nav class="sidebarFull__menu">
          <router-link :to="'/section/' + section" class="sidebarFull__menu--main">主頁</router-link>
          <div class="sidebarFull__menu--horizDivider"></div>
          <router-link class="sidebarFull__menu--item" :to="'/category/' + item.name" v-for="item in menuItem" v-text="item.title"></router-link>
        </nav>
      </div>
      <div class="sidebarFull-curtain" @click="closeSideBar()" v-show="openSide"></div>
    </div>
    <div class="searchFull" v-show="openSearch">
      <div class="searchFull-container">
        <input type="text" placeholder="Search" v-model="searchVal" @keyup.enter="search(searchVal)">
        <a @click="closeSearchBar()">
          <img src="/public/icon/close.png">
        </a>
      </div>
      <div class="searchFull-curtain" @click="closeSearchBar()"></div>
    </div>
  </header>
</template>
<script>

import { SOCIAL_LINK } from '../constants/index'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import _ from 'lodash'

export default {
  name: 'header-full',
  props: ['commonData', 'section', 'sections'],
  data () {
    return {
      blackNav: false,
      defaultNav: true,
      opacity: 1,
      openSearch: false,
      openSide: false,
      searchVal: '',
    }
  },
  methods: {
    closeSearchBar () {
      this.openSearch = false
    },
    closeSideBar () {
      this.openSide = false
    },
    getHeaderDFPHeight () {
      this.headerDFPHeight = document.getElementById('dfp-HD').offsetHeight + 35
    },
    getSectionLogoUrl () {
      return _.get(this.sectionLogo, [ 'image', 'url' ]) ? _.get(this.sectionLogo, [ 'image', 'url' ]) : '/asset/logo.png'
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
    handleScroll () {
      window.onscroll = (e) => {
        this.opacity = 1 - currentYPosition() / 300
        this.opacity < 0 ? this.defaultNav = false : this.defaultNav = true
        this.opacity < 1 ? this.blackNav = true : this.blackNav = false
      } 
    }
  },
  computed: {
    menuItem () {
      return _.get( _.find( _.get(this.sections, ['items']), { name: this.section } ), ['categories'])
    },
    sectionLogo () {
      return _.get( _.find( _.get(this.commonData, [ 'sections', 'items' ]), { name: this.section }), [ 'image' ], null)
    },
    socialLink () {
      return SOCIAL_LINK
    }
  },
  mounted() {
    this.handleScroll()
  },
}

</script>
<style lang="stylus" scoped>

.headerFull
  display flex
  justify-content space-between
  align-items flex-start
  position fixed
  top 0
  left 0
  z-index 500
  width 100%
  height 85px
  padding 20px 30px 0 25px
  background linear-gradient(#000,transparent)
  
  a
    display block
    line-height 1
  
  > div
    font-size 0

  &__logo
    position absolute
    top 22px
    left 50%
    transform translateX(-50%)
    
  &__link
    display flex
    justify-content space-between
    width 250px
    &--icon
      height 20px
      
  &--black
    align-items center
    height 55px
    padding-top 0
    background-color #000
    .headerFull
      &__logo
        top 50%
        left 50%
        transform translate(-50%, -50%)

.sidebarFull
  &-container
    position fixed
    top 0
    z-index 530
    width 100%
    height 100%
    padding 20px 25px 0
    background-color #333
    transform translate3d(-100%,0,0)
    transition .5s ease
    &.open
      transform translate3d(0,0,0)
      transition .5s ease
  &-curtain
    position fixed
    top 0
    left 0
    z-index 520
    width 100%
    height 100%
    background-color rgba(0, 0, 0, .5)
  &__close
    display flex
    align-items center
    margin-bottom 46px
    a
      color #fff
    &--iconf
      font-size 0
    &--text
      margin-left 10px
      font-size 13px
  &__menu
    display flex
    flex-direction column
    align-items center
    &--main
      font-size 15px
      color #7e7e7e
      margin-bottom 20px
    &--horizDivider
      width 100%
      height 1px
      margin-bottom 28px
      background-color #fff
    &--item
      font-size 18px
      color #fff
      margin-bottom 48px

.searchFull
  &-container
    position fixed
    top 0
    left 0
    z-index 520
    display flex
    justify-content space-between
    align-items center
    width 100%
    height 55px
    padding 0 22px 0 30px
    background-color #dcdcdc
    > input
      flex-grow 1
      height 22px
      padding 0
      font-size 20px
      color #8c8c8c
      background-color transparent
      border none
      box-shadow none
    > a
      font-size 0
      
  &-curtain
    position fixed
    top 0
    left 0
    z-index 510
    width 100%
    height 100%
    background-color rgba(0, 0, 0, .5)

@media (min-width: 1200px)
  .headerFull
    height 150px
    &--black
      height 60px

  .sidebarFull
    &-container
      width 365px

  .searchFull
    &-container
      top 60px
      justify-content flex-end
      height 52px
      > input
        text-align right
      > a
        margin-left 50px
</style>
