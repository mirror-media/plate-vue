<template>
  <div class="dfp-fixed ">
    <slot name="dfpFF"></slot>
    <img src="/assets/mirrormedia/icon/close-btn.png" @click="closeDfpFixed()" alt="關閉">
  </div>
</template>

<script>

export default {
  name: 'dfpFixed',
  methods: {
    closeDfpFixed () {
      this.$emit('closeDfpFixed')
    }
  }
}
</script>

<style lang="stylus" scoped>
.dfp-fixed
  display none
  position fixed
  top 165px
  right 15px
  > img
    position absolute
    top -12.5px
    right -12.5px
    width 25px
    cursor pointer

@media (min-width 1201px)
  .dfp-fixed
    display block
</style>
