<template>
 <div class="moreFoodTravel">
   <button @click="loadMore()" id="loadmore"><span>更多文章</span></button>
 </div>
</template>

<script>

export default {
  name: 'moreFoodTravel',
  methods: {
    loadMore () {
      this.$emit('loadMore')
    }
  }
}

</script>
<style lang="stylus" scoped>

.moreFoodTravel
  margin 50px 5%
  > button
    display: flex
    justify-content: center
    align-items: center
    width 100%
    height 42px
    font-size 18px
    color #fff
    letter-spacing 10px
    border none
    background-color #333
    > span
      margin 0 auto

@media (min-width: 1200px)
  .moreFoodTravel
    margin 50px 8.3%
    margin-bottom 70px
    > button
      height 48px
      font-size 20px
</style>
