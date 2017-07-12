<template>
  <div class="video-container" @mouseover="mouseoverHandler" @click="videoPlay" >
    <video width="100%" height="100%" controls controlsList="nodownload" preload="metadata" playsinline :ref="videoId" :id="videoId"
          :poster="poster" :style="{ backgroundImage: `url(${getValue(video, ['poster'], '/public/notImage.png')})` }">
            <source :src="getValue(video, [ 'url' ])" :type="getValue(video, [ 'filetype' ])">
            Your browser does not support the video tag.
    </video>
    <div class="playpause" :class="videoClass" :target-video="videoId" :style="playPauseStyle" ></div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { getClientOS } from '../../util/comm.js'

  export default {
    name: 'article-video',
    computed: {
      playPauseStyle () {
        return this.playingFlag ? {
          opacity: this.opacity
        } : {}
      },
      poster () {
        const poster = _.get(this.video, [ 'poster' ])
        return !poster ? poster : '/public/transperent.png'
      },
      videoClass () {
        return {
          hover: this.hoverFlag,
          play: !this.playingFlag,
          pause: this.playingFlag
        }
      }
    },
    data () {
      return {
        hoverFlag: false,
        playingFlag: false,
        opacity: 1,
        videoId: `video-${_.get(this.video, [ 'id' ])}-${Math.floor(Math.random() * (10000000000 - 100000) + 100000)}`
      }
    },
    methods: {
      fadeOutPauseBtn () {
        this.opacity = 1
        const opacityDecreasing = (i) => {
          setTimeout(() => {
            this.opacity -= 0.1
          }, 1000 + 50 * i)
        }
        for (let i = 0; i < 10; i++) {
          opacityDecreasing(i)
        }
      },
      getClientOS,
      getValue (o = {}, p = [], d = '') {
        return _.get(o, p, d)
      },
      mouseoverHandler (e) {
        const target = e.target
        const clientOS = this.getClientOS()
        if (target.getAttribute('class') && target.getAttribute('class').indexOf('playpause') > -1 && !(clientOS === 'iOS' || clientOS === 'Android')) {
          this.opacity = 1
          this.hoverFlag = true
        } else {
          this.hoverFlag = false
          this.fadeOutPauseBtn()
        }
      },
      videoPlay (e) {
        if (!this.playingFlag) {
          this.$refs[this.videoId].play()
        } else {
          this.$refs[this.videoId].pause()
        }
      }
    },
    mounted () {
      this.$refs[this.videoId].addEventListener('play', () => {
        const videosThisPAge = document.querySelectorAll('video')
        _.map(videosThisPAge, (v) => {
          if (v.getAttribute('id') !== this.videoId) {
            v.pause()
          }
        })
        this.playingFlag = true
        this.pausingFlag = false
        this.fadeOutPauseBtn()
      })
      this.$refs[this.videoId].addEventListener('pause', () => {
        this.playingFlag = false
        this.pausingFlag = true
      })
    },
    props: [ 'video' ]
  }
</script>
<style lang="stylus" scoped>
  .video-container
    position relative
    > video
      cursor pointer
      position relative
      width 100%
      height 100%
      background-size cover
      background-color transparent
      background-repeat no-repeat
      background-position center center
      &::-webkit-media-controls-play-button
        display none
      &::-webkit-media-controls-current-time-display
        padding 10px
      &::-webkit-media-controls-enclosure
        height 30px
      &::-webkit-media-controls-panel-background
        height 30px
      &::-webkit-media-controls-panel
        position absolute
        bottom 0
        width 100%
        height 30px
        background-color rgba(255,255,255, .7)
      &::-webkit-media-controls-current-time-display
        padding 10px
        display flex !important
        font-size 12px
      &::-webkit-media-controls-time-remaining-display
        display flex !important
        font-size 12px
      &::-webkit-media-controls-volume-slider
        display none        
      &::-webkit-media-controls-start-playback-button
        display none!important
        -webkit-appearance none
        /* the followings isfor Android */
        opacity 0
        pointer-events none
    > .playpause
      background-repeat no-repeat
      width 60px
      height 60px
      position absolute
      margin auto
      background-size contain
      background-position center
      top 50%
      left 50%
      margin-left -30px
      margin-top -30px
      cursor pointer
      box-shadow 0 0 20px rgba(0, 0, 0, 0.25)
      border-radius 50%

      &.play
        background-image url('/public/icon/play-btn@2x.png')
        opacity 1
        
      &.pause
        background-image url('/public/icon/pause-btn@2x.png')
        // animation fade-out 0.5s
        opacity 0

        &.hover
          opacity 1 !important

  @media (min-width 768px)
    .video-container
      .playpause
        margin-left -50px
        margin-top -50px
        width 80px
        height 80px

  @keyframes fade-out
    0%
      opacity 1

    100%
      opacity 0
</style>
