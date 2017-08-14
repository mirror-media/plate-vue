<template>
  <section class="listChoice container">
    <h1 :style="{ color: sectionColor }">編輯精選</h1>
    <div class="listChoice__block" v-for="(item, index) in sectionfeatured" :class="[ index%2 !== 0 ? 'right' : '' ]">
      <figure>
        <template>
          <router-link :to="getHref(item)" :id="`listing_choice-${item.name}-img`" target="_blank">
            <img :src="getImage(item, viewportTarget)" />
          </router-link>
        </template>
      </figure>
      <div class="listChoice__block--content" :style="{ borderColor: sectionColor }">
        <h2><router-link :to="getHref(item)" :id="`listing_choice-${item.name}-title`" target="_blank" v-text="getTruncatedVal(getValue(item, [ 'title' ]), 30)"></router-link></h2>
        <p><router-link :to="getHref(item)" :id="`listing_choice-${item.name}-descr`" target="_blank" v-text="getBrief(item, 45)"></router-link></p>
      </div>
    </div>
  </section>
</template>

<script>

import { SECTION_MAP } from '../constants'
import { getBrief, getHref, getImage, getTruncatedVal, getValue } from '../util/comm'
import _ from 'lodash'

export default {
  name: 'listChoice',
  props: [ 'initialSection', 'initialSectionfeatured', 'viewport' ],
  computed: {
    section () {
      return this.initialSection
    },
    sectionfeatured () {
      return this.initialSectionfeatured
    },
    sectionColor () {
      return _.get(SECTION_MAP, [ _.get(this.section, [ 'id' ]), 'bgcolor' ], '#bcbcbc')
    },
    viewportTarget () {
      if (this.viewport < 600) {
        return 'mobile'
      } else {
        return 'desktop'
      }
    }
  },
  methods: {
    getBrief,
    getImage,
    getTruncatedVal,
    getHref,
    getValue
  }
}
</script>

<style lang="stylus" scoped>

.listChoice
  display block
  h1
    padding-left 2rem
    margin .5em 0 0
    font-size 1.5rem
    font-weight normal
  &__block
    margin .5em 0 1em
    background-color #fff
    box-shadow 0px 2px 5px #bcbcbc
    figure
      position relative
      width 100%
      padding-top 66.66%
      margin 0
      overflow hidden
      a
        font-size 0
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
    &--content
      padding 0 30px 15px
      border-top-width 7px
      border-top-style solid
      h2
        margin 0
        padding .5em 0
        font-size 1.3rem
        font-weight 300
        text-align justify
        line-height 1.3
      p
        margin 0
        color #999
        font-size 1rem
        font-weight 300
        text-align justify
        line-height 1.5
        a
          color #999

@media (min-width: 600px)
  .listChoice
    width 100%
    padding 0 25px
    h1
      padding 0
    &__block
      display flex
      margin 1em 0
      figure
        width 50%
        padding-top calc((100vw - 50px) * 0.5 * 0.6666)
      &.right
        flex-direction row-reverse
        figure
          width calc(50% - 7px)
        .listChoice__block--content
          border-top none
          border-left none
          border-right-width 7px
          border-right-style solid
      &--content
        display flex
        flex-direction column
        justify-content center
        align-items center
        width 50%
        padding 0 30px
        border-top none
        border-left-width 7px
        border-left-style solid
        h2, p
          width 100%
        h2
          font-size 1.4rem
        p
          font-size 1.1rem

@media (min-width: 1200px)
  .listChoice
    width 1024px
    margin 0 auto
    padding 0
    &__block
      figure
        width 33.33%
        padding-top calc(1024px * 0.3333 * 0.6667)
      &.right
        figure
          width 33.33%
      &--content
        width 66.67%
        padding 0 50px
</style>
