<template>
  <div class="watch-item" @click="openLightbox">
    <div class="watch-item--pic">
      <img :alt="item.name" v-lazy="getValue(item, [ 'watchImage', 'image', 'url' ])"
            :data-srcset="`
              ${getValue(item, [ 'watchImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')} 800w,
              ${getValue(item, [ 'watchImage', 'image', 'resizedTargets', 'tablet', 'url' ], '')} 1200w,
              ${getValue(item, [ 'watchImage', 'image', 'resizedTargets', 'desktop', 'url' ], '')} 2000w`">
    </div>
    <div class="watch-item--brand" v-text="getValue(item, [ 'brand', 'name' ], '')"></div>
    <div class="watch-item--name" v-text="getValue(item, [ 'type' ], '')"></div>
    <div class="watch-item--price" v-text="getPice(getValue(item, [ 'price' ], ''))"></div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { getValue } from '../../util/comm'
  import numeral from 'numeral'

  export default {
    name: 'watch-item',
    methods: {
      getValue,
      getPice (price) {
        return `NT$ ${numeral(price).format('0,0')}`
      },
      openLightbox () {
        this.$emit('openLightbox', this.item)
        window.ga && window.ga('send', 'event', 'watch101', 'click', _.get(this.item, [ 'id' ], ''), {
          nonInteraction: false
        })
      }
    },
    mounted () {},
    props: [ 'item' ]
  }
</script>
<style lang="stylus" scoped>
  .watch-item
    width 50%
    display inline-block
    padding 10px
    vertical-align top
    margin 0 auto
    cursor pointer
    &:nth-child(odd)
      padding-right 5px
    &:nth-child(even)
      padding-left 5px
    &--pic
      height 150px
      > img
        object-fit contain
        object-position center center
        width 100%
        height 100%

    &--brand, &--name, &--price
      word-break break-word
      text-align center
      width 95%
    &--brand
      font-weight bold
    &--name
      margin-top 5px
    &--price
      margin-top 5px
      color #b3b3b3
  
  @media (min-width: 768px)
    .watch-item
      width 33.3%
      &--pic
        height 250px
</style>
