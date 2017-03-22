<template>
  <section class="audioList container">
    <audio-box :sources="getAudioSource(item)" :id="'latest-'+ item.id" :item="item"  v-for="item in audios" />
  </section>
</template>

<script>

import _ from 'lodash'
import AudioBox from '../components/AudioBox.vue'

export default {
  name: 'audioList',
  props: ['audios'],
  components: {
    'audio-box': AudioBox
  },
  methods: {
    getAudioSource(item) {
      let audioURL = []
      audioURL.push(_.get(item, ['audio', 'url']))
      return audioURL
    },
  },
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