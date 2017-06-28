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
        <div v-for="item in headerItem.section" class="dropdown" :class="item.name" :style="{ width: 'calc( 100% /' + headerAmount + ')'}">
          <router-link :id="`header-${item.name}-menu`" :to="item.href" v-text="item.title"></router-link>
          <div class="dropdown-content">
            <router-link :to="c.href" :id="`header-${c.name}-menu`" v-for="(c, i) in item.categories" v-text="c.title" :key="`${i}-${Date.now()}`"/>
          </div>
        </div>
        <router-link :to="item.href" :id="`header-${item.name}-menu`" v-for="(item, i) in headerItem.category" v-text="item.title" :class="item.section" :style="{ width: 'calc( 100% /' + headerAmount + ')'}" :key="`${i}-${Date.now()}`" />
      </div>
      <a href="https://www.mirrorfiction.com/" id="header-mirrorfiction-menu" class="header--mirrorfiction" target="_blank">鏡文學</a>
    </nav>
    <nav class="header-menu--topic">
      <div>
        <div class="header-menu">
          <router-link :to="item.href" :id="`header-${item.name}-menu`" v-for="(item, i) in headerItem.topic" v-text="item.title" :key="`${i}-${Date.now()}`" />
        </div>
        <router-link to="/section/topic">更多</router-link>
      </div>
    </nav>
    <nav class="header-sidebar mobile-only" :class="{ open: openSide }">
      <div class="header-sidebar__close">
        <a @click="closeSideBar()"><img src="/public/icon/close_white.png" alt="關閉側邊欄"></a>
      </div>
      <div class="header-sidebar__menu">
        <a href="https://www.mirrorfiction.com/" id="header-mirrorfictionSidebar-sidebar" target="_blank">鏡文學</a>
        <a :href="item.href" :id="`header-${item.name}-sidebar`" v-for="item in headerItem.topic" v-text="item.title"></a>
        <a :href="item.href" :id="`header-${item.name}-sidebar`" v-for="item in headerItem.section" v-text="item.title"></a>
        <a :href="item.href" :id="`header-${item.name}-sidebar`" v-for="item in headerItem.category" v-text="item.title"></a>
        <a :href="socialLink.DOWNLOADAPP" id="footer-download-sidebar" target="_blank" class="header-sidebar__menu--download">
          <img src="/public/icon/download_lightgray.png" alt="下載APP">
          <span>下載APP</span>
        </a>
        <div class="header-sidebar__menu--second">
          <a id="footer-email-sidebar" :href="socialLink.EMAIL" target="_blank"><img src="/public/icon/mail_lightgray.png" alt="聯絡我們"></a>
          <a id="footer-feed-sidebar" :href="socialLink.FEED" target="_blank"><img src="/public/icon/feed_lightgray.png" alt="RSS"></a>
        </div>
      </div>
      <div class="header-sidebar__socialMedia">
        <span>追蹤鏡傳媒</span>
        <a id="footer-line-sidebar" :href="socialLink.LINE" target="_blank"><img src="/public/icon/line_blue.png" alt="Line"></a>
        <a id="footer-weibo-sidebar" :href="socialLink.WEIBO" target="_blank"><img src="/public/icon/weibo_blue.png" alt="微博"></a>
        <a id="footer-fb-sidebar" :href="socialLink.FACEBOOK" target="_blank"><img src="/public/icon/facebook_blue.png" alt="Facebook"></a>
        <a id="footer-ig-sidebar" :href="socialLink.INSTAGRAM" target="_blank"><img src="/public/icon/instagram_blue.png" alt="Instagram"></a>
      </div>
    </nav>
    <section class="header-searchbar mobile-only" :class="{ open: openSearch }">
      <form action=".">
        <input type="search" v-model="searchVal" @keyup.enter="search(searchVal)" @change="hasChanged()" placeholder="搜尋">
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

import { SOCIAL_LINK } from '../constants/index'
import { currentYPosition } from 'kc-scroll'
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
    headerItem () {
      const headerItem = {}
      headerItem.section = []
      headerItem.category = []
      headerItem.topic = []
      _.forEach(_.get(this.commonData, [ 'sections', 'items' ]), (s) => {
        s.href = '/section/' + s.name
        s.isFeatured ? headerItem.section.push(s) : ''
        _.forEach(s.categories, (c) => {
          c.href = '/category/' + c.name
          c.section = s.name
          c.isFeatured ? headerItem.category.push(c) : ''
        })
      })
      _.forEach(_.get(this.commonData, [ 'topics', 'items' ]), (t) => {
        t.href = '/topic/' + t.id
        t.title = t.name
        t.isFeatured && headerItem.topic.length < 7 ? headerItem.topic.push(t) : ''
      })
      return headerItem
    },
    headerAmount () {
      return this.headerItem.section.length + this.headerItem.category.length
    },
    logoImage () {
      const eventLogo = _.get(this.eventLogo, [ 'image', 'image', 'resizedTargets', 'desktop', 'url' ], null)
      return eventLogo || '/public/logo.svg'
    },
    socialLink () {
      return SOCIAL_LINK
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

<style lang="stylus">
.header-logoSearch__logoAd
  display flex
  align-items flex-end
  &--ad
    display flex
    align-items flex-end
    &:before
      content "｜"
      margin-bottom 5px

@media (max-width: 350px)
  .header-logoSearch
    padding 10px 8px
</style>
