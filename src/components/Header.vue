<template>
  <header id="header" class="header">
    <section class="header-logoSearch">
      <a @click="openSideBar()" id="menubar" class="mobile-only"><img src="/public/icon/hamburger@2x.png" class="header-icon"></a>
      <router-link :to="'/'" id="header-logo"><img src="/public/logo.svg" class="header-logoSearch--logo"></router-link>
      <div class="header-logoSearch__search desktop-only">
        <input type="text" v-model="searchVal" @keyup.enter="search(searchVal)" placeholder="">
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
        <a :href="item.href" :id="'header-' + item.id" v-for="item in headerItem.topic" v-text="item.title"></a>
        <a :href="item.href" :id="'header-' + item.name" v-for="item in headerItem.section" v-text="item.title"></a>
        <a :href="item.href" :id="'header-' + item.name" v-for="item in headerItem.category" v-text="item.title"></a>
        <a :href="socialLink.SUBSCRIBE" id="footer-subscribe" target="_bank" class="header-sidebar__menu--subscribe">訂閱鏡週刊</a>
        <a :href="socialLink.DOWNLOADAPP" id="footer-download" target="_bank" class="header-sidebar__menu--download">下載APP</a>
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
      this.openSearch = false
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
