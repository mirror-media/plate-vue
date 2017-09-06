<template>
  <section class="editorChoiceFood">
    <h2 class="editorChoiceFood__title">編輯精選</h2>
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
        return this.getTruncatedVal(title, 14)
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
  &__title
    width 120px
    padding 10px
    margin 0 0 25px
    color #fff
    font-size 24px
    font-weight 300
    letter-spacing 1px
    line-height 26px
    background-color #4d4d4d
    
.editorChoiceFoodBlock
  display flex
  flex-direction column
  width 100%
  margin-bottom 40px
  background-color rgba(255, 255, 255, .6)
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
  &__content
    padding 1em
    a
      color #000
    h2
      margin 0
      font-weight 700
      line-height 1.5
    p
      margin .5em 0  0
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
      display flex
      flex-direction column
      justify-content center
      width 48%
      padding-right 1em
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
    > div:nth-child(2)
      width 100%
      h2
        font-size 2rem
      p
        font-size 1.5rem
    > div:not(:first-child):not(:nth-child(2))
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
  .editorChoiceFoodBlock
    &__content
      padding-right 2em

</style>
