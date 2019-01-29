<template>
  <section class="video-leading">
    <slot name="LPCHD"></slot>
    <slot name="LMBHD"></slot>
    <div id="oathPlayer" ref="oathPlayer" class="video-leading__player"></div>
  </section>
</template>
<script>

import { OATH_PLAYLIST } from '../../constants'

const PLAYER_ID_DESKTOP = '5c0f55eddbaab306353048ec'
const PLAYER_ID_MOBILE = '5c4e7cc9f79c4150001f2b08'
const COPMANY_ID = '5bffb44aa00f3047dec33787'

export default {
  name: 'VideoLeading',
  data () {
    return {
    }
  },
  watch: {
    '$route.fullPath' () {
      this.$refs.oathPlayer.innerHTML = ''
      this.embedDynamicPlayer()
    }
  },
  mounted () {
    this.embedDynamicPlayer()
  },
  methods: {
    embedDynamicPlayer () {
      const playlistInfo = this.$route.fullPath.match(/category/)
        ? Object.entries(OATH_PLAYLIST).find(item => item[1].categoryName === this.$route.fullPath.split('/')[2])
        : ''
      const playlistId = playlistInfo ? playlistInfo[0] : ''
      const playerId = this.$store.state.viewport.width > 768 ? PLAYER_ID_DESKTOP : PLAYER_ID_MOBILE

      const script = document.createElement("script")
      script.innerHTML = `var player = vidible.player('oathPlayer').setup({
        pid: '${playerId}',
        bcid: '${COPMANY_ID}',
        bid: '${playlistId}'
      }).load();`
      document.querySelector('.video-leading').appendChild(script)
    }
  }
}
</script>
<style lang="stylus" scoped>
.video-leading
  position relative
  padding-top 56.25%
  background-color #000
  &__player
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    max-width 1024px
    margin 0 auto

@media (min-width: 1200px)
  .video-leading
    min-height 576px
    padding-top 0
</style>
