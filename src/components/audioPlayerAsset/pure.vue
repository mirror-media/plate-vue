<template>
  <div class="player">
    <audio ref="audio" />
    <PlayerInfo
      :sound="currentSound"
    />
    <nav class="player__player-navs player-navs">
      <PlayerNavs
        :is-playing="isPlaying"
        @pause="pause"
        @play="play"
      />
      <div class="player-navs__progress-bar progress-bar">
        <PlayerSlider
          class="progress-bar__bar"
          :direction="'horizontal'"
          :buffered="(playStatLoadedTime / playStatDuration) || 0"
          :value="(playStatPlayedTime / playStatDuration) || 0"
          @valueChange="seek"
        />
        <PlayerTimestamp
          class="progress-bar__timestamp"
          :duration="playStatDuration"
          :played="playStatPlayedTime"
        />
      </div>
    </nav>
  </div>
</template>

<script>
import PlayerNavs from './components/PlayerNavs.vue'
import PlayerInfo from './components/PlayerInfo.vue'
import PlayerSlider from './components/PlayerSlider.vue'
import PlayerTimestamp from './components/PlayerTimestamp.vue'

import initEventEmitters from './util/eventEmitters'
import initEventHandlers from './util/eventHandlers'

export default {
  props: {
    sound: {
      type: Object,
      required: true,
      validator(object) {
        return 'title' in object && 'src' in object
      }
    },

    // native audio's properties as props
    volume: {
      type: Number,
      default: 1,
      validator(value) {
        return value >= 0 && value <= 1
      }
    },
    muted: {
      type: Boolean,
      default: false
    },
    playbackRate: {
      type: Number,
      default: 1.0
    },
  },
  components: {
    PlayerNavs,
    PlayerInfo,
    PlayerSlider,
    PlayerTimestamp
  },
  data() {
    return {
      internalSound: this.sound,
      internalVolume: this.volume,
      internalMuted: this.muted,
      internalPlaybackRate: this.playbackRate,
      internalBufferedAmount: 0,
      internalPlayedAmount: 0,
      isPlaying: false,
      isLoading: false,
      playStatDuration: 0,
      playStatLoadedTime: 0,
      playStatPlayedTime: 0
    }
  },
  computed: {
    // alias of audio element
    audio() {
      return this.$refs.audio
    },

    // observers
    // inform parent component in setters
    currentSound: {
      get() {
        return this.internalSound
      },
      set(val) {
        this.$emit('update:sound', val)
        this.internalSound = val
      }
    },
    currentVolume: {
      get() {
        return this.internalVolume
      },
      set(val) {
        this.$emit('update:volume', val)
        this.internalVolume = val
      }
    },
    currentMuted: {
      get() {
        return this.internalMuted
      },
      set(val) {
        this.$emit('update:muted', val)
        this.internalMuted = val
      }
    },
    currentPlaybackRate: {
      get() {
        return this.internalPlaybackRate
      },
      set(val) {
        this.$emit('update:playbackRate', val)
        this.internalPlaybackRate = val
      }
    }
  },
  mounted() {
    this.initAudio()
  },
  methods: {
    initAudio() {
      // set exposed properties as their init value which is passing from props
      this.audio.volume = this.volume
      this.audio.muted = this.muted
      this.audio.playbackRate = this.playbackRate

      // init events
      initEventEmitters(this)
      initEventHandlers(this)

      // set audio's src
      if (this.currentSound) {
        this.audio.src = this.currentSound.src
      }
    },
    play() {
      const promise = this.audio.play()

      if (promise) {
        promise.catch(() => {
          this.$emit('playingError')
        })
      }
    },
    pause() {
      const promise = this.audio.pause()

      if (promise) {
        promise.catch(() => {
          this.$emit('pausingError')
        })
      }
    },
    seek(percentage) {
      this.audio.currentTime = this.audio.duration * percentage
    }
  }
}
</script>

<style lang="stylus" scoped>
.player
  margin-left 6px
  margin-right 6px
  border solid 2px #efefef

.player-navs
  height 56px
  padding 6px 16px
  background-color #efefef
  display flex
  align-items center
  &__progress-bar
    flex 1 1 auto
    margin 0 0 0 20px

.progress-bar
  position relative
  &__timestamp
    position absolute
    left 0
    top 4px
    width 100%

@media (max-width 768px)
  .player
    margin-left 0
    margin-right 0
</style>
