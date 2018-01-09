<template>
  <section class="popListVert">
    <div class="popListVert__title">熱門文章</div>
    <div class="popListVert-list">
      <template v-for="(o, i) in popArticles">
        <div class="popListVert-list__item" :key="`popListVert${i}`">
          <router-link :to="o.slug" :id="`popular-${i}-popVertImg`" class="popListVert-list__item--img"><img v-lazy="getImage(o, 'mobile')" :alt="getValue(o, [ 'title' ])"></router-link>
          <div class="popListVert-list__item--text">
            <div :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', '0', 'title' ])"></div>
            <h2><router-link :to="o.slug" :id="`popular-${i}-popVertTitle`" v-text="getTruncatedVal(o.title, 12)"></router-link></h2>
          </div>
        </div>
        <slot name="microAdNA3" v-if="i === 1"></slot>
        <slot name="microAdNA5" v-if="i === 2"></slot>
        <slot name="microAdNA9" v-if="i === 5"></slot>
      </template>
    </div>
  </section>
</template>

<script>

import { SECTION_MAP } from '../../constants'
import { getHref, getImage, getTruncatedVal, getValue } from '../../util/comm'
import _ from 'lodash'

export default {
  name: 'popListVert',
  props: {
    pop: {
      type: Array,
      default: []
    }
  },
  computed: {
    popArticles () {
      return _.take(this.pop, 6)
    }
  },
  methods: {
    getHref,
    getImage,
    getTruncatedVal,
    getValue,
    getSectionStyle (sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = { backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#bcbcbc') }
      return style
    }
  }
}
</script>

<style lang="stylus">
.popListVert
  width 100%
  border 1px solid #dedede
  &__title
    padding .3em 1em
    color #fff
    font-size 18px
    letter-spacing 1px
    background-color #0c5a80
  &-list
    padding 1em 1em
    div:first-child
      margin-top 0
    div:last-child
      margin-bottom 0
    &__item
      display flex
      justify-content space-between
      margin 1.3em 0
      &--img
        position relative
        width 48%
        padding-top calc(48% * 0.6666)
        img
          position absolute
          top 0
          left 0
          bottom 0
          right 0
          width 100%
          height 100%
          object-fit cover
          object-position 50% 50%
      &--text
        width 48%
        text-align justify
        > div
          display inline-block
          height 25px
          padding 0 5px
          color #fff
          font-size 0.9rem
          letter-spacing 1px
          line-height 25px
        h2
          margin .8em 0 0
          font-size 1rem
          font-weight 700
        
</style>
