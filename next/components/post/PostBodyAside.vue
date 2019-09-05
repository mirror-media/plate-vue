<template>
  <aside class="post-body-aside">
    <slot></slot>
  </aside>
</template>
<script>
export default {
  name: 'PostBodyAside'
}
</script>
<style lang="stylus" scoped>
.post-body-aside
  > *
    & + *
      margin-top 20px
</style>