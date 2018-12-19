<template>
  <section ref="articleAsideFixed" class="articleAsideFixed">
    <slot name="dfpR2"></slot>
    <slot name="fbPage"></slot>
    <slot name="readrLatest"></slot>
    <slot name="popListVert"></slot>
  </section>
</template>

<script>
import { currentYPosition, elmYPosition } from 'kc-scroll'

export default {
  name: 'ArticleAsideFixed',
  props: {
    projects: {
      type: Array
    }
  },
  mounted () {
    if (document.querySelector('.article__main')) {
      this.$refs.articleAsideFixed.classList.add('external')
    } else {
      this.$refs.articleAsideFixed.classList.remove('external')
    }
    window.addEventListener('scroll', this.$_articleDetectAsideFixed)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.$_articleDetectAsideFixed)
  },
  methods: {
    $_articleDetectAsideFixed: function () {
      // const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const articleAsideFixed = document.querySelector('.articleAsideFixed')
      const articleMain = document.querySelector('.article_main') || document.querySelector('.article__main')
      const articleMainPosBtm = (elmYPosition('.article_main') || elmYPosition('.article__main')) + articleMain.offsetHeight
      const articleAside = document.querySelector('.article_aside') || document.querySelector('.article__aside')
      const articleAsideHeight = articleAside.offsetHeight
      const currPos = currentYPosition()
      let fixedPos
      let fixedPosBtm
      fixedPos = document.querySelector('.article_aside .latest-list-container') || document.querySelector('.article__aside .latest-list-container')
      fixedPosBtm = elmYPosition('.article_aside .latest-list-container') + fixedPos.offsetHeight || elmYPosition('.article__aside .latest-list-container') + fixedPos.offsetHeight

      if (articleMain.offsetHeight > articleAsideHeight) {
        if (currPos > fixedPosBtm && (articleMainPosBtm - currPos - 20) > articleAsideFixed.clientHeight) {
          articleAsideFixed.classList.remove('fixed')
          articleAsideFixed.classList.add('fixed-top')
          articleAsideFixed.style.top = 0
          articleAsideFixed.style.bottom = `auto`
        } else if (articleMainPosBtm - currPos - 20 <= articleAsideFixed.clientHeight) {
          articleAsideFixed.classList.remove('fixed-top')
          articleAsideFixed.classList.add('fixed')
          articleAsideFixed.style.bottom = `20px`
        } else {
          articleAsideFixed.classList.remove('fixed-top')
          articleAsideFixed.classList.remove('fixed')
          articleAsideFixed.style.top = `auto`
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
    margin auto
    &.external
      right calc((100% - 1170px) / 2 + 55px)
  &.fixed-top
    position fixed
    right calc((100% - 1160px) / 2 + 55px)
    margin auto
    &.external
      right calc((100% - 1170px) / 2 + 55px)
</style>
