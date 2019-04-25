<template>
  <div class="info">
    <p class="info__first info__first--truncate">
      {{ title }}
    </p>
    <p class="info__second info__second--fixed-width">
      {{ secondsToMs(played) }}<span> / {{ secondsToMs(duration) }}</span>
    </p>
  </div>
</template>

<script>
import { get } from 'lodash'

export default {
  props: {
    sound: {
      type: Object,
      required: true
    },
    duration: {
      type: Number,
      default: 0
    },
    played: {
      type: Number,
      default: 0
    }
  },
  computed: {
    title() {
      return get(this.sound, 'title', '')
    },
    slug() {
      return get(this.sound, 'slug', '')
    }
  },
  methods: {
    secondsToMs(d) {
      d = Number(d)
      const m = Math.floor((d % 3600) / 60)
      const s = Math.floor((d % 3600) % 60)

      const mDisplay = m > 0 ? `${m}`.padStart(2, '0') : '00'
      const sDisplay = s > 0 ? `${s}`.padStart(2, '0') : '00'
      return `${mDisplay}:${sDisplay}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.info
  display flex
  justify-content space-between
  font-size 13px
  &__first
    line-height 1
    color #064f77
    display block
    width 0px
    flex 1 1 auto
    margin 0
    &--truncate
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
  &__second
    line-height 1
    color #bfbfbf
    span
      color #898989
    &--fixed-width
      min-width max-content
      margin 0 0 0 5px

@media (max-width 768px)
  .info
    font-size 11px
</style>
