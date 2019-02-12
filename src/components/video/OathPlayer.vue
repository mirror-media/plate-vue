<template>
  <div class="oath-player">
    <div id="oathPlayer" ref="oathPlayer" class="oath-player__player"></div>
  </div>
</template>
<script>

import { OATH_COPMANY_ID } from '../../constants'

export default {
  naem: 'OathPlayer',
  props: {
    playerId: {
      type: String,
      required: true
    },
    playlistId: {
      type: String,
      default: ``
    },
    vidoeId: {
      type: String,
      default: ``
    }
  },
  watch: {
    '$route.fullPath' () {
      this.embedDynamicPlayer()
    }
  },
  mounted () {
    this.embedDynamicPlayer()
  },
  methods: {
    embedDynamicPlayer () {
      document.querySelector('.oath-player__player').innerHTML = ''
      const script = document.createElement("script")
      script.innerHTML = `var player = vidible.player('oathPlayer').setup({
        pid: '${this.playerId}',
        bcid: '${OATH_COPMANY_ID}',
        bid: '${this.playlistId}',
        videos: [ '${this.vidoeId}' ]
      }).load();`
      document.querySelector('.oath-player').appendChild(script)
    }
  }
}
</script>
<style lang="stylus" scoped>
.oath-player
  position relative
  padding-top 56.25%
  background-color #000
  &__player
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    width 100%

</style>
