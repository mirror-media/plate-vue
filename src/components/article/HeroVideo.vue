<template>
  <div class="hero-video">
    <template v-if="video">
      <ArticleVideo :video="video" class="hero-video__video"></ArticleVideo>
      <div v-show="heroCaption && heroCaption.length > 0" class="hero-video__caption" v-text="heroCaption"></div>
    </template>
  </div>
</template>
<script>
  import ArticleVideo from 'src/components/article/Video.vue'

  export default {
    name: 'HeroVideo',
    components: {
      ArticleVideo
    },
    props: [ 'heroCaption', 'video' ]
  }
</script>
<style lang="stylus" scoped>
  .hero-video
    position relative
    left -25px
    width calc(100% + 50px)
    background-color #fff
    &__caption
      padding 0 25px
      margin-top 5px
      font-size 1rem
      line-height 1.3
      text-align justify

@media (min-width: 500px)
  .hero-video
    width calc(100% + 100px)
    left -50px
    &__caption
      padding 0 50px

@media (min-width: 768px)
  .hero-video
    position static
    width 100%
    &__caption
      padding 0 calc((100% - 645px) / 2)

@media (min-width: 900px)
  .hero-video
    &__caption
      padding 0 calc((100% - 695px) / 2)

@media (min-width: 1200px)
  .hero-video
    &__caption
      margin-top .5em
    
</style>