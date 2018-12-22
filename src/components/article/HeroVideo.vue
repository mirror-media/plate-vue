<template>
  <!-- <div :class="[ 'heroimage-container', `heroimage-container--${abIndicator.toLowerCase()}` ]"> -->
  <div class="heroimage-container">
    <template v-if="viewport > 1199">
      <!-- <template v-if="abIndicator === 'A'"> -->
      <template>
        <div class="hero-info">
          <div class="hero-info-category-container">
            <div class="hero-info-category"
              v-if="!isAd"
              v-text="get(articleData, [ 'categories', 0, 'title' ], get(articleData, [ 'sections', 0, 'title' ], ''))"
              :style="{ borderLeftColor: get(sectionMap, [ sectionId, 'bgcolor' ]) }"></div>
            <h1 v-text="get(articleData, [ 'title' ])"></h1>
            <h2 v-if="get(articleData, [ 'subtitle' ])" v-text="get(articleData, [ 'subtitle' ])"></h2>
          </div>
          <div class="hero-info-heroCaption" v-text="heroCaption"></div>
        </div>
        <div class="hero-img">
          <ArticleVideo v-if="video" :video="video" class="heroimg"></ArticleVideo>
        </div>
      </template>
      <!-- <template v-if="abIndicator === 'B'">
        <ArticleVideo v-if="video" :video="video" class="heroimg"></ArticleVideo>
        <p class="hero-img-b-subtitle" v-text="heroCaption"></p>
        <div
          class="hero-info-category hero-info-category--b"
          v-if="!isAd"
          v-text="get(articleData, [ 'categories', 0, 'title' ], get(articleData, [ 'sections', 0, 'title' ], ''))"
          :style="{ borderLeftColor: get(sectionMap, [ sectionId, 'bgcolor' ]) }"
        >
        </div>
        <h1 class="hero-title-b" v-text="get(articleData, [ 'title' ])"></h1>
        <h2 v-if="get(articleData, [ 'subtitle' ])" v-text="get(articleData, [ 'subtitle' ])"></h2>
      </template> -->
    </template>
    <template v-else-if="viewport">
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
    props: [ 'abIndicator', 'articleData', 'heroCaption', 'sectionId', 'sectionMap', 'video', 'viewport', 'isAd' ]
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
    &--b
      margin 0
      flex-direction column
      justify-content flex-start
  .hero-info
    display flex 
    flex-direction column
    justify-content space-between 
    width 33.34%
    background-color #989898
  .hero-info-category-container
    display flex
    flex-direction column
    justify-content center
    height 100%
    padding 0 10%
    > h1 
      margin-top 10px
      color #fff 
      font-size 40px 
      font-weight 400 
      line-height 1.3 
      text-align justify
    > h2
      margin 0
      color #fff 
      font-size 30px 
      font-weight 300 
      line-height 1.3 
      text-align justify
  .hero-info-category 
    width 80% 
    padding-left 10px 
    color #000 
    font-size 21px 
    border-left 7px solid #989898
    &--b
      margin 30px 0 0 0
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

  .hero-img-b
    width 100%
    height 458.7px
    & >>> img
      width 100%
      height 100%
      object-fit cover
  .hero-img-b-subtitle
    font-size 16px
    line-height 1.5
    margin 8px 0
    color #6e6e6e
    text-align justify
  .hero-title-b
    margin 15px 0 25px 0
    text-align justify
    line-height 1.5
    color black

  @media (max-width: 1200px)
    .heroimg
      width 100%
    .heroimage-container
      display block
    .heroimg-caption
      padding 5px 25px 0
      line-height 1.3rem
</style>