<template>
  <HOC
    class="player-wrapper"
    :post="post"
  >
    <Player
      slot-scope="{ sound, showPlayer }"
      v-if="showPlayer"
      class="player-wrapper__player"
      :sound="sound"
      :volume="playerVolume"
      :muted="playerMuted"
      :playback-rate="playerplaybackRate"
      @play="onPlay"
    />
  </HOC>
</template>

<script>
import HOC from './HOC.vue'
import Player from './Player.vue'

export default {
  props: {
    post: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    HOC,
    Player
  },
  data() {
    return {
      playerVolume: 1,
      playerMuted: false,
      playerplaybackRate: 1
    }
  },
  methods: {
    onPlay() {
      window.ga('send', 'event', 'article', 'click', 'audio-play')
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
