<template>
  <section class="editorChoiceFood">
    <div class="editorChoiceFoodBlock" v-for="(item, index) in sectionfeatured">
      <router-link :to="getHref(item)" class="editorChoiceFoodBlock__img" target="_blank"><figure :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }"></figure></router-link>
      <div class="editorChoiceFoodBlock__content">
        <router-link :to="getHref(item)" target="_blank"><h2 v-text="calcTitle(getValue(item, [ 'title' ]))"></h2></router-link>
        <router-link :to="getHref(item)" target="_blank"><p v-text="calcBrief(item, index)"></p></router-link>
      </div>
    </div>
  </section>
</template>
<script>

import { getBrief, getHref, getImage, getTruncatedVal, getValue } from '../util/comm'

export default {
  name: 'editorChoice-foodTravel',
  props: {
    sectionfeatured: {
      type: Array,
      default: []
    },
    viewport: {
      type: Number,
      default: 0
    }
  },
  methods: {
    calcBrief (article, index) {
      if (this.viewport < 587) {
        return this.getBrief(article, 35)
      } else if (this.viewport < 900) {
        return this.getBrief(article, 30)
      } else if (this.viewport < 1300) {
        if (index === 0) {
          return this.getBrief(article, 59)
        } else {
          return this.getBrief(article, 12)
        }
      } else {
        if (index === 0) {
          return this.getBrief(article, 70)
        } else {
          return this.getBrief(article, 31)
        }
      }
    },
    calcTitle (title) {
      if (this.viewport < 587) {
        return title
      } else if (this.viewport < 900) {
        return this.getTruncatedVal(title, 19)
      } else if (this.viewport < 1300) {
        return this.getTruncatedVal(title, 15)
      } else {
        return this.getTruncatedVal(title, 19)
      }
    },
    getBrief,
    getHref,
    getImage,
    getTruncatedVal,
    getValue
  }
}
</script>
<style lang="stylus" scoped>

.editorChoiceFood
  display flex
  flex-direction column
  padding 10% 5% 5%
.editorChoiceFoodBlock
  display flex
  flex-direction column
  width 100%
  margin-bottom 40px
  figure
    width 100%
    height 100%
    margin 0
    padding-top calc(100% * 0.6666)
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover
  &__img
    position relative
    width 100%
    
    &:before
      content '編輯精選' 
      position absolute
      bottom 0
      left 1px
      z-index 1
      padding .5em
      color #fff
      background-color #4d4d4d
  &__content
    a
      color #000
    h2
      margin .5em 0
      padding-bottom .5em
      font-weight 700
      line-height 1.5
      border-bottom 3px solid #000
    p
      margin 0
      text-align justify
      line-height 1.5

@media (min-width: 600px)
  .editorChoiceFoodBlock
    flex-direction row
    justify-content space-between
    figure
      padding-top calc(100% * 0.6666)
    &__img
      position relative
      width 48%
      
    &__content
      width 48%
      h2
        margin 0
      p
        margin-top .5em

@media (min-width: 900px)
  .editorChoiceFood
    flex-direction row
    flex-wrap wrap
    justify-content space-between
    padding 0
    margin 5%
    > div:first-child
      width 100%
      h2
        font-size 2rem
      p
        font-size 1.5rem
    > div:not(:first-child)
      width 48%
      margin-top 40px
      h2
        font-size 1.5rem
      p
        font-size 1rem
  .editorChoiceFoodBlock
    margin-bottom 0

@media (min-width: 1200px)
  .editorChoiceFood
    margin 5% 4.3% 5% 8.3%

</style>
