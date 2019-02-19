<template>
  <div class="oath-player">
    <div id="vdbPlayer" class="vdb_player"></div>
  </div>
</template>
<script>

import { OATH_COPMANY_ID } from '../../constants'

export default {
  naem: 'OathPlayer',
  props: {
    combinedId: {
      type: String,
      required: true
    },
    playerId: {
      type: String,
      required: true
    },
    scriptSrc: {
      type: String,
      required: true
    },
    videoId: {
      type: String,
      default: ``
    }
  },
  watch: {
    '$route.fullPath' () {
      this.embedPlayer()
    },
    // combinedId (newValue, oldValue) {
    //   document.querySelector('.vdb_player').classList.remove(`vdb_${oldValue}`)
    //   this.embedScript()
    // }
  },
  beforeMount () {
    // this.embedScript()
    this.embedPlayer()
    console.log('beforeMount', window)
  },
  mounted ( ){
    console.log('mounted', window)
  },
  methods: {
    embedPlayer () {
      const container = document.querySelector('.vdb_player')
      container.innerHTML = ''
      /*global vidible:true*/
      vidible.player('vdbPlayer').setup({
        bcid: `${OATH_COPMANY_ID}`,
        pid: `${this.playerId}`,
        videos: [ `${this.videoId}` ]
      }).load()
    },
    // embedScript () {
    //   const container = document.querySelector('.vdb_player')
    //   container.innerHTML = ''
    //   container.classList.add(`vdb_${this.combinedId}`)
    //   const script = document.createElement("script")
    //   script.setAttribute('type', 'text/javascript')
    //   script.setAttribute('src', this.scriptSrc)
    //   container.appendChild(script)
    // }
  }
}
</script>
<style lang="stylus" scoped>
.oath-player
  position relative
  padding-top 56.25%
  background-color #000
  .vdb_player
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    width 100%

</style>
