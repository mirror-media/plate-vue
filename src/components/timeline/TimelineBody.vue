<template>
  <section class="timelineBody">
    <article>
      <div v-html="getBrief(timeline.topic, 5000, 'p')" class="timelineBody__brief"></div>
      <timeline-menu :highlightNodes="highlightNodes" />
    </article>
  </section>
</template>

<script>

import TimelineMenu from '../../components/timeline/TimelineMenu.vue'
import { getBrief } from '../../utils/comm'

export default {
  components: {
    'timeline-menu': TimelineMenu
  },
  props: [ 'timeline', 'highlightNodes' ],
  methods: {
    getBrief
  }
}

</script>

<style lang="stylus">

article
  padding 1em 0
  text-align justify
  > p
    padding 0 1em

.timelineBody
  z-index 10
  padding-top 100vh
  background-color #fff
  &__brief
    margin 30px 30px
    color black
    letter-spacing 2px
    line-height 26px
    font-size 16px
    p:nth-child(1), p:nth-child(2)
      color grey
      margin 0

@media (min-width 600px)
  article
    > p
      width 80%
      padding 0
      margin 1em auto
  .timelineBody
    &__brief
      margin 30px 20%
      p:nth-child(1), p:nth-child(2)
        color grey
        margin 0

</style>
