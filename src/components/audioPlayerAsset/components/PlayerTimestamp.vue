<template>
  <div class="timestamp">
    <p
      class="timestamp__time"
      v-text="secondsToMs(played)"
    />
    <p
      class="timestamp__time"
      v-text="secondsToMs(duration)"
    />
  </div>
</template>

<script>
export default {
  props: {
    duration: {
      type: Number,
      default: 0
    },
    played: {
      type: Number,
      default: 0
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
.timestamp
  display flex
  justify-content space-between
  &__time
    margin 0 !important
    color #fe6c2d !important
    font-size 10px !important
</style>