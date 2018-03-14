<template>
  <div class="heroimage-container">
    <template v-if="viewport > 1199">
      <div class="hero-info">
        <div
          class="hero-info-category"
          :style="{ borderLeftColor: get(sectionMap, [ sectionId, 'bgcolor' ]) }"
          v-text="get(articleData, [ 'categories', 0, 'title' ], get(articleData, [ 'sections', 0, 'title' ], ''))"></div>
        <h1 v-text="get(articleData, [ 'title' ])"></h1>
        <div class="hero-info-heroCaption" v-text="heroCaption"></div>
      </div>
      <div class="hero-img">
        <ArticleVideo v-if="video" :video="video" class="heroimg"></ArticleVideo>
      </div>
    </template>
    <template v-else>
      <ArticleVideo v-if="video" :video="video" class="heroimg"></ArticleVideo>
      <div class="heroimg-caption" v-text="heroCaption" v-show="heroCaption && heroCaption.length > 0"></div>
    </template>
  </div>
</template>
<script>
  import { get } from 'lodash'
  import ArticleVideo from 'src/components/article/Video.vue'

  export default {
    name: 'HeroImage',
    components: {
      ArticleVideo
    },
    methods: {
      get
    },
    mounted () {},
    props: [ 'abIndicator', 'articleData', 'heroCaption', 'sectionId', 'sectionMap', 'video', 'viewport' ]
  }
</script>
<style lang="stylus" scoped>
  .heroimage-container
    margin 0 auto
    background-color #fff
    max-width 1160px
    position relative
    display flex
    justify-content space-between
  .hero-info
    display flex 
    flex-direction column 
    width 33.34% 
    padding 80px 0 0 0 
    background-color #989898 
    > h1 
      flex 1 
      width 80% 
      margin 0 auto 
      color #fff 
      font-size 40px 
      font-weight 400 
      line-height 1.3 
      text-align justify 
  .hero-info-category 
    width 80% 
    margin 0 auto 15px 
    padding-left 10px 
    color #000 
    font-size 21px 
    border-left 7px solid #989898 
  .hero-info-heroCaption 
    position relative 
    padding 10px 10% 
    color #fff 
    font-weight 300 
    line-height 1.4 
    border-top 3px solid #fff 
    &::after 
      content '' 
      position absolute 
      top -9px 
      right -7.5px 
      z-index 1 
      width 15px 
      height 15px 
      background-color #fff 
      border-radius 50% 
  .hero-img 
    position relative 
    width 66.66% 
    &[lazy=loading]
      object-fit contain
      height 150px
    &::after 
      content '' 
      display block 
      width 100% 
      padding-top 66.66% 
    > .heroimg 
      position absolute 
      top 0 
      left 0 
      bottom 0 
      right 0 
      width 100% 
      height 100%
  @media (max-width: 1200px)
    .heroimg
      width 100%
    .heroimage-container
      display block
    .heroimg-caption
      padding 5px 25px 0
      line-height 1.3rem
</style>