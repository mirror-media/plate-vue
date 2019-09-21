<template>
  <transition name="fade">
    <div class="relateds-over-content" v-show="showContent">
      <div>
        <a :href="`/story/${_get(articles[0], 'slug', '')}`" class="related">
          <div class="related__arrow"></div>
          <div class="related__txt">
            <div class="related__category">{{ relatedCategory || _get(articles[0], 'categories.0.title', '新聞') }}</div>
            <div class="related__title">
              <p>{{ _get(articles[0], 'title', '') }}</p>
            </div>
          </div>
        </a>
        <a :href="`/story/${_get(articles[1], 'slug', '')}`" class="related">
          <div class="related__txt">
            <div class="related__category">{{ relatedCategory || _get(articles[1], 'categories.0.title', '新聞') }}</div>
            <div class="related__title">
              <p>{{ _get(articles[1], 'title', '') }}</p>
            </div>
          </div>
          <div class="related__arrow"></div>
        </a>
      </div>
    </div>
  </transition>
</template>

<script>
import { get as _get } from 'lodash'

export default {
  name: 'RelatedListOverContent',
  props: [ 'articles', 'relatedCategory' ],
  data () {
    return {
      showContent: false,
      wEl: null,
      scrollY: 0
    }
  },
  mounted () {
    this.wEl = window
    this.scrollY = this.wEl.pageYOffset
    this.wEl.addEventListener('scroll', this.displayContent)
  },
  methods: {
    _get,
    displayContent () {
      const currentScrollY = this.wEl.pageYOffset
      if (currentScrollY >= this.scrollY) {
        this.showContent = false
      } else {
        this.showContent = true
      }
      this.scrollY = currentScrollY
    }
  }
}
</script>

<style lang="stylus" scoped>
.relateds-over-content
  position fixed
  top 118px
  z-index 99
  padding-right 4px
  padding-left 4px
  max-width 1160px
  width 100%
  left 50%
  transform translateX(-50%)
  justify-content center
  @media (min-width 731px)
    padding-right 0
    padding-left 0
  @media (min-width 1200px)
    justify-content flex-start
    top 160px
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
    transition opacity 0.2s ease-in-out
  &-enter, &-leave-to
    opacity 0
</style>