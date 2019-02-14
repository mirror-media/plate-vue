<template>
  <div class="oath-player">
    <div :class="[ 'vdb_player', `vdb_${combinedId}` ]"></div>
  </div>
</template>
<script>

import { OATH_COPMANY_ID, OATH_PLAYER_LIST } from '../../constants'

export default {
  naem: 'OathPlayer',
  data () {
    return {
      OATH_COPMANY_ID,
      OATH_PLAYER_LIST,
      combinedId: ``
    }
  },
  computed: {
    playerId () {
      const path = this.$route.fullPath
      const type = this.$store.state.viewport.width > 768 ? 'desktop' : 'mobile'
      if (path.match(/\/section\//)) {
        return OATH_PLAYER_LIST.section[type]
      } else if (path.match(/\/category\//)) {
        const categoryName = path.split('/')[2]
        return OATH_PLAYER_LIST.category[categoryName][type]
      } else {
        return OATH_PLAYER_LIST.singleVideo[type]
      }
    },
    scriptSrc () {
      const path = this.$route.fullPath
      if (path.match(/\/video\//)) {
        const videoId = path.split('/')[2]
        return `//delivery.vidible.tv/jsonp/pid=${this.playerId}/vid=${videoId}/${OATH_COPMANY_ID}.js`
      }
      return `//delivery.vidible.tv/jsonp/pid=${this.playerId}/${OATH_COPMANY_ID}.js`
    }
  },
  watch: {
    playerId (value) {
      this.combinedId = `${value}${OATH_COPMANY_ID}`
      this.embedScript()
    }
  },
  mounted () {
    this.combinedId = `${this.playerId}${OATH_COPMANY_ID}`
    this.embedScript()
  },
  methods: {
    embedScript () {
      document.querySelector('.vdb_player').innerHTML = ''
      const script = document.createElement("script")
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('src', this.scriptSrc)
      document.querySelector('.vdb_player').appendChild(script)
    }
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
