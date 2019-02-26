<template>
  <section id="editorChoice" class="editorChoice">
    <div class="slider">
      <h2>編輯精選</h2>
      <div class="slider-container" :style="{ width: `${editorChoice.length * 100}%`, transform: `translateX(-${100 / editorChoice.length * sliderCurrent}%)` }">
        <a v-for="item in editorChoice"
          :key="item.slug"
          :href="`/story/${item.slug}`"
          :style="{ width: `${100 / editorChoice.length}%`, backgroundImage: `url(${item.heroImage.image.resizedTargets.tablet.url})` }"
          class="slider__item"
          data-gtm-category="home"
          data-gtm="choice"
          target="_blank">
          <div class="slider__item-curtain"></div>
          <p class="slider__item-title" v-text="item.title"></p>
        </a>
      </div>
      <div class="slider__nav">
        <div class="nav-container" :style="{ width: `${ editorChoice.length * 8 + (editorChoice.length - 1) * 10 }px` }">
          <div v-for="(item, index) in editorChoice"
            :key="`btn-${item.slug}`"
            :class="{ active: sliderCurrent === index}"
            class="dot"
            @click="sliderCurrent = index">
          </div>
        </div>
      </div>
      <div class="slider__arrow next" @click="handleNextSlider">
        <img src="/assets/mirrormedia/icon/arrow2-2017.png" alt="下一則" >
      </div>
      <div class="slider__arrow previous" @click="handlePrevSlider">
        <img src="/assets/mirrormedia/icon/arrow1-2017.png" alt="上一則" >
      </div>
    </div>
    <div class="editorChoice--mobile">
      <div class="editorChoice__eyebrow"><h2>編輯精選</h2></div>
      <div v-for="(item, index) in editorChoice" :href="getHref(item)" class="editorChoice__block">
        <template>
          <router-link
            v-if="item.style !== 'projects'"
            :to="getHref(item)"
            :target="target"
            class="editorChoice__block--img"
            data-gtm-category="home"
            data-gtm="choice">
            <LatestAriticleImg class="figure"
              :src="getImage(item, 'mobile')" :id="getValue(item, [ 'heroImage', 'id' ], Date.now())"
              :key="getValue(item, [ 'heroImage', 'id' ], Date.now())"></LatestAriticleImg>
            <div :style="getSectionStyle(getValue(item, [ 'sections', 0 ], ''))" v-text="getValue(item, [ 'sections', 0, 'title' ], '')"></div>
          </router-link>
          <a
            v-if="item.style === 'projects'"
            :href="`https://www.mirrormedia.mg${getHref(item)}`"
            :target="target"
            class="editorChoice__block--img"
            data-gtm-category="home"
            data-gtm="choice">
            <LatestAriticleImg class="figure"
              :src="getImage(item, 'mobile')" :id="getValue(item, [ 'heroImage', 'id' ], Date.now())"
              :key="getValue(item, [ 'heroImage', 'id' ], Date.now())"></LatestAriticleImg>
            <div :style="getSectionStyle(getValue(item, [ 'sections', 0 ], ''))" v-text="getValue(item, [ 'sections', 0, 'title' ], '')"></div>
          </a>
        </template>
        <div class="editorChoice__block--title" :class="getSection(item)">
          <div :style="getSectionStyle(getValue(item, [ 'sections', 0 ], ''))" v-text="getValue(item, [ 'sections', 0, 'title' ], '')"></div>
          <template>
            <router-link
              v-if="item.style !== 'projects'"
              :to="getHref(item)"
              :target="target"
              data-gtm-category="home"
              data-gtm="choice">
              <h2 v-text="getTitle(item, 24)"></h2>
            </router-link>
            <a
              v-if="item.style === 'projects'"
              :href="`https://www.mirrormedia.mg${getHref(item)}`"
              :target="target"
              data-gtm-category="home"
              data-gtm="choice">
              <h2 v-text="getTitle(item, 24)"></h2>
            </a>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import { SECTION_MAP } from 'src/constants'
import { getHref, getImage, getSection, getTitle, getTruncatedVal, getValue } from 'src/util/comm'
import LatestAriticleImg from 'src/components/LatestAriticleImg.vue'
import Slider from 'src/components/Slider.vue'
import _ from 'lodash'

