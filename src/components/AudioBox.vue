<template>
  <div class="audioBox">
    <figure class="audioBox__figure">
      <img v-lazy="getValue(audio, [ 'coverPhoto', 'image', 'resizedTargets', 'mobile', 'url' ], '/public/notImage.png')" :alt="getValue(audio, [ 'title' ])" />
    </figure>
    <div class="audioBox__control">
      <audio ref="audio" preload="none" @loadeddata="audioLoaded" @ended="audioEnded" @timeupdate="renewAudioCurrent" @loadedmetadata="renewAudioDuration" @canplay="audioCanplay">
        <source :src="getValue(audio, [ 'url' ])" :type="getValue(audio, [ 'filetype' ])">
      </audio>
      <h2 v-text="getValue(audio, [ 'title' ])" />
      <div ref="audioProgress" class="audioBox__control--progress" v-on:click="changeProgress">
        <div class="audioBox__control--progressCurrent" :style="{ width: `${progress}%` }" />
      </div>
      <div class="audioBox__control--controlBar">
        <div class="audioBox__control--controlGroup">
          <img v-lazy="`/public/icon/play-btn_blue@2x.png`" @click="audioPlay()" v-show="!isPlaying && !isEnded" />
          <img v-lazy="`/public/icon/pause-btn_blue@2x.png`" @click="audioPause()" v-show="isPlaying && !isEnded" />
          <img v-lazy="`/public/icon/replay-btn_blue@2x.png`" @click="audioReplay()" v-show="isEnded" />
        </div>
        <div class="audioBox__control--info">
          <p v-show="audioDuration !== 0 && canPlay">{{ getAudioTime(audioCurrent) }} / {{ getAudioTime(audioDuration) }}</p>
          <p v-show="audioDuration !== 0 && !canPlay" >讀取中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { getValue } from '../util/comm'
import moment from 'moment'

export default {
  name: 'audioBox',
  props: [ 'audio' ],
  data () {
    return {
      audioCurrent: 0,
      audioDuration: 0,
      isEnded: false,
      isLoaded: false,
      isPlaying: false,
      canPlay: false,
      progress: 0
    }
  },
  computed: {
    duration () {
      return this.$refs.audio.duration
    }
  },
  methods: {
    audioCanplay () {
      this.canPlay = true
    },
    audioEnded () {
      this.isEnded = true
    },
    audioLoaded () {
      this.isLoaded = true
    },
    audioPlay () {
      const audioEle = this.$refs.audio
      if (audioEle) {
        this.isPlaying = true
        audioEle.play()
      }
    },
    audioPause () {
      const audioEle = this.$refs.audio
      if (audioEle) {
        this.isPlaying = false
        audioEle.pause()
      }
    },
    audioReplay () {
      const audioEle = this.$refs.audio
      if (audioEle) {
        this.isEnded = false
        this.isPlaying = true
        this.$refs.audio.currentTime = 0
        audioEle.play()
      }
    },
    changeProgress (e) {
      const audioEle = this.$refs.audio
      if (!this.isLoaded) {
        audioEle.load()
      }
      if (this.isLoaded) {
        const newTime = e.offsetX / this.$refs.audioProgress.offsetWidth * this.$refs.audio.duration
        this.$refs.audio.currentTime = newTime
        this.isEnded = false
        this.isPlaying = true
        audioEle.play()
      }
    },
    getValue,
    getAudioTime (duration) {
      return moment.utc(duration * 1000).format('HH:mm:ss')
    },
    renewAudioCurrent () {
      this.audioCurrent = this.$refs.audio.currentTime
      this.progress = this.$refs.audio.currentTime / this.$refs.audio.duration * 100
    },
    renewAudioDuration () {
      this.audioDuration = this.$refs.audio.duration
    }
  }
}
</script>
<style lang="stylus" scoped>

.audioBox
  display flex
  flex-direction column
  width 100%
  margin-bottom 20px
  padding 10px 0
  background-color #fff
  &__figure
    display none
    position relative
    width 100%
    padding-top 66.66%
    margin 0
    overflow hidden
    img
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      object-fit cover
      object-position 50% 50%
  &__control
    display flex
    flex-direction column
    justify-content center
    width 100%
    padding 0
    h2
      font-size 1.2rem !important
      margin 0 !important
    &--progress
      width 100%
      height 4px
      margin-top 1em
      background-color #bcbcbc
      cursor pointer
    &--progressCurrent
      height 4px
      background-color #064f77
    &--controlBar
      display flex
      justify-content space-between
      height 36px
      margin-top .5em
      img
        width 20px
        height 20px
        margin-right 1em
        cursor pointer
    &--controlGroup
      display flex
      align-items center
    &--info
      p
        margin 0 !important
        font-size 1rem !important

</style>
