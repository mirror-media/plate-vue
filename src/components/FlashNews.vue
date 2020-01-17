<template>
  <section class="flash-news" v-if="articles.length">
    <div class="flash-news__name">快訊</div>
    <div class="flash-news__container">
      <div :style="{ transform: `translateY(${distance}%)` }" :class="[ 'flash-news__titles', { transition: isTransition } ]" @transitionend="handleTransitionEnd" @oTransitionEnd="handleTransitionEnd" @webkitTransitionEnd="handleTransitionEnd">
        <div v-for="news in articles" :key="news.slug" class="flash-news__title-wrapper">
          <a :href="`${siteUrl}/story/${news.slug}`" target="_blank" @click="sendGaClickEvent('home', 'breakingnews title')">{{ news.title }}</a>
        </div>
      </div>
      <div class="flash-news__arrows">
        <div class="next" @click="slideToNextNews(false); sendGaClickEvent('home', 'breakingnews up')"></div>
        <div class="prev" @click="slideToPrevNews(); sendGaClickEvent('home', 'breakingnews down')"></div>
      </div>
    </div>
  </section>
</template>

<script>
import { sendGaClickEvent } from '../util/comm'
import { SITE_URL } from 'src/constants'

export default {
  name: 'FlashNews',
  props: {
    articles: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  mounted () {
    this.autoSlideToNextNews()
  },
  data () {
    return {
      order: 1,
      isTransition: false,
      isAutoSlide: true
    }
  },
  computed: {
    distance () {
      return this.order * -100
    },
    siteUrl () {
      return SITE_URL
    }
  },
  methods: {
    slideToNextNews (isAuto) {
      if (this.isTransition) { return }
      this.isTransition = true
      this.isAutoSlide = isAuto
      this.order += 1
    },
    slideToPrevNews () {
      if (this.isTransition) { return }
      this.isTransition = true
      this.isAutoSlide = false
      this.order -= 1
    },
    autoSlideToNextNews () {
      setTimeout(() => {
        if (this.isAutoSlide) {
          this.slideToNextNews(true)
        }
        this.isAutoSlide = true
        this.autoSlideToNextNews()
      }, 3000)
    },
    handleTransitionEnd () {
      this.isTransition = false
      switch (this.order) {
        case (this.articles.length - 1):
          this.order -= 1
          this.articles.push(this.articles.shift())
          break
        case 0:
          this.order += 1
          this.articles.unshift(this.articles.pop())
          break
      }
    },
    sendGaClickEvent
  }
}
</script>

<style lang="stylus" scoped>
.flash-news
  display flex
  overflow hidden
  margin 8px 6px
  height 44px
  font-size 1rem
  @media (min-width 768px)
    font-size 1.25rem
    height 54px
  @media (min-width 600px)
    margin-right 0
    margin-left 0
    width 100%
    padding-right 2rem
    padding-left 2rem
  @media (min-width 1200px)
    max-width 1024px
    padding-right 0
    padding-left 0
    margin 10px auto 0 auto
  &__name
    background-color #e51731
    color #fff
    border-radius 2px
    text-align center
    font-weight 600
    width 52px
    margin-right 4px
    font-size 1rem
    line-height 44px
    @media (min-width 768px)
      line-height 54px
      width 92px
      margin-right 8px
      font-size 1.25rem
  &__container
    background-color #eee
    border-radius 2px
    display flex
    width calc(100% - 56px)
    padding-right 6px
    @media (min-width 768px)
      width calc(100% - 100px)
      padding-right 13px
  &__titles
    width calc(100% - 52px)
    padding-right 10px
    padding-left 10px
    &.transition
      transition transform 0.3s cubic-bezier(0.445, 0.05, 0.55, 0.95)
    @media (min-width 768px)
      padding-right 19px
      padding-left 19px
      width calc(100% - 70px)
    & a
      display block
      color #e51731
      overflow hidden
      text-overflow ellipsis
      margin 0
      font-weight 500
      white-space nowrap
      line-height 44px
      @media (min-width 768px)
        line-height 54px
  &__arrows
    width 52px
    display flex
    align-items center
    justify-content space-between
    user-select none
    @media (min-width 768px)
      width 70px
    & > div
      width 24px
      height 24px
      display flex
      justify-content center
      align-items center
      cursor pointer
      @media (min-width 768px)
        width 30px
        height 30px
      &::before
        content ''
        display block
        width 0
        height 0
        border-style solid
    & .next::before
      border-width 0 5px 5px 5px
      border-color transparent transparent #4a4a4a transparent
      @media (min-width 768px)
        border-width 0 6.5px 6px 6.5px
    & .prev::before
      border-width 5px 5px 0 5px
      border-color #4a4a4a transparent transparent transparent
      @media (min-width 768px)
        border-width 6px 6.5px 0 6.5px
</style>
