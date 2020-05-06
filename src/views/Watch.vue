<template>
  <VueDfpProvider
    :dfp-units="DFP_UNITS"
    :dfpid="DFP_ID"
    :section="SECTION_WATCH_ID"
    :options="dfpOptions"
    :mode="dfpMode"
  >
    <template
      slot="dfpPos"
      slot-scope="props"
    >
      <Header
        :dfp-header-logo-loaded="dfpHeaderLogoLoaded"
        :props="props"
        :show-dfp-header-logo="showDfpHeaderLogo"
        active-section="watch"
      />
      <ContainerWatchArticle />
    </template>
  </VueDfpProvider>
</template>
<script>

import { DFP_ID, DFP_UNITS, DFP_OPTIONS, DFP_SIZE_MAPPING, SECTION_WATCH_ID } from 'src/constants'

import ContainerWatchArticle from '../components/watch/ContainerWatchArticle.vue'
import Header from '../components/Header.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'

const fetchHeaderData = store => store.dispatch('FETCH_COMMONDATA', { endpoints: ['sections', 'topics'] })

export default {
  name: 'AppWatch',
  serverPrefetch () {
    return Promise.all([
      this.$store.dispatch('watches/FETCH_WATCH', { name: this.$route.params.name }),
      fetchHeaderData(this.$store)
    ]).catch(() => {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    })
  },
  components: {
    ContainerWatchArticle,
    Header,
    VueDfpProvider
  },
  data () {
    return {
      DFP_ID,
      DFP_UNITS,
      SECTION_WATCH_ID,
      dfpHeaderLogoLoaded: false,
      dfpMode: 'prod',
      showDfpHeaderLogo: false
    }
  },
  computed: {
    dfpOptions () {
      const currentInstance = this
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded: function (event) {
          const dfpCurrAd = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCurrAd.getAttribute('pos')

          /**
          * Because googletag.pubads().addEventListener('slotRenderEnded', afterEachAdLoaded) can't be removed.
          * We have check if current page gets changed with checking by sessionId to prevent from runnig this outdated callback.
          */
          const elSessionId = dfpCurrAd.getAttribute('sessionId')
          if (elSessionId !== this.sessionId) { return }

          const adDisplayStatus = dfpCurrAd.currentStyle ? dfpCurrAd.currentStyle.display : window.getComputedStyle(dfpCurrAd, null).display

          switch (position) {
            case 'LOGO':
              if (adDisplayStatus !== 'none') {
                currentInstance.showDfpHeaderLogo = true
              }
              currentInstance.dfpHeaderLogoLoaded = true
              break
          }
        },
        setCentering: true,
        sizeMapping: DFP_SIZE_MAPPING
      })
    }
  }
}
</script>
