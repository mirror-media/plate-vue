<template>
  <section class="video-leading">
    <OathPlayer class="video-leading__player"></OathPlayer>
    <slot name="LPCHD"></slot>
    <slot name="LMBHD"></slot>
  </section>
</template>
<script>

import OathPlayer from './OathPlayer.vue'

export default {
  name: 'VideoLeading',
  components: {
    OathPlayer
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
