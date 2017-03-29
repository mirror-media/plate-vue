<template>
  <section id="editorChoice" class="editorChoice container">
    <app-slider class="editorChoice-slides grid grid-4-fifth desktop-only" slideId="editorChoiceSlider" :option="sliderOption">
      <template scope="props">
        <swiper-slide :is="props.slide" v-for="(item, index) in editorChoice">
          <router-link :to="getHref(item)" :id="'choices-' + item.name">
            <div :id="'slide-' + index" class="editorChoice-image"
            :style="{ backgroundImage: 'url(' + getImage(item, 'desktop') + ')' }">
            </div>
          </router-link>
        </swiper-slide>
      </template>
    </app-slider>
    <div class="editorChoice-list grid grid-1-fifth desktop-only">
      <router-link v-for="(item, index) in editorChoice" :to="getHref(item) " :id="'choices-' + item.name"
            :class="(index === 0) ? 'editorChoice-list__item active' : 'editorChoice-list__item'"
            :style="(index === 0) ? styleFor1stitem(getValue(item, [ 'sections', 0, 'id' ])) : ''"
            @click="jumpToSlideForParent">
        <span v-text="getTitle(item, 24)" @click="jumpToSlide" :index="index" :section="getValue(item, [ 'sections', 0, 'id' ])"></span>
      </router-link>
    </div>
    <div class="editorChoice-title mobile-only"><h2>編輯精選</h2></div>
    <div class="editorChoice-list mobile-only">
      <div v-for="(item, index) in editorChoice" :href="getHref(item)" class="editorChoice-list-post">
        <router-link :to="getHref(item)" :id="'choices-' + item.name" class="editorChoice-list-post__img">
          <figure :style="{ backgroundImage: 'url(' + getImage(item, 'mobile') + ')' }"></figure>
          <div class="section-label" :style="getSectionStyle(getValue(item, [ 'sections', 0 ], ''))" v-text="getValue(item, [ 'sections', 0, 'title' ], '')"></div>
        </router-link>
        <div class="editorChoice-list-post__title" :class="getSection(item)">
          <router-link :to="getHref(item)" :id="'choices-' + item.name"><h2 v-text="getTitle(item, 24)"></h2></router-link>
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
    getHref,
    getSrcSet(img) {
      return `${img.resizedTargets.mobile.url} 600w, ${img.resizedTargets.tablet.url} 900w, ${img.resizedTargets.desktop.url} 1200w`
    },
    getImage,
    getSection,
    getTitle,
    getTruncatedVal,
    getValue,
    getSectionStyle(sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = { 
        backgroundColor: _.get( SECTION_MAP, [sectionId, 'bgcolor'], 'rgba(140, 140, 140, 0.18)'),
        width:  _.get( SECTION_MAP, [sectionId, 'label-width-tablet'], '60px'),
      }
      return style
    },
    setHoverEvent() {
      const _targ = document.querySelectorAll('.editorChoice-list__item')
      const _targII = document.querySelectorAll('.editorChoice-list__item > span')
      _.map(_targ, (o) => {
        o.onmouseover = (e) => {
          this.jumpToSlide(null, e.target.children[0])
        }
      })
      _.map(_targII, (o) => {
        o.onmouseover = (e) => {
          this.jumpToSlide(e)
        }
      })
    },
    styleFor1stitem(sect) {
      return {
        borderLeft: SECTION_MAP[ sect ][ "borderLeft" ]
      }
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
  },
  mounted() {
    this.setHoverEvent()
  },
  name: 'editorChoice',
  updated() {
    this.setHoverEvent()
  }
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
    display block
    flex-direction column
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

  &-title
    width 100%
    padding 0 2em
    margin-bottom 10px
    color #356d9c

    > h2
      margin 0
      overflow hidden

      &::after
        content ""
        display inline-block
        height .5em
        vertical-align middle
        width 100%
        margin-right -100%
        margin-left 10px
        border-top 5px solid #356d9c

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
      > span
        font-size 1rem
        line-height 1.5rem
      &:last-child
        border-bottom none
      &.active
        background-color #fff

    &.mobile-only
      display flex
      flex-direction column
      width 90%
      margin 0 auto

      > div:not(:last-child)
        margin-bottom 20px

      .editorChoice-list-post

        > a
          position relative
          color #fff

          .section-label
            position absolute
            width 60px
            height 35px
            top -35px
            background-color #000
            display flex 
            justify-content center
            align-items center 
            font-size 1.2rem           

        &__img
          > figure
            width 100%
            padding-top 66.66%
            margin 0
            background-position 50% 50%
            background-repeat no-repeat
            background-size cover
                
        &__title
          padding .5em 0

          h2
            font-size 1.5rem
            line-height 2rem
            margin 0
            font-weight 300

@media (min-width: 600px)
  .editorChoice-list
    &.mobile-only
      flex-direction row
      flex-wrap wrap
      justify-content space-between
      width 100%
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
      display flex
      flex-direction: row
      width 1024px
      height 500px
      margin-bottom 35px
    &-list
      background-color #f6f6f6

</style>