export default {
  name: 'editorChoice',
  components: {
    'app-slider': Slider,
    LatestAriticleImg
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
  data () {
    return {
      sliderCurrent: 0,
      sliderTimer: undefined,
      sliderTouchEndX: 0,
      sliderTouchStartX: 0,
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
    handleNextSlider () {
      clearInterval(this.sliderTimer)
      this.sliderCurrent = (this.sliderCurrent + 1 < this.editorChoice.length) ? this.sliderCurrent + 1 : 0
      this.setTimer()
    },
    handlePrevSlider () {
      clearInterval(this.sliderTimer)
      this.sliderCurrent = (this.sliderCurrent - 1 > -1) ? this.sliderCurrent - 1 : this.editorChoice.length - 1
      this.setTimer()
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
    setTimer () {
      this.sliderTimer = setInterval(() => {
        if (this.sliderCurrent + 1 < this.editorChoice.length) {
          this.sliderCurrent += 1
        } else {
          this.sliderCurrent = 0
        }
      }, 5000)
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
    this.setTimer()
  },
  updated () {
    this.setHoverEvent()
  },
  beforeDestroy () {
    clearInterval(this.sliderTimer)
  },
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
      .figure
        width 100%
        padding-top 66.66%
        margin 0
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
      > div:not(.figure)
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
      > div
        display none
    
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

.slider
  display none
  position relative
  width 100%
  padding-top 56.25%
  margin 0 auto
  overflow hidden
  > h2
    position absolute
    top 20px
    left 20px
    z-index 1
    margin 0
    color #fff
    font-size 1rem
    font-weight 500
    user-select none
    text-shadow #000 .1em .1em .5em
  &-container
    position absolute
    top 0
    left 0
    display flex
    height 100%
    transition transform 1s ease-out 0s
  &__item
    position relative
    display block
    height 100%
    background-size cover
    background-position center center
    background-repeat no-repeat
    &-title
      position absolute
      left 10%
      bottom 45px
      width 80%
      margin 0
      color #fff
      text-align justify
      font-size 2rem
      font-weight 500
      line-height 1.5
    &-curtain
      position absolute
      left 0
      right 0
      bottom 0
      height 60%
      background-image linear-gradient(transparent, rgba(0,0,0,1))
  &__nav
    display flex
    align-items center
    position absolute
    left 50%
    bottom 10px
    transform translateX(-50%)
    max-width 115px
    height 10px
    overflow hidden
    .nav-container
      display flex
    .dot
      width 8px
      height 8px
      background-color #b5b5b5
      border-radius 8px
      transition background-color .5s ease
      cursor pointer
      & + .dot
        margin-left 10px
      &:hover
        background-color #fff
      &.active
        background-color #fff
  &__arrow
    position absolute
    top 50%
    z-index 10
    transform translateY(-50%)
    cursor pointer
    img
      width 30px
    &.next
      right 15px
    &.previous
      left 15px

@media (max-width: 599px)
  .editorChoice--mobile
    width 100%
    > div
      &:not(:last-child):not(:first-child)
        margin 0
        border-bottom 1px solid #fff
    .editorChoice__eyebrow
      width 90%
      margin 0 auto 10px
      h2
        &::after
          content none
    .editorChoice__block
      position relative
    .editorChoice__block--img
      > div
        &:not(.figure)
          display none
      .figure
        padding-top 56.25%
    .editorChoice__block--title
      position absolute
      bottom 0
      left 5%
      width 90%
      > div
        display inline-flex
        justify-content center
        align-items center
        height 30px
        padding 0 .5em
        color #fff
        font-size 1rem
        white-space nowrap
      h2
        margin-top 5px
        color #fff
        text-shadow 1.4px 1.4px 1.9px rgba(0, 0, 0, 0.2)

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
      height 576px
    .editorChoice__menu
      display flex
      position absolute
      left 0
      right 0
      bottom 0
      z-index 10
      width 100%
      background-color rgba(246,246,246,.8)
      min-height 76px
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
      
  .slider
    display block

</style>
