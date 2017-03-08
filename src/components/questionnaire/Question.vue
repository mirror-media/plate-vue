<template>
  <div class="question">
    <div class="question__index">
      <h3 v-for="n in total" :style="{ zIndex: tabZindex(index, n, total), left: tabLeft(index, n, total), marginLeft: tabMarginLeft(index, n, total) }">Ｑ{{ n }}</h3>
    </div>
    <div class="question__content">
      <div class="content">
        <h3>{{ content }}</h3>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'question-container',
    methods: {
      tabLeft(index, number, total) {
        return (20 * (number - 1)) + '%'
      },
      tabMarginLeft(index, number, total) {
        return (index < 5)? '-5%' : `${- 5 - ((index - 4) * 20)}%`
      },
      tabZindex(index, number, total) {
        let zIndex = total
        if(index != number) {
          const distance = Math.abs(index - number)
          zIndex = total - distance
        }
        return zIndex
      },
    },
    props: {
      index: {},
      total: {
        default: () => { return 1 }
      },
      content: {}
    }
  }
</script>
<style lang="stylus">
  .question 
    height 33%

    .question__index 
      text-align center
      height 40px
      background-color #064f77
      position relative

      h3
        cursor pointer
        margin 0
        background-color #fff
        display block
        width 35%
        height 100%
        display flex
        justify-content center
        align-items center
        font-size 1.5rem
        color #064f77
        border-top-left-radius 10px
        border-top-right-radius 10px
        margin-left -5%
        position absolute
        box-shadow 0 0 10px rgba(65, 65, 65, 0.76)

    .question__content 
      padding 0 2rem
      height 100%
      display flex
      flex-direction column
      justify-content center
      position relative
      z-index 100
      background-color #fff
  
  @media (min-width 768px)
    .question
      .question__content
        padding 2rem 5rem
        font-size 1.3rem

  @media (min-width 1200px)
    .question
      .question__index
        display none
      
      .question__content
        padding 50px 0 25px
</style>
