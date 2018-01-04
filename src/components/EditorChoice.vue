<template>
  <section id="editorChoice" class="editorChoice">
    <h2>編輯精選</h2>
    <app-slider class="editorChoice__slides" slideId="editorChoiceSlider" :option="sliderOption" v-if="viewport > 1199">
      <template slot-scope="props">
        <swiper-slide :is="props.slide" v-for="(item, index) in editorChoice"  :key="`${index}-${Date.now()}`">
          <template>
            <router-link :to="getHref(item)" :id="'choices-' + item.name" v-if="item.style !== 'projects'" :target="target">
              <div :id="'slide-' + index" class="editorChoice__slides--img" :style="{ backgroundImage: 'url(' + getImage(item, 'desktop') + ')' }" :title="item.title">
              </div>
            </router-link>
            <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'choices-' + item.name" v-if="item.style === 'projects'" :target="target">
              <div :id="'slide-' + index" class="editorChoice__slides--img" :style="{ backgroundImage: 'url(' + getImage(item, 'desktop') + ')' }" :title="item.title">
              </div>
            </a>
          </template>
        </swiper-slide>
      </template>
    </app-slider>
    <div class="editorChoice__menu">
      <template v-for="(item, index) in editorChoice">
        <router-link :to="getHref(item)" :id="'choices-' + item.name" class="editorChoice__menu--item" :class="(index === 0) ? 'active' : ''"
          @click="jumpToSlideForParent" v-if="item.style !== 'projects'" :target="target">
          <span v-text="getTitle(item, 18)" @click="jumpToSlide" :index="index" :section="getValue(item, [ 'sections', 0, 'id' ])"></span>
        </router-link>
        <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'choices-' + item.name" class="editorChoice__menu--item" :class="(index === 0) ? 'active' : ''"
          @click="jumpToSlideForParent" v-if="item.style === 'projects'" :target="target">
          <span v-text="getTitle(item, 18)" @click="jumpToSlide" :index="index" :section="getValue(item, [ 'sections', 0, 'id' ])"></span>
        </a>
      </template>
    </div>
    <div class="editorChoice--mobile">
      <div class="editorChoice__eyebrow"><h2>編輯精選</h2></div>
      <div v-for="(item, index) in editorChoice" :href="getHref(item)" class="editorChoice__block">
        <template>
          <router-link :to="getHref(item)" :id="'choices-' + item.name" class="editorChoice__block--img" v-if="item.style !== 'projects'" :target="target">
            <figure v-lazy:background-image="getImage(item, 'mobile')" :title="item.title"></figure>
            <div :style="getSectionStyle(getValue(item, [ 'sections', 0 ], ''))" v-text="getValue(item, [ 'sections', 0, 'title' ], '')"></div>
          </router-link>
          <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'choices-' + item.name" class="editorChoice__block--img" v-if="item.style === 'projects'" :target="target">
            <figure v-lazy:background-image="getImage(item, 'mobile')" :title="item.title"></figure>
            <div :style="getSectionStyle(getValue(item, [ 'sections', 0 ], ''))" v-text="getValue(item, [ 'sections', 0, 'title' ], '')"></div>
          </a>
        </template>
        <div class="editorChoice__block--title" :class="getSection(item)">
          <template>
            <router-link :to="getHref(item)" :id="'choices-' + item.name" v-if="item.style !== 'projects'" :target="target"><h2 v-text="getTitle(item, 24)"></h2></router-link>
            <a :href="`https://www.mirrormedia.mg${getHref(item)}`" :id="'choices-' + item.name" v-if="item.style === 'projects'" :target="target"><h2 v-text="getTitle(item, 24)"></h2></a>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import { SECTION_MAP } from '../constants'
import { getHref, getImage, getSection, getTitle, getTruncatedVal, getValue } from '../util/comm'
import Slider from './Slider.vue'
import _ from 'lodash'

