<template>
  <section id="editorChoice" class="editorChoice container">
    <app-slider class="editorChoice-slides grid grid-4-fifth desktop-only" slideId="editorChoiceSlider" :option="sliderOption">
      <template scope="props">
        <swiper-slide :is="props.slide" v-for="(item, index) in editorChoice">
          <router-link :to="getHref(item)">
            <div :id="'slide-' + index" class="editorChoice-image"
            :style="{ backgroundImage: 'url(' + getImage(item, 'desktop') + ')' }">
            </div>
          </router-link>
        </swiper-slide>
      </template>
    </app-slider>
    <div class="editorChoice-list grid grid-1-fifth desktop-only">
      <router-link v-for="(item, index) in editorChoice" :to="getHref(item)"
            :class="(index === 0) ? 'editorChoice-list__item active' : 'editorChoice-list__item'"
            :style="(index === 0) ? styleFor1stitem(getValue(item, [ 'sections', 0, 'id' ])) : ''"
            @click="jumpToSlideForParent">
        <span v-text="item.title" @click="jumpToSlide" :index="index" :section="getValue(item, [ 'sections', 0, 'id' ])"></span>
      </router-link>
    </div>
    <div class="editorChoice-list mobile-only">
      <div v-for="(item, index) in editorChoice" :href="getHref(item)" class="editorChoice-list-post">
        <router-link :to="getHref(item)" class="editorChoice-list-post__img">
          <figure :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }"></figure>
        </router-link>
        <div class="editorChoice-list-post__title" :class="getSection(item)">
          <router-link :to="getHref(item)" ><h2 v-text="getTitle(item, 24)"></h2></router-link>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import { SECTION_MAP } from '../constants'
import { getHref, getImage, getSection, getTitle, getTruncatedVal, getValue } from '../utils/comm'
import Slider from './Slider.vue'
import _ from 'lodash'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'


export default {
  beforeMount () {},
  components: {
    'app-slider': Slider
  },
  computed: {
    sliderOption() {
      return {
        setNavBtn: false,
        grabCursor: false,
        autoplay : 5000,
        autoplayDisableOnInteraction: false,
        onSlideChangeStart: (swiper) => {
          this.updateNavStatus(swiper.activeIndex)
        }
      }
    },
  },
  data () {
    return {

    }
  },
  props: {
    editorChoice: this.editorChoice
  },
  methods: {
    jumpToSlide(e, pTarget) {
      if(!e && !pTarget) { return }
      const targ = pTarget || e.target
      const targOld = targ.parentNode.getAttribute('class')
      const targSect = targ.getAttribute('section')
      const i = Number(targ.getAttribute('index'))
      window.refs[ 'editorChoiceSlider' ].slideTo((i + 1), 1000, false)
      const lastTarg = document.querySelector(`.${targOld}.active`)
      if(lastTarg) {
        lastTarg.setAttribute('class', `${targOld}`)
        lastTarg.removeAttribute('style')
      }
      targ.parentNode.setAttribute('style', `border-left: ${SECTION_MAP[ targSect ][ "borderLeft" ]};`)
      targ.parentNode.setAttribute('class', `${targOld} active`)
    },
    jumpToSlideForParent(e) {
      this.jumpToSlide(null, e.target.children[0])
    },
    updateNavStatus(ind) {
      const index = (ind !== 6 ) ? (ind % 6) : 1
      const targ = document.querySelector(`.editorChoice-list__item span[index="${(index - 1)}"]`)
      const targOld = targ.parentNode.getAttribute('class')
      const targSect = targ.getAttribute('section')
      const lastTarg = document.querySelector(`.${targOld}.active`)
      if(lastTarg) {
        lastTarg.setAttribute('class', `${targOld}`)
        lastTarg.removeAttribute('style')        
      }
      targ.parentNode.setAttribute('style', `border-left: ${SECTION_MAP[ targSect ][ "borderLeft" ]};`)
      targ.parentNode.setAttribute('class', `${targOld} active`)
    },
    getHref,
    getSrcSet(img) {
      return `${img.resizedTargets.mobile.url} 600w, ${img.resizedTargets.tablet.url} 900w, ${img.resizedTargets.desktop.url} 1200w`
    },
    getImage,
    getSection,
    getTitle,
    getTruncatedVal,
    getValue,
    styleFor1stitem(sect) {
      return {
        borderLeft: SECTION_MAP[ sect ][ "borderLeft" ]
      }
    },
    setHoverEvent() {
      const _targ = document.querySelectorAll('.editorChoice-list__item')
      const _targII = document.querySelectorAll('.editorChoice-list__item > span')
      _.map(_targ, (o) => {
        o.addEventListener('mouseover', (e) => {
          this.jumpToSlide(null, e.target.children[0])
        })
      })
      _.map(_targII, (o) => {
        o.addEventListener('mouseover', (e) => {
          this.jumpToSlide(e)
        })
      })
    }
  },
  mounted() {
    this.setHoverEvent()
  },
  name: 'editorChoice'
}

</script>
<style lang="stylus" scoped>

$color-news = #30bac8
$color-entertainment = #bf3284
$color-foodtravel = #eac151
$color-watch = #c1d16e
$color-projects = #000
$color-other = #bcbcbc

.editorChoice
  &.container
    flex-direction: row
    width 100%
    height auto
    margin-bottom 35px

  .grid
    position relative
    overflow hidden

  &-slides
    height: 100%
  &-image
    position absolute
    width 100%
    height 100%
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover

    & img
      width 100%
      height 100%

  &-list
    height 100%
    a:last-child
      div
        border-bottom none

    &__item
      display flex
      flex-direction: column
      justify-content: center
      height 20%
      padding 0 1em
      border-bottom 1px solid rgba(204, 204, 204, 0.75);
      cursor: pointer
      &:last-child
        border-bottom none
      &.active
        background-color #fff
    &.mobile-only
      display flex
      flex-direction column
      width 100%
      padding 0 1em
      > div:not(:last-child)
        margin-bottom 20px
      .editorChoice-list-post
        &__img
          > figure
            width 100%
            padding-top 66.66%
            margin 0
            background-position 50% 50%
            background-repeat no-repeat
            background-size cover
        &__title
          padding .5em 1em
          h2
            margin 0
          &.news-people
            border-left 8px solid $color-news

          &.entertainment
            border-left 8px solid $color-entertainment

          &.foodtravel
            border-left 8px solid $color-foodtravel

          &.watch
            border-left 8px solid $color-watch

          &.projects
            border-left 8px solid $color-projects

          &.other
            border-left 8px solid $color-other

@media (min-width: 600px)
  .editorChoice-list
    &.mobile-only
      flex-direction row
      flex-wrap wrap
      justify-content space-between
      padding 0 2em
      > div:first-child
        width 100%
      > div:not(:first-child)
        width calc( (100% - 30px)/2 )
      .editorChoice-list-post
        &__title
          height 65px

@media (min-width: 1200px)
  .editorChoice
    &.container
      flex-direction: row
      width 1024px
      height 500px
      margin-bottom 35px
    &-list
      background-color #f6f6f6

</style>
