<template>
  <a
    :href="`/story/${slug}`"
    class="watch-related"
    target="_blank"
  >
    <!-- <a>
      <picture>

      </picture>
    </a> -->
    <div class="watch-related__info">
      <p
        class="watch-related__title"
        v-text="title"
      />
      <p
        class="watch-related__date"
        v-text="publishedDate"
      />
    </div>
  </a>
</template>
<script>
export default {
  name: 'UIWatchRelated',
  props: {
    // images: {
    //   type: Object,
    //   required: true
    // },
    publishedDate: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.watch-related
  display block
  padding 10px 10px 14px
  box-shadow 0 0 2px 0 rgba(0, 0, 0, 0.15)
  p
    margin 0
  &__title
    color rgba(0, 0, 0, 0.87)
    font-size 17px
    font-weight 600
    line-height 1.53
    & + .watch-related__date
      margin-top 11px
  &__date
    color rgba(0, 0, 0, 0.66)
    font-size 14px

@media (min-width: 1200px)
  .watch-related
    &__title
      font-size 24px
      line-height 1.58
    &__date
      font-size 16px
      line-height 2.38
</style>
