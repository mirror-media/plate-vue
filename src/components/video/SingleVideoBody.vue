<template>
  <section class="single-video">
    <div class="single-video__video">
      <div id="oathSingleVideoPlayer" ref="oathSingleVideoPlayer" class="single-video__video-player"></div>
      <div class="single-video__video-info">
        <div v-if="playlistFiltered" v-text="playlistFiltered.name"></div>
        <p class="small" v-text="moment(video.publishDate).format('YYYY. MM. DD')"></p>
      </div>
      <h1 v-text="video.name"></h1>
      <p v-text="video.description"></p>
    </div>
    <template v-if="relateds.length > 0">
      <div class="single-video__relateds">
        <h3>相關影音</h3>
        <a v-for="video in relateds" :key="video.id" :href="`/video/${video.id}`" class="related" target="_blank">
          <figure>
              <img :src="getThumbnails(video)" :alt="video.name">
          </figure>
          <p v-text="video.name"></p>
        </a>
      </div>
    </template>
    <div class="single-video__comments">
      <div :href="`${SITE_URL}/video/${$route.params.slug}`" class="fb-comments" data-numposts="5" data-width="100%"></div>
    </div>
  </section>
</template>
<script>

import moment from 'moment'
import { SITE_URL } from '../../constants'


const PLAYER_ID = '5c4e8789600c9a7e62ade71a'
const COPMANY_ID = '5bffb44aa00f3047dec33787'

export default {
  name: 'SingleVideoBody',
  props: {
    playlist: {
      type: Array,
    },
    video: {
      type: Object
    },
    videos: {
      type: Array,
      // default () {
      //   return []
      // }
    }
  },
  data () {
    return {
      SITE_URL,
      // COPMANY_ID,
      // PLAYER_ID,
    }
  },
  computed: {
    playlistFiltered () {
      const video = this.videos.find(video => video.id === this.video.id)
      const playlistId = video ? video.playlistId : ''
      return playlistId ? this.playlist.find(playlist => playlist.id === playlistId) : ''
    },
    relateds () {
      const playlistId = this.playlistFiltered ? this.playlistFiltered.id : ''
      return playlistId ? this.$store.state.playlist[playlistId].filter(video => video.id !== this.$route.params.slug).slice(0, 7) : []
    }
  },
  watch: {
    '$route.fullPath' () {
      this.$refs.oathSingleVideoPlayer.innerHTML = ''
    },
    video (value) {
      this.embedDynamicPlayer(value.id)
    }
  },
  mounted () {
    if (this.video) {
      this.embedDynamicPlayer(this.video.id)
    }
  },
  methods: {
    embedDynamicPlayer (vidoeId) {
      const script = document.createElement("script")
      script.innerHTML = `var player = vidible.player('oathSingleVideoPlayer').setup({
        pid: '${PLAYER_ID}',
        bcid: '${COPMANY_ID}',
        videos: [ '${vidoeId}' ]
      }).load();`
      document.querySelector('.single-video__video').appendChild(script)
    },
    getThumbnails (video) {
      return video.systemThumbnails.length > 0 ? video.systemThumbnails[video.systemThumbnails.length - 1].url : ''
    },
    moment
  }
}
</script>
<style lang="stylus" scoped>
.single-video
  &__video
    > h1, > p
      width 90%
      margin 0 auto
    h1
      margin-top .5em
      color #064f77
      text-align justify
      font-size 1.1875rem
      line-height 1.37
    p
      margin-top .5em
      text-align justify
      line-height 1.88
      &.small
        color #a0a0a0
        font-size .75rem
  &__video-player
    position relative
    padding-top 56.25%
    background-color #000
    >>> .o2-script-api-wrapper
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      width 100%
  &__video-info
    display flex
    justify-content space-between
    width 90%
    margin 15px auto 0
    > div
      display flex
      align-items center
      padding .2em .5em
      color #fff
      font-size .75rem
      background-color #f19149
      border-radius 2px
    > p
      display inline-block
      margin 0
  &__relateds
    width 90%
    margin 40px auto 0
    h3
      margin 0
      color #2a597d
      font-size 1rem
      font-weight 600
    .related
      display block
      margin-top 20px
      figure
        position relative
        padding-top 56.25%
        margin 0
        overflow hidden
        img
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          width 100%
          height 100%
          object-fit cover
          object-position center center
      p
        margin 10px 0 0
        color #828282
        font-size .875rem
        text-align justify
        line-height 1.43
  &__comments
    width 90%
    margin 40px auto 0

@media (min-width: 768px)
  .single-video
    &__video
      > h1, > p
        width 60%
      h1
        font-size 1.375rem
    &__video-info, &__relateds, &__comments
      width 60%
    &__relateds
      .related
        display flex
        figure
          width 50%
          padding-top 28.125%
          margin 0 10px 0 0
        p
          flex 1
          font-size 1rem

@media (min-width: 1200px)
  .single-video
    display flex
    flex-wrap wrap
    max-width 1160px
    margin 30px auto 0
    &__video
      width 66.67%
      > h1, > p
        width 100%
      p.small
        font-size .875rem
    &__video-info
      width 100%
      > div
        font-size .875rem
    &__relateds
      width calc(33.33% - 50px)
      margin 0 0 0 50px
      h3
        font-size 1.25rem
      .related
        figure
          width 40%
          padding-top 22.5%
        p
          margin 0
          font-size .875rem
          &:hover
            color #064f77
    &__comments
      width 66.67%
      margin 40px auto 0 0
</style>
