<template>
  <section class="relateds-in-content">
    <template v-if="abIndicator === 'A'">
      <div v-for="related in relateds" :key="related.id" class="related">
        <div class="related__title">
          <a :id="`related-title-${related.slug}`" :href="getHref(related)" target="_blank" v-text="related.title"></a>
        </div>
        <a v-if="getImage(related.heroImage)" :id="`related-img-${related.slug}`" :href="getHref(related)" class="related__img" target="_blank">
          <img :src="getImage(related.heroImage)" :alt="related.title">
        </a>
      </div>
    </template>
    <template v-if="abIndicator === 'B'">
      <div v-if="relateds && relateds.length > 0" class="relateds-b">
        <div
          v-for="related in relateds"
          :key="related.id"
          class="relateds-b__related-b related-b"
        >
          <a
            v-if="getImage(related.heroImage)"
            class="related-b__img"
            :id="`related-img-${related.slug}`"
            :href="getHref(related)"
            target="_blank"
          >
            <img :src="getImage(related.heroImage)" :alt="related.title">
          </a>
          <a
            class="related-b__title"
            :id="`related-title-${related.slug}`"
            :href="getHref(related)"
            target="_blank"
            v-text="related.title"
          >
          </a>
        </div>
      </div>
    </template>
  </section>
</template>
<script>
import { get } from 'lodash'
import { getHref } from '../../util/comm'

export default {
  name: 'RelatedListInContent',
  props: {
    relateds: {
      type: Array,
      default () {
        return []
      }
    },
    abIndicator: {
      type: String,
      default: 'A'
    }
  },
  methods: {
    getHref,
    getImage (id) {
      const item = this.$store.state.imagesById.find(image => image.id === id)
      const image = get(item, 'image.resizedTargets.mobile.url') || get(item, 'image.url')
      return image ? image : undefined
    }
  }
}
</script>
<style lang="stylus" scoped>
.relateds-in-content
  margin-bottom 20px
  clear both
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

.relateds-b
  position relative
  left -25px
  width 100vw
  background-color #eeeeee
  display flex
  flex-wrap nowrap
  padding 14px 0 0 14px
  overflow-x scroll
  -webkit-overflow-scrolling touch
  &__related-b
    margin 0 12px 23px 0
    &:last-child
      padding 0 14px 0 0
.related-b
  display flex
  flex-direction column
  &__img
    display block
    width 158px
    height 119px
    text-decoration none !important
    border-bottom none !important
    padding 0 !important
    img
      width 100%
      height 100%
      object-fit cover
  &__title
    display block
    width 158px
    margin 15px 0 0 0
    font-size 18px
    font-weight 300
    line-height 1.44
    color #808080 !important
    text-decoration none !important
    border-bottom none !important
    padding 0 !important


@media (min-width 767px)
  .relateds-in-content
    .related
      &__title
        padding 1em 2em
      &__img
        width 25%

@media (min-width 900px)
  .relateds-in-content
    margin-bottom 0
    .related
      &__img
        width 20%

  .relateds-b
    position static
    width auto
    flex-wrap wrap
    &__related-b
      &:last-child
        padding 0
</style>
