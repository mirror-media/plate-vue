<template>
  <section class="articleAsideFixed">
    <div class="fb-page" data-href="https://www.facebook.com/mirrormediamg/" data-small-header="true" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="false">
      <blockquote cite="https://www.facebook.com/mirrormediamg/" class="fb-xfbml-parse-ignore">
        <a href="https://www.facebook.com/mirrormediamg/">鏡週刊</a>
      </blockquote>
    </div>
  </section>
</template>

<script>

import { currentYPosition, elmYPosition } from 'kc-scroll'
import ProjectListVert from './ProjectListVert.vue'

export default {
  name: 'articleAsideFixed',
  components: {
    'project-listVert': ProjectListVert
  },
  props: [ 'projects' ],
  methods: {
    detectFixAside: function (e) {
      const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const asideLatestList = document.querySelector('.latest-list-container')
      const dfpR2 = document.querySelector('.dfp-r2')
      const articleAsideFixed = document.querySelector('.articleAsideFixed')
      const dfpFtTopPosition = elmYPosition('.article_footer')
      const projectBottomPosition = currentYPosition() + articleAsideFixed.offsetHeight + 44
      const deltaY = vh - (elmYPosition('.article_footer') - currentYPosition())
      let dfpR2BottomPosition
      if (dfpR2.offsetHeight === 0) {
        dfpR2BottomPosition = elmYPosition('.latest-list-container') + asideLatestList.offsetHeight
      } else {
        dfpR2BottomPosition = elmYPosition('.dfp-r2') + dfpR2.offsetHeight
      }
      if (currentYPosition() > dfpR2BottomPosition && (projectBottomPosition < dfpFtTopPosition)) {
        articleAsideFixed.classList.add('fixed-top')
      } else {
        articleAsideFixed.classList.remove('fixed-top')
      }
      if (projectBottomPosition > dfpFtTopPosition) {
        articleAsideFixed.style.bottom = `${deltaY + 44}px`
        articleAsideFixed.classList.add('fixed')
      } else {
        articleAsideFixed.classList.remove('fixed')
      }
    }
  },
  created () {
    window.addEventListener('scroll', this.detectFixAside)
  },
  destroyed () {
    window.removeEventListener('scroll', this.detectFixAside)
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
