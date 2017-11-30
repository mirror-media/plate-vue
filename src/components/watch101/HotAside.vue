<template>
  <div class="items">
    <div class="hot-item" v-for="(watch, index) in list" v-if="index < 10" :key="`hot-${index}`" @click="openLightbox(watch)">
      <div class="hot-item--order"><span v-text="`${index + 1}`"></span></div>
      <div class="hot-item--img">
        <img :alt="watch.description" v-lazy="getValue(watch, [ 'watchImage', 'image', 'url' ])"
            :data-srcset="`
              ${getValue(watch, [ 'watchImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')} 800w,
              ${getValue(watch, [ 'watchImage', 'image', 'resizedTargets', 'tablet', 'url' ], '')} 1200w,
              ${getValue(watch, [ 'watchImage', 'image', 'resizedTargets', 'desktop', 'url' ], '')} 2000w`">
      </div>
      <div class="hot-item--title"><span v-text="getValue(watch, [ 'brand', 'name' ])"></span></div>
      <div class="hot-item--desc"><span v-text="getValue(watch, [ 'type' ])"></span></div>
    </div>
  </div>
</template>
<script>
  import { getValue } from '../../util/comm'

  export default {
    name: 'hot-list-verticle',
    methods: {
      getValue,
      openLightbox (item) {
        this.$emit('openLightbox', item)
      }
    },
    mounted () {},
    props: [ 'list' ]
  }
</script>
<style lang="stylus" scoped>
  .items
    // padding 30px
    .hot-item
      position relative
      border-top 1px solid #000
      padding 5px 0 20px
      $img-height = 120px
      cursor pointer
      &--order
        height ($img-height + 20px)
        position relative
        z-index 1
        font-size 2rem
        padding-top 15px
        padding-left 10px
      &--img
        position absolute
        width 100%
        height $img-height
        top 20px
        right 0
        text-align right
        > img
          object-fit contain
          object-position center center
          height 100%
          width 100%
      &--title
        font-weight bold
        line-height 1.25rem
      &--desc
        line-height 1.2rem
        font-size 0.9rem
</style>
