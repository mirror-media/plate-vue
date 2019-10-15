<template>
  <div class="info">
    <h1
      class="info__title"
      v-text="sound.title"
    />
    <a
      class="info__link link"
      href="https://voice.mirrorfiction.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <picture>
        <source
          media="(max-width: 768px)"
          srcset="/assets/mirrormedia/icon/mirrorvoice.ico"
        >
        <source
          media="(min-width: 769px)"
          srcset="/assets/mirrormedia/icon/mirrorvoice.png"
        >
        <img
          class="link__img"
          src="/assets/mirrormedia/icon/mirrorvoice.png"
          alt="mirror-voice-link"
        >
      </picture>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    sound: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.info
  padding 16px
  position relative
  &__title
    margin 0
    font-size 16px
    line-height 1.06
    color #000000
    width 80%
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
  &__link
    position absolute
    right 8px
    top 8px

.link
  border none !important
  &__img
    width 53.5px

@media (max-width 768px)
  .info
    padding 14px
    &__title
      line-height 1.63
      width 60%
      white-space normal
    &__link
      right 14px
      top 10px

  .link
    &__img
      width 34px
</style>
