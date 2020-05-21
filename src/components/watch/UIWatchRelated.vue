<template>
  <a
    :href="`/story/${post.slug}`"
    class="watch-related"
    target="_blank"
  >
    <picture class="watch-related__img">
      <img
        :src="heroImage"
        :alt="post.title"
      >
    </picture>
    <div class="watch-related__info">
      <p
        class="watch-related__title"
        v-text="post.title"
      />
      <p
        class="watch-related__date"
        v-text="publishedDate"
      />
    </div>
  </a>
</template>
<script>
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'UIWatchRelated',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    heroImage () {
      return _.get(this.post, 'heroImage.image.resizedTargets.mobile.url')
    },
    publishedDate () {
      return moment(new Date(this.post.publishedDate)).format('YYYY/MM/DD')
    }
  }
}
</script>
<style lang="stylus" scoped>
.watch-related
  display flex
  align-items flex-start
  padding 10px 10px 14px
  box-shadow 0 0 2px 0 rgba(0, 0, 0, 0.15)
  p
    margin 0
  &__img
    position relative
    width 112px
    padding-top calc(112px * 0.6666)
    img
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      width 100%
      height 100%
      object-fit cover
      object-position center center
  &__info
    flex 1
    margin-left 9px
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

@media (min-width: 768px)
  .watch-related
    flex-direction column
    padding 0
    &__img
      width 100%
      padding-top 56.25%
    &__info
      margin 0
      padding 7px 6px 11px 8px
    &__title
      & + .watch-related__date
        margin-top 3px

@media (min-width: 1200px)
  .watch-related
    &__title
      font-size 24px
      line-height 1.58
    &__date
      font-size 16px
      line-height 2.38
</style>
