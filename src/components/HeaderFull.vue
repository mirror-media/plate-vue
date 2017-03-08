<template>
  <header>
    <nav class="headerFull" :style="{opacity: opacity}" v-show="defaultNav">
      <div class="headerFull__menu">
        <a @click="openSideBar()"><img src="~public/icon/hamburger_white.png"></a>
      </div>
      <div class="headerFull__logo">
        <a :href=" '/section/' + section "><img :src="getSectionLogoUrl()"></a>
      </div>
      <div class="headerFull__link">
        <a href="/">
          <img class="headerFull__link--icon desktop-only" src="~public/icon/logo_black@3x.png">
        </a>
        <a :href="socialLink.FACEBOOK">
          <img class="headerFull__link--icon desktop-only" src="~public/icon/facebook_white.png">
        </a>
        <a :href="socialLink.LINE">
          <img class="headerFull__link--icon desktop-only" src="~public/icon/line_white.png">
        </a>
        <a :href="socialLink.WEIBO">
          <img class="headerFull__link--icon desktop-only" src="~public/icon/weibo_white.png">
        </a>
        <a @click="openSearchBar()">
          <img class="headerFull__link--icon" src="~public/icon/search_white.png">
        </a>
      </div>
    </nav>
    <nav class="headerFull headerFull--black" :style="{opacity: 1-opacity}" v-show="blackNav">
      <div class="headerFull__menu">
        <a @click="openSideBar()"><img src="~public/icon/hamburger_white.png"></a>
      </div>
      <div class="headerFull__logo">
        <a :href=" '/section/' + section "><img :src="getSectionLogoUrl()"></a>
      </div>
      <div class="headerFull__link">
        <a href="/">
          <img class="headerFull__link--icon desktop-only" src="~public/icon/logo_black@3x.png">
        </a>
        <a :href="socialLink.FACEBOOK">
          <img class="headerFull__link--icon desktop-only" src="~public/icon/facebook_white.png">
        </a>
        <a :href="socialLink.LINE">
          <img class="headerFull__link--icon desktop-only" src="~public/icon/line_white.png">
        </a>
        <a :href="socialLink.WEIBO">
          <img class="headerFull__link--icon desktop-only" src="~public/icon/weibo_white.png">
        </a>
        <a @click="openSearchBar()">
          <img class="headerFull__link--icon" src="~public/icon/search_white.png">
        </a>
      </div>
    </nav>
  </header>
</template>
<script>

import { SOCIAL_LINK } from '../constants/index'
import { currentYPosition, elmYPosition } from 'kc-scroll'
import _ from 'lodash'

export default {
  name: 'header-full',
  props: ['commonData', 'section'],
  data () {
    return {
      blackNav: false,
      defaultNav: true,
      opacity: 1,
      searchVal: '',
    }
  },
  methods: {
    getHeaderDFPHeight () {
      this.headerDFPHeight = document.getElementById('dfp-HD').offsetHeight + 35
    },
    getSectionLogoUrl () {
      return _.get(this.sectionLogo, [ 'image', 'url' ]) ? _.get(this.sectionLogo, [ 'image', 'url' ]) : '/asset/logo.png'
    },
    openSearchBar () {
      this.$emit('openSearchBar')
    },
    openSideBar () {
      this.$emit('openSideBar')
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

@media (min-width: 1200px)
  .headerFull
    height 150px
    &--black
      height 60px

</style>
