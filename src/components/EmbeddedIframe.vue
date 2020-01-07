<template>
  <div class="embedded-iframe" v-html="mediaDataEmbed" @click="sendGaClickEvent('home', 'embedded')"></div>
</template>

<script>
import { get as _get } from 'lodash'
import { sendGaClickEvent } from '../util/comm'

export default {
  name: 'EmbeddedIframe',
  props: {
    mediaData: {
      required: true
    }
  },
  computed: {
    mediaDataEmbed () {
      return _get(this.mediaData, [ 'embed' ], '')
    }
  },
  methods: {
    sendGaClickEvent
  }
}
</script>

<style lang="stylus" scoped>
.embedded-iframe
  cursor pointer
  @media (min-width 600px)
    padding-right 2rem
    padding-left 2rem
  @media (min-width 1200px)
    margin-top 10px
    padding-right 0
    padding-left 0
    max-width 1024px
    margin-right auto
    margin-left auto
</style>
