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

export default {
  name: 'articleAsideFixed',
  mounted () {
    window.addEventListener('scroll', (e) => {
      const dfpR2 = document.querySelector('.dfp-r2')
      if (dfpR2) {
        const dfpR2BottomPosition = elmYPosition('.dfp-r2') + document.querySelector('.dfp-r2').offsetHeight
        if (currentYPosition() > dfpR2BottomPosition) {
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
    top 0px
    right calc((100% - 1160px) / 2 + 55px)
</style>
