<template>
  <div class="option-container">
    <div class="option">
      <div class="option__checkbox"><span></span></div>
      <div class="option__content">{{ content }}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'option-container',
    props: {
      index: {},
      content: {}
    }
  }
</script>
<style lang="stylus" scoped>
  .option-container
    display flex
    align-items center
    padding 10px
    font-size 1rem

    .option
      width 100%
      display flex
      align-items center

      .option__checkbox
        font-weight bold
        font-family Verdana
        margin-right 0.5rem

        span
          border 1px solid #d1d1d1
          height 20px
          width 20px
          display block
          border-radius 20%      
      
      .option__content
        flex 9
      
    
  
</style>
