<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { insertPopInAdScript } from '../util/comm'
const debug = require('debug')('CLIENT:PopInAd')

export default {
  name: 'popin-ad',
  data () {
    return {
      adScriptLoaded: false
    }
  },
  mounted () {
    debug('PopInAd mounted')
    insertPopInAdScript(this)
  }
}
</script>

