<template>
  <div class="share-toolbox">
    <div class="item line" @click="shareLine"></div>
    <div class="item facebook" @click="shareFacebook"></div>
  </div>
</template>
<script>
  import { elmYPosition } from 'kc-scroll'
  export default {
    methods: {
      fixToolBox() {
        const header = document.querySelector('.header')
        const article = document.querySelector('.article')
        const shareBox = document.querySelector('.share-toolbox')
        window.addEventListener('scroll', () => {
          if(window.shareBoxLeft && window.shareBoxTop) {
            
          } else {
            window.shareBoxTop = header.offsetTop + header.offsetHeight
            window.shareBoxLeft = article.offsetLeft - shareBox.offsetWidth
            shareBox.setAttribute('style', `left: ${window.shareBoxLeft}px; top: ${window.shareBoxTop}px; display: block; opacity: 1;`)
          }
        })
        window.addEventListener( 'resize',  () => {
          shareBox.removeAttribute('styel')
          window.shareBoxTop = header.offsetTop + header.offsetHeight
          window.shareBoxLeft = article.offsetLeft - shareBox.offsetWidth
          shareBox.setAttribute('style', `left: ${window.shareBoxLeft}px; top: ${window.shareBoxTop}px; display: block; opacity: 1;`)
        })
      },
      shareLine() {
        let _thisTitle = document.querySelector('meta[property="og:title"]').getAttribute('content');
        window.open(`https://line.naver.jp/R/msg/text/?${encodeURIComponent(_thisTitle)}%0D%0A${encodeURIComponent('https://mirrormedia.mg/' + this.$route.path)}`);
      },
      shareFacebook() {
        window.open(`https://www.facebook.com/share.php?u=https://mirrormedia.mg/${this.$route.path}`);
      }
    },
    mounted() {
      this.fixToolBox()
    },
    name: 'share-tools',

  }
</script>
<style lang="stylus" scoped>
  .share-toolbox {
    background-color: #fff;
    position: fixed;
    width: 30px;
    opacity: 0;
    .item {
      width: 100%;
      height: 30px;
      background-color: #989898;
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      cursor: pointer;
      &.line {
        background-image: url(https://mirrormedia.mg//asset/icon/line_white.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 85%;
      }
      &.facebook {
        background-image: url(https://mirrormedia.mg//asset/icon/facebook_white.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 35%;        
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>