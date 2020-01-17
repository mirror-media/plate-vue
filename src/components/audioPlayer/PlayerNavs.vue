<template>
  <nav class="navs">
    <img
      :key="isPlaying ? 'pause' : 'play'"
      v-lazy="`/assets/mirrormedia/icon/audio_player_icon_${isPlaying ? 'pause' : 'play'}.png`"
      class="navs__play"
      alt=""
      @click="$emit(isPlaying ? 'pause' : 'play')"
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
