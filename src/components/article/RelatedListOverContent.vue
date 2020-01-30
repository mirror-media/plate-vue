<template>
  <transition name="fade">
    <div
      v-show="showContent"
      class="relateds-over-content"
      :class="{ 'to-top': isToTop }"
    >
      <div>
        <a
          :href="`/story/${articlesSlug[ 0 ] || '' }`"
          class="related"
          @click="sendGaClickEvent('article', 'related news left')"
        >
          <div class="related__arrow" />
          <div class="related__txt">
            <div class="related__category">{{ relatedCategory }}</div>
            <div class="related__title">
              <p>{{ articlesTitle[ 0 ] || '' }}</p>
            </div>
          </div>
        </a>
        <a
          :href="`/story/${articlesSlug[ 1 ] || '' }`"
          class="related"
          @click="sendGaClickEvent('article', 'related news right')"
        >
          <div class="related__txt">
            <div class="related__category">{{ relatedCategory }}</div>
            <div class="related__title">
              <p>{{ articlesTitle[ 1 ] || '' }}</p>
            </div>
          </div>
          <div class="related__arrow" />
        </a>
      </div>
    </div>
  </transition>
</template>

<script>
import { sendGaClickEvent } from '../../util/comm'

export default {
  name: 'RelatedListOverContent',
  props: {
    articles: {
      type: Array,
      default: () => []
    },
    relatedCategory: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showContent: false,
      wEl: null,
      scrollY: 0,
      isToTop: false,
      ww: 0
    }
  },
  computed: {
    isLapW () {
      return this.ww >= 1200
    },
    articlesSlug () {
      const articles = this.articles.slice(0, 2)
      return articles.filter((article) => article.slug).map((article) => article.slug)
    },
    articlesTitle () {
      const articles = this.articles.slice(0, 2)
      return articles.filter((article) => article.title).map((article) => article.title)
    }
  },
  mounted () {
    this.wEl = window
    this.ww = Math.min(this.wEl.innerWidth, document.documentElement.clientWidth)
    this.scrollY = this.wEl.pageYOffset
    this.wEl.addEventListener('scroll', this.displayContent)
    this.wEl.addEventListener('scroll', this.locateContent)
  },
  methods: {
    sendGaClickEvent,
    displayContent () {
      const currentScrollY = this.wEl.pageYOffset
      this.showContent = (this.articlesSlug.length === 2 && this.articlesTitle.length === 2 && (currentScrollY < this.scrollY))
      this.scrollY = currentScrollY
    },
    locateContent () {
      const topOffset = (this.isLapW ? 160 : 118)
      this.isToTop = (this.scrollY >= topOffset)
    }
  }
}
</script>

<style lang="stylus" scoped>
.relateds-over-content
  position fixed
  top 122px
  z-index 99
  padding-right 4px
  padding-left 4px
  max-width 1160px
  width 100%
  left 50%
  transform translateX(-50%)
  justify-content center
  transition top 0.4s ease-out
  @media (min-width 731px)
    padding-right 0
    padding-left 0
  @media (min-width 1200px)
    justify-content flex-start
    top 164px
  &.to-top
    top 82px
    @media (min-width 1200px)
      top 4px
  & > div
    display flex
    justify-content center
    @media (min-width 1200px)
      max-width 795px
  & .related
    display flex
    font-size 0.875rem
    line-height 1.5
    max-width 360px
    flex 1 1 50%
    box-shadow 0 0 2px rgba(#000, 0.25)
    overflow hidden
    &:first-child
      margin-right 1.5px
      border-top-left-radius 4px
      border-bottom-left-radius 4px
    &:last-child
      margin-left 1.5px
      border-top-right-radius 4px
      border-bottom-right-radius 4px
    &__arrow
      background-color #ae4182
      width 26px
      flex 0 0 auto
      position relative
      display flex
      justify-content center
      align-items center
      &:before
        content ""
        display block
        width 0
        height 0
        border-style solid
        border-width 7px 8px 7px 0
        border-color transparent #fff transparent transparent
        border-radius 2px
      &:first-child:before
        border-width 7px 8px 7px 0
        border-color transparent #fff transparent transparent
      &:last-child:before
        border-width 7px 0 7px 8px
        border-color transparent transparent transparent #fff
    &__txt
      display flex
      padding 9px 12px 9px 12px
      background-color #fff
      flex 1 1 auto
      @media (min-width 600px)
        padding-left 8px
    &__category
      display none
      color #fff
      background-color #ae4182
      align-self flex-start
      padding 2px 7px
      flex 0 0 auto
      @media (min-width 600px)
        display block
    &__title
      color #1b1b1b
      user-select none
      @media (min-width 600px)
        padding-left 12px
      & p
        text-align justify
        margin 0
        overflow hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
        height calc(1em * 1.5 * 2)
    &:hover, :active
      & .related__txt
        outline 2px solid #ae4182
        outline-offset -2px
.fade
  &-enter-active, &-leave-active
    transition all 0.2s ease-in-out
  &-enter, &-leave-to
    opacity 0
    transform translate(-50%, -16px)
</style>
