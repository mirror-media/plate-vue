<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
  import { mmLog } from './util/comm.js'
  import { visibleTracking } from './util/visibleTracking'
  import Tap from 'tap.js'

  export default {
    computed: {
      currPath () {
        return this.$route.fullPath
      }
    },
    data () {
      return {
        doc: {},
        globalTapevent: {}
      }
    },
    methods: {
      doLog (event) {
        mmLog({
          category: 'whole-site',
          description: '',
          eventType: 'click',
          target: event.target
        }).then((log) => {
          return this.$store.dispatch('LOG_CLIENT', { params: {
            clientInfo: log
          }})
        }).catch((err) => {
          console.log(err)
        })
      },
      launchLogger () {
        this.globalTapevent = new Tap(this.doc)
        this.doc.addEventListener('tap', (event) => {
          this.doLog(event)
        })
      },
      setUpVisibleTracking () {
        this.visibleTracking(
          [
            { target: '.article_body > .article_main .poplist-container', seenFlag: false, desc: 'popular' },
            { target: '.article_body > .article_main .article_main_tags', seenFlag: false, desc: 'tag' },
            { target: '.article_body > .article_main .newsletter', seenFlag: false, desc: 'end' },
            { target: '.article_body > .article_main .matchedContentContainer', seenFlag: false, desc: 'matched' },
            { target: '.article__main .newsletter', seenFlag: false, desc: 'end' },
            { target: '.article__main .matchedContentContainer', seenFlag: false, desc: 'matched' }
          ]
        )
      },
      visibleTracking
    },
    mounted () {
      this.doc = document
      this.launchLogger()
      this.setUpVisibleTracking()
    },
    watch: {
      currPath: function () {
        this.setUpVisibleTracking()
      }
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
      background-image url(/public/icon/close-btn.png)
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
