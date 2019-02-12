<template>
  <section class="video-leading">
    <OathPlayer :playerId="playerId" :playlistId="playlistId" class="video-leading__player"></OathPlayer>
    <slot name="LPCHD"></slot>
    <slot name="LMBHD"></slot>
  </section>
</template>
<script>

import OathPlayer from './OathPlayer.vue'
import {
  OATH_HOME_PLAYER_DESKTOP_ID,
  OATH_HOME_PLAYER_MOBILE_ID,
  OATH_PLAYLIST
} from '../../constants'

export default {
  name: 'VideoLeading',
  components: {
    OathPlayer
  },
  computed: {
    playerId () {
      return this.$store.state.viewport.width > 768 ? OATH_HOME_PLAYER_DESKTOP_ID : OATH_HOME_PLAYER_MOBILE_ID
    },
    playlistId () {
      const playlistInfo = this.$route.fullPath.match(/category/)
        ? Object.entries(OATH_PLAYLIST).find(item => item[1].categoryName === this.$route.fullPath.split('/')[2])
        : ''
      return playlistInfo ? playlistInfo[0] : ``
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
      padding-top calc(1024px * 0.5625)
      margin 0 auto
</style>
