<template>
  <div class="article_body">
    <div class="sharebox">
      <div class="mm-icon" @click="goHome"></div>
      <div class="share-icon">
        <div class="icon share"></div>
        <div class="icon facebook" @click="shareFacebook"></div>
        <div class="icon line" @click="shareLine"></div>
      </div>
    </div>
    <section class="pic-section">
      <div class="title">
        <span><h2 v-text="title"></h2></span>
      </div>
      <div class="brief">
        <div class="hidden">
          <div v-text="heroCaption"></div>
          <span v-text="getValue(brief, [ 'apiData', 0, 'content', 0 ], '')"></span>
        </div>
      </div>
      <div class="img">
        <img :src="getValue(heroImg, [ 'image', 'url' ])"
              :srcset="`${getValue(heroImg, [ 'image', 'resizedTargets', 'mobile', 'url' ])} 800w,
                        ${getValue(heroImg, [ 'image', 'resizedTargets', 'tablet', 'url' ])} 1200w,
                        ${getValue(heroImg, [ 'image', 'resizedTargets', 'desktop', 'url' ])} 2000w`" />
      </div>
    </section>
    <section class="pic-section" v-for="(o, i) in contentArr" v-if="getValue(o, [ 'type' ], '') === 'image'">
      <div class="brief">
        <div class="hidden">
          <span v-text="getValue(o, [ 'content', 0, 'description' ], '')"></span>
        </div>
      </div>
      <div class="img">
        <img :src="getValue(o, [ 'content', 0, 'url' ])"
              :srcset="`${getValue(o, [ 'content', 0, 'mobile', 'url' ])} 800w,
                        ${getValue(o, [ 'content', 0, 'tablet', 'url' ])} 1200w,
                        ${getValue(o, [ 'content', 0, 'desktop', 'url' ])} 2000w`" />      
      </div>
    </section>
    <section class="pic-section latest">
      <div class="credit" v-html="credit"></div>
      <related-list-thumbnail :relatedList="relatedList"/>
      <div class="article_fb_comment">
        <div class="fb-comments" v-bind:data-href="articleUrl" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>
      </div>
    </section>
    <div class="go-next-page" @click="goNextPage"></div>
    <div class="btn-toggle-description" @click="toggleDesc">！</div>
    <div class="progress-wrap progress" data-progress-percent="25">
      <div class="progress-bar progress"></div>
    </div>
  </div>
</template>
<script>
  import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
  import { getValue } from '../../utils/comm'
  import _ from 'lodash'
  import RelatedListWithThumbnail from './RelatedListWithThumbnail.vue'

  export default {
    components: {
      'related-list-thumbnail': RelatedListWithThumbnail
    },
    computed: {
      articleUrl() {
        const { slug } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return `https://www.mirrormedia.mg/story/${slug}`
      },
      brief() {
        const { brief } = this.articleData
        return brief
      },
      contentArr() {
        const { apiData } = _.get(this.articleData, [ 'content' ], [])
        return apiData
      },
      credit() {
        const { cameraMan, designers, engineers, photographers, writers } = this.articleData
        const creditWriterStr = (writers.length > 0) ? '文｜' + writers.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditPhotoStr = (photographers.length > 0) ? '攝影｜' + photographers.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditDesignStr = (designers.length > 0) ? '設計｜' + designers.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditEnginStr = (engineers.length > 0) ? '工程｜' + engineers.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        const creditCamStr = (cameraMan.length > 0) ? '影音｜' + cameraMan.map((o) => (`<a class=\"white\" href=\"/author/${o.id}/${o.name}\">${o.name}</a>`)).join('&nbsp;') : ''
        return [ creditWriterStr, creditPhotoStr, creditDesignStr, creditEnginStr, creditCamStr ].filter((o) => (o.length > 0)).join('&nbsp;&nbsp;&nbsp;&nbsp;')
      },
      heroCaption() {
        const { heroCaption } = this.articleData
        return heroCaption        
      },
      heroImg() {
        const { heroImage } = this.articleData
        return heroImage
      },
      relatedList() {
        const { relateds } = this.articleData
        return relateds
      },
      sectionsInfo() {
        const _htmlHeight = document.documentElement.clientHeight
        const _sectArr = document.querySelectorAll('section.pic-section')
        let _sectInfo = []
        _.map(_sectArr, (elem, index) => {
          const _eleTop = this.elmYPosition(`section.pic-section:nth-child(${(index + 1)})`)
          const _eleBtm = _eleTop + _htmlHeight
          const _selector = `section.pic-section:nth-child(${(index + 1)})`
          _sectInfo.push({ _selector, _eleTop, _eleBtm })
        })
        return _sectInfo
      },
      sectCount() {
        return document.querySelectorAll('section.pic-section').length
      },
      title() {
        const { title } = this.articleData
        return title
      }
    },
    data() {
      return {
        descSwitch: false,
        scrollingFlag: false,
        sectIndex: 2,
      }
    },
    methods: {
      currentYPosition,
      disableScroll() {
        if (window.addEventListener) // older FF
          window.addEventListener('DOMMouseScroll', this.preventDefault, false)
        window.onwheel = this.preventDefault // modern standard
        window.onmousewheel = document.onmousewheel = this.preventDefault // older browsers, IE
        window.ontouchmove  = this.preventDefault // mobile
        document.onkeydown  = this.preventDefaultForScrollKeys
      },
      elmYPosition,
      enableScroll() {
          if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', this.preventDefault, false)
          window.onmousewheel = document.onmousewheel = null; 
          window.onwheel = null; 
          window.ontouchmove = null;  
          document.onkeydown = null;  
      },
      getValue,
      goNextPage() {
        this.sectIndex = (this.sectIndex < this.sectCount + 1) ? this.sectIndex + 1 : this.sectIndex
        this.smoothScroll(`section.pic-section:nth-child(${this.sectIndex})`)
      },
      goHome() {
        window.location.href = '/'
      },      
      keys() {
        return {37: 1, 38: 1, 39: 1, 40: 1}
      },
      preventDefault(e) {
        e = e || window.event
        if (e.preventDefault)
          e.preventDefault()
        e.returnValue = false
      },
      preventDefaultForScrollKeys(e) {
        // doesn't work
        if (this.keys[e.keyCode]) {
          this.preventDefault(e)
          return false
        }
      },
      smoothScroll,
      scrollOnePage() {
        window.addEventListener('wheel', (e) => {
          const _derection = e.wheelDelta
          const _htmlHeight = document.documentElement.clientHeight
          const _lastDelta = window.wheelDelta
          let _currTop = 0
          let _targEle = 0
          if(_derection < 0) {
            if(!this.scrollingFlag && Math.abs(_derection) > 3) {
              this.sectIndex = (this.sectIndex < this.sectCount + 1) ? this.sectIndex + 1 : this.sectIndex
            }
          } else {
            if(!this.scrollingFlag && Math.abs(_derection) > 3) {
              this.sectIndex = (this.sectIndex > 2) ? this.sectIndex - 1 : this.sectIndex
            }
          }
          _currTop = this.currentYPosition()
          _targEle = this.elmYPosition(`section.pic-section:nth-child(${this.sectIndex})`)              
          if(!this.scrollingFlag && Math.abs(_derection) > 3 && _currTop != _targEle) {
            this.scrollingFlag = true
            this.smoothScroll(`section.pic-section:nth-child(${this.sectIndex})`)
          } else if((Math.abs(_derection) <= 3 && _currTop === _targEle)) {
            this.scrollingFlag = false
          }

          if(this.sectIndex >= (this.sectCount + 1) && _currTop >= _targEle) {
            this.enableScroll()
          } else if(Math.abs(_derection) <= 3 && this.sectIndex >= (this.sectCount + 1) && _currTop < _targEle) {
            this.scrollingFlag = false
          } else {
            
            this.disableScroll()
          }
          window.wheelDelta = _derection

        })
        window.addEventListener('scroll', () => {
          this.updateProgressbar(((this.sectIndex - 1) * 100)/this.sectCount)
          if(((this.sectIndex - 1) * 100)/this.sectCount >= 100) {
            document.querySelector('.go-next-page').setAttribute('style', 'display: none;')
            document.querySelector('.btn-toggle-description').setAttribute('style', 'display: none;')
          } else {
            document.querySelector('.go-next-page').removeAttribute('style')
            document.querySelector('.btn-toggle-description').removeAttribute('style')
          }

        })
      },
      shareLine() {
        let _thisTitle = document.querySelector('meta[property="og:title"]').getAttribute('content');
        window.open(`https://line.naver.jp/R/msg/text/?${encodeURIComponent(_thisTitle)}%0D%0A${encodeURIComponent('https://mirrormedia.mg/' + this.$route.path)}`);
      },
      shareFacebook() {
        window.open(`https://www.facebook.com/share.php?u=https://mirrormedia.mg/${this.$route.path}`);
      },
      toggleDesc() {
        const _briefArr = document.querySelectorAll('.brief')
        this.descSwitch = (this.descSwitch) ? false : true
        if(!this.descSwitch) {
          _.map(_briefArr, (o) => {
            o.children[ 0 ].setAttribute('class', 'hidden')
          })
        } else {
          _.map(_briefArr, (o) => {
            o.children[ 0 ].removeAttribute('class')
          })
        }
      },
      updateIndex() {
        
      },
      updateProgressbar(percentage){
        const _progressBar = document.querySelector('.progress-bar')
        _progressBar.setAttribute('style', `left: ${percentage}%;`)
      },
    },
    mounted() {
      this.disableScroll()
      this.scrollOnePage()
      this.updateIndex()
    },
    name: 'ariticle-body-photo',
    props: {
      articleData: {
        default: () => { return {} }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .article_body
    /*width 100%*/
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
        &.hidden
          display none
      
    .go-next-page
      position fixed
      width 40px
      height 40px
      bottom 20px
      background-color rgba(218, 218, 218, 0.37)
      background-image url(/public/icon/continue.png)
      background-repeat no-repeat
      background-size contain
      background-position center center
      left 50%
      margin-left -20px
      border-radius 40px
      z-index 20
      cursor pointer
      -webkit-transition all .1s
      transition all .1s
      &:hover
        background-color rgba(218, 218, 218, 0.8)
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
        -webkit-transition left 1s
        transition left 1s
    .btn-toggle-description
      position fixed
      bottom 0
      left 0
      bottom 20px
      left 20px
      width 30px
      height 30px
      color #fff
      background-color rgba(218, 218, 218, 0.37)
      font-size 20px
      border-radius 5px
      display flex
      justify-content center
      align-items center
      z-index 102
      cursor pointer
      -webkit-transition all .1s
      transition all .1s
      &:hover
        background-color rgba(218, 218, 218, 0.8)
        text-shadow 0.9px 0.5px 0 rgba(0, 0, 0, 0.8)

</style>