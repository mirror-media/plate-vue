<template>
  <section
    class="relateds-in-content"
    :class="{ test: abIndicator === 'B' }"
  >
    <div
      v-for="related in relateds"
      :key="related.id"
      class="related"
    >
      <div class="related__title">
        <a
          :href="getHref(related, isAppPage)"
          target="_blank"
          @click="sendGaClickEvent('article', 'related')"
          v-text="related.title"
        />
      </div>
      <a
        v-if="getImage(related.heroImage)"
        :href="getHref(related, isAppPage)"
        class="related__img"
        target="_blank"
        @click="sendGaClickEvent('article', 'related')"
      >
        <LazyImage
          :src="getImage(related.heroImage)"
          :alt="related.title"
        />
      </a>
    </div>
    <slot />
  </section>
</template>

<script>
import LazyImage from 'src/components/common/LazyImage.vue'
import { get } from 'lodash'
import { getHref, sendGaClickEvent } from '../../util/comm'

export default {
  name: 'RelatedListInContent',
  components: {
    LazyImage
  },
  props: {
    isAppPage: {
      type: Boolean,
      default: false
    },
    relateds: {
      type: Array,
      default () {
        return []
      }
    },
    abIndicator: {
      type: String,
      required: true
    }
  },
  methods: {
    getHref,
    getImage (id) {
      const item = this.$store.state.imagesById.find(image => image.id === id)
      const image = get(item, 'image.resizedTargets.mobile.url') || get(item, 'image.url')
      return image || undefined
    },
    sendGaClickEvent
  }
}
</script>

<style lang="stylus" scoped>
.relateds-in-content.test
  padding-left 20px
  padding-right 20px
  @media (min-width 321px)
    padding-left 0
    padding-right 0
  @media (min-width 900px)
    position relative
    padding-top 12px
    border-top 1px solid #d8d8d8
  .related
    background-color transparent
    flex-direction row-reverse
    align-items center
    border-bottom 1px solid #d8d8d8
    padding-left 0
    @media (min-width 900px)
      margin-left auto
      width 375px
      &:nth-child(2)
        padding-bottom 9px
        .related
          &__title
            padding-top 0
            padding-bottom 0
            height 42px
    & + .related
      margin-top 0
    &::before
      content none
    &:first-child
      flex-direction column-reverse
      height auto
      align-items flex-start
      @media (min-width 900px)
        position absolute
        width 300px
      .related
        &__img
          margin-right 0
          width 100%
          height auto
          img
            position relative
    &__img
      width 42px
      height 28px
      margin-right 12px
      flex 0 0 auto
      &::after
        content none
    &__title
      padding 9px 0
      // 42 + 9 * 2
      height 60px
      flex 1 1 auto
      width 100%
      a
        font-size 15px
        color rgba(#000, 0.87)
        line-height 1.4
        // 15 * 1.4 * 2
        max-height 42px
        width 100%
    >>> #compass-fit-widget-content
      flex-direction row-reverse
      align-items center
      figure
        width 42px
        height 28px
        margin-right 12px
        a
          width 42px
          height 28px
          padding-top 0
          padding-bottom 0
          border-bottom none
        .pop_item--colorBlock
          display none
      .pop_item_title
        background-color transparent !important
        padding 9px 0
        // 42 + 9 * 2
        height 60px
        a
          font-size 15px
          width 100%
          color rgba(#000, 0.87)
          line-height 1.4
          // 15 * 1.4 * 2
          max-height 42px

.relateds-in-content
  margin-bottom 20px
  clear both
  @media (min-width 900px)
    margin-bottom 0
  > h3
    margin 0 0 .6em
    color #000
    font-size 1.25rem
    font-weight 600
  .related
    display flex
    position relative
    padding-left 10px
    background-color #eee
    &::before
      content ''
      position absolute
      top 0
      left 0
      width 10px
      height 100%
      background-color #808080
    & + .related
      margin-top 1em
    &__title
      flex 1
      display flex
      align-items center
      padding 1em
      @media (min-width 768px)
        padding 1em 2em
      a
        display inline-block
        display -webkit-box
        padding 0
        color #808080
        font-size 1.125rem
        line-height 1.3
        max-height 46.8px
        -webkit-line-clamp 2
        -webkit-box-orient vertical
        text-overflow ellipsis
        border-bottom none
        overflow hidden
    &__img
      position relative
      width 33%
      padding 0 !important
      border-bottom none !important
      @media (min-width 768px)
        width 25%
      @media (min-width 900px)
        width 20%
      &::after
        content ''
        display block
        top 0
        width 100%
        padding-top 75%
      img
        display block
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        width 100%
        height 100%
        object-fit cover
        object-position center center

    >>> #compass-fit-widget-content
      display flex
      a
        text-decoration none
      figure
        order 1
        position relative
        width 33%
        margin 0
        @media (min-width 768px)
          width 25%
        @media (min-width 900px)
          width 20%
        a
          display block
          width 100%
          padding-top 56.25%
        img
          display block
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          width 100%
          height 100%
          object-fit cover
          object-position center center
      .pop_item_title
        flex 1
        order 0
        display flex
        align-items center
        padding 1em
        background-color #eee !important
        @media (min-width 768px)
          padding 1em 2em
        a
          display inline-block
          display -webkit-box
          padding 0
          color #808080
          font-size 1.125rem
          line-height 1.3
          max-height 46.8px
          -webkit-line-clamp 2
          -webkit-box-orient vertical
          text-overflow ellipsis
          border none
          overflow hidden
</style>
