<template>
  <section class="projectListVert">
    <div class="projectListVert__title">專題報導</div>
    <div class="projectListVert-list">
      <div class="projectListVert-list__item" :class="[isSquareStyle ? 'square' : '' ]" v-for="item in projects">
        <a :id="`projects-${item.name}-img`" :href="`${siteUrl}/projects/${item.slug}`" :target="[openInNewWindow ? '_blank' : '']" class="projectListVert-list__item--img"><img v-lazy="getImage(item, 'mobile')"></a>
        <div class="projectListVert-list__item--text">
          <a :id="`projects-${item.name}-title`" :href="`${siteUrl}/projects/${item.slug}`" :target="[openInNewWindow ? '_blank' : '']"><h2 v-text="truncateTitle(item.title)"></h2></a>
          <a :id="`projects-${item.name}-descr`" :href="`${siteUrl}/projects/${item.slug}`" :target="[openInNewWindow ? '_blank' : '']"><p v-text="truncateBrief(getValue(item, [ 'brief', 'html' ], ''))"></p></a>
        </div>
      </div>
    </div>
    <div class="projectListVert__link"><router-link id="more-projcets" to="/topic/58f067697bce2b0e0048299e">看更多</router-link></div>
  </section>
</template>
<script>
  import _ from 'lodash'
  import { SITE_URL } from '../../constants'
  import { getImage, getTruncatedVal, getValue } from '../../util/comm'
  import sanitizeHtml from 'sanitize-html'

  export default {
    props: {
      initProjects: {
        default: () => { return {} }
      },
      isSquareStyle: {
        default: () => { return false }
      },
      openInNewWindow: {
        default: () => { return false }
      }
    },
    data () {
      return {
        siteUrl: SITE_URL
      }
    },
    computed: {
      projects () {
        return _.take(this.initProjects, 4)
      }
    },
    methods: {
      getImage,
      getTruncatedVal,
      getValue,
      sanitizeHtml,
      truncateBrief (text) {
        if (this.isSquareStyle) {
          return this.getTruncatedVal(this.sanitizeHtml(text, { allowedTags: [ ] }), 9)
        } else {
          return this.getTruncatedVal(this.sanitizeHtml(text, { allowedTags: [ ] }), 19)
        }
      },
      truncateTitle (text) {
        if (this.isSquareStyle) {
          return this.getTruncatedVal(text, 9)
        } else {
          return this.getTruncatedVal(text, 13)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>

.projectListVert
  width 100%
  margin-top 10px
  border 1px solid #dedede
  &__title
    padding .5em 1em
    color #fff
    font-size 19px
    letter-spacing 1px
    background-color #000
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
      &.square
        .projectListVert-list__item--img
          padding-top 48%
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
        h2
          margin 0
          font-size 1rem
          font-weight 700
        p
          margin-top .5em
          margin-bottom 0
          padding-top .5em
          color rgba(0,0,0,.49)
          border-top 1px solid rgba(0,0,0,.49)
  &__link
    padding .5em 1em
    text-align center

</style>
