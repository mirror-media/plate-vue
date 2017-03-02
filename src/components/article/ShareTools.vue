<template>
  <div class="share-toolbox">
    <div class="item mm-icon" @click="goHome"></div>
    <div class="item line" @click="shareLine"></div>
    <div class="item facebook" @click="shareFacebook"></div>
  </div>
</template>
<script>
  import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
  export default {
    methods: {
      fixToolBox() {
        const article = document.querySelector('.article')
        const header = document.querySelector('.header')
        const headerLogo = document.querySelector('.header-logoSearch')
        const shareBox = document.querySelector('.share-toolbox')
        const sbLoo = document.querySelector('.share-toolbox .mm-icon')
        window.addEventListener('scroll', () => {
          const currTop = currentYPosition()
          const headerLogoBtm = elmYPosition('.header-logoSearch') + headerLogo.clientHeight
          if(currTop > headerLogoBtm) {
            sbLoo.setAttribute('class', 'item mm-icon active')
          } else {
            sbLoo.setAttribute('class', 'item mm-icon')            
          }
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
      goHome() {
        window.location.href = '/'
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
        background-image: url(/public/icon/line_white.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 85%;
      }
      &.facebook {
        background-image: url(/public/icon/facebook_white.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 35%;        
      }
      &.mm-icon {
        background-image: url(/public/icon/mirrorlogo-2017.jpg);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;   
        -webkit-transition: height 0.25s, opacity 0.25s; /* For Safari 3.1 to 6.0 */
        transition: height 0.25s, opacity 0.25s;
        height: 0;
        opacity: 0;
        border-bottom: none;
        &.active {
          height: 30px;
          opacity: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        } 
      }
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background-color: #064f77;
      }
    }
  }
</style>