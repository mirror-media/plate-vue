<template>
 <div class="more">
   <button @click="loadMore()"><span>更多文章</span></button>
 </div>
</template>

<script>

export default {
  name: 'more',
  props: {
  },
  methods: {
    loadMore () {
      this.$emit('loadMore')
    }
  },
}
  
</script>
<style lang="stylus" scoped>

.more
  height 30px
  margin-top 20px
  border 1px solid #bcbcbc
    
  > button
    display: flex
    justify-content: center
    align-items: center
    width 100%
    height 100%
    border none
    background none

.more-container
  width 100%
  height 30px
  margin-top 20px
  border 1px solid #bcbcbc
  > button
    display: flex
    justify-content: center
    align-items: center
    width 100%
    height 100%
    border none
    background none

</style>