<template>
  <div class="audioBox">
    <span> {{ toMMSS(seek) }} / {{ toMMSS(duration) }} </span>
    <div class="audioBox-progress">
      <input type="range" min="0" :value="seek" :max="duration" step="1" @change="handleChange"/>
      <div class="audioBox-progress__bar" :style="{ width: progressWidth + '%' }">
        
      </div>
    </div>
    <div class="audioBox-content">
      <div class="audioBox-content__cover" :style="{ backgroundImage: 'url(' + getImage(item) + ')' }" :class="{ 'cover': hasCover }">
        <div @click="togglePlayback" :class="[playing ? 'pause' : 'play']"></div>
      </div>
      <h2 class="audioBox-content__title" v-text="item.title"></h2>
    </div>
  </div>
</template>

<script>

import _ from 'lodash'
import VueHowler from 'vue-howler'

export default {
  name: 'audioBox',
  props: [ 'item' ],
  mixins: [ VueHowler ],
  computed: {
    hasCover () {
      const cover = _.get(this.item, [ 'coverPhoto', 'image', 'resizedTargets', 'tiny', 'url' ])
      return cover
    },
    progressWidth () {
      return (this.seek / this.duration) * 100 < 1 ? 100 : (this.seek / this.duration) * 100
    }
  },
  methods: {
    getImage (item) {
      return _.get(item, [ 'coverPhoto', 'image', 'resizedTargets', 'tiny', 'url' ], '/public/icon/audio@2x.png')
    },
    getCoverCss (item) {
      const cover = _.get(item, [ 'coverPhoto', 'image', 'resizedTargets', 'tiny', 'url' ])
      return cover ? 'backgroundImage: url(' + cover + '), background-size: cover, background-position: 50% 50%'
        : 'backgroundImage: url(/public/icon/audio@2x.png), background-size: 80px 40px, background-position: 50% 50%'
    },
    handleChange (e) {
      console.log(e.target.value)
      this.setSeek(parseInt(e.target.value))
    },
    toMMSS (seconds) {
      seconds = parseInt(seconds, 10)
      const minutes = parseInt(seconds / 60) % 60
      seconds = seconds % 60
      return (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
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
  > span
    margin-right 10px
    text-align right
  &-progress
    position relative
    width 100%
    height 15px
    margin 10px 0
    > input[type=range]
      position absolute
      width 100%
      height 5px
      background transparent
      outline none
      -webkit-appearance none

    &__bar
      width 100%
      height 5px
      background-color #004ea2
  &-content
    display flex
    &__cover
      position relative
      width 80px
      height 80px
      margin 10px
      background-color #004ea2
      background-position 50% 50%
      background-repeat no-repeat
      background-size 80px 40px
      > div
        position absolute
        top 0
        left 0
        bottom 0
        right 0
        width 45px
        height 45px
        margin auto
        background-position 50% 50%
        background-repeat no-repeat
        background-size contain
        &.pause
          background-image url(/public/icon/pause-btn@2x.png)
        &.play
          background-image url(/public/icon/play-btn@2x.png)
      &.cover
        background-size cover

    &__title
      width calc( 100% - 100px)
      flex-grow 1
      margin 10px 0
      padding 0 10px
      font-size 1.5rem
      line-height 2rem
      font-weight 300

@media (min-width: 600px)
  .audioBox
    flex-direction column
    flex-wrap wrap
    width calc( (100% - 40px)/2 )
    margin 0 10px 20px

@media (min-width: 1200px)
  .audioBox
    width calc( (100% - 60px)/3 )

</style>
