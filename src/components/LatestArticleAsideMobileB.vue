<template>
  <div class="group">
    <a
      class="group__hero-image"
      :id="createId(groupedArticle, true)"
      :href="_getHref(groupedArticle)"
      target="_blank"
      rel="noopener"
    >
      <img v-lazy="getImage(groupedArticle, 'mobile')" alt="">
    </a>
    <div class="group__articles articles">
      <a
        class="articles__item"
        :id="createId(groupedArticle)"
        :href="_getHref(groupedArticle)"
        target="_blank"
        rel="noopener"
        v-text="getTruncatedVal(groupedArticle.title, 22)"
      >
      </a>
      <a
        v-for="(article, i) in getValue(groupedArticle, [ 'relateds' ]).slice(0, 3)"
        :key="i"
        class="articles__item"
        :id="createId(article)"
        :href="_getHref(article)"
        target="_blank"
        rel="noopener"
        v-text="getTruncatedVal(article.title, 22)"
      >
      </a>
    </div>
  </div>
</template>

<script>
import { getHref, getHrefFull, getImage, getTruncatedVal, getValue } from '../util/comm'

export default {
  props: {
    groupedArticle: {
      type: Object,
      required: true
    }
  },
  computed: {
    shouldGetHrefFull () {
      return this.groupedArticle.style === 'projects' || this.groupedArticle.style === 'campaign' || this.groupedArticle.style === 'readr'
    }
  },
  methods: {
    _getHref (group) {
      return this.shouldGetHrefFull ? getHrefFull(group) : getHref(group)
    },

    getImage,
    getTruncatedVal,
    getValue,
    createId (article, isImg = false) {
      return `group-latest-0-${getValue(article, [ 'slug' ], Date.now())}${isImg ? '-img' : ''}-mobile-b`
    }
  }
}
</script>

<style lang="stylus" scoped>
.group
  margin 0 0 25px 0
  &:last-child
    margin 0
  &__hero-image
    img
      width 100%
  &__articles
    margin 3px 0 0 0

.articles
  &__item
    display inline-block
    padding 10px 0
    color rgba(0, 0, 0, 0.65)
    font-size 20.8px
    font-weight 300
    line-height 1.31
    text-align justify
    min-width 100%
    & + &
      border-top solid 2px #d7d7d7
</style>

