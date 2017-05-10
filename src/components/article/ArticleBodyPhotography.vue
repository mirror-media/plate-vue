<template>
  <div class="article_body">
    <div class="sharebox">
      <div class="mm-icon" @click="goHome"></div>
      <div class="share-icon">
        <div class="icon share"></div>
        <div class="icon facebook" @click="shareFacebook"></div>
        <div class="icon line" @click="shareLine"></div>
        <div class="icon g-plus" @click="shareGooglePlus"></div>
      </div>
    </div>
    <section class="pic-section">
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
    <section class="pic-section latest">
      <div class="credit" v-html="credit"></div>
      <related-list-thumbnail :relatedList="relatedList"/>
      <slot name="slot_dfpFT"></slot>
      <slot name="slot_fb_comment"></slot>
    </section>
    <div class="go-next-page" @click="goNextPage" :class="goNextPageClass"></div>
    <div class="btn-toggle-description" :class="switchStatus" @click="toggleDesc">
      <div class="hint">開啟／關閉圖說</div>
    </div>
    <div class="progress-wrap progress mobile-only" data-progress-percent="25">
      <div class="progress-bar progress"></div>
    </div>
    <div class="progress-sidebar desktop-only" v-if="ifRenderProgressSidebar">
      <div class="stick-container">
        <div class="stick" v-for="(o, i) in imgArr" :style="stickBottom(i)" :class="{ 'passed' : stickflag[i] }" :index="i" @click="goPage"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
  import { getValue } from '../../utils/comm'
  import { shareGooglePlus, shareLine, shareFacebook } from '../../utils/comm'
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
        const { cameraMan, designers, engineers, photographers, writers } = this.articleData
        const creditWriterStr = (writers.length > 0) ? '文｜' + writers.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditPhotoStr = (photographers.length > 0) ? '攝影｜' + photographers.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditDesignStr = (designers.length > 0) ? '設計｜' + designers.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditEnginStr = (engineers.length > 0) ? '工程｜' + engineers.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditCamStr = (cameraMan.length > 0) ? '影音｜' + cameraMan.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        return [ creditWriterStr, creditPhotoStr, creditDesignStr, creditEnginStr, creditCamStr ].filter((o) => (o.length > 0)).join('&nbsp;&nbsp;&nbsp;&nbsp;')
      },
      goNextPageClass () {
        return {
          center: (this.viewport < 768 && !this.ifLandscape)
        }
      },
      heroCaption () {
        const { heroCaption } = this.articleData
        return heroCaption
      },
      heroImg () {
        const { heroImage } = this.articleData
        return heroImage
      },
      landscapeClass () {
        return {
          landscape: this.ifLandscape
        }
      },
      ifRenderProgressSidebar () {
        return (this.viewport > 1200)
      },
      imgArr () {
        return _.filter(this.contentArr, { type: 'image' })
      },
      relatedList () {
        const { relateds } = this.articleData
        return relateds
      },
      sectionsInfo () {
        const _htmlHeight = document.documentElement.clientHeight
        const _sectArr = document.querySelectorAll('section.pic-section')
        const _sectInfo = []
        _.map(_sectArr, (elem, index) => {
          const _eleTop = this.elmYPosition(`section.pic-section:nth-child(${(index + 1)})`)
          const _eleBtm = _eleTop + _htmlHeight
          const _selector = `section.pic-section:nth-child(${(index + 1)})`
          _sectInfo.push({ _selector, _eleTop, _eleBtm })
        })
        return _sectInfo
      },
      sectCount () {
        return document.querySelectorAll('section.pic-section').length
      },
      switchStatus () {
        return {
          on: this.descSwitch,
          off: !this.descSwitch,
          hide: !this.ifLandscape
        }
      },
      title () {
        const { title } = this.articleData
        return title
      }
    },
    data () {
      return {
        descSwitch: false,
        ifLandscape: false,
        scrollingFlag: false,
        sectIndex: 2,
        stickflag: []
      }
    },
    methods: {
      currentYPosition,
      disableScroll () {
        if (window.addEventListener) { // older FF
          window.addEventListener('DOMMouseScroll', this.preventDefault, false)
        }
        window.onwheel = this.preventDefault // modern standard
        window.onmousewheel = document.onmousewheel = this.preventDefault // older browsers, IE
        window.ontouchmove = this.preventDefault // mobile
        document.onkeydown = this.preventDefaultForScrollKeys
      },
      elmYPosition,
      enableScroll () {
        if (window.removeEventListener) {
          window.removeEventListener('DOMMouseScroll', this.preventDefault, false)
        }
        window.onmousewheel = document.onmousewheel = null
        window.onwheel = null
        window.ontouchmove = null
        document.onkeydown = null
      },
      getValue,
      goNextPage () {
        this.sectIndex = (this.sectIndex < this.sectCount + 1) ? this.sectIndex + 1 : this.sectIndex
        this.scrollingFlag = true
        this.smoothScroll(`section.pic-section:nth-child(${this.sectIndex})`)
      },
      goHome () {
        window.location.href = '/'
      },
      goPage (e) {
        const targIndex = Number(e.target.getAttribute('index')) + 2
        if (this.sectIndex < targIndex) {
          for (let i = this.sectIndex - 1; i < targIndex; i++) {
            this.sideProgressHandler('pass', i)
          }
        } else {
          for (let i = targIndex - 1; i < this.sectIndex; i++) {
            this.sideProgressHandler('back', i)
          }
        }
        this.sectIndex = targIndex
        this.smoothScroll(`section.pic-section:nth-child(${(targIndex)})`)
        this.scrollingFlag = false
      },
      keys () {
        return { 37: 1, 38: 1, 39: 1, 40: 1 }
      },
      preventDefault (e) {
        e = e || window.event
        if (e.preventDefault) {
          e.preventDefault()
        }
        e.returnValue = false
      },
      preventDefaultForScrollKeys (e) {
        // doesn't work
        if (this.keys[e.keyCode]) {
          this.preventDefault(e)
          return false
        }
      },
      smoothScroll,
      scrollOnePage () {
        window.addEventListener('wheel', (e) => {
          const _derection = e.wheelDelta
          if (!this.scrollingFlag && _derection < 0) {
            if ((this.sectIndex >= this.sectCount + 1)) {
              this.enableScroll()
              return
            }
            this.sectIndex = (this.sectIndex < this.sectCount + 1) ? this.sectIndex + 1 : this.sectIndex
            this.sideProgressHandler('pass', (this.sectIndex - 2))
            this.stickflagF = true
            this.scrollingFlag = true
            this.smoothScroll(`section.pic-section:nth-child(${this.sectIndex})`)
          } else if (!this.scrollingFlag && _derection > 0) {
            if ((this.sectIndex <= 2)) {
              return
            }
            this.sectIndex = (this.sectIndex > 2) ? this.sectIndex - 1 : this.sectIndex
            this.sideProgressHandler('back', (this.sectIndex))
            this.scrollingFlag = true
            this.smoothScroll(`section.pic-section:nth-child(${this.sectIndex})`)
          }
        })
        window.addEventListener('touchmove', (e) => {
          const _currTouchClientY = e.touches[ 0 ].clientY
          const _lastTouchClientY = window.touchClientY || _currTouchClientY
          if (!this.scrollingFlag && _currTouchClientY < _lastTouchClientY) {
            if ((this.sectIndex >= this.sectCount + 1)) {
              this.enableScroll()
              return
            }
            this.sectIndex = (this.sectIndex < this.sectCount + 1) ? this.sectIndex + 1 : this.sectIndex
            this.scrollingFlag = true
            this.smoothScroll(`section.pic-section:nth-child(${this.sectIndex})`)
          } else if (!this.scrollingFlag && _currTouchClientY > _lastTouchClientY) {
            if ((this.sectIndex <= 2)) {
              return
            }
            this.sectIndex = (this.sectIndex > 2) ? this.sectIndex - 1 : this.sectIndex
            this.scrollingFlag = true
            this.smoothScroll(`section.pic-section:nth-child(${this.sectIndex})`)
          }
          window.touchClientY = _currTouchClientY
          setTimeout(() => {
            window.touchClientY = undefined
          }, 200)
        })
        window.addEventListener('scroll', (e) => {
          const currTop = this.currentYPosition()
          const _targEle = this.elmYPosition(`section.pic-section:nth-child(${this.sectIndex})`)
          if ((this.sectIndex >= this.sectCount + 1 && currTop >= _targEle)) {
            this.enableScroll()
            this.scrollingFlag = false
            return
          } else {
            this.disableScroll()
            if (this.scrollingFlag && currTop === _targEle) {
              setTimeout(() => {
                this.scrollingFlag = false
                window.currTop = _targEle
              }, 1000)
              return
            }
          }
          window.currTop = currTop

          this.updateProgressbar(((this.sectIndex - 1) * 100) / this.sectCount)
          if (((this.sectIndex - 1) * 100) / this.sectCount >= 100) {
            document.querySelector('.go-next-page').setAttribute('style', 'display: none;')
            document.querySelector('.btn-toggle-description').setAttribute('style', 'display: none;')
          } else {
            document.querySelector('.go-next-page').removeAttribute('style')
            document.querySelector('.btn-toggle-description').removeAttribute('style')
          }
        })
      },
      shareGooglePlus () {
        shareGooglePlus({ route: this.$route.path })
      },
      shareLine () {
        shareLine({
          route: this.$route.path,
          title: document.querySelector('meta[property="og:title"]').getAttribute('content')
        })
      },
      shareFacebook () {
        shareFacebook({ route: this.$route.path })
      },
      sideProgressHandler (action, index) {
        const _targElement = document.querySelector(`.stick:nth-child(${index})`)
        const _targContainer = document.querySelector('.stick-container')
        if (!_targElement) { return }
        switch (action) {
          case 'pass':
            _targElement.setAttribute('style', `bottom: ${(_targContainer.offsetHeight - (index * 7))}px;`)
            break
          case 'back':
            _targElement.setAttribute('style', `bottom: ${((this.imgArr.length - index) * 7)}px;`)
            break
        }
      },
      stickBottom (index) {
        return {
          bottom: `${((this.imgArr.length - index) * 7)}px`
        }
      },
      toggleDesc () {
        this.descSwitch = !this.descSwitch
      },
      updateProgressbar (percentage) {
        const _progressBar = document.querySelector('.progress-bar')
        _progressBar.setAttribute('style', `left: ${percentage}%;`)
      },
      updateIfLandscape () {
        const browser = typeof window !== 'undefined'
        this.ifLandscape = browser && window.innerHeight < window.innerWidth
      }
    },
    mounted () {
      this.disableScroll()
      this.scrollOnePage()
      this.updateIfLandscape()

      window.addEventListener('resize', () => {
        this.updateIfLandscape()
      })
    },
    name: 'ariticle-body-photo',
    props: {
      articleData: {
        default: () => { return {} }
      },
      viewport: {
        default: () => { return {} }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .article_body
    .pic-section
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
          background-image url(/public/favicon-48x48.png)
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
                background-image url(/public/icon/share-white.png)
                background-size 50%
              
              &.facebook
                background-image url(/public/icon/facebook_white.png)
                background-size 35%
                -webkit-transition-delay 50ms
                transition-delay 20ms
                
              &.line
                background-image url(/public/icon/line_white.png)
                background-size 70%
                background-color #20b22c   
                -webkit-transition-delay 75ms
                transition-delay 40ms

              &.g-plus
                background-image url(/public/icon/google-plus.png)
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
      
    .go-next-page
      position fixed
      width 35px
      height 35px
      bottom 20px
      background-color rgba(218, 218, 218, 0.37)
      background-image url(/public/icon/continue.png)
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

    .latest
      padding 5% 0
      background-color rgba(51, 51, 51, 0.83)
      overflow auto
      height auto
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
        background-image url(/public/icon/caption-on.png)
        
      &.off
        background-image url(/public/icon/caption-off.png)
      
      &.hide
        display none

      &:hover
        background-image url(/public/icon/caption-on.png)

        .hint
          display block

  @media (min-width 768px)
    .mobile-only
      display none !important

  @media (max-width 767px) and (min-width 0px)
    .article_body
      .pic-section
        .title
          span
            text-align center
            padding 20px
        
        &.latest
          .credit
            padding 0 20px
            width 100%
          
          .related-container
            width 100%
            margin 0

          .article_fb_comment
            width 100%
            margin 40px auto 0
            margin-bottom 0!important


        &:not(:nth-child(2))
          .img
            img:not([class="landscape"])
              object-fit contain
              object-position 0 20%
              background-color #696969
        
        .brief
          & > div
            height 40vh

      .go-next-page
        &.center
          left 50%
          margin-left -20px 
          height 40px
          width 40px
</style>
