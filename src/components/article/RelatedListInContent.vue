<template>
  <section class="relateds-in-content">
    <div v-for="related in relateds" :key="related.id" class="related">
      <div class="related__title">
        <a :href="getHref(related)" target="_blank" v-text="related.title"></a>
      </div>
      <!-- <a :href="getHref(related)" class="related__img" target="_blank">
        <img src="" alt="">
      </a> -->
    </div>
  </section>
</template>
<script>

import { getHref } from '../../util/comm'

export default {
  name: 'RelatedListInContent',
  props: {
    relateds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    getHref
  }
}
</script>
<style lang="stylus" scoped>
.relateds-in-content
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
      // background-size cover 
      // background-position center center 
      // background-repeat no-repeat
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

@media (min-width 767px)
  .relateds-in-content
    .related
      &__title
        padding 1em 2em
      &__img
        width 25%

@media (min-width 900px)
  .relateds-in-content
    .related
      &__img
        width 20%
</style>
