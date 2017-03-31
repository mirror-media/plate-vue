<template>
  <footer class="left">
    <div class="left mobile-hide">
      <div><span><a id="footer-subscribe" href="https://docs.google.com/a/mirrormedia.mg/forms/d/e/1FAIpQLSfrEEGd5Qv160mquHj6H0flpbgliARY0kiLY9WjTYwnV8pBkA/viewform?c=0&w=1">訂閱鏡週刊</a></span></div>
      <div><span><a id="footer-ad" href="https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam">廣告合作</a></span></div>
      <div><span><a id="footer-activity" href="https://www.mirrormedia.mg/category/campaign">活動專區</a></span></div>
      <div><span><a id="footer-download" href="http://hyperurl.co/mmfooter">下載ＡＰＰ</a></span></div>
    </div>
    <div class="follow mobile-hide">
      <a class="item" id="footer-line" :href="SOCIAL_LINK.LINE" ><img src="/public/icon/line@2x.png" class="footer-icon line" /></a>
      <a class="item" id="footer-weibo" :href="SOCIAL_LINK.WEIBO" ><img src="/public/icon/weibo@2x.png" class="footer-icon weibo" /></a>
      <a class="item" id="footer-fb" :href="SOCIAL_LINK.FACEBOOK" ><img src="/public/icon/facebook@2x.png" class="footer-icon facebook" /></a>
      <a class="item" id="footer-ig" :href="SOCIAL_LINK.INSTAGRAM" ><img src="/public/icon/instagram@2x.png" class="footer-icon instagram" /></a>
      <a class="item" id="footer-feed" :href="SOCIAL_LINK.FEED" ><img src="/public/icon/feed@2x.png" class="footer-icon feed" /></a>
      <a class="item" id="footer-email" :href="SOCIAL_LINK.EMAIL" ><img src="/public/icon/mail@2x.png" class="footer-icon mail" /></a>
    </div>
    <div class="mobile-follow mobile-only">
      <a href="https://docs.google.com/a/mirrormedia.mg/forms/d/e/1FAIpQLSfrEEGd5Qv160mquHj6H0flpbgliARY0kiLY9WjTYwnV8pBkA/viewform?c=0&w=1">訂閱鏡週刊</a> - 
      <router-link to="/story/ad1018001">廣告合作</router-link> - 
      <router-link to="/category/campaign">活動專區</router-link>
    </div>
    <div class="share-mobile" :class="ifShowShareBottom" v-if="ifShare">
      <a class="share-mobile_btn" id="share-line"><i class="icon line" @click="shareLine"></i></a>
      <a class="share-mobile_btn" id="share-fb"><i class="icon facebook" @click="shareFacebook"></i></a>
      <a class="share-mobile_btn" id="share-googleplus"><i class="icon google-plus" @click="shareGooglePlus"></i></a>
    </div>
  </footer>
</template>
<script>
  import { SOCIAL_LINK } from '../constants'
  import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
  import { shareGooglePlus, shareLine, shareFacebook } from '../utils/comm'

  export default {
    name: 'footer',
    computed: {
      ifShowShareBottom () {
        return {
          show: (this.scrollDirection !== 'up')
        }
      }
    },
    data () {
      return {
        scrollDirection: 'up',
        SOCIAL_LINK: SOCIAL_LINK
      }
    },
    methods: {
      currentYPosition,
      elmYPosition,
      shareFacebook () {
        shareFacebook({ route: this.$route.path })
      },
      shareLine () {
        shareLine({
          route: this.$route.path,
          title: document.querySelector('meta[property="og:title"]').getAttribute('content')
        })
      },
      shareGooglePlus () {
        shareGooglePlus({ route: this.$route.path })
      },
      smoothScroll
    },
    mounted () {
      window.addEventListener('wheel', (e) => {
        const _derection = e.wheelDelta
        if (_derection <= 0) {
          this.scrollDirection = 'down'
        } else {
          this.scrollDirection = 'up'
        }
      })
      window.addEventListener('touchmove', (e) => {
        const _currTouchClientY = e.touches[ 0 ].clientY
        const _lastTouchClientY = window.touchClientY || _currTouchClientY
        if (_currTouchClientY <= _lastTouchClientY) {
          this.scrollDirection = 'down'
        } else {
          this.scrollDirection = 'up'
        }
        window.touchClientY = _currTouchClientY
      })
    },
    props: {
      ifShare: {
        default: () => { return true }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  footer 
    display flex
    padding-top 15px
    padding-bottom 50px
    justify-content space-between
    margin-top 20px
    border-top 2px solid #000

    .left 
      display flex
      flex 2
      align-items center
      div 
        width 15%
        text-align center
        font-weight bold
      
    
    .follow 
      display flex
      justify-content space-around
      align-items center
      flex 1
      img 
        height 20px
      
  @media (min-width 0px) and (max-width 767px)
    footer
      width 100%
      
      .share-mobile
        display flex
        width 100vw
        height 100%
        position fixed 
        bottom -50px
        left 0
        height 50px
        padding 0
        margin 0
        background-color #064f77
        z-index 99
        transition bottom 0.25s

        &_btn
          height 100%
          flex 1
          cursor pointer

          &:not(:last-child)
            border-right 1px solid #fff

          .icon
            background-position center center
            background-repeat no-repeat
            display block
            width 100%
            height 100%

          .line
            background-image url(/public/icon/line_white.png)
            background-size 30%

          .facebook
            background-image url(/public/icon/facebook_white.png)
            background-size 12%

          .google-plus
            background-image url(/public/icon/google-plus.png)
            background-size 23%

        &.show
          bottom 0

  @media (min-width 768px)
    footer
      .share-mobile
        display none

  @media (min-width 0px) and (max-width 1199px)
    .mobile-hide
      display none!important

    .mobile-follow
      width 100%
      border 1px solid rgba(0, 0, 0, 0.19)
      margin-bottom 20px
      padding 10px 20px
      box-shadow 0 0 10px rgba(0, 0, 0, 0.2)
      font-size 1.2rem
      color rgba(0, 0, 0, 0.4)
      text-align center

      > a 
        &:hover, &:link, &:visited
          color rgba(0, 0, 0, 0.4)

  @media (max-width 1199px)
    footer
      border-top none

      .left
        div
          width 20%
  
</style>
