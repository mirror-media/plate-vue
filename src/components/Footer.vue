<template>
  <footer :class="ifShowShareBottom">
    <div class="left mobile-hide">
      <div><span><a href="https://docs.google.com/a/mirrormedia.mg/forms/d/e/1FAIpQLSfrEEGd5Qv160mquHj6H0flpbgliARY0kiLY9WjTYwnV8pBkA/viewform?c=0&w=1">訂閱鏡週刊</a></span></div>
      <div><span><a href="https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam">廣告合作</a></span></div>
      <div><span><a href="https://www.mirrormedia.mg/category/campaign">活動專區</a></span></div>
      <div><span><a href="http://hyperurl.co/mmfooter">下載ＡＰＰ</a></span></div>
    </div>
    <div class="share mobile-hide">
      <a class="item" :href="SOCIAL_LINK.LINE" ><img src="https://www.mirrormedia.mg/asset/icon/line@2x.png" class="footer-icon line" /></a>
      <a class="item" :href="SOCIAL_LINK.WEIBO" ><img src="https://www.mirrormedia.mg/asset/icon/weibo@2x.png" class="footer-icon weibo" /></a>
      <a class="item" :href="SOCIAL_LINK.FACEBOOK" ><img src="https://www.mirrormedia.mg/asset/icon/facebook@2x.png" class="footer-icon facebook" /></a>
      <a class="item" :href="SOCIAL_LINK.INSTAGRAM" ><img src="https://www.mirrormedia.mg/asset/icon/instagram@2x.png" class="footer-icon instagram" /></a>
      <a class="item" :href="SOCIAL_LINK.FEED" ><img src="https://www.mirrormedia.mg/asset/icon/feed@2x.png" class="footer-icon feed" /></a>
      <a class="item" :href="SOCIAL_LINK.EMAIL" ><img src="https://www.mirrormedia.mg/asset/icon/mail@2x.png" class="footer-icon mail" /></a>
    </div>
    <div class="share-mobile mobile-only">
      <div class="share-mobile_btn"><i class="icon line" @click="shareLine"></i></div>
      <div class="share-mobile_btn"><i class="icon facebook" @click="shareFacebook"></i></div>
      <div class="share-mobile_btn"><i class="icon google-plus" @click="shareGooglePlus"></i></div>
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
      ifShowShareBottom() {
        return {
          show: (this.scrollDirection !== 'up') ? true : false
        }
      }
    },
    data() {
      return {
        scrollDirection: 'up',
        SOCIAL_LINK: SOCIAL_LINK
      }
    },
    methods: {
      currentYPosition, 
      elmYPosition, 
      shareFacebook() {
        shareFacebook({ route: this.$route.path })
      },
      shareLine() {
        shareLine({ 
          route: this.$route.path,
          title: document.querySelector('meta[property="og:title"]').getAttribute('content')
        })
      },
      shareGooglePlus() {
        shareGooglePlus({ route: this.$route.path })
      },
      smoothScroll,
    },
    mounted() {
      window.addEventListener('scroll', () => {
        const lastTop = window.currTopForShareBottom || 0
        const currTop = currentYPosition()
        if(currTop > lastTop) {
          this.scrollDirection = 'down'
        } else {
          this.scrollDirection = 'up'
        }
        window.currTopForShareBottom = currTop
      })
    }
  }
</script>
<style lang="stylus" scoped>
  footer 
    display flex
    border-top 2px solid #000
    padding-top 15px
    padding-bottom 50px
    justify-content space-between
    margin-top 20px

    .left 
      display flex
      flex 2
      align-items center
      div 
        width 15%
        text-align center
        font-weight bold
      
    
    .share 
      display flex
      justify-content space-around
      align-items center
      flex 1
      img 
        height 20px
      
  @media (min-width 0px) and (max-width 767px)
    footer
      position fixed
      bottom -50px
      left 0
      height 50px
      width 100vw
      padding 0
      margin 0
      background-color #064f77
      z-index 99
      transition bottom 0.25s
      border-top none

      .share-mobile
        display flex
        width 100%
        height 100%

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

  @media (max-width 1199px)
    footer
      .left
        div
          width 20%
  
</style>
