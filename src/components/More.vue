<template>
 <div class="more-container">
   <a @click="loadMore()"><span>更多文章</span></a>
 </div>
</template>

<script>

export default {
  name: 'more',
  methods: {
    loadMore () {
      this.$emit('loadMore')
    }
  },
}
  
</script>
<style lang="stylus" scoped>

.more-container
  width 100%
  height 30px
  margin-top 20px
  border 1px solid #bcbcbc
  > a
    display: flex
    justify-content: center
    align-items: center
    width 100%
    height 100%

</style>