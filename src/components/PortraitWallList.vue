<template>
  <section class="portraitWallList">
    <div class="portraitWallList__imageGroup" :class="[ index%2 === 0 ? 'color' : '' ]" v-for="(item, index) in images">
      <div class="portraitWallList__block" :class="[ getOrder(image) %2 === 0 ? '' : 'color' ]" v-for="(image, index) in item">
        <router-link :to="getHref(image)" class="portraitWallList__block--image" :style="{ backgroundImage: `url(${getImage(image)})` }">
          <p></p>
        </router-link>
        <div class="portraitWallList__block--content">
          <h2><router-link :to="getHref(image)" v-text="getValue(image, [ 'description' ])"></router-link></h2>
          <p><a></a></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import { getValue } from '../util/comm'
import _ from 'lodash'

export default {
  name: 'portraitWallList',
  props: [ 'initialMediaData' ],
  computed: {
    images () {
      return _.chunk(_.sortBy(_.get(this.initialMediaData, [ 'images', 'items' ]), [ function (o) {
        return _.toNumber(_.split(o.keywords, '-')[0])
      } ]), 5)
    }
  },
  methods: {
    getImage (item) {
      return _.get(item, [ 'image', 'resizedTargets', 'desktop', 'url' ])
    },
    getOrder (item) {
      return _.split(_.get(item, [ 'keywords' ]), '-')[0]
    },
    getHref (item) {
      return `/story/${_.split(_.get(item, [ 'keywords' ]), '-')[1]}`
    },
    getValue
  }
}

</script>
<style lang="stylus" scoped>

.portraitWallList
  &__block
    display flex
    justify-content space-between
    width 100%
    padding 5% 7%
    .portraitWallList__block--image
      order 2
    .portraitWallList__block--content
      order 1
      a
        color #d6642e
    &.color
      background-color #d6642e
      .portraitWallList__block--image
        order 1
      .portraitWallList__block--content
        order 2
        a
          color #fff
    &--image
      display block
      width calc(50% - 5px)
      padding-top calc(50% - 5px)
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover
      p
        display none
    &--content
      display flex
      flex-direction column
      justify-content center
      width calc(50% - 5px)
      h2
        margin 0 0 .5em
        font-size 1.2rem

@media (min-width: 600px)
  .portraitWallList
    &__block
      padding 5% 10%
      &--image
        width calc(50% - 10px)
        padding-top calc(50% - 10px)
      &--content
        width calc(50% - 10px)

@media (min-width:900px)
  .portraitWallList
    &__imageGroup
      display flex
      justify-content flex-start
      padding 1em calc(15% + 25px)
      .portraitWallList__block--image
        order 1
      .portraitWallList__block--content
        order 1
      a
        color #d6642e !important
      &.color
        background-color orange
        a
          color #fff !important
    &__block
      flex-direction column
      width 18%
      padding 0
      margin 0 5px
      // padding-left 1%
      // padding-right 1%
      &.color
        background-color transparent
      &--image
        width 100%
        padding-top 100%
        &:hover
          filter brightness(.5)
      &--content
        flex-direction row
        justify-content center
        align-items center
        width 100%
        padding .5em 0
        h2
          margin 0
        p
          display none
</style>
