<template>
  <HOC
    class="player-wrapper"
    :post="post"
  >
    <Player
      v-if="showPlayer"
      slot-scope="{ sound, showPlayer }"
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
  components: {
    HOC,
    Player
  },
  props: {
    post: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      playerVolume: 1,
      playerMuted: false,
      playerplaybackRate: 1
    }
  },
  methods: {
    onPlay () {
      window.ga('send', 'event', 'article', 'click', 'audio-play')
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
