<template>
  <section class="ActivityLightboxMenu">
    <h1 v-text="getValue(activity, [ 'name' ])"/>
    <div class="ActivityLightboxMenu__images">
      <div class="ActivityLightboxMenu__images--block" v-for="(item, index) in nodeContents">
        <div class="ActivityLightboxMenu__images--image" :style="{ backgroundImage: 'url(' + getImage(item) + ')' }" @click="goToContentIndex(index)" />
      </div>
    </div>
  </section>
</template>

<script>

import { getValue } from '../../util/comm'
import _ from 'lodash'

export default {
  props: [ 'currentNodeContents', 'initialActivity', 'viewport' ],
  data () {
    return {
      activity: this.initialActivity
    }
  },
  computed: {
    nodeContents () {
      return this.currentNodeContents
    },
    windowViewport () {
      return this.viewport
    }
  },
  methods: {
    getValue,
    getImage (item) {
      const contentStyle = _.get(item, [ 'type' ])
      if (this.windowViewport < 600) {
        if (contentStyle === 'video') {
          return _.get(item, [ 'content', '0', 'coverPhoto', 'mobile', 'url' ])
        } else {
          return _.get(item, [ 'content', '0', 'mobile', 'url' ])
        }
      } else {
        if (contentStyle === 'video') {
          return _.get(item, [ 'content', '0', 'coverPhoto', 'desktop', 'url' ])
        } else {
          return _.get(item, [ 'content', '0', 'desktop', 'url' ])
        }
      }
    },
    goToContentIndex (index) {
      this.$emit('goToContentIndex', index)
    }
  }
}

</script>

<style lang="stylus" scoped>

.ActivityLightboxMenu
  display flex
  flex-direction column
  position fixed
  top 0
  left 0
  z-index 1001
  width 100vw
  height 100vh
  background-color #1a1a1a
  overflow hidden
  > h1
    display flex
    align-items center
    justify-content center
    width 50%
    height 60px
    margin 0 auto
    color #ababab
    font-size 1.2rem
    font-weight 300
    line-height 1.2
    text-align center
  &__images
    display flex
    align-items flex-start
    align-content flex-start
    flex-wrap wrap
    flex-grow 1
    padding 0 5%
    margin-top 20px
    &--block
      position relative
      width calc(100% / 3 - 20px )
      padding-top calc(100% / 3 - 20px )
      margin 10px
      cursor pointer
    &--image
      display inline-block
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover

@media (min-width: 900px)
  .ActivityLightboxMenu
    &__images
      padding 0 15% 20px
      overflow-y scroll
      &--block
        width calc((100% - 80px) / 4 )
        padding-top calc((100% - 80px) / 4 )
        margin 10px
        overflow hidden
      &--image:hover
        top -10%
        left -10%
        bottom auto
        right auto
        width 120%
        height 120%
</style>