export default {
  name: 'editorChoice',
  components: {
    'app-slider': Slider
  },
  props: {
    editorChoice: {
      default: () => { return this.editorChoice }
    },
    target: {
      default: () => ('_self')
    },
    viewport: {
      default: () => { return undefined }
    }
  },
  computed: {
    sliderOption () {
      return {
        setNavBtn: false,
        grabCursor: false,
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        onSlideChangeStart: (swiper) => {
          this.updateNavStatus(swiper.activeIndex)
        }
      }
    }
  },
  methods: {
    jumpToSlide (e, pTarget) {
      if (!e && !pTarget) { return }
      const targ = pTarget || e.target
      const targOld = targ.parentNode.getAttribute('class')
      // const targSect = targ.getAttribute('section')
      const i = Number(targ.getAttribute('index'))
      window.refs[ 'editorChoiceSlider' ].slideTo((i + 1), 1000, false)
      const lastTarg = document.querySelector(`.${targOld}.active`)
      if (lastTarg) {
        lastTarg.setAttribute('class', `${targOld}`)
        lastTarg.removeAttribute('style')
      }
      // targ.parentNode.setAttribute('style', `border-left: ${SECTION_MAP[ targSect ][ 'borderLeft' ]};`)
      targ.parentNode.setAttribute('class', `${targOld} active`)
    },
    jumpToSlideForParent (e) {
      this.jumpToSlide(null, e.target.children[0])
    },
    getHref,
    getSrcSet (img) {
      return `${img.resizedTargets.mobile.url} 600w, ${img.resizedTargets.tablet.url} 900w, ${img.resizedTargets.desktop.url} 1200w`
    },
    getImage,
    getSection,
    getTitle,
    getTruncatedVal,
    getValue,
    getSectionStyle (sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = {
        backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#bcbcbc')
      }
      return style
    },
    setHoverEvent () {
      const _targ = document.querySelectorAll('.editorChoice__menu--item')
      const _targChilde = document.querySelectorAll('.editorChoice__menu--item > span')
      _.map(_targ, (o) => {
        o.onmouseover = (e) => {
          this.jumpToSlide(null, e.target.children[0])
        }
      })
      _.map(_targChilde, (o) => {
        o.onmouseover = (e) => {
          this.jumpToSlide(e)
        }
      })
    },
    styleFor1stitem (sect) {
      return {
        borderLeft: SECTION_MAP[ sect ][ 'borderLeft' ]
      }
    },
    updateNavStatus (ind) {
      const index = (ind !== 6) ? (ind % 6) : 1
      const targ = document.querySelector(`.editorChoice__menu--item span[index="${(index - 1)}"]`)
      const targOld = targ.parentNode.getAttribute('class')
      // const targSect = targ.getAttribute('section')
      const lastTarg = document.querySelector(`.${targOld}.active`)
      if (lastTarg) {
        lastTarg.setAttribute('class', `${targOld}`)
        lastTarg.removeAttribute('style')
      }
      // targ.parentNode.setAttribute('style', `border-left: ${SECTION_MAP[ targSect ][ 'borderLeft' ]};`)
      targ.parentNode.setAttribute('class', `${targOld} active`)
    }
  },
  mounted () {
    this.setHoverEvent()
  },
  updated () {
    this.setHoverEvent()
  }
}
</script>
<style lang="stylus" scoped>

.editorChoice
  > h2
    display none
  &__slides
    display none
    &--img
      position absolute
      width 100%
      height 100%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover
      
  &__menu
    display none
  &--mobile
    display flex
    flex-direction column
    width 90%
    margin 0 auto
    > div:not(:last-child):not(:first-child)
      margin-bottom 20px
    .editorChoice__block--img
      position relative
      color #fff
      display block
      figure
        width 100%
        padding-top 66.66%
        margin 0
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
      > div
        position absolute
        height 35px
        background-color #000
        display flex 
        justify-content center
        align-items center 
        font-size 1.2rem       
        top auto
        bottom 0
        left 0
        white-space nowrap
        padding 0 20px !important
    .editorChoice__block--title
      padding 0.5em 0
      h2
        margin 0
        font-size 1.25rem
        line-height 1.6rem
        font-weight normal
    
  &__eyebrow
    width 100%
    margin-bottom 10px
    color #356d9c
    h2
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

@media (min-width: 600px)
  .editorChoice
    &--mobile
      flex-direction row
      flex-wrap wrap
      justify-content space-between
      width 100%
      > div:nth-child(2)
        width 100%
      > div:not(:first-child):not(:nth-child(2))
        width calc( (100% - 30px)/2 )
      .editorChoice__block--title
        height 65px

@media (min-width: 1200px)
  .editorChoice
    display block
    position relative
    width 100%
    margin-bottom 15px
    > h2
      display block
      margin 0 0 10px
      color #356d9c
      font-size 1.3rem
      line-height 1.15
      font-weight 400
    .editorChoice__slides
      display block
      width 100%
      height 500px
    .editorChoice__menu
      display flex
      position absolute
      left 0
      right 0
      bottom 0
      z-index 10
      width 100%
      background-color rgba(246,246,246,.8)
      a:not(:last-child)
        border-right 1px solid rgba(204, 204, 204, 0.75)
      &--item
        display flex
        justify-content center
        align-items center
        flex-grow 1
        flex-basis 0
        padding .5em 1em
        color #000
        span
          text-align justify
          line-height 1.3
          font-weight 300
        &.active
          background-color #356d9c
          color #fff
    &--mobile
      display none

</style>
