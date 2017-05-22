<template>
  <section class="timelineBody">
    <article>
      <div v-html="getBrief()" class="timelineBody__brief" />
      <timeline-menu :highlightNodes="highlightNodes" />
    </article>
  </section>
</template>

<script>

import _ from 'lodash'
import TimelineMenu from '../../components/timeline/TimelineMenu.vue'

export default {
  components: {
    'timeline-menu': TimelineMenu
  },
  props: [ 'timeline', 'highlightNodes' ],
  methods: {
    getBrief () {
      return _.get(this.timeline, [ 'topic', 'brief', 'html' ])
    }
  }
}

</script>

<style lang="stylus" scoped>

article
  padding-top 1em
  text-align justify
  > p
    padding 0 1em

.timelineBody
  z-index 10
  padding-top 100vh
  background-color transparent
  &__brief
    width calc(100% - 2em)
    margin 0 auto
    color #000
    line-height 1.5
    letter-spacing 2px
    > p:nth-of-type(1):nth-of-type(2)
      color grey
      margin 0
  > article
    background-color #fff

@media (min-width 600px)
  article
    > p
      width 80%
      padding 0
      margin 1em auto
  .timelineBody
    &__brief
      width 70%
      p:nth-child(1)
        color grey
        margin 0

</style>
