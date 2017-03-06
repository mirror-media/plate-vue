<template>
 <div class="moreFull">
   <button @click="loadMore()"><span>更多文章</span></button>
 </div>
</template>

<script>

export default {
  name: 'moreFull',
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

.moreFull
  padding 0 40px
  margin-bottom 70px
  > button
    display: flex
    justify-content: center
    align-items: center
    width 100%
    height 48px
    font-size 20px
    color #fff
    letter-spacing 10px
    border none
    background-color #333

</style>