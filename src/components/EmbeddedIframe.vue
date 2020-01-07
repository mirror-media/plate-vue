<template>
  <div class="embedded-iframe" v-html="mediaDataEmbed" @click="sendGaClickEvent(gaEventCategory, 'embedded')"></div>
</template>

<script>
import { get as _get } from 'lodash'
import { sendGaClickEvent } from '../util/comm'

export default {
  name: 'EmbeddedIframe',
  props: {
    mediaData: {
      required: true
    },
    gaEventCategory: {
      type: String,
      default: 'undefined'
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
</style>
