<template>
  <header>
    <nav class="headerFoodTravel">
      <div class="headerFoodTravel__logo">
        <router-link to="/" id="header-home">
          <img class="headerFoodTravel__link--icon" src="/assets/mirrormedia/icon/logo_black@3x.png" alt="鏡週刊 Mirror Media">
        </router-link>
      </div>
      <div class="headerFoodTravel__menu">
        <a class="headerFoodTravel__menu--ham mobile-only" @click="openSideBar()"><img src="/assets/mirrormedia/icon/hamburger@2x.png" alt="開啟側邊欄"></a>
        <router-link class="headerFoodTravel__menu--item desktop-only" :to="'/category/' + item.name" v-for="(item, i) in menuItem" v-text="item.title" :id="'header-' + item.name" :key="`${i}-${Date.now()}`"></router-link>
      </div>
      <div class="headerFoodTravel__social-and-search">
        <a :href="socialLink.FACEBOOK_FOODTRAVEL" target="_blank" id="header-facebook">
          <img class="headerFoodTravel__link--icon desktop-only" src="/assets/mirrormedia/icon/facebook@2x.png" alt="Facebook">
        </a>
        <a :href="socialLink.LINE" target="_blank" id="header-line">
          <img class="headerFoodTravel__link--icon desktop-only" src="/assets/mirrormedia/icon/line@2x.png" alt="Line">
        </a>
        <a @click="openSearchBar()">
          <img class="headerFoodTravel__link--icon" src="/assets/mirrormedia/icon/search@2x.png" alt="開啟搜尋列">
        </a>
      </div>
    </nav>
    <div class="sidebarFull">
      <div class="sidebarFull-container" :class="{ open: openSide }">
        <div class="sidebarFull__close">
          <a class="sidebarFull__close--icon" @click="closeSideBar()">
            <img src="/assets/mirrormedia/icon/close.png" alt="關閉側邊欄">
          </a>
          <a class="sidebarFull__close--text" @click="closeSideBar()"></a>
        </div>
        <nav class="sidebarFull__menu">
          <router-link class="sidebarFull__menu--item" :to="'/category/' + item.name" v-for="(item, i) in menuItem" v-text="item.title" :id="'header-' + item.name" :key="`${i}-${Date.now()}`"></router-link>
        </nav>
      </div>
      <div class="sidebarFull-curtain" @click="closeSideBar()" v-show="openSide"></div>
    </div>
    <div class="searchFull" v-show="openSearch">
      <div class="searchFull-container">
        <input type="text" placeholder="Search" v-model="searchVal" @keyup.enter="search(searchVal)">
        <a @click="closeSearchBar()">
          <img src="/assets/mirrormedia/icon/close.png" alt="關閉搜尋列">
        </a>
      </div>
      <div class="searchFull-curtain" @click="closeSearchBar()"></div>
    </div>
  </header>
</template>

<script>
  import {
    SOCIAL_LINK
  } from '../constants/index'
  import _ from 'lodash'
  export default {
    name: 'header-full',
    props: [ 'commonData', 'sectionName', 'sections' ],
    data () {
      return {
        blackNav: false,
        defaultNav: true,
        opacity: 1,
        openSearch: false,
        openSide: false,
        searchVal: ''
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
      search () {
        this.$router.push('/search/' + this.searchVal)
      }
    },
    computed: {
      menuItem () {
        return _.get(_.find(_.get(this.sections, [ 'items' ]), {
          name: this.sectionName
        }), [ 'categories' ])
      },
      sectionLogo () {
        return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), {
          name: this.sectionName
        }), [ 'image' ], null)
      },
      socialLink () {
        return SOCIAL_LINK
      }
    }
  }
</script>

<style lang="stylus" scoped>

.headerFoodTravel
  display flex
  align-items center
  position fixed
  top 0
  left 0
  z-index 500
  width 100%
  height 50px
  padding 5px 10px 5px 10px
  background-color white
  
  a
    // display block
    // line-height 1
  
  > div
    font-size 0

  &__logo
    width 30px
    .headerFoodTravel__link--icon
      height 40px

    // padding-bottom 50px

  &__link
    display flex
    justify-content space-between
    width 250px
    &--icon
      height 22px

  &__menu
    a
      img
        height 40px
    display flex
    justify-content space-between
    
    &--item
      justify-content flex-end
      align-items center
      font-size: 18px
      font-weight 500
      letter-spacing 1px
      color #4d4d4d
      width 110px
      // border-left 1px solid black
      // padding-left 5px
    &--item + &--item:before
      content "｜"
      font-size 18px
      font-weight 500
      letter-spacing 8px
      color #d3d3d3
    &--ham
      margin-left 20px

  &__social-and-search
    position absolute
    top 30%
    right 0
    display flex
    justify-content space-between
    a
      margin-left 10px
      margin-right 10px
      
  &--black
    align-items center
    height 55px
    padding-top 0
    background-color #000
    .headerFoodTravel
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
    background-color #4d4d4d
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
  .headerFoodTravel
    height 60px
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
