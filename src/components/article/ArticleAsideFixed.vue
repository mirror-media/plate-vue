<template>
  <section class="articleAsideFixed">
    <slot name="popListVert"></slot>
  </section>
</template>

<script>

import { currentYPosition, elmYPosition } from 'kc-scroll'

export default {
  name: 'ArticleAsideFixed',
  props: {
    projects: Array
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
      const fbPageFixed = document.querySelector('.article_aside_fbPage') || document.querySelector('.article__aside--fbPage')
      const articleAsideFixed = document.querySelector('.articleAsideFixed')
      const article = document.querySelector('.article_main') || document.querySelector('.article__main')
      const articlePos = elmYPosition('.article_main') || elmYPosition('.article__main')
      const articleBottomPosition = articlePos + article.offsetHeight
      const dfpFtTopPosition = elmYPosition('.article_footer') || elmYPosition('.footer')
      const articleAsideBottomPos = currentYPosition() + articleAsideFixed.offsetHeight + 20
      const deltaY = vh - (dfpFtTopPosition - currentYPosition())
      const fbPageBottomPosition = (elmYPosition('.article_aside_fbPage') || elmYPosition('.article__aside--fbPage')) + fbPageFixed.offsetHeight

      if (articleBottomPosition > articleAsideBottomPos) {
        if (currentYPosition() > fbPageBottomPosition && ((articleAsideBottomPos + 20) < dfpFtTopPosition)) {
          articleAsideFixed.classList.add('fixed-top')
        } else {
          articleAsideFixed.classList.remove('fixed-top')
        }
        if (currentYPosition() > fbPageBottomPosition && (articleAsideBottomPos + 20) >= dfpFtTopPosition) {
          articleAsideFixed.style.bottom = `${deltaY + 20}px`
          articleAsideFixed.classList.add('fixed')
        } else {
          articleAsideFixed.classList.remove('fixed')
        }
      }
    }
  }
}

</script>
<style lang="stylus" scoped>
.articleAsideFixed
  width 300px
  margin 15px auto 0
  &.fixed
    position fixed
    right calc((100% - 1160px) / 2 + 55px)
  &.fixed-top
    position fixed
    top 0px
    right calc((100% - 1160px) / 2 + 55px)
</style>
