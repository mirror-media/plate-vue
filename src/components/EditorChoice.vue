<template>
  <section id="editorChoice" class="editorChoice container">
    <app-slider class="editorChoice-slides grid grid-4-fifth" slideId="editorChoiceSlider" :option="sliderOption">
      <template scope="props">
        <swiper-slide :is="props.slide" v-for="(item, index) in editorChoice.items">
          <a :href="getHref(item)" target="_blank">
            <div :id="'slide-' + index" class="editorChoice-image"
            :style="{ backgroundImage: 'url(' + item.heroImage.image.resizedTargets.desktop.url + ')' }">
            </div>
          </a>
        </swiper-slide>
      </template>
    </app-slider>
    <div class="editorChoice-list grid grid-1-fifth">
      <div v-for="(item, index) in editorChoice.items"
            :class="(index === 0) ? 'editorChoice-list__item active' : 'editorChoice-list__item'"
            :style="(index === 0) ? styleFor1stitem(getValue(item, [ 'sections', 0, 'id' ])) : ''"
            @click="jumpToSlideForParent">
        <span v-text="item.title" @click="jumpToSlide" :index="index" :section="getValue(item, [ 'sections', 0, 'id' ])"></span>
      </div>
    </div>
  </section>
</template>
<script>

import { SECTION_MAP } from '../constants'
import { getHref, getTruncatedVal, getValue } from '../utils/comm'
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
        grabCursor: false
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
    getTruncatedVal,
    getValue,
    styleFor1stitem(sect) {
      return {
        borderLeft: SECTION_MAP[ sect ][ "borderLeft" ]
      }
    }
  },
  mounted() {
  },
  name: 'editorChoice'
}

</script>
<style lang="stylus" scoped>

.editorChoice
  &.container
    flex-direction: row
    height 500px
    margin-bottom 20px

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
    background-color #f6f6f6
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
        background-color: #fff;


</style>
