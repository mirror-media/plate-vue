<template>
  <div class="dfp-fixed ">
    <slot name="dfpFF"></slot>
    <img src="/public/icon/close-btn.png" @click="closeDfpFixed()">
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
    top -15px
    right -15px
    width 30px
    cursor pointer

@media (min-width 1201px)
  .dfp-fixed
    display block
</style>
