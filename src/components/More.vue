<template>
 <div class="more">
   <button @click="loadMore()" id="loadmore"><span>更多文章</span></button>
 </div>
</template>

<script>

export default {
  name: 'more',
  methods: {
    loadMore () {
      this.$emit('loadMore')
    }
  }
}

</script>
<style lang="stylus" scoped>

.more
  height 30px
  margin 20px 0
  padding 0 1em
    
  > button
    display: flex
    justify-content: center
    align-items: center
    width 100%
    height 100%
    border 1px solid #bcbcbc
    background none
    > span
      margin 0 auto

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

@media (min-width: 768px)
  .more
    padding 0
    margin-bottom 0

</style>
