<template>
  <div class="watch-item-lightbox">
    <div class="lightbox-wrapper">
      <div class="lightbox-wrapper--pic">
        <img :alt="lightboxItem.name" v-lazy="getValue(lightboxItem, [ 'watchImage', 'image', 'url' ])"
          :data-srcset="`
            ${getValue(lightboxItem, [ 'watchImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')} 800w,
            ${getValue(lightboxItem, [ 'watchImage', 'image', 'resizedTargets', 'tablet', 'url' ], '')} 1200w,
            ${getValue(lightboxItem, [ 'watchImage', 'image', 'resizedTargets', 'desktop', 'url' ], '')} 2000w`">
      </div>
      <div class="lightbox-wrapper--content">
        <div class="brief">
          <div class="brand" v-text="getValue(lightboxItem, [ 'brand', 'name' ])"></div>
          <div class="type" v-text="getValue(lightboxItem, [ 'type' ])"></div>
          <div class="price" v-text="price"></div>
        </div>
        <div class="content" v-if="getValue(lightboxItem, [ 'content', 'apiData' ])">
          <p v-for="paragraph in getValue(lightboxItem, [ 'content', 'apiData' ])" v-if="getValue(paragraph, [ 'type' ]) === 'unstyled'" v-text="getValue(paragraph, [ 'content', 0 ])"></p>
        </div>
        <div class="specification">
          <div class="title"><span v-text="WORDING[ 'SPEC' ]"></span></div>
          <div class="item">
            <div class="item--title"><span v-text="WORDING[ 'TYPE' ]"></span></div>
            <div class="item--content"><span v-text="getValue(lightboxItem, [ 'type' ])"></span></div>
          </div>
          <div class="item">
            <div class="item--title"><span v-text="WORDING[ 'MATERIAL' ]"></span></div>
            <div class="item--content"><span v-text="getValue(lightboxItem, [ 'material' ])"></span></div>
          </div>
          <div class="item">
            <div class="item--title"><span v-text="WORDING[ 'WATERPROOF' ]"></span></div>
            <div class="item--content"><span v-text="getValue(lightboxItem, [ 'waterproof' ])"></span></div>
          </div>
          <div class="item">
            <div class="item--title"><span v-text="WORDING[ 'MOVEMENT' ]"></span></div>
            <div class="item--content"><span v-text="getValue(lightboxItem, [ 'movement' ])"></span></div>
          </div>
          <div class="item functions">
            <div class="item--title"><span v-text="WORDING[ 'FUNCTIONS' ]"></span></div>
            <div class="item--content">
              <span v-for="(fn, i) in getValue(lightboxItem, [ 'watchfunction' ])" v-text="i !== 0 ? `、${fn.name}` : fn.name"></span>
            </div>
          </div>
        </div>
        <div class="relateds" v-if="getValue(lightboxItem, [ 'relateds' ])">
          <div class="title" v-text="WORDING[ 'RELATED' ]"></div>
          <div class="item" v-for="post in getValue(lightboxItem, [ 'relateds' ])">
            <a target="_blank" :href="`${SITE_URL}/story/${getValue(post, [ 'slug' ], getValue(post, [ 'name' ], ''))}`" v-text="getValue(post, [ 'title' ], '')"></a>
          </div>
        </div>
      </div>
      <div class="lightbox-wrapper--close" @click="closeLightbox"></div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { getValue } from '../../util/comm'
  import { WORDING } from '../../constants/watch101'
  import { SITE_URL } from '../../constants'
  import numeral from 'numeral'

  export default {
    computed: {
      price () {
        const price = _.get(this.lightboxItem, [ 'price' ], 0)
        return `NT$ ${numeral(price).format('0,0')}`
      }
    },
    data () {
      return {
        WORDING: WORDING,
        SITE_URL: SITE_URL
      }
    },
    name: 'watch-item-lightbox-pc',
    methods: {
      closeLightbox () {
        this.$emit('closeLightbox')
      },
      getValue
    },
    mounted () {},
    props: [ 'lightboxItem' ]
  }
</script>
<style lang="stylus" scoped>
  .watch-item-lightbox
    position fixed
    background-color rgba(0, 0, 0, 0.8)
    width 100vw
    height 100vh
    top 0
    left 0
    display flex
    justify-content center
    align-items center
    z-index 999
    .lightbox-wrapper
      width 95%
      height 80%
      background-color #fff
      position relative
      &--close
        content ''
        position absolute
        right 10px
        top 10px
        height 30px
        width 30px
        background-position center center
        background-size contain
        background-repeat no-repeat
        background-image url(/public/icon/watch-lightbox-close.png)
        cursor pointer
      &--pic, &--content
        display inline-block
        height 100%
        vertical-align top
      &--pic
        width 45%
        padding 20px 0
        > img
          width 100%
          height 100%
          object-fit contain
          object-position center center
      &--content
        width 55%
        overflow auto
        > div:not(.content)
          padding 0 50px 0 30px
          margin 30px 0
        > div
          > div.title
            color #404040
        > .brief
          color #404040
          > div
            margin 0.2rem 0
            font-size 1rem
          > .brand
            font-size 1.6rem
            font-weight bold
            margin 0.8rem 0
          > .price
            color rgba(0, 0, 0, 0.5)
            font-size 0.9rem

        > .content
          background-color #404040
          color rgba(255, 255, 255, 0.8)
          text-align justify
          padding 30px 50px 30px 30px
          > p
            font-size 0.9rem
            font-weight normal
            line-height 1.5rem

        > .specification
          width 100%
          > .title
            border-bottom 1px solid #000
            padding 0 0 1rem
            font-size 1rem
            font-weight bold
          .item
            display inline-block
            width calc(33% - 1.5rem)
            margin 1rem 1.5rem 0 0
            vertical-align top
            font-size 0.9rem
            line-height 1.5rem
            &--title, &--content
              vertical-align top
              display inline-block
            &--title
              width 34%
              color #000
            &--content
              color #808080
              margin-left 0.8rem
              width calc(66% - 0.8rem)
              > span
                display inline-block
            &.functions
              width calc(66% - 1.5rem)
              > .item--title
                width 17%
              > .item--content
                width calc(82% - 0.8rem)
        > .relateds
          > .title
            border-bottom 1px solid #000
            padding 0 0 1rem
            font-size 1rem
            font-weight bold
          > .item
            text-align left
            margin 1rem 0
            font-size 0.9rem
            > a
              &, &:hover, &:link, &:visited
                color #808080
</style>
