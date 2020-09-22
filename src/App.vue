<template>
  <div id="app">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view class="view" />
    </transition>
  </div>
</template>

<script>
import { FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from 'src/constants'
import { mmLog } from './util/comm.js'
import { visibleTracking } from './util/visibleTracking'
import loadScripts from './mixin/loadScripts.js'

const debug = require('debug')('CLIENT:App')

const resetAdCoverFlag = store => store.dispatch('RESET_AD_COVER')
const updateViewport = (store) => {
  const width = Math.min(window.innerWidth, document.documentElement.clientWidth)
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  const viewport = { width: width, height: height }
  return store.dispatch('UPDATE_VIEWPORT', viewport)
}

export default {
  metaInfo: {
    title: SITE_TITLE,
    titleTemplate: `%s - ${SITE_TITLE}`,
    meta: [
      { vmid: 'keywords', name: 'keywords', content: SITE_KEYWORDS },
      { vmid: 'description', name: 'description', content: SITE_DESCRIPTION },
      { vmid: 'og:title', property: 'og:title', content: SITE_TITLE },
      { vmid: 'og:description', property: 'og:description', content: SITE_DESCRIPTION },
      { vmid: 'og:url', property: 'og:url', content: SITE_URL },
      { vmid: 'og:image', property: 'og:image', content: SITE_OGIMAGE },
      { vmid: 'og:site_name', property: 'og:site_name', content: SITE_TITLE },
      { vmid: 'og:locale', property: 'og:locale', content: 'zh_TW' },
      { vmid: 'og:type', property: 'og:type', content: 'article' },
      { vmid: 'fb:app_id', property: 'fb:app_id', content: FB_APP_ID },
      { vmid: 'fb:pages', property: 'fb:pages', content: FB_PAGE_ID },
      { vmid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { vmid: 'twitter:title', name: 'twitter:title', content: SITE_TITLE },
      { vmid: 'twitter:description', name: 'twitter:description', content: SITE_DESCRIPTION },
      { vmid: 'twitter:image', name: 'twitter:image', content: SITE_OGIMAGE }
    ]
  },
  mixins: [loadScripts],
  data () {
    return {
      doc: {},
      globalTapevent: {}
    }
  },
  computed: {
    currPath () {
      return this.$route.fullPath
    }
  },
  watch: {
    currPath: function () {
      this.setUpVisibleTracking()
      resetAdCoverFlag(this.$store)
    }
  },
  // beforeMount () {
  //   updateViewport(this.$store)
  // },
  mounted () {
    /**
       * todo
       * updateViewport() 從 beforeMount 改放到 mounted 後，更新的速度變得比螢幕尺寸變化還慢
       * 如果你是在組件的 mounted 處取得螢幕尺寸（比如使用 viewportWidth），那這個變數紀錄的值會是在螢幕變化前的值（因為 updateViewport() 會比較慢執行）
       * 但現在又不能把 updateViewport() 改放回到 beforeMount，不然網頁會出現難以理解的錯誤
       */
    updateViewport(this.$store)

    this.doc = document
    this.launchLogger()
    this.setUpVisibleTracking()
    window.addEventListener('resize', this.updateViewport)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateViewport)
  },
  methods: {
    doLog (event) {
      mmLog({
        category: 'whole-site',
        description: '',
        eventType: 'click',
        target: event.target
      }).then(log => {
        debug('log', log)
        return this.$store.dispatch('LOG_CLIENT', {
          params: {
            clientInfo: log
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    launchLogger () {
      this.doc.addEventListener('click', (event) => {
        this.doLog(event)
      })
    },
    setUpVisibleTracking () {
      this.visibleTracking(
        [
          { target: '.article_body > .article_main .poplist-container', seenFlag: false, desc: 'popular' },
          { target: '.article_body > .article_main .article_main_tags', seenFlag: false, desc: 'tag' },
          { target: '.article_body > .article_main .dable-widget', seenFlag: false, desc: 'matched' },
          { target: '.article__main .dable-widget', seenFlag: false, desc: 'matched' }
        ]
      )
    },
    updateViewport () {
      updateViewport(this.$store)
    },
    visibleTracking
  }
}
</script>

<style lang="stylus">
video::-internal-media-controls-download-button
  display none

video::-webkit-media-controls-enclosure
  overflow hidden

video::-webkit-media-controls-panel
  width calc(100% + 30px)

html
  box-sizing border-box
  font-size 16px

*, *:before, *:after
  box-sizing inherit

body
  font-family -apple-system, Microsoft JhengHei,"Segoe UI", Roboto, Ubuntu, "Droid Sans", "Helvetica Neue", sans-serif;
  background-color #fff
  color #34495e
  overflow-y scroll

a
  display inline
  color #34495e
  text-decoration none
  cursor pointer

  u
    text-decoration none

  &.white
    &, &:hover, &:link, &:visited
      color #fff
  &.blue
    &, &:hover, &:link, &:visited
      color #0b4fa2

p, h2, h3
  font-weight normal

section.tweet
  .content
    a, a:hover, a:link, a:visited
        color #0b4fa2

button
  cursor pointer

button:disabled
  cursor not-allowed

input:focus,
select:focus,
textarea:focus,
button:focus {
    outline: none
}

#app
  overflow hidden

.desktop-only
  display none !important

.container
  width 100%
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin 0 auto

.grid-1-fourth
  width 25%

.grid-2-fourth
  width 50%

.grid-1-fifth
  width 20%

.grid-2-fifth
  width 40%

.grid-3-fifth
  width 60%

.grid-4-fifth
  width 80%

.view
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

.leading-embedded
  .embedded
    > iframe
      max-height 100%

.dfp-cover
  &:not(.vpon)
    height 100vh
    width 100vw
    position fixed
    top 0
    left 0
    z-index 9997
    background-color rgba(0, 0, 0, 0.7)
    display flex
    justify-content center
    align-items center

  > .ad
    position relative
    width 320px
    height 480px

    > .close
      position absolute
      top -16px
      right -16px
      width 32px
      height 32px
      background-image url(/assets/mirrormedia/icon/close-btn.png)
      background-repeat no-repeat
      background-size contain
      background-position center center
      cursor pointer

  &.vpon, &.ad2
    margin 0
    padding 0

.limited-height
  // height calc(100vh + 1px)
  height 100%
  background-color #000
  // overflow hidden
  &.no-scroll
    overflow hidden

[lazy=loading]
  margin 0 auto
  object-fit contain
  object-position center center
  background-size 40% 40%

@media (min-width 0px) and (max-width 320px)
  .dfp-cover
    > .ad
      > .close
        right 0
@media (min-width 600px)
  .container
    width 90%

@media (min-width 900px)
  .container
    width 768px

@media (max-width 1199px)
  .mobile-hide
    display none !important

@media (min-width 1200px)
  .mobile-only
    display none !important

  .desktop-only
    display flex !important

  .container
    width 1024px

@media only screen and (min-width 0px) and (max-width 1199px)
  .dfp-desktop
    display none !important

@media only screen and (min-width 1200px)
  .dfp-mobile
    display none !important

</style>
