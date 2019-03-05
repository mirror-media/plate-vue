<template>
  <div>
    <div class="btn-toggle-description" :class="switchStatus" @click="toggleDesc">
      <div class="hint">開啟／關閉圖說</div>
    </div>
    <div class="go-next-page" @click="goNextPage" :class="goNextPageClass"></div>
    <div class="progress-wrap progress mobile-only" data-progress-percent="25">
      <div class="progress-bar progress"></div>
    </div>
    <div class="progress-sidebar desktop-only" v-if="ifRenderProgressSidebar">
      <div class="stick-container">
        <div class="stick" v-for="(o, i) in imgArr" :style="stickBottom((i))" :class="{ 'passed' : stickflag[i] }" :index="i" @click="goPage"></div>
      </div>
    </div>
    <div class="article_body">
      <div class="pic-container">
        <section class="pic-section active">
          <div class="title">
            <span><h2 v-text="title"></h2></span>
          </div>
          <div class="brief">
            <div :class="captionStyle">
              <div v-text="heroCaption"></div>
              <span v-text="getValue(brief, [ 'apiData', 0, 'content', 0 ], '')"></span>
            </div>
          </div>
          <div class="img">
            <img :src="getValue(heroImg, [ 'image', 'url' ])" :class="landscapeClass"
                  :srcset="`${getValue(heroImg, [ 'image', 'resizedTargets', 'mobile', 'url' ])} 800w,
                            ${getValue(heroImg, [ 'image', 'resizedTargets', 'tablet', 'url' ])} 1200w,
                            ${getValue(heroImg, [ 'image', 'resizedTargets', 'desktop', 'url' ])} 2000w`" />
          </div>
        </section>
        <section class="pic-section" v-for="(o, i) in imgArr">
          <div class="brief">
            <div :class="captionStyle">
              <span v-text="getValue(o, [ 'content', 0, 'description' ], '')"></span>
            </div>
          </div>
          <div class="img">
            <img :src="getValue(o, [ 'content', 0, 'url' ])" :class="landscapeClass"
                  :srcset="`${getValue(o, [ 'content', 0, 'mobile', 'url' ])} 800w,
                            ${getValue(o, [ 'content', 0, 'tablet', 'url' ])} 1200w,
                            ${getValue(o, [ 'content', 0, 'desktop', 'url' ])} 2000w`" />      
          </div>
        </section>
      </div>
    </div>
    <div class="credit-comment" :class="creditCommentClass">
      <div class="credit" v-html="credit"></div>
      <related-list-thumbnail :isApp="true" :relatedList="relatedList"/>
      <!--slot name="slot_dfpFT"></slot-->
      <slot name="slot_fb_comment"></slot>      
    </div>
  </div>
</template>
<script>
  import { OnePageScroller } from 'kc-scroll'
  import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
  import { getValue, addClass, removeClass } from '../../util/comm'
  import _ from 'lodash'
  import RelatedListWithThumbnail from './RelatedListWithThumbnail.vue'

  export default {
    components: {
      'related-list-thumbnail': RelatedListWithThumbnail
    },
    computed: {
      brief () {
        const { brief } = this.articleData
        return brief
      },
      captionStyle () {
        return {
          show: (this.descSwitch || (this.viewport < 768 && !this.ifLandscape)),
          hide: !this.descSwitch
        }
      },
      contentArr () {
        const { apiData } = _.get(this.articleData, [ 'content' ], [])
        return apiData
      },
      credit () {
        const { cameraMan = [], designers = [], engineers = [], extendByline = '', photographers = [], writers = [] } = this.articleData
        const creditWriterStr = (writers.length > 0) ? '文｜' + writers.filter((o) => (o !== null && o !== undefined)).map((o) => (`${o.name}`)).join('&nbsp;') : ''
        const creditPhotoStr = (photographers.length > 0) ? '攝影｜' + photographers.filter((o) => (o !== null && o !== undefined)).map((o) => (`${o.name}`)).join('&nbsp;') : ''
        const creditDesignStr = (designers.length > 0) ? '設計｜' + designers.filter((o) => (o !== null && o !== undefined)).map((o) => (`${o.name}`)).join('&nbsp;') : ''
        const creditEnginStr = (engineers.length > 0) ? '工程｜' + engineers.filter((o) => (o !== null && o !== undefined)).map((o) => (`${o.name}`)).join('&nbsp;') : ''
        const creditCamStr = (cameraMan.length > 0) ? '影音｜' + cameraMan.filter((o) => (o !== null && o !== undefined)).map((o) => (`${o.name}`)).join('&nbsp;') : ''
        const creditElse = (extendByline.length > 0) ? extendByline + '&nbsp;' : ''
        return [ creditWriterStr, creditPhotoStr, creditDesignStr, creditEnginStr, creditCamStr, creditElse ].filter((o) => (o.length > 0)).join('&nbsp;&nbsp;&nbsp;&nbsp;')
      },
      creditCommentClass () {
        return {
          show: this.creditCommentShow
        }
      },
      goNextPageClass () {
        return {
          center: (this.viewport < 768 && !this.ifLandscape),
          hidden: this.goNextPageHide
        }
      },
      heroCaption () {
        const { heroCaption } = this.articleData
        return heroCaption || ''
      },
      heroImg () {
        const { heroImage } = this.articleData
        return heroImage
      },
      ifRenderProgressSidebar () {
        return (this.viewport > 1200)
      },
      landscapeClass () {
        return {
          landscape: this.ifLandscape
        }
      },
      imgArr () {
        return _.filter(this.contentArr, { type: 'image' })
      },
      relatedList () {
        const { relateds } = this.articleData
        return relateds
      },
      switchStatus () {
        return {
          on: this.descSwitch,
          off: !this.descSwitch,
          hide: !this.ifLandscape || this.descHide
        }
      },
      title () {
        const { title } = this.articleData
        return title
      }
    },
    data () {
      return {
        currIndex: 1,
        creditCommentShow: false,
        descHide: false,
        descSwitch: _.get(this.articleData, [ 'isAdvertised' ], false),
        lastAnimation: 0,
        ifLandscape: false,
        goNextPageHide: false,
        onePageScroll: (new OnePageScroller()),
        quietPeriod: 700,
        scrollingFlag: false,
        stickflag: [],
        touchStartY: 0
      }
    },
    methods: {
      currentYPosition,
      elmYPosition,
      getValue,
      goNextPage () {
        const nextPage = this.currIndex <= this.imgArr.length ? this.currIndex + 1 : this.currIndex
        if (this.currIndex < this.imgArr.length + 1) {
          this.onePageScroll.moveTo(nextPage)
        } else {
          this.smoothScroll('.credit-comment')
          this.onePageScroll.pauseToggle()
        }
      },
      goHome () {
        window.location.href = '/'
      },
      goPage (e) {
        const targIndex = Number(e.target.getAttribute('index')) + 1
        let loopCount = this.currIndex
        this.onePageScroll.moveTo(targIndex)
        this.onePageScroll.cancelPause()
        while (loopCount !== targIndex) {
          if (this.currIndex < targIndex) {
            this.sideProgressHandler('pass', loopCount)
            loopCount++
          } else if (this.currIndex > targIndex) {
            this.sideProgressHandler('back', loopCount)
            loopCount--
          }
        }
      },
      initOnepage () {
        this.onePageScroll.init('.article_body', {
          afterMove: (index) => {
            this.currIndex = parseInt(index)
            this.updateProgressbar(((this.currIndex - 1) * 100) / this.imgArr.length)
            if (this.currIndex === this.imgArr.length + 1) {
              this.creditCommentShow = true
              this.initFBComment()
              removeClass(document.body, 'limited-height')
              removeClass(document.documentElement, 'limited-height')
              setTimeout(() => {
                document.addEventListener('touchstart', this.touchStartHandler)
                document.addEventListener('touchend', this.touchEndHandler)
                document.addEventListener('mousewheel', this.mouseWheelHandler)
                document.addEventListener('DOMMouseScroll', this.mouseWheelHandler)
              }, 1000)
            } else {
              this.creditCommentShow = false
              document.removeEventListener('touchstart', this.touchStartHandler)
              document.removeEventListener('touchmove', this.touchMoveHandler)
              document.removeEventListener('touchend', this.touchEndHandler)
              document.removeEventListener('mousewheel', this.mouseWheelHandler)
              document.removeEventListener('DOMMouseScroll', this.mouseWheelHandler)
              addClass(document.body, 'limited-height')
              addClass(document.documentElement, 'limited-height')
            }
          },
          animationTime: 500,
          beforeMove: (index) => {
            this.smoothScroll('.article_body')
            if (parseInt(index) > this.currIndex) {
              this.sideProgressHandler('pass', parseInt(index - 1))
            } else {
              this.sideProgressHandler('back', parseInt(index))
            }
          },
          defaultInitialPage: 1,
          easing: 'ease',
          pageContainer: '.pic-section',
          quietPeriod: 750
        })
      },
      mouseWheelHandler (evt) {
        const delta = evt.wheelDelta || -evt.detail
        const targ = evt.target
        const timeNow = new Date().getTime()

        const shouldDo = this.onePageScroll._isDescendant(document.querySelector('.article_body'), targ)

        const creditCommentTopY = this.elmYPosition('.credit-comment')
        const currTop = this.currentYPosition()

        if (delta < 0 && this.currIndex === this.imgArr.length + 1 && shouldDo && creditCommentTopY > currTop) {
          if (timeNow - this.lastAnimation < this.quietPeriod + 500) {
            evt.preventDefault()
            return
          } else {
            this.smoothScroll('.credit-comment')
            this.onePageScroll.pauseToggle()
          }
        } else if (delta > 0 && this.currIndex === this.imgArr.length + 1 && !shouldDo) {
          if (creditCommentTopY > currTop) {
            if (this.scrollingFlag === true) {
              evt.preventDefault()
              return
            } else {
              this.smoothScroll('.article_body')
              this.scrollingFlag = true
              setTimeout(() => {
                this.scrollingFlag = false
                this.onePageScroll.pauseToggle()
              }, 1000)
            }
          }
        }
        this.lastAnimation = timeNow
      },
      scrollHandler () {
        const currTop = this.currentYPosition()
        const creditCommentTopY = this.elmYPosition('.credit-comment')
        const tHtml = document.documentElement
        if (currTop + (tHtml.clientHeight / 2) > creditCommentTopY && creditCommentTopY !== 0) {
          this.goNextPageHide = true
          this.descHide = true
        } else {
          this.goNextPageHide = false
          this.descHide = false
        }
      },
      setUpHtmlHeight () {
        return new Promise((resolve) => {
          if (process.env.VUE_ENV === 'client') {
            addClass(document.body, 'limited-height')
            addClass(document.documentElement, 'limited-height')
          }
          resolve()
        })
      },
      setUpScrollHandler () {
        return new Promise((resolve) => {
          window.removeEventListener('scroll', this.scrollHandler)
          window.addEventListener('scroll', this.scrollHandler)
          resolve()
        })
      },
      setUpResizeHandler () {
        return new Promise((resolve) => {
          window.removeEventListener('resize', this.updateIsLandscape)
          window.addEventListener('resize', this.updateIsLandscape)
          resolve()
        })
      },
      smoothScroll,
      sideProgressHandler (action, index) {
        return new Promise(() => {
          const _targContainer = document.querySelector('.stick-container')
          if (!_targContainer) { return }
          const _targElement = _targContainer.querySelector(`.stick:nth-child(${index})`)
          if (!_targElement) { return }
          switch (action) {
            case 'pass':
              _targElement.setAttribute('style', `bottom: ${(_targContainer.offsetHeight - (index * 7))}px;`)
              break
            case 'back':
              _targElement.setAttribute('style', `bottom: ${((this.imgArr.length - index + 1) * 7)}px;`)
              break
          }
        })
      },
      stickBottom (index) {
        return {
          bottom: `${((this.imgArr.length - index) * 7)}px`
        }
      },
      toggleDesc () {
        this.descSwitch = !this.descSwitch
        this.descShowDefault = false
      },
      touchEndHandler () {
        document.removeEventListener('touchmove', this.touchMoveHandler)
      },
      touchStartHandler (event) {
        const touches = event.touches

        if (touches && touches.length) {
          this.touchStartY = touches[0].pageY
          document.addEventListener('touchmove', this.touchMoveHandler)
        }
      },
      touchMoveHandler (event) {
        const targ = event.target
        const touches = event.touches

        const creditCommentTopY = this.elmYPosition('.credit-comment')
        const currTop = this.currentYPosition()
        const shouldDo = this.onePageScroll._isDescendant(document.querySelector('.article_body'), targ)
        const timeNow = new Date().getTime()

        if (touches && touches.length) {
          const deltaY = this.touchStartY - touches[0].pageY
          if (deltaY >= 50 && shouldDo && creditCommentTopY > currTop) {
            if (timeNow - this.lastAnimation < this.quietPeriod + 500) {
              event.preventDefault()
              return
            } else {
              this.smoothScroll('.credit-comment')
              this.onePageScroll.pauseToggle()
              this.lastAnimation = timeNow
            }
          }
          // else if (deltaY <= -50 && !shouldDo) {
          // }
        }
      },
      updateProgressbar (percentage) {
        return new Promise(() => {
          const _progressBar = document.querySelector('.progress-bar')
          _progressBar.setAttribute('style', `left: ${percentage}%;`)
        })
      },
      updateIfLandscape () {
        const browser = typeof window !== 'undefined'
        this.ifLandscape = browser && window.innerHeight < window.innerWidth
      }
    },
    mounted () {
      this.updateIfLandscape()
      this.smoothScroll(null, 0)

      Promise.all([
        this.setUpHtmlHeight(),
        this.setUpResizeHandler(),
        this.setUpScrollHandler()
      ])

      if (window === undefined) {
        window.addEventListener('load', () => {
          this.initOnepage()
        })
      } else {
        this.initOnepage()
      }
    },
    beforeRouteLeave (to, from, next) {
      if (process.env.VUE_ENV === 'client') {
        this.creditCommentShow = false
        document.removeEventListener('mousewheel', this.mouseWheelHandler)
        document.removeEventListener('DOMMouseScroll', this.mouseWheelHandler)
        removeClass(document.body, 'limited-height')
        removeClass(document.documentElement, 'limited-height')
      }
      next()
    },
    name: 'ariticle-body-photo',
    props: {
      articleData: {
        default: () => { return {} }
      },
      viewport: {
        default: () => { return {} }
      },
      initFBComment: {
        default: () => {
          return () => {
            console.log('init fb comment')
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .sharebox
    position fixed
    top 0
    left 0
    padding 20px
    z-index 99

    & > div
      display inline-block

      &.mm-icon
        width 48px
        height 48px
        background-image url(/assets/mirrormedia/favicon-48x48.png)
        background-size contain
        background-position center center
        background-repeat no-repeat
        cursor pointer

      &.share-icon
        margin-left 10px

        div
          display inline-block
          position relative

          &.icon
            width 48px
            height 48px
            background-position center center
            background-repeat no-repeat
            background-color #2068b2
            border-radius 48px
            margin-left 10px
            -webkit-transition all .1s ease-out
            transition all .1s ease-out
            cursor pointer

            &.share
              margin-left 0
              background-image url(/assets/mirrormedia/icon/share-white.png)
              background-size 50%
            
            &.facebook
              background-image url(/assets/mirrormedia/icon/facebook_white.png)
              background-size 35%
              -webkit-transition-delay 50ms
              transition-delay 20ms
              
            &.line
              background-image url(/assets/mirrormedia/icon/line_white.png)
              background-size 70%
              background-color #20b22c   
              -webkit-transition-delay 75ms
              transition-delay 40ms

            &.g-plus
              background-image url(/assets/mirrormedia/icon/google-plus.png)
              background-size 70%
              background-color #c00   
              -webkit-transition-delay 75ms
              transition-delay 40ms

            &:active, &:focus, &:hover
              box-shadow inset 0 0 4px rgba(0,0,0,.7), 0 4px 8px rgba(0,0,0,.7)
              
            &:not(:first-child)
              width 48px
              height 48px
              margin-left 0
              opacity 0
              -webkit-transform translateX(0)
                  -ms-transform translateX(0)
                      transform translateX(0)
        &:hover 
          .icon:not(:first-child)
            opacity 1
            -webkit-transform none
                -ms-transform none
                    transform none
            margin-left 10px
  
  .btn-toggle-description
    align-items center
    background-position center center
    background-repeat no-repeat
    background-size contain
    border-radius 5px
    bottom 20px
    color #fff
    cursor pointer
    display flex
    font-size 20px
    left 20px
    justify-content center
    height 40px
    position fixed
    transition all .1s
    z-index 102
    width 40px

    .hint
      font-size 1rem
      width 150px
      position absolute
      top -22px
      left 5px
      color rgba(255, 255, 255, 0.8)
      cursor auto
      display none

    &.on
      background-image url(/assets/mirrormedia/icon/caption-on.png)
      opacity 0.65
      
    &.off
      background-image url(/assets/mirrormedia/icon/caption-off.png)
      
    &.hide
      display none

    &:hover
      background-image url(/assets/mirrormedia/icon/caption-on.png)
      opacity 1

      .hint
        display block
  .progress 
    width 100%
    height 10px

  .progress-wrap 
    position fixed
    top 0
    left 0
    background #5b7d9e
    overflow hidden
    z-index 100
    .progress-bar 
      background rgba(0, 0, 0, 0.7)
      left 0
      position absolute
      top 0
      transition left 1s
  
  .progress-sidebar
    position fixed
    right 10px
    bottom 60px
    height 80vh
    width 35px
    z-index 99

    .stick-container
      position relative
      height 100%
      width 100%

      .stick
        border-top 3px solid rgba(255, 255, 255, 0.5)
        width 100%
        transform rotate(25deg)
        margin 10px auto
        position absolute
        transition bottom 0.5s
        cursor pointer

        &:hover
          border-top 3px solid rgba(255, 255, 255, 1)
  .credit-comment
    width 100vw
    position relative
    padding 5% 0
    background-color rgba(51, 51, 51, 0.83)
    overflow auto
    height auto
    display none
    .credit
      color #fff
      width 900px
      display flex
      height 100px
      vertical-align top
      margin 40px auto
      align-items center
      position relative
      text-shadow 0.9px 0.5px 0 rgba(0, 0, 0, 0.8)
      justify-content flex-start
      a, a:hover, a:link, a:visited
        color #fff
    
    .related-container
      width 900px
      margin 40px auto
    
    .article_fb_comment
      margin 40px auto
      width 900px
      background-color rgb(255, 255, 255)
      padding 1.5rem
    &.show
      display block

  .go-next-page
      position fixed
      width 35px
      height 35px
      bottom 20px
      background-color rgba(218, 218, 218, 0.37)
      background-image url(/assets/mirrormedia/icon/continue.png)
      background-repeat no-repeat
      background-size contain
      background-position center center
      border-radius 10px
      z-index 20
      cursor pointer
      -webkit-transition all .1s
      transition all .1s
      right 10px

      &:hover
        background-color rgba(240, 240, 240, 0.8)
        text-shadow 0.9px 0.5px 0 rgba(0, 0, 0, 0.8)

      &.hidden
        display none

  .article_body
    height 100vh
    > .pic-container
      > .pic-section
        width 100vw
        height 100vh
        overflow hidden
        position relative

        .img
    
          img
            object-fit cover
            max-height 100%
            position absolute
            z-index 0
            height 100vh
            width 100vw
            object-position center center  
    
    .title
      position relative
      span
        position absolute
        height 100vh
        width 100vw
        display flex
        justify-content center
        padding-top 10%
        z-index 10
        background-image linear-gradient(0deg, transparent, rgba(0,0,0,0.5))
        h2
          font-size 2.5rem
          color #fff
          font-weight 300
          text-shadow 0.9px 0.5px 0 rgba(0, 0, 0, 0.8)
          font-family 'Noto Sans TC','STHeitiTC-Light','Microsoft JhengHei',sans-serif

    .brief
      & > div
        position absolute
        z-index 10
        height 20vh
        width 100vw
        display flex
        justify-content flex-start
        align-items center
        flex-direction column
        background-image linear-gradient(180deg,transparent,rgba(0,0,0,0.7))
        bottom 0   

        div
          margin-bottom 20px
          color #d1d1d1
          text-shadow 0.9px 0.5px 0 rgba(0, 0, 0, 0.8)

        span
          width 70%
          color #fff
          text-align left
          word-break break-all
          display flex
          align-items center
          justify-content center
          bottom 0
          line-height 20px
          text-shadow 0.9px 0.5px 0 rgba(0, 0, 0, 0.8)
          font-size 16px

        &.hide
          display none

        &.show
          display flex
      
    

    
  @media (min-width 768px)
    .mobile-only
      display none !important

  @media (max-width 767px) and (min-width 0px)
    .go-next-page
      &.center
        left 50%
        margin-left -20px 
        height 40px
        width 40px
    .credit-comment
      .credit
        padding 0 20px
        width 100%
        display block
      
      .related-container
        width 100%
        margin 0

      .article_fb_comment
        width 100%
        margin 40px auto 0
    .article_body
      > .pic-container
        > .pic-section
          .title
            span
              text-align center
              padding 20px          
              margin-bottom 0!important

          .img
            img:not([class="landscape"])
              object-fit contain
              object-position 0 20%
              background-color #696969
          
          .brief
            & > div
              height 40vh


</style>
