<template>
  <div class="watch-item-lightbox">
    <div class="lightbox-wrapper">
      <div class="lightbox-wrapper--brief">
        <div class="pic">
          <img :alt="lightboxItem.name" v-lazy="getValue(lightboxItem, [ 'watchImage', 'image', 'url' ])"
            :data-srcset="`
              ${getValue(lightboxItem, [ 'watchImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')} 800w,
              ${getValue(lightboxItem, [ 'watchImage', 'image', 'resizedTargets', 'tablet', 'url' ], '')} 1200w,
              ${getValue(lightboxItem, [ 'watchImage', 'image', 'resizedTargets', 'desktop', 'url' ], '')} 2000w`">
        </div>
        <div class="brand" v-text="getValue(lightboxItem, [ 'brand', 'name' ])"></div>
        <div class="type" v-text="getValue(lightboxItem, [ 'type' ])"></div>
        <div class="price" v-text="price"></div>
      </div>
      <div class="lightbox-wrapper--content" v-if="getValue(lightboxItem, [ 'content', 'apiData' ])">
        <p v-for="paragraph in getValue(lightboxItem, [ 'content', 'apiData' ])" v-if="getValue(paragraph, [ 'type' ]) === 'unstyled'" v-text="getValue(paragraph, [ 'content', 0 ])"></p>
      </div>
      <div class="lightbox-wrapper--specification">
        <div class="lightbox-wrapper--specification_title"><span v-text="WORDING[ 'SPEC' ]"></span></div>
        <div class="lightbox-wrapper--specification_item">
          <div class="title"><span v-text="WORDING[ 'TYPE' ]"></span></div>
          <div class="content"><span v-text="getValue(lightboxItem, [ 'type' ])"></span></div>
        </div>
        <div class="lightbox-wrapper--specification_item">
          <div class="title"><span v-text="WORDING[ 'MATERIAL' ]"></span></div>
          <div class="content"><span v-text="getValue(lightboxItem, [ 'material' ])"></span></div>
          </div>
        <div class="lightbox-wrapper--specification_item">
          <div class="title"><span v-text="WORDING[ 'FUNCTIONS' ]"></span></div>
          <div class="content">
            <span v-for="(fn, i) in getValue(lightboxItem, [ 'watchfunction' ])" v-text="i !== 0 ? `、${fn.name}` : fn.name"></span>
          </div>
        </div>
        <div class="lightbox-wrapper--specification_item">
          <div class="title"><span v-text="WORDING[ 'WATERPROOF' ]"></span></div>
          <div class="content"><span v-text="getValue(lightboxItem, [ 'waterproof' ])"></span></div>
        </div>
        <div class="lightbox-wrapper--specification_item">
          <div class="title"><span v-text="WORDING[ 'MOVEMENT' ]"></span></div>
          <div class="content"><span v-text="getValue(lightboxItem, [ 'movement' ])"></span></div>
        </div>
      </div>
      <div class="lightbox-wrapper--related" v-if="getValue(lightboxItem, [ 'relateds' ])">
        <div class="lightbox-wrapper--related_title" v-text="WORDING[ 'RELATED' ]"></div>
        <div class="lightbox-wrapper--related_item" v-for="post in getValue(lightboxItem, [ 'relateds' ])">
          <a target="_blank" :href="`${SITE_URL}/story/${getValue(post, [ 'slug' ], getValue(post, [ 'name' ], ''))}`" v-text="getValue(post, [ 'title' ], '')"></a>
        </div>
      </div>
      <div class="lightbox-wrapper--close" @click="closeLightbox"></div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING } from '../../constants/watch101'
  import { SITE_URL } from '../../constants'
  import { getValue } from '../../util/comm'
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
    name: 'watch-item-lightbox',
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
    width 100vw
    height 100vh
    top 0
    left 0
    background-color rgba(0, 0, 0, 0.7)
    z-index 999
    display flex
    justify-content center
    align-items center
    .lightbox-wrapper
      width 100%
      height 100%
      position relative
      overflow auto
      > div
        > div[class$="_title"]
          color #404040
      &--close
        content ''
        position fixed
        right 10px
        top 10px
        height 30px
        width 30px
        background-position center center
        background-size contain
        background-repeat no-repeat
        background-image url(/public/icon/watch-lightbox-close.png)
      &--brief
        width 100%
        // height 100vh
        background-color #fff
        padding 10px 0 20px
        color #404040
        > div
          text-align center
        > div:not(.pic)
          margin 5px auto
          &.brand
            margin 15px auto
          &.price
            margin 10px auto 5px
        > .pic
          width 100%
          > img
            width 100%
        > .brand
          font-weight bold
          font-size 2rem
        > .price
          color #b3b3b3
      &--content
        background-color #404040
        color #fff
        padding 20px
        text-align justify
        p
          margin 0 0 1rem
          font-size 1rem
          line-height 1.5rem
      &--specification
        background-color #fff
        padding-bottom 10px
        &_title
          padding 20px
          font-size 1.3rem
          font-weight bold
          border-bottom 1px solid #000
        &_item
          font-size 1.1rem
          padding 0 20px
          margin 10px 0
          &:nth-child(2)
            margin 20px 0 10px
          > div
            display inline-block
            vertical-align top
            color #636363
            &.title
              color #000
              width 29%
            &.content
              color #808080
              width 70%
              word-break break-word
              > span
                display inline-block
                margin 0 0 5px 0
      &--related
        background-color #fff
        padding-bottom 40px
        line-height 1.5rem
        &_title
          padding 20px
          font-size 1.3rem
          font-weight bold
          border-bottom 1px solid #000
          margin-bottom 20px
        &_item
          padding 0 20px
          margin 10px 0
          > a
            &, &:hover, &:link, &:visited
              color #636363
              
</style>
