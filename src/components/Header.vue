<template>
  <header id="header" class="header">
    <section class="header-logoSearch">
      <a @click="openSideBar()" id="menubar" class="mobile-only"><img src="/public/icon/hamburger@2x.png" class="header-icon"></a>
      <router-link :to="'/'" id="header-logo"><img src="/public/logo.svg" class="header-logoSearch--logo"></router-link>
      <div class="header-logoSearch__search desktop-only">
        <input type="text" v-model="searchVal" @keyup.enter="search(searchVal)" @change="hasChanged()" placeholder="">
        <button @click="search(searchVal)">
          <img class="header-logoSearch__search--icon" src="/public/icon/search.svg" />
        </button>
      </div>
      <a @click="openSearchBar()" class="header-logoSearch__search mobile-only">
        <img src="/public/icon/search.svg">
      </a>
    </section>
    <nav class="header-menu--section">
      <div class="header-menu">
        <div v-for="item in headerItem.section" class="dropdown" :class="item.name" :style="{ width: 'calc( 100% /' + headerAmount + ')'}">
          <router-link :id="'header-' + item.name" :to="item.href" v-text="item.title"/>
          <div class="dropdown-content">
            <router-link :to="c.href" :id="'header-' + c.name" v-for="c in item.categories" v-text="c.title"/>
          </div>
        </div>
        <router-link :to="item.href" :id="'header-' + item.name" v-for="item in headerItem.category" v-text="item.title" :class="item.section" :style="{ width: 'calc( 100% /' + headerAmount + ')'}" />
      </div>
      <a href="https://www.mirrorfiction.com/" id="header-mirrorfiction" class="header--mirrorfiction" target="_blank">鏡文學</a>
    </nav>
    <nav class="header-menu--topic">
      <div>
        <div class="header-menu">
          <router-link :to="item.href" :id="'header-' + item.id" v-for="item in headerItem.topic" v-text="item.title"/>
        </div>
        <router-link to="/section/topic">更多</router-link>
      </div>
    </nav>
    <nav class="header-sidebar mobile-only" :class="{ open: openSide }">
      <div class="header-sidebar__close">
        <a @click="closeSideBar()"><img src="/public/icon/close_white.png"></a>
      </div>
      <div class="header-sidebar__menu">
        <a href="https://www.mirrorfiction.com/" id="header-mirrorfictionSidebar" target="_blank">鏡文學</a>
        <a :href="item.href" :id="'header-' + item.id" v-for="item in headerItem.topic" v-text="item.title"></a>
        <a :href="item.href" :id="'header-' + item.name" v-for="item in headerItem.section" v-text="item.title"></a>
        <a :href="item.href" :id="'header-' + item.name" v-for="item in headerItem.category" v-text="item.title"></a>
        <a :href="socialLink.DOWNLOADAPP" id="footer-download" target="_blank" class="header-sidebar__menu--download">
          <img src="/public/icon/download_lightgray.png">
          <span>下載APP</span>
        </a>
        <div class="header-sidebar__menu--second">
          <a id="footer-email" :href="socialLink.EMAIL" target="_blank"><img src="/public/icon/mail_lightgray.png"></a>
          <a id="footer-feed" :href="socialLink.FEED" target="_blank"><img src="/public/icon/feed_lightgray.png"></a>
        </div>
      </div>
      <div class="header-sidebar__socialMedia">
        <span>追蹤鏡傳媒</span>
        <a id="footer-line" :href="socialLink.LINE" target="_blank"><img src="/public/icon/line_blue.png"></a>
        <a id="footer-weibo" :href="socialLink.WEIBO" target="_blank"><img src="/public/icon/weibo_blue.png"></a>
        <a id="footer-fb" :href="socialLink.FACEBOOK" target="_blank"><img src="/public/icon/facebook_blue.png"></a>
        <a id="footer-ig" :href="socialLink.INSTAGRAM" target="_blank"><img src="/public/icon/instagram_blue.png"></a>
      </div>
    </nav>
    <section class="header-searchbar mobile-only" :class="{ open: openSearch }">
      <input type="text" v-model="searchVal" @keyup.enter="search(searchVal)" placeholder="搜尋">
      <a @click="closeSearchBar()"><img src="/public/icon/close.png"></a>
    </section>
    <section class="header-scrolled mobile-only" v-show="isScrolled">
      <a @click="openSideBar()"><img src="/public/icon/hamburger@2x.png"></a>
      <div>
        <a href="/"><img src="~public/icon/logo@2x.png"></a>
        <a @click="openSearchBar()"><img src="/public/icon/search.svg"></a>
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
  props: [ 'commonData' ],
  data () {
    return {
      isChanged: false,
      isScrolled: false,
      openSearch: false,
      openSide: false,
      searchVal: _.get(this.$route, [ 'params', 'keyword' ])
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
    socialLink () {
      return SOCIAL_LINK
    }
  },
  mounted () {
    this.handleScroll()
    console.log('mounted Header')
  }
}

</script>
