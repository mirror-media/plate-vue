<template>
  <section class="flash-news">
    <div class="flash-news__name">快訊</div>
    <div class="flash-news__container">
      <div class="flash-news__titles" :style="{ transform: `translateY(${distance}%)` }">
        <!-- <a href="#" target="_blank">1 【澳洲共諜疑雲 4】「叛逃從來不是容易事」</a>
        <a href="#" target="_blank">2 【我哥是立委2】受害人想退場 他當場叩立委哥喬驗</a>
        <a href="#" target="_blank">3 【韓國瑜專訪4】如何證明比蔡英文懂得處理兩岸？</a>
        <a href="#" target="_blank">4 沈玉琳尾牙80場起跳 「錢來就幹」榮登尾牙王</a>
        <a href="#" target="_blank">5 西雅圖濾掛式咖啡摻低價豆 13款商品免費退換貨</a> -->
        <a v-for="news in articles" :key="news.slug" :href="`${siteUrl}/story/${news.slug}`" target="_blank">{{ news.title }}</a>
      </div>
      <div class="flash-news__arrows">
        <div class="next" @click="slideToNextNews"></div>
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
  data () {
    return {
      order: 0
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
    slideToNextNews () {
      this.order += 1
    },
    slideToPrevNews () {
      this.order -= 1
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
    // overflow hidden
    width calc(100% - 56px)
    padding-right 6px
    @media (min-width 768px)
      width calc(100% - 100px)
      padding-right 13px
  &__titles
    width calc(100% - 52px)
    padding-right 10px
    padding-left 10px
    @media (min-width 768px)
      padding-right 19px
      padding-left 19px
    & a
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