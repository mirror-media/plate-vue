<template>
  <div class="question__index">
    <h3 v-for="n in total" v-text="tabName(n)" :style="{ top: tabTop(index, n, total), marginTop: tabMarginTop(index, n, total), zIndex: tabZindex(index, n, total) }"></h3>
  </div>
</template>
<script>
  export default {
    methods: {
      tabMarginTop (index, number, total) {
        return (index < 7) ? '-5%' : `${-5 - ((index - 6) * 150)}%`
      },
      tabName (n) {
        return `Ｑ${(n)}`
      },
      tabTop (index, number, total) {
        return (12 * (number - 1)) + '%'
      },
      tabZindex (index, number, total) {
        let zIndex = 999
        if (index !== number) {
          const distance = Math.abs(index - number)
          zIndex = total - distance
        }
        return zIndex
      }
    },
    name: 'aside-tab',
    props: {
      index: {
        default: () => { return 0 }
      },
      title: {
        default: () => { return '小測驗' }
      },
      total: {
        default: () => { return 1 }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .question__index
    width 100%
    height 100%
    display flex
    flex-direction column
    align-items flex-end

    h3
      background-color #fff
      width 65%
      height 18%
      border-top-left-radius 10px
      border-bottom-left-radius 10px
      padding 15px 5px
      text-align right
      box-shadow 0 0 10px rgba(65, 65, 65, 0.76)
      position absolute
      right 0
      overflow hidden
      display flex
      justify-content center
      align-items center
      font-weight normal
      color #007cbf
      transition: margin-top 0.25s, z-index 0.1s;

</style>
