<template>
  <div
    id="matchedContentContainer"
    class="matchedContentContainer"
  />
</template>
<script>
import { MATCHED_CONTENT_AD_CLIENT, MATCHED_CONTENT_AD_SLOT } from '../constants'
import { ScrollTriggerRegister } from '../util/scrollTriggerRegister'

export default {
  name: 'GoogleMatchedContent',
  watch: {
    '$route.fullPath' () {
      this.updateScript()
    }
  },
  mounted () {
    const scrollTriggerRegister = new ScrollTriggerRegister([
      { target: '#matchedContentContainer', offset: 400, cb: this.insertScript },
    ])
    scrollTriggerRegister.init()
  },
  methods: {
    insertScript () {
      const matchedContentStart = document.createElement('script')
      const matchedContentContent = document.createElement('ins')
      const matchedContentEnd = document.createElement('script')
      matchedContentStart.setAttribute('id', 'matchedContentStart')
      matchedContentStart.setAttribute('async', 'true')
      matchedContentStart.setAttribute('src', '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
      matchedContentContent.setAttribute('id', 'matchedContentContent')
      matchedContentContent.setAttribute('class', 'adsbygoogle')
      matchedContentContent.setAttribute('style', 'display:block')
      matchedContentContent.setAttribute('data-ad-format', 'autorelaxed')
      matchedContentContent.setAttribute('data-ad-client', MATCHED_CONTENT_AD_CLIENT)
      matchedContentContent.setAttribute('data-ad-slot', MATCHED_CONTENT_AD_SLOT)
      matchedContentEnd.setAttribute('id', 'matchedContentEnd')
      matchedContentEnd.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({});`

      const container = document.querySelector('#matchedContentContainer')

      if (container && !document.querySelector('#matchedContentStart')) {
        container.appendChild(matchedContentStart)
      }
      if (container && !document.querySelector('#matchedContentContent')) {
        container.appendChild(matchedContentContent)
      }
      if (container && !document.querySelector('#matchedContentEnd')) {
        container.appendChild(matchedContentEnd)
      }
    },
    updateScript () {
      const matchedContentStart = document.querySelector('#matchedContentStart')
      const matchedContentContent = document.querySelector('#matchedContentContent')
      const matchedContentEnd = document.querySelector('#matchedContentEnd')
      if (matchedContentStart) {
        document.querySelector('#matchedContentContainer').removeChild(matchedContentStart)
        document.querySelector('#matchedContentContainer').removeChild(matchedContentContent)
        document.querySelector('#matchedContentContainer').removeChild(matchedContentEnd)
      }
      this.insertMatchedContentScript()
    }
  }
}
</script>
