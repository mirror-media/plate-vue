<template>
  <section class="articleAsideFixed">
    <div class="fb-page" data-href="https://www.facebook.com/mirrormediamg/" data-small-header="true" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="false">
      <blockquote cite="https://www.facebook.com/mirrormediamg/" class="fb-xfbml-parse-ignore">
        <a href="https://www.facebook.com/mirrormediamg/">鏡週刊</a>
      </blockquote>
    </div>
    <project-listVert :initProjects="projects" v-if="abIndicator === 'B'"></project-listVert>
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
  props: [ 'abIndicator', 'projects' ],
  mounted () {
    window.addEventListener('scroll', (e) => {
      const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const dfpR2 = document.querySelector('.dfp-r2')
      const dfpFt = document.querySelector('.dfp-ft')
      const articleAsideFixed = document.querySelector('.articleAsideFixed')
      if (dfpR2 && dfpFt) {
        const dfpR2BottomPosition = elmYPosition('.dfp-r2') + document.querySelector('.dfp-r2').offsetHeight
        const dfpFtTopPosition = elmYPosition('.dfp-ft')
        const projectBottomPosition = currentYPosition() + articleAsideFixed.offsetHeight + 44
        const deltaY = vh - (elmYPosition('.dfp-ft') - currentYPosition())
        if (currentYPosition() > dfpR2BottomPosition && (projectBottomPosition < dfpFtTopPosition)) {
          document.querySelector('.articleAsideFixed').classList.add('fixed-top')
        } else {
          document.querySelector('.articleAsideFixed').classList.remove('fixed-top')
        }
        if (projectBottomPosition > dfpFtTopPosition) {
          document.querySelector('.articleAsideFixed').style.bottom = `${deltaY + 44}px`
          document.querySelector('.articleAsideFixed').classList.add('fixed')
        } else {
          document.querySelector('.articleAsideFixed').classList.remove('fixed')
        }
      }
    })
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
