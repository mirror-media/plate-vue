<template>
  <div class="watch-iframe">
    <iframe
      :src="iframeSrc"
      width="560"
      height="315"
      frameborder="0"
      loading="lazy"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
<script>
export default {
  naem: 'UIWatchIframe',
  props: {
    iframeSrc: {
      type: String,
      required: true
    },
    triggerEmbed: {
      type: Boolean,
      default: false
    }
  }

}
</script>
<style lang="stylus" scoped>
.watch-iframe
  position relative
  padding-top 56.25%
  overflow hidden
  iframe
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    width 100%
    height 100%
    object-fit cover
    object-position center center

@media (min-width: 768px)
  .watch-iframe
    padding-top calc(56.25% * 0.79)

</style>
