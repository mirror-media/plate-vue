<template>
  <div class="annotation">
    <span class='part-1' v-html="annotationPart1"></span>
    <span class='part-2 tooltip' :class="isActive" @mouseover="mouseover" @mouseout="mouseout" @touchstart="touchstart" @touchend="touchend">
      <span v-html="annotationPart2"></span>
      <span class="tooltiptext" v-html="annotationText" :style="annotationTextStyle"></span>
      <img src='/assets/mirrormedia/icon/info.png' style="height: 1.3rem; margin-left: 3px;">
    </span>
    <span v-if="!isPart3HasAnnotation" class='part-3' v-html="annotationPart3"></span>
    <annotation v-if="isPart3HasAnnotation" class="recursive-annotation" :annotationStr="annotationPart3"></annotation>
  </div>
</template>
<script>
import _ from 'lodash'
import { getClientOS } from '../../util/comm'

export default {
  name: 'annotation',
  props: [ 'annotationStr' ],
  computed: {
    annotationPart1 () {
      return this.annotationComposer.annotationPart1
    },
    annotationPart2 () {
      return this.annotationComposer.annotationPart2
    },
    annotationPart3 () {
      return this.annotationComposer.annotationPart3
    },
    isPart3HasAnnotation () {
      return this.hasAnnotation(this.annotationPart3)
    },
    annotationText () {
      return this.annotationComposer.annotationText
    },
    annotationComposer () {
      const annotationContentStart = this.annotationStr.toString().indexOf(this.annotationTextTagStart)
      const annotationContentEnd = this.annotationStr.toString().indexOf(this.annotationTextTagEnd)

      const annotationContent = this.hasAnnotation(this.annotationStr) ? this.annotationStr.toString().substring(annotationContentStart + '<!--__ANNOTATION__='.length, annotationContentEnd) : '{}'

      const annotationContentObj = JSON.parse(annotationContent)

      let paragraph = this.annotationStr.toString()
      if (_.get(annotationContentObj, [ 'text' ])) {
        paragraph = paragraph.replace(`--><!--${annotationContentObj.text}-->`, '')
      }

      return {
        annotationPart1: this.annotationStr.toString().substring(0, annotationContentStart),
        annotationPart2: annotationContentObj.text,
        annotationPart3: paragraph.substring(annotationContentEnd),
        annotationText: _.get(annotationContentObj, [ 'pureAnnotationText' ], '')
      }
    },
    isActive () {
      return {
        active: this.mouseovered
      }
    },
    os () {
      if (process.env.VUE_ENV === 'client') {
        return getClientOS()
      } else {
        return undefined
      }
    }
  },
  data () {
    return {
      annotationTextTagStart: '<!--__ANNOTATION__=',
      annotationTextTagEnd: '-->',
      annotationTextStyle: '',
      mouseovered: false
    }
  },
  methods: {
    mouseover (e) {
      if (this.os !== 'Android' && this.os !== 'iOS') {
        this.mouseovered = true
        this.annotationTextStyle = `left: ${e.clientX}px; top: ${(e.clientY + 20)}px; position: fixed; width: 300px;`
      }
    },
    mouseout () {
      this.mouseovered = false
    },
    touchstart (e) {
      this.mouseovered = true
      this.annotationTextStyle = `position: fixed; left: 0; top: ${(e.touches[0].clientY + 20)}px; width: 100vw;`
    },
    touchend () {
      this.mouseovered = false
    },
    hasAnnotation (paragraph) {
      const annotationContentStart = paragraph.toString().indexOf(this.annotationTextTagStart)
      const annotationContentEnd = paragraph.toString().indexOf(this.annotationTextTagEnd)

      return (annotationContentStart > -1 && annotationContentEnd > -1)
    }
  }
}
</script>
<style lang="stylus">
  .annotation
    color #171717
    font-size 18px
    line-height 36px
    margin 1.5em 0
    text-align justify

  .tooltip
    position relative
    border-bottom 2px dotted black
    cursor pointer
    padding-bottom 3px

    & > .tooltiptext
      visibility hidden
      min-width 280px
      background-color black
      color #fff
      text-align center
      border-radius 6px
      padding 1rem
      text-decoration none
      position absolute
      left 0
      top 2rem
      z-index 1
      line-height 1.6rem
      font-size 1rem
      word-break break-word
    
    &.active
      -webkit-touch-callout none
      -webkit-user-select none
      -khtml-user-select none
      -moz-user-select none
      -ms-user-select none
      user-select none

      & > .tooltiptext
        visibility visible

  .recursive-annotation
    display inline

</style>
