<template>
  <section class="latestProject grid-1-fifth">
    <template v-for="item in highlightProject">
      <a :href="getHref(item)" :id="'projects-'+ item.name">
        <img class="latestProject__img" :src="getImage(item, 'mobile')">
        <div class="latestProject__title" >
          <h2 v-text="getTruncatedVal(item.title, 22)"></h2>
          <p v-text="getBrief(item, 34)"></p>
        </div>
      </a>
    </template>
  </section>
</template>
<script>

import { getBrief, getImage, getSection, getHref, getTruncatedVal } from '../utils/comm'
import _ from 'lodash'

export default {
  name: 'latestProject',
  props: [ 'projects' ],
  computed: {
    highlightProject () {
      return _.take(this.projects, 8)
    }
  },
  methods: {
    getBrief,
    getImage,
    getSection,
    getHref,
    getTruncatedVal
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

.latestProject
  display none
  padding-left 15px

  h2
    padding .5em 0 .2em .5em
    margin 0
    text-align center
    font-size .9rem

  p
    padding .2em 0 .2em 0
    margin 0
    font-size .8rem
    font-weight 300
    line-height 1rem
    color rgba(0, 0, 0, .9)

  > a
    display block

  > a:not(:first-child)
    margin 35px 0

  &__img
    display: table
    max-width 100%
    height auto

  &__title
    text-align: justify
  
  .news-people
    border-left 3px solid $color-news

  .entertainment
    border-left 3px solid $color-entertainment

  .foodtravel
    border-left 3px solid $color-foodtravel

  .watch
    border-left 3px solid $color-watch

  .projects
    border-left 3px solid $color-projects

  .other
    border-left 3px solid $color-other

@media (min-width: 1200px)
  .latestProject
    display block
</style>
