<template>
  <div class="listArticleBlockLight">
    <figure v-if="image" class="listArticleBlockLight__figure">
      <router-link :to="`/external/${getValue(article, [ 'name' ])}`" target="_blank">
        <img v-lazy="image" :alt="getValue(article, [ 'title' ])" />
      </router-link>
    </figure>
    <div class="listArticleBlockLight__text" :class="{ noImg: !image }">
      <h2><router-link :to="`/external/${getValue(article, [ 'name' ])}`" target="_blank" v-text="getValue(article, [ 'title' ])"></router-link></h2>
      <p><router-link :to="`/external/${getValue(article, [ 'name' ])}`" target="_blank" v-text="$_listArticleLight_getBrief(article)"></router-link></p>
    </div>
  </div>
</template>

<script>

import { getBrief, getValue } from '../../util/comm'
import _ from 'lodash'

export default {
  name: 'ListArticleBlockLight',
  props: {
    article: {
      type: Object,
      required: true
    },
    viewport: {
      required: true
    }
  },
  computed: {
    image () {
      const link = _.get(this.article, [ 'thumb' ])
      if (link) {
        return link
      }
      return
    }
  },
  methods: {
    $_listArticleLight_getBrief (article) {
      if (this.viewport >= 1200) {
        return getBrief(article, 53)
      } else if (this.viewport >= 900) {
        return getBrief(article, 22)
      } else if (this.viewport >= 500) {
        return getBrief(article, 57)
      } else {
        return getBrief(article, 22)
      }
    },
    getBrief,
    getValue
  }
}

</script>

<style lang="stylus" scoped>

h2, p
  margin 0

h2
  margin-bottom .5em
  font-size 1.2rem
  line-height 1.3
  text-align left
p
  font-size 1rem
  font-weight 300
  text-align justify
  line-height 1.5

figure
  margin 0

.listArticleBlockLight
  display flex
  justify-content space-around
  align-items center
  width 100%
  min-height 116px
  padding 3%
  border-top 1px solid #333
  &__figure
    position relative
    width 30%
    margin-right 10px
    overflow hidden
    a
      position relative
      display block
      width 100%
      padding-top 100%
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
      &[lazy=loading]
        object-fit contain
        width 150px
  &__text
    display flex
    flex-direction column
    justify-content center
    width calc(75% - 10px)
    text-align center
    &.noImg
      width 100%

@media (min-width: 900px)
  .listArticleBlockLight
    margin-bottom 20px
    background-color #fff
    border none
    box-shadow 5px 5px 5px #bcbcbc
    &__figure
      a
        padding-top 66.66%
    

@media (min-width: 1200px)
  .listArticleBlockLight
    padding 10px
    &__figure
      margin-right 20px
    &__text
      &.noImg
        margin-left 10px
</style>