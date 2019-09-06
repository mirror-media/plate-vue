<template>
  <section class="candidate-progress">
    <!-- <div> -->
    <div class="candidate-progress__event">
      <div class="candidate-progress__date">2019.9.13 ~ 9.17</div>
      <div class="candidate-progress__name">受理申請為總統、副總統選舉被連署人</div>
    </div>
    <div class="candidate-progress__event">
      <div class="candidate-progress__date">2019.9.18</div>
      <div class="candidate-progress__name">中選會公告總統、副總統選舉被連署人</div>
    </div>
    <div class="candidate-progress__event">
      <div class="candidate-progress__date">2019.9.19 ~ 11.2</div>
      <div class="candidate-progress__name">中選會受理總統、副總統選舉連署書件</div>
    </div>
    <!-- </div> -->
  </section>
</template>

<script>
export default {
  name: 'PresidentElectionProgress',
  data () {
    return {
      events: [
        {
          name: '受理申請為總統、副總統選舉被連署人',
          date: '2019.9.13 ~ 9.17'
        },
        {
          name: '中選會公告總統、副總統選舉被連署人',
          date: '2019.9.18'
        },
        {
          name: '中選會受理總統、副總統選舉連署書件',
          date: '2019.9.19 ~ 11.2'
        },
        {
          name: '中選會公告總統、副總統選舉連署結果',
          date: '2019.11.13 前'
        },
        {
          name: '總統、副總統選舉參選人登記申請',
          date: '2019.11.18 ~ 11.22'
        },
        {
          name: '總統、副總統選舉候選人抽籤決定號次',
          date: '2019.12.9'
        },
        {
          name: '總統、副總統選舉候選人電視政見發表會',
          date: '2019.12.14 ~ 2020.1.10'
        },
        {
          name: '投票、開票',
          date: '2020.1.11'
        }
      ]
    }
  }
}
</script>

<style lang="stylus">
.candidate-progress
  display flex
  margin-bottom 10px
  &__event
    flex 0 0 auto
    font-size 15px
  &__date
    color #4a4a4a
  &__name
    padding 12px
    color #fff
    background-color #074f77
    font-weight 600
</style>