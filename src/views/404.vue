<template>
  <div class="notFound-view">
    <figure class="notFound__img">
      <img class="notFound__img--mobile" src="/public/404-mobile.png" alt="404 Not Found">
      <img class="notFound__img--desktop" src="/public/404-desktop.png" alt="404 Not Found">
      <div class="notFound__img--textBox">
        <h1>404</h1>
        <h2>抱歉！<br>找不到這個網址</h2>
        <a id="notfound-backHome" href="/">| 回首頁 |</a>
      </div>
    </figure>
    <div class="notFound__popList">
      <h2>熱門文章</h2>
      <div class="notFound-popListContainer">
        <div class="notFound-popListContainer__post" v-for="(item, index) in popArticles">
          <figure class="notFound-popListContainer__post--img">
            <a :id="`notfound-${index}-img`" :href="getValue(item, [ 'slug' ])"><img :src="getValue(item, [ 'heroImage', 'image', 'resizedTargets', viewportTarget, 'url' ])" :alt="getValue(item, [ 'title' ])"/></a>
            <div class="notFound-popListContainer__post--category" :style="getSectionStyle(item)" v-text="getValue(item, [ 'sections', '0', 'title' ])" />
          </figure>
          <div class="notFound-popListContainer__post--title">
            <a :id="`notfound-${index}-title`" :href="getValue(item, [ 'slug' ])" v-text="getValue(item, [ 'title' ])"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { SECTION_MAP, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { getValue } from '../util/comm'
import _ from 'lodash'

const fetchPop = (store) => {
  return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
}

export default {
  name: 'notFound-view',
  data () {
    return {
      viewport: 0
    }
  },
  computed: {
    popArticles () {
      return _.take(_.get(this.$store.state, [ 'articlesPopList', 'report' ]), 3)
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
    getValue,
    getSectionStyle (item) {
      return { backgroundColor: _.get(SECTION_MAP, [ _.get(item, [ 'sections', '0', 'id' ]), 'bgcolor' ], '#bcbcbc') }
    },
    insertGoogleFonts () {
      const googleFonts = document.createElement('link')
      googleFonts.setAttribute('id', 'googleFonts')
      googleFonts.setAttribute('href', 'https://fonts.googleapis.com/css?family=PT+Mono')
      document.querySelector('head').appendChild(googleFonts)
    },
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.querySelector('body').offsetWidth
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (process.env.VUE_ENV === 'client') {
      const googleFonts = document.querySelector('#googleFonts')
      if (googleFonts) {
        document.querySelector('head').removeChild(googleFonts)
      }
    }
  },
  beforeMount () {
    fetchPop(this.$store)
  },
  mounted () {
    this.insertGoogleFonts()
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })

    window.ga('send', 'pageview', { title: '404 - Page Not Found', location: document.location.href })
  },
  metaInfo () {
    const title = SITE_TITLE
    const description = SITE_DESCRIPTION
    console.log('404 vue')
    return {
      title,
      meta: [
          { name: 'keywords', content: SITE_KEYWORDS },
          { name: 'description', content: description },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: SITE_OGIMAGE },
          { property: 'og:site_name', content: SITE_TITLE },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:url', content: SITE_URL },
          { property: 'og:image', content: SITE_OGIMAGE }
      ]
    }
  }
}

</script>
<style lang="stylus" scoped>

h1, h2, a
  margin 0 0 .5em

.notFound-view
  display flex
  flex-direction column
  justify-content center
  background-color #2c5970

.notFound__img
  position relative
  width 100%
  margin 2em 0
  padding-left 1em
  > img
    width 100%
  &--mobile
    display inline
  &--desktop
    display none
  &--textBox
    display flex
    flex-direction column
    position absolute
    top 40%
    left 35%
    transform translate(-50%, -50%)
    h1, h2
      color #f89228
    h1
      margin 0
      font-size 45px
      font-family 'PT Mono', monospace, -apple-system, "Helvetica Neue", sans-serif
      font-weight normal
    h2
      font-size 1.2rem
    a
      margin 0
      color #fff
      font-size 1.2rem
      font-weight 300

.notFound__popList
  padding 0 5%
  h2
    color #fff
    font-size 1.2rem

.notFound-popListContainer
  display flex
  flex-direction column
  &__post
    width 100%
    margin-bottom 1em
    &--img
      position relative
      width 100%
      padding-top 56.25%
      margin 0
      img
        position absolute
        top 0
        left 0
        bottom 0
        right 0
        width 100%
        height 100%
        object-fit cover
        object-position 50% 50%
    &--title
      background-color #fff
      padding 1em
      a
        font-size 1.2rem
        font-weight 300
        text-align justify
        line-height 1.2
        letter-spacing 1px
    &--category
      position absolute
      left 0
      bottom 0
      padding .5em
      color #fff
      letter-spacing 2px

@media (min-width 600px)
  br
    display none
  h1, h2, a
    margin 0 1em
  .notFound-view
    justify-content flex-start
    width 100vw
    height 100vh
  .notFound__img
    position relative
    margin 20% 0 2em
    &--mobile
      display none
    &--desktop
      display inline
    &--textBox
      align-items flex-end
      flex-direction row
      top 50%
      left 0
      transform translateY(-50%)
      width 100%
      padding-left 5%
      h1
        font-size 60px
      h2, a
        font-size 1.2rem
        padding-bottom 13px
  .notFound__popList
    display flex
    flex-direction column
    justify-content center
    h2
      margin 1em 0 1em 10px
  .notFound-popListContainer
    flex-direction row
    &__post
      margin 0 10px
      background-color #fff

@media (min-width 900px)
  .notFound-view
    justify-content center
  .notFound__img
    margin 2em 0
    &--textBox
      width 75%
      padding 0
      left 12.5%
      h1
        font-size 70px
      h2, a
        padding-bottom 15px
        font-size 30px
      h2
        margin 0 1.5em
  .notFound__popList
    width 75%
    margin 0 auto
    padding 0
    h2
      margin 1em 0
  .notFound-popListContainer
    justify-content space-between
    &__post
      width 30%
      margin 0

@media (min-width 1200px)
  .notFound__img
    &--textBox
      h1
        font-size 80px
      h2, a
        font-size 40px
      h2
        margin 0 2em

</style>
