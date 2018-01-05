<template>
  <section class="articleAsideFixed">
    <slot name="dfpR2"></slot>
    <slot name="fbPage"></slot>
    <slot name="popListVert"></slot>
  </section>
</template>

<script>

import { currentYPosition, elmYPosition } from 'kc-scroll'

export default {
  name: 'ArticleAsideFixed',
  props: {
    abIndicator: {
      type: String,
      default: 'A'
    },
    projects: {
      type: Array
    }
  },
  mounted () {
    window.addEventListener('scroll', this.$_articleDetectAsideFixed)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.$_articleDetectAsideFixed)
  },
  methods: {
    $_articleDetectAsideFixed: function (e) {
      const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const articleAsideFixed = document.querySelector('.articleAsideFixed')
      const articleMain = document.querySelector('.article_main') || document.querySelector('.article__main')
      const articleMainPosBtm = (elmYPosition('.article_main') || elmYPosition('.article__main')) + articleMain.offsetHeight
      const articleAside = document.querySelector('.article_aside') || document.querySelector('.article__aside')
      const articleAsideHeight = articleAside.offsetHeight
      const popListVert = document.querySelector('.popListVert').offsetHeight
      const deltaHeightBtwAsideWindow = popListVert - vh
      let fixedPos
      let fixedPosBtm
      if (this.abIndicator === 'B') {
        fixedPos = document.querySelector('.article_aside .latest-list-container') || document.querySelector('.article__aside .latest-list-container')
        fixedPosBtm = elmYPosition('.article_aside .latest-list-container') + fixedPos.offsetHeight || elmYPosition('.article__aside .latest-list-container') + fixedPos.offsetHeight
      } else {
        fixedPos = document.querySelector('.article_aside_fbPage') || document.querySelector('.article__aside--fbPage')
        fixedPosBtm = elmYPosition('.article_aside_fbPage') + fixedPos.offsetHeight || elmYPosition('.article__aside--fbPage') + fixedPos.offsetHeight
      }
      if (articleMain.offsetHeight > articleAsideHeight) {
        if (currentYPosition() > fixedPosBtm && (currentYPosition() + vh) <= articleMainPosBtm) {
          articleAsideFixed.classList.add('fixed-top')
          articleAsideFixed.style.top = `0px`
          if (articleMainPosBtm - (currentYPosition() + vh) < deltaHeightBtwAsideWindow) {
            articleAsideFixed.style.top = `-${deltaHeightBtwAsideWindow - (articleMainPosBtm - (currentYPosition() + vh))}px`
          }
        } else {
          articleAsideFixed.classList.remove('fixed-top')
        }
        if ((currentYPosition() + vh) > articleMainPosBtm) {
          let fixValue
          if (popListVert > vh) {
            fixValue = 0
            if (document.querySelector('main .footer')) {
              fixValue = document.querySelector('main .footer').offsetHeight
            }
            articleAsideFixed.classList.add('fixed')
            articleAsideFixed.style.bottom = `${fixValue}px`
          } else {
            fixValue = 20
            if (document.querySelector('main .footer')) {
              fixValue = document.querySelector('main .footer').offsetHeight
            }
            articleAsideFixed.classList.add('fixed')
            articleAsideFixed.style.bottom = `${fixValue}px`
          }
        } else {
          articleAsideFixed.classList.remove('fixed')
          articleAsideFixed.style.bottom = `auto`
        }
      }
    }
  }
}

</script>
<style lang="stylus" scoped>
.articleAsideFixed
  width 300px
  margin 15px auto 20px
  &.fixed
    position absolute
    top auto !important
    right calc((100% - 1160px) / 2 + 55px)
  &.fixed-top
    position fixed
    right calc((100% - 1160px) / 2 + 55px)
</style>
