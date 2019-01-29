<template>
  <section class="video-list">
    <h2 v-text="playlist.name"></h2>
    <div class="video-list__list">
      <a v-for="item in items" :key="item.id" :href="`/video/${item.id}`" class="video-list__block" target="_blank">
        <figure>
          <img :src="getThumbnails(item)" :alt="item.name">
        </figure>
        <h3 v-text="item.name"></h3>
      </a>
    </div>
    <slot name="more"></slot>
  </section>
</template>
<script>
export default {
  name: 'VideoList',
  props: {
    items: {
      type: Array
    },
    playlist: {
      type: Object
    }
  },
  methods: {
    getThumbnails (video) {
      return video.systemThumbnails.length > 0 ? video.systemThumbnails[video.systemThumbnails.length - 1].url : ''
    }
  }
}
</script>
<style lang="stylus" scoped>

.video-list
  display flex
  flex-direction column
  width 90%
  margin 30px auto 0
  > h2
    margin 0
    color #2a597d
    font-size 1rem
    text-align justify
  &__list
    display flex
    flex-direction column
    flex-wrap wrap
    margin-top 20px
  &__block
    display block
    width 100%
    cursor pointer
    & + .video-list__block
      margin-top 20px
    > figure
      position relative
      padding-top 56.25%
      margin 0
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
    > h3
      margin 10px 0 0
      color #828282
      text-align justify
      font-size .875rem

@media (min-width: 768px)
  .video-list
    width 60%
    max-width 1044px
    > h2
      font-size 1.375rem
    &__block
      > h3
        margin-top 20px
        font-size 1rem

@media (min-width: 1200px)
  .video-list
    width auto
    > h2
      margin 0 10px
    &__list
      justify-content flex-start
      flex-direction row
    &__block
      max-width calc((100% - 80px) / 4)
      margin 0 10px
      & + .video-list__block
        margin-top 0
</style>
