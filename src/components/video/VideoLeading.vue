<template>
  <section class="video-leading">
    <slot name="LPCHD"></slot>
    <slot name="LMBHD"></slot>
    <OathPlayer :combinedId="combinedId" :playerId="playerId" :scriptSrc="scriptSrc" class="video-leading__player"></OathPlayer>
  </section>
</template>
<script>

import OathPlayer from './OathPlayer.vue'
import { OATH_COPMANY_ID, OATH_PLAYER_LIST } from '../../constants'

export default {
  name: 'VideoLeading',
  components: {
    OathPlayer
  },
  computed: {
    combinedId () {
      return `${this.playerId}${OATH_COPMANY_ID}`
    },
    playerId () {
      const path = this.$route.fullPath
      const type = this.$store.state.viewport.width > 768 ? 'desktop' : 'mobile'
      if (path.match(/\/section\//)) {
        return OATH_PLAYER_LIST.section[type]
      } else if (path.match(/\/category\//)) {
        const categoryName = path.split('/')[2]
        return OATH_PLAYER_LIST.category[categoryName][type]
      }
    },
    scriptSrc () {
      return `//delivery.vidible.tv/jsonp/pid=${this.playerId}/${OATH_COPMANY_ID}.js`
    }
  },
}
</script>
<style lang="stylus" scoped>
.video-leading
  text-align center
  background-color #000

@media (min-width: 1200px)
  .video-leading
    min-height 576px
    padding-top 0
    &__player
      width 1024px
      padding-top calc(1024px * 0.5625) !important
      margin 0 auto
</style>
