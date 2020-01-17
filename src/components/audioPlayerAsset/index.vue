<template>
  <composition
    :audio="audio"
  >
    <pure
      slot-scope="{ sound }"
      :sound="sound"
      :volume="playerVolume"
      :muted="playerMuted"
      :playback-rate="playerplaybackRate"
      @play="onPlay"
    />
  </composition>
</template>

<script>
import composition from './composition.vue'
import pure from './pure.vue'

export default {
  components: {
    composition,
    pure
  },
  props: {
    audio: {
      type: Object,
      required: true
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
      // window.ga('send', 'event', 'article', 'click', 'audio-play')
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
