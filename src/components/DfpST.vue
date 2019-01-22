<template>
  <div class="dfp-st">
    <slot name="dfpST"></slot>
  </div>
</template>
<script>
export default {
  name: 'DfpST'
}
</script>
<style lang="stylus" scoped>
.dfp-st
  position fixed
  left 0
  right 0
  bottom 0
</style>
