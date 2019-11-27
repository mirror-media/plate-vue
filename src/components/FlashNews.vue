<template>
  <section class="flash-news" v-if="articles.length">
    <div class="flash-news__name">快訊</div>
    <div class="flash-news__container">
      <div :style="{ transform: `translateY(${distance}%)` }" :class="[ 'flash-news__titles', { transition: isTransition } ]" @transitionend="handleTransitionEnd" @oTransitionEnd="handleTransitionEnd" @webkitTransitionEnd="handleTransitionEnd">
        <a v-for="news in articles" :key="news.slug" :href="`${siteUrl}/story/${news.slug}`" target="_blank">{{ news.title }}</a>
      </div>
      <div class="flash-news__arrows">
        <div class="next" @click="slideToNextNews(false)"></div>
        <div class="prev" @click="slideToPrevNews"></div>
      </div>
    </div>
  </section>
</template>

<script>
import { SITE_URL } from 'src/constants'

export default {
  name: 'FlashNews',
  props: {
    articles: {
      type: Array,
      default: [],
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
      }, 3000);
    },
    handleTransitionEnd () {
      this.isTransition = false
      switch (this.order) {
        case this.articles.length - 1:
          this.order -= 1
          this.articles.push(this.articles.shift())
          break
        case 0:
          this.order += 1
          this.articles.unshift(this.articles.pop())
          break
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.flash-news
  display flex
  height 44px
  overflow hidden
  font-size 1rem
  margin 8px 6px
  @media (min-width 600px)
    margin-right 0
    margin-left 0
    width 100%
  @media (min-width 768px)
    font-size 1.25rem
    height 54px
  &__name
    background-color #e51731
    color #fff
    border-radius 2px
    text-align center
    line-height 44px
    font-weight 600
    width 52px
    margin-right 4px
    @media (min-width 768px)
      width 92px
      line-height 54px
      margin-right 8px
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
      white-space nowrap
      color #e51731
      overflow hidden
      text-overflow ellipsis
      margin 0
      line-height 44px
      font-weight 600
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