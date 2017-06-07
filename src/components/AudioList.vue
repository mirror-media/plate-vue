<template>
  <section class="audioList container">
    <audio-box :sources="getAudioSource(item)" preload="false" :id="'latest-'+ item.id" :item="item"  v-for="(item, i) in audios" :key="`${i}-${Date.now()}`" />
  </section>
</template>

<script>
import { SITE_URL } from '../constants'
import _ from 'lodash'
import AudioBox from '../components/AudioBox.vue'

export default {
  name: 'audioList',
  props: [ 'audios' ],
  components: {
    'audio-box': AudioBox
  },
  methods: {
    getAudioSource (item) {
      const audioURL = []
      audioURL.push(`${SITE_URL}/${_.get(item, [ 'audio', 'gcsDir' ])}${_.get(item, [ 'audio', 'filename' ])}`)
      return audioURL
    }
  }
}
</script>
<style lang="stylus" scoped>

.audioList
  &.container
    flex-direction column
    flex-wrap wrap
    margin-top 10px
    padding 0 2em

@media (min-width: 600px)
  .audioList
    &.container
      flex-direction row
      padding 0

</style>
