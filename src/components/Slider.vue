<template>
  <swiper :options="swiperOption" :ref="slideId">
    <slot :slide="slideComp"></slot>
    <slot name="custNav" :thisSwiperId="slideId"></slot>
    <div class="swiper-pagination" :id="swiperPagiantionId" slot="pagination" :style="custStyle"></div>
    <div class="swiper-button swiper-button-prev" :class="navBtnClass" slot="button-prev" :style="[ navBtnStyle, navBtnPrevStyle ]"></div>
    <div class="swiper-button swiper-button-next" :class="navBtnClass" slot="button-next" :style="[ navBtnStyle, navBtnNextStyle ]"></div>
  </swiper>
</template>
<script>
  import Swiper from 'vue-awesome-swiper/src/swiper.vue'
  import SwiperSlide from 'vue-awesome-swiper/src/slide.vue'

  if (process.env.VUE_ENV === 'client') {
    require('swiper/dist/css/swiper.css')
  }

  export default {
    components: {
      Swiper,
      SwiperSlide
    },
    computed: {
      navBtnClass () {
        // return `${this.slideId}-navbtn`
        return {
          enabled: (this.option[ 'setNavBtn' ])
        }
      },
      navBtnStyle () {
        return this.option[ 'navBtnStyle' ] || {}
      },
      navBtnNextStyle () {
        return this.option[ 'navBtnNextStyle' ] || {}
      },
      navBtnPrevStyle () {
        return this.option[ 'navBtnPrevStyle' ] || {}
      },
      swiperPagiantionId () {
        return `${this.slideId}-pagination`
      },
      swiper () {
        return this.$refs[ this.slideId ].swiper
      },
      slideComp () {
        return SwiperSlide
      },
      swiperOption () {
        const defaultOpt = {
          notNextTick: true,
          direction: 'horizontal',
          grabCursor: true,
          setWrapperSize: true,
          loop: true,
          initialSlide: 1,
          // effect: 'coverflow',
          // coverflow: {
          //   stretch: 100,
          //   modifier: 3,
          // },
          // pagination: `#${this.swiperPagiantionId}`,
          // paginationClickable: true,
          // paginationHide: false,
          uniqueNavElements: true,
          // mousewheelControl: true,
          // preloadImages: true,
          // updateOnImagesReady : true,
          lazyLoading: true,
          lazyLoadingInPrevNext: true,
          lazyLoadingOnTransitionStart: true,
          // zoom : true,

          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next',
          observer: true,
          observeParents: true
          // virtualTranslate : true,
        }
        if (this.option[ 'paginationable' ]) {
          this.option[ 'pagination' ] = `#${this.swiperPagiantionId}`
        }
        if (this.option['showPagination']) {
          this.custStyle = 'top: 1px'
        }
        if (this.$refs[ this.slideId ]) {
          this.swiper.update()
        }
        return Object.assign(defaultOpt, this.option)
      }
    },
    data () {
      return {
        custStyle: ''
      }
    },
    methods: {
      slideTo () {
        return this.swiper.slideNext()
      }
    },
    mounted () {
      // this.swiper.update()
      // this.swiper.slideTo(2, 1000, true)
      // this.swiper.update(true)
      if (!window[ 'refs' ]) window[ 'refs' ] = {}
      window[ 'refs' ][ this.slideId ] = this.swiper
      window[ 'refs' ][ this.slideId ].init()
    },
    name: 'app-slider',
    props: {
      slideId: {
        default: () => {
          const id = `id-${Date.now()}`
          return id
        }
      },
      option: { default: () => { return {} } }
    }
  }
</script>
<style lang="stylus">
  .swiper-container
    .swiper-pagination
      position relative
      top 20px

      &.swiper-pagination-bullets
        bottom 0
      
      .swiper-pagination-bullet
        bottom 0
        box-shadow 0 0 7px rgba(65, 65, 65, 0.61)
        border 2px solid #000000
        background-color #fff
        width 15px
        height 15px

        &.swiper-pagination-bullet-active
          background #4d4d4d
          border none
        
      
    
    .swiper-button
      display none
      
      &.enabled
        display block
      
    
    .swiper-button-prev
      background-image url(/public/icon/arrow1-2017.png)
    
    .swiper-button-next
      background-image url(/public/icon/arrow2-2017.png)
  
</style>
