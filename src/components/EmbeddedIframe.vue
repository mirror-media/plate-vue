<template>
  <div class="embedded-iframe" @click="sendGaClickEvent(gaEventCategory, 'embedded')"></div>
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
  mounted () {
    const unwatch = this.$watch('mediaDataEmbed', (obj) => {
      if (obj) {
        this.loadIframe()
        unwatch()
      }
    })
    window.addEventListener('scroll', this.loadIframe)
  },
  computed: {
    mediaDataEmbed () {
      return _get(this.mediaData, [ 'embed' ], '')
    }
  },
  methods: {
    loadIframe () {
      if (!this.mediaDataEmbed) { return }

      const { top } = this.$el.getBoundingClientRect()
      const { height } = this.$store.state.viewport

      if (top <= height) {
        this.$el.innerHTML = this.mediaDataEmbed
        window.removeEventListener('scroll', this.loadIframe)        
      }
    },
    sendGaClickEvent
  }
}
</script>

<style lang="stylus" scoped>
.embedded-iframe
  cursor pointer
</style>
