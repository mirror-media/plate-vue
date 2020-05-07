<template>
  <UIWatchIframe
    :trigger-embed="triggerEmbed"
    :iframe-src="iframeSrc"
  />
</template>
<script>

import UIWatchIframe from './UIWatchIframe.vue'

export default {
  name: 'ContainerWatchIframe',
  components: {
    UIWatchIframe
  },
  props: {
    iframeSrc: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      triggerEmbed: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.triggerEmbed = true
    }, 0)
  }
}
</script>
