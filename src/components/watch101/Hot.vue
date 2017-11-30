<template>
  <div class="items">
    <app-slider :option="sliderOption">
      <template slot-scope="props">
        <swiper-slide :is="props.slide" v-for="(watch, index) in list" :key="`hot-${index}`" v-if="index < 10">
          <div class="hot-item" @click="openLightbox(watch)">
            <div class="hot-item--order"><span v-text="`${index + 1}`"></span></div>
            <div class="hot-item--img">
              <img :alt="watch.description" v-lazy="getValue(watch, [ 'watchImage', 'image', 'url' ])"
                :data-srcset="`
                  ${getValue(watch, [ 'watchImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')} 800w,
                  ${getValue(watch, [ 'watchImage', 'image', 'resizedTargets', 'tablet', 'url' ], '')} 1200w,
                  ${getValue(watch, [ 'watchImage', 'image', 'resizedTargets', 'desktop', 'url' ], '')} 2000w`">
            </div>
            <div class="hot-item--title"><span v-text="getValue(watch, [ 'brand', 'name' ])"></span></div>
            <div class="hot-item--desc"><span v-text="getValue(watch, [ 'type' ])"></span></div>
          </div>
        </swiper-slide>
      </template>
    </app-slider>
  </div>
</template>
<script>
  import Slider from '../Slider.vue'
  import { getValue } from '../../util/comm'

  export default {
    components: {
      'app-slider': Slider
    },
    computed: {
      sliderOption () {
        return {
          autoplay: 10000,
          navBtnStyle: {
            height: '80%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            marginTop: 0,
            top: '10%',
            backgroundSize: '60% auto'
          },
          navBtnNextStyle: {
            right: 0
          },
          navBtnPrevStyle: {
            left: 0
          },
          paginationable: false,
          paginationClickable: true,
          paginationHide: false,
          setNavBtn: true,
          slidesPerView: 2,
          loop: false
        }
      }
    },
    name: 'hot-list',
    methods: {
      getValue,
      openLightbox (item) {
        console.log('hihi')
        this.$emit('openLightbox', item)
      }
    },
    mounted () {},
    props: [ 'list' ]
  }
</script>
<style lang="stylus" scoped>
  .items
    height 100%
    border-top 1px solid #000
    border-bottom 1px solid #000
      
    .swiper-container
      height 100%

      .swiper-slide-active
        > .hot-item
          &::after
            content ''
            position absolute
            height 80%
            width 1px
            background-color #000
            right 0
            top 10%
            margin-top 0
          > .hot-item--img
            right 5px
      .swiper-slide-next
        > .hot-item
          padding-left 5px
          > .hot-item--img
            right 25px
      .hot-item
        // height calc(100% - 60px)
        height calc(100% - 30px)
        position relative
        // padding 30px
        padding 15px 30px
        display flex
        justify-content flex-end
        flex-direction column
        cursor pointer

        &--order
          position absolute
          z-index: 1
          // padding-right 65%
          // height 60%
          height  50%
          top 10px
          font-size 2.25rem
        &--title
          position relative
          z-index: 1
          font-weight bold
          font-size 0.9rem
          text-shadow 0 0 1px #fff
        &--desc
          position relative
          z-index 1
          font-size 0.8rem
          text-shadow 0 0 1px #fff
          
        &--img
          position absolute
          z-index 0
          right 0
          // top 0
          top 10px
          width 65%
          // height 100%
          height calc(100% - 40px)
          padding 10px 0
          > img
            object-fit cover
            object-position center center
            height 100%
            width 100%

          &::after
            content ''
            position absolute
            width 100%
            height 100%
            top 0
            left 0
            background linear-gradient(50deg, #fff, rgba(255, 255,255, 0.5), rgba(255, 255,255, 0.4), rgba(255, 255,255, 0), rgba(255, 255,255, 0), rgba(255, 255,255, 0))
</style>
