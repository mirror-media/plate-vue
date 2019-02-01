<template>
  <section class="single-video">
    <slot name="PCHD"></slot>
    <slot name="MBHD"></slot>
    <div class="single-video__video">
      <div id="oathSingleVideoPlayer" ref="oathSingleVideoPlayer" class="single-video__video-player"></div>
      <div class="single-video__video-info">
        <div v-if="playlist[0]" v-text="playlist[0].name"></div>
        <p class="small" v-text="moment(video.publishDate).format('YYYY. MM. DD')"></p>
      </div>
      <div class="single-video__video-title">
        <h1 v-text="video.name"></h1>
        <slot name="share"></slot>
      </div>
      <p v-text="video.description"></p>
    </div>
    <template v-if="relateds.length > 0">
      <div class="single-video__relateds">
        <h3>相關影音</h3>
        <a v-for="video in relateds"
          :key="video.id"
          :href="`/video/${video.id}`"
          class="related"
          data-gtm-category="article"
          data-gtm="video related"
          target="_blank">
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
    <slot name="PCFT"></slot>
    <slot name="MBFT"></slot>
  </section>
</template>
<script>

import moment from 'moment'
import {
  OATH_COPMANY_ID,
  OATH_ARTICLE_PLAYER_DESKTOP_ID,
  OATH_ARTICLE_PLAYER_MOBILE_ID,
  SITE_URL
} from '../../constants'

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
    }
  },
  data () {
    return {
      SITE_URL,
    }
  },
  computed: {
    relateds () {
      const playlistId = this.playlist[0] ? this.playlist[0].id : ''
      return playlistId ? this.$store.state.playlist[playlistId].filter(video => video.id !== this.$route.params.slug).slice(0, 7) : []
    }
  },
  mounted () {
    if (this.video) {
      this.embedDynamicPlayer(this.video.id)
    }
  },
  methods: {
    embedDynamicPlayer (vidoeId) {
      const playerId = this.$store.state.viewport.width > 768 ? OATH_ARTICLE_PLAYER_DESKTOP_ID : OATH_ARTICLE_PLAYER_MOBILE_ID
      const script = document.createElement("script")
      script.innerHTML = `var player = vidible.player('oathSingleVideoPlayer').setup({
        pid: '${playerId}',
        bcid: '${OATH_COPMANY_ID}',
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
    > p
      width 90%
      margin 0 auto
    h1
      margin 0
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
  &__video-title
    width 90%
    margin 1em auto 0
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
    &__video-info, &__video-title, &__relateds, &__comments
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
      h1
        margin-right 2em
      p.small
        font-size .875rem
    &__video-info
      width 100%
      > div
        font-size .875rem
    &__video-title
      display flex
      align-items flex-start
      width 100%
      > div
        margin 0 0 0 auto
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
