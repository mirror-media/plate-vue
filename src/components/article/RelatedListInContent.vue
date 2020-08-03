<template>
  <section
    class="relateds-in-content"
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
    >>> #compass-fit-widget
      @media (min-width 1200px)
        margin 0 !important

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
      @media (min-width 1200px)
        .popListVert-list__item
          position relative
          justify-content normal
          width 100%
          margin 0
        .popListVert-list__item--img
          order 1
          width 20%
          padding 0
          border none
          &::after
            content ''
            display block
            top 0
            width 100%
            padding-top 75%
          img
            display block
            height 100%
        .popListVert-list__item--text
          order 0
          flex 1
          display flex
          align-items center
          width auto
          padding 1em 2em
          > div
            display none
          > h2
            margin 0
            a
              height auto
              max-height 46.8px
              padding 0
              color grey
              font-size 1.125rem
              line-height 1.3
              -webkit-line-clamp: 2;
              border none
</style>
