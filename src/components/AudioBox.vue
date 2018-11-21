<template>
  <div class="audioBox" v-click-outside="handleClickOutside">
    <div class="audioBox__action">
      <button :class="{ paused: !isPlaying && !isEnded, playing: isPlaying && !isEnded, ended: isEnded }" @click="handleAudioClick"></button>
    </div>
    <div class="audioBox__info">
      <h1 v-text="getValue(audio, 'title')"></h1>
      <div ref="audioProgress" class="progress">
        <div class="progress__line" @click="changeProgress($event)">
          <div></div>
        </div>
        <div class="progress__current" :style="{ left: `calc(${progress}% - 10px)` }"></div>
      </div>
      <div class="info">
        <h1 v-text="getValue(audio, 'title')"></h1>
        <p v-show="audioDuration !== 0 && canPlay">{{ getAudioTime(audioCurrent) }} / {{ getAudioTime(audioDuration) }}</p>
        <p v-show="audioDuration !== 0 && !canPlay" >讀取中...</p>
      </div>
    </div>
    <audio ref="audio" preload="none" @loadeddata="isLoaded = true" @ended="isEnded = true" @timeupdate="renewAudioCurrent" @loadedmetadata="renewAudioDuration" @canplay="canPlay = true">
      <source :src="getValue(audio, 'url')" :type="getValue(audio, 'filetype')">
    </audio>
  </div>
</template>

<script>
import { getValue } from '../util/comm'
import moment from 'moment'

export default {
  name: 'audioBox',
  directives: {
    'click-outside': {
      bind (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  },
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
    handleAudioClick () {
      if (this.isEnded) {
        const audioEle = this.$refs.audio
        if (audioEle) {
          this.isEnded = false
          this.isPlaying = true
          this.$refs.audio.currentTime = 0
          audioEle.play()
        }
      } else if (this.isPlaying) {
        const audioEle = this.$refs.audio
        if (audioEle) {
          this.isPlaying = false
          audioEle.pause()
        }
      } else {
        const audioEle = this.$refs.audio
        if (audioEle) {
          this.isPlaying = true
          audioEle.play()
        }
      }
    },
    handleClickOutside (e) {
      const parent = e.target.parentNode
      const parentClassList = [ ...parent.classList ]
      if (parentClassList.includes('audioBox__action') && this.isPlaying) {
        const audioEle = this.$refs.audio
        if (audioEle) {
          this.isPlaying = false
          audioEle.pause()
        }
      }
    } ,
    changeProgress (e) {
      const audioEle = this.$refs.audio
      if (!this.isLoaded) {
        audioEle.load()
      } else {
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
  position relative
  margin-bottom 1em
  &__action
    box-sizing content-box
    position relative
    left 3px
    z-index 10
    width 33%
    padding-top 33%
    background-color #fff
    border 1px #fff solid
    border-radius 50%
    box-shadow 0 0 6px 1px rgba(0,0,0,.5)
    button
      box-sizing border-box;
      position absolute
      top 10%
      left 10%
      width 80%
      height 80%
      padding 0
      border none
      border-radius 50%
      background-color transparent
      background-size 60%
      background-repeat no-repeat
      background-position 50% 50%
      box-shadow 0 0 10px 1px rgba(0,0,0,.4) inset
      cursor pointer
      &.paused
        background-image url(/assets/mirrormedia/icon/play-btn_blue@2x.png)
        background-position 60% 50%
      &.ended
        background-image url(/assets/mirrormedia/icon/replay-btn_blue@2x.png)
      &.playing
        background-image url(/assets/mirrormedia/icon/pause-btn_blue@2x.png)
  &__info
    display flex
    flex-direction column
    position absolute
    top 0
    right 0
    width 83%
    height 100%
    background-color #004598
    > h1
      display none
    .progress
      position relative
      width 85%
      margin 15px 0 0 15%
      &__line
        padding 5px 0
        cursor pointer
        > div
          height 4px
          background-color #fff
      &__current
        position absolute
        left -10px
        z-index 10
        width 20px
        height 20px
        background-color #fff
        border-radius 50%
        transform translateY(-16px)
        box-shadow 0 0 10px 2px rgba(0, 0, 0, .4)
        cursor pointer
    .info
      flex 1
      padding .5em .5em .2em 25%
      color #fff
      h1, p
        margin 0
      h1
        max-height 2.3rem
        font-size 1rem
        text-overflow ellipsis
        overflow hidden
      p
        margin-top .5em
        color #fff
        font-size .8rem
        line-height .8rem
        text-align left

@media (min-width: 768px)
  .audioBox
    &__action
      width 20%
      padding-top 20%
    &__info
      width 90%
      .progress
        width 92%
        margin-left 8%
      .info
        padding 1em 1em 1em 15%
        h1
          max-height 2.76rem
          font-size 1rem
        p
          margin-top 1em
          font-size 1rem
          line-height 1rem

@media (min-width: 1200px)
  .audioBox
    width calc(100% - 13px)
    &__info
      padding 1.5em 0 .5em
      > h1
        display block
        height 3rem
        margin 0
        padding-left 15%
        color #fff
        font-size 1.3rem
        text-overflow ellipsis
        overflow hidden
      .progress
        width 89%
        margin-left 11%
      .info
        padding 0 1em 0 15%
        min-height 32px
        h1
          display none
        p
          text-align right
</style>
