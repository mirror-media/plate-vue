<template>
  <div class="event">
    <button
      v-show="!hasZoomIn"
      class="event__close-btn"
    >
      <img
        src="/assets/mirrormedia/icon/close-btn.png"
        alt="關閉"
        @click="close"
      >
    </button>
    <div
      :class="[ { 'zoom-in': hasZoomIn }, 'event-container' ]"
      @click="toggleZoomIn"
    >
      <div
        v-if="isEventMod"
        v-show="!hasZoomIn"
        class="event__curtain"
        @click.stop="toggleZoomIn"
      />
      <div
        class="event__iframe"
        v-html="eventIframeHtml"
      />
    </div>
  </div>
</template>
<script>

export default {
  name: 'EventPresentational',
  props: {
    eventIframeHtml: {
      type: String,
      required: true
    },
    eventType: {
      type: String,
      required: true
    },
    hasZoomIn: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isEventMod () {
      return this.eventType === 'mod'
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    toggleZoomIn () {
      this.$emit('toggleZoomIn')
    }
  }
}
</script>
<style lang="stylus" scoped>
.event
  position relative
  &-container
    position relative
    display block
    width 100%
    padding-top 56.25%
    &.zoom-in
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      z-index 999
      width 100%
      height 100%
      padding 0
      background-color rgba(0,0,0,.7)
      cursor pointer
      >>> iframe
        top 50%
        transform translateY(-50%)
        height 56.25vw
      >>> iframe:fullscreen
        top auto
        transform none
  &__iframe
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    overflow hidden
    >>> iframe
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      object-position center
      object-fit cover
  &__curtain
    position absolute
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    width 100%
    height 100%
    cursor pointer
  &__close-btn
    position absolute
    top -7px
    right -7px
    z-index 110
    width 25px
    padding 0
    font-size 0
    background-color transparent
    border none
    img
      width 100%

@media (min-width: 1024px)
  .event
    &-container
      &.zoom-in
        >>> iframe
          left 50%
          transform translate(-50%, -50%)
          width 60%
          height 33.75vw

</style>
