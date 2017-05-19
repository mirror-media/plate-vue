<template>
  <section class="timelineBody">
    <article>
      <p class="credit">文/李又如 攝影/鐘聖雄</p>
      <p>2017年4月20日，台北捷運南勢角站一名約40歲的司機員在執勤中昏倒，送醫不治。司機過去無重大疾病記錄，
      北捷公司也表示「該名司機前天休假，昨天和今天都正常出勤，並沒有超時工作」，死因還有待調查。</p>
      <p>2017年4月20日，台北捷運南勢角站一名約40歲的司機員在執勤中昏倒，送醫不治。司機過去無重大疾病記錄，
      北捷公司也表示「該名司機前天休假，昨天和今天都正常出勤，並沒有超時工作」，死因還有待調查。</p>
      <p>2017年4月20日，台北捷運南勢角站一名約40歲的司機員在執勤中昏倒，送醫不治。司機過去無重大疾病記錄，
      北捷公司也表示「該名司機前天休假，昨天和今天都正常出勤，並沒有超時工作」，死因還有待調查。</p>
      <timeline-menu :highlightNodes="highlightNodes" />
    </article>
  </section>
</template>

<script>

import TimelineMenu from '../../components/timeline/TimelineMenu.vue'

export default {
  components: {
    'timeline-menu': TimelineMenu
  },
  props: [ 'highlightNodes' ]
}

</script>

<style lang="stylus" scoped>

article
  padding 1em 0
  text-align justify
  > p
    padding 0 1em

.timelineBody
  z-index 10
  padding-top 100vh
  background-color #fff

@media (min-width 600px)
  article
    > p
      width 80%
      padding 0
      margin 1em auto

</style>
