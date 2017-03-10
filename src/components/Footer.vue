<template>
  <footer>
    <div class="left">
      <div><span><a href="https://docs.google.com/a/mirrormedia.mg/forms/d/e/1FAIpQLSfrEEGd5Qv160mquHj6H0flpbgliARY0kiLY9WjTYwnV8pBkA/viewform?c=0&w=1">訂閱鏡週刊</a></span></div>
      <div><span><a href="https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam">廣告合作</a></span></div>
      <div><span><a href="https://www.mirrormedia.mg/category/campaign">活動專區</a></span></div>
      <div><span><a href="http://hyperurl.co/mmfooter">下載ＡＰＰ</a></span></div>
    </div>
    <div class="share">
      <a class="item" :href="SOCIAL_LINK.LINE" ><img src="https://www.mirrormedia.mg/asset/icon/line@2x.png" class="footer-icon line" /></a>
      <a class="item" :href="SOCIAL_LINK.WEIBO" ><img src="https://www.mirrormedia.mg/asset/icon/weibo@2x.png" class="footer-icon weibo" /></a>
      <a class="item" :href="SOCIAL_LINK.FACEBOOK" ><img src="https://www.mirrormedia.mg/asset/icon/facebook@2x.png" class="footer-icon facebook" /></a>
      <a class="item" :href="SOCIAL_LINK.INSTAGRAM" ><img src="https://www.mirrormedia.mg/asset/icon/instagram@2x.png" class="footer-icon instagram" /></a>
      <a class="item" :href="SOCIAL_LINK.FEED" ><img src="https://www.mirrormedia.mg/asset/icon/feed@2x.png" class="footer-icon feed" /></a>
      <a class="item" :href="SOCIAL_LINK.EMAIL" ><img src="https://www.mirrormedia.mg/asset/icon/mail@2x.png" class="footer-icon mail" /></a>
    </div>
  </footer>
</template>
<script>
  import { SOCIAL_LINK } from '../constants'
  export default {
    name: 'footer',
    data() {
      return {
        SOCIAL_LINK: SOCIAL_LINK
      }
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
      
  @media (max-width 1199px)
    footer
      .left
        div
          width 20%
  
</style>
