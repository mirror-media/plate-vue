<template>
  <section class="gs-list">
    <div v-if="images.length > 0" class="gs-list__slider slider" @touchstart="handleTouchstart" @touchend="handleTouchend">
      <div class="slider-container" :style="{ width: `${images.length * 100}%`, transform: `translateX(-${100 / images.length * current}%)` }">
        <a v-for="item in images"
          :key="item.id"
          :style="{ width: `${100 / images.length}%`, backgroundImage: `url(${item.image.resizedTargets.desktop.url})` }"
          class="slider__item"
          :href="getHref(item)"
          target="_blank">
        </a>
      </div>
      <div class="slider__nav">
        <div class="nav-container" :style="{ width: `${ images.length * 15 + (images.length - 1) * 10 }px` }">
          <div v-for="(item, index) in images"
            :key="`btn-${item.id}`"
            :class="{ active: current === index}"
            class="dot"
            @click="current = index">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { get } from 'lodash'

const GS_TAG_ID = '5bbc2069f39162100007c8bc' // 5bbf08301e598f1000fc8e52

export default {
  name: 'ListSlider',
  data () {
    return {
      current: 0,
      timer: undefined,
      touchEndX: 0,
      touchStartX: 0,
    }
  },
  computed: {
    images () {
      const items = get(this.$store, [ 'state', 'images', GS_TAG_ID, 'items' ], []) || []
      return items.sort((a, b) => {
        return Number(a.keywords.split('_')[0]) - Number(b.keywords.split('_')[0])
      })
    }
  },
  mounted () {
    this.setTimer()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    getHref (image) {
      if (image.keywords) {
        return image.keywords.split('_')[1] || 'https://www.mirrormedia.mg/'
      }
      return 'https://www.mirrormedia.mg/'
    },
    handleSwipe () {
      if (this.touchEndX > this.touchStartX) {
        if (this.current + 1 < this.images.length) {
          this.current += 1
        } else {
          this.current = 0
        }
      } else {
        if (this.current - 1 > -1) {
          this.current -= 1
        } else {
          this.current = this.images.length - 1
        }
      }
    },
    handleTouchstart (e) {
      this.touchStartX = e.changedTouches[0].screenX
    },
    handleTouchend (e) {
      this.touchEndX = e.changedTouches[0].screenX
      this.handleSwipe()
    },
    setTimer () {
      this.timer = setInterval(() => {
        if (this.current + 1 < this.images.length) {
          this.current += 1
        } else {
          this.current = 0
        }
      }, 5000)
    }
  }
}
</script>
<style lang="stylus" scoped>
.gs-list
  &__slider
    width 100%
    padding-top 56.25%
    margin 0 auto
    overflow hidden
  &.gs
    .gs-list__slider
      max-width 1380px
      padding-top 43.478%
.slider
  position relative
  &-container
    position absolute
    top 0
    left 0
    display flex
    height 100%
    transition transform 1s ease-out 0s
  &__item
    display block
    height 100%
    background-size cover
    background-position center center
    background-repeat no-repeat
  &__nav
    display none
    align-items center
    position absolute
    left 50%
    bottom 10px
    transform translateX(-50%)
    max-width 115px
    height 15px
    overflow hidden
    .nav-container
      display flex
    .dot
      width 15px
      height 15px
      background-color #bbb
      border-radius 15px
      transition background-color .5s ease
      cursor pointer
      & + .dot
        margin-left 10px
      &:hover
        background-color rgba(0,0,0,.6)
      &.active
        background-color rgba(0,0,0,.6)

@media (min-width: 1400px)
  .gs-list
    &.gs
      .gs-list__slider
          height 600px
          padding-top 0
  .slider
    &__nav
      display flex
</style>
