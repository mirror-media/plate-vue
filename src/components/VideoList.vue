<template>
  <section class="videoList container">
    <a :href="getLink(item)" :id="'latest-'+ item.id" v-for="item in playlist" class="videoList-block" target="_bank">
      <div class="videoList-block__img" :title="getValue(item, [ 'snippet', 'title' ])" :style="{ backgroundImage: 'url(' + getImage(item) + ')' }"></div>
      <div class="videoList-block__content">
        <h2 v-text="getTitle(item)"></h2>
        <p v-text="getBrief(item)"></p>
      </div>
    </a>
  </section>
</template>

<script>

import { getTruncatedVal, getValue } from '../util/comm'
import _ from 'lodash'

export default {
  name: 'videoList',
  props: [ 'playlist' ],
  methods: {
    getBrief (item) {
      return getTruncatedVal(_.get(item, [ 'snippet', 'description' ], ''), 45)
    },
    getImage (item) {
      return _.get(item, [ 'snippet', 'thumbnails', 'medium', 'url' ], '')
    },
    getLink (item) {
      return 'https://youtu.be/' + _.get(item, [ 'snippet', 'resourceId', 'videoId' ], '')
    },
    getTitle (item) {
      return getTruncatedVal(_.get(item, [ 'snippet', 'title' ], ''), 20)
    },
    getValue
  }
}

</script>
<style lang="stylus" scoped>

.videoList
  &.container
    flex-direction column
    flex-wrap wrap
    margin-top 30px
    padding 0 2em
    a
      display block
  &-block
    width 100%
    margin-bottom 40px
    background-color #fff
    box-shadow 5px 5px 5px #bcbcbc
    transition all .3s ease-in-out
    &__img
      width 100%
      padding-top 66.66%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover
    &__content
      height auto
      padding 0 15px 15px 30px
      text-align justify
      h2
        position relative
        margin 0
        padding .5em 0
        font-weight 300
        line-height 1.7rem
      h2:before
        content: ''
        display block
        position absolute
        top 0
        bottom 0
        left -15px
        width 5px
        background-color #bcbcbc
      p
        display none
        margin 0
        padding 1em 0
        color #999
        font-weight 300
        line-height 1.3rem

  &-block:hover
    transform translateY(-20px)
    box-shadow 5px 15px 5px #bcbcbc

@media (min-width: 600px)
  .videoList
    &.container
      flex-direction row
      padding 0
    &-block
      width calc( (100% - 40px) / 2 )
      margin 0 10px 40px
      &__content
        p
          display block

@media (min-width: 1200px)
  .videoList
    &-block
      width calc( (100% - 60px) / 3 )
      margin 0 10px 40px

</style>
