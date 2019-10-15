<template>
  <nav class="navs">
    <img
      class="navs__play"
      v-lazy="navIcon"
      :key="nextState"
      alt=""
      @click="$emit(nextState)"
    >
  </nav>
</template>

<script>
export default {
  props: {
    isPlaying: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nextState() {
      return this.isPlaying ? 'pause' : 'play'
    },
    navIcon() {
      return `/assets/mirrormedia/icon/audio_player_icon_${this.nextState}_mirrorvoice.png`
    }
  }
}
</script>

<style lang="stylus" scoped>
.navs
  display flex
  align-items center
  &__play
    cursor pointer
    height 34px
</style>
