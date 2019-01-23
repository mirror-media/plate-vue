<template>
  <div class="share-light">
    <button @click="shareFacebook"><img src="/assets/mirrormedia/icon/share-fb.png" alt="分享至 Facebook" data-gtm="share fb" :data-gtm-category="gtmCategory"></button>
    <button @click="shareLine"><img src="/assets/mirrormedia/icon/share-line.png" alt="分享至 Line" data-gtm="share line" :data-gtm-category="gtmCategory" ></button>
  </div>
</template>
<script>

import { shareLine, shareFacebook } from '../../util/comm'

export default {
  name: 'ShareLight',
  props: {
    gtmCategory: {
      type: String,
      default: 'header'
    }
  },
  methods: {
    shareFacebook () {
      shareFacebook({ route: this.$route.path })
    },
    shareLine () {
      shareLine({
        route: this.$route.path,
        title: document.querySelector('meta[property="og:title"]').getAttribute('content')
      })
    },
  }
}
</script>
<style lang="stylus" scoped>
.share-light
  display flex
  button
    display inline-block
    width 35px
    padding 0
    font-size 0
    background-color transparent
    border none
    cursor pointer
    & + button
      margin-left 10px
    img
      width 100%
</style>
