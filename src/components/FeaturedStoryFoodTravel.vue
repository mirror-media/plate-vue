<template>
    <div class="project-container" v-if="(sectionfeatured.length > 0)">
    <items-title-rect class="header-rect">精選<br>影音</items-title-rect>
    <div class="proj_list">
      <app-slider :option="sliderOption" v-if="ifShowFeatured" :slideId="sliderId">
        <template scope="props">
          <swiper-slide :is="props.slide" v-for="(o, i) in sectionfeatured" v-if="i < 10">
            <div class="proj_item">
              <div>
                <a :href="`${siteUrl}/story/${o.slug}`" :id="'story-' + o.name + '-1'">
                  <div class="proj_item_img"
                      :style="{ backgroundImage: 'url(' + getImage(o, 'mobile') + ')' }">
                  <img class="play-btn" src="../../public/icon/play-foodtravel.png" alt="">
                  <p>{{ o.title }}</p>
                  </div>
                </a>
              </div>
            </div>
          </swiper-slide>
        </template>
      </app-slider>
    </div>
    <div class="slide-nav-btn prev" @click="goPrev"></div>
    <div class="slide-nav-btn next" @click="goNext"></div>
  </div>
</template>

<script>
  import ItemsTitleRect from './ItemsTitleRect.vue'
  import { SECTION_MAP, SITE_URL } from '../constants'
  import { getHref, getImage, getTruncatedVal, getValue } from '../utils/comm'
  import Slider from './Slider.vue'
  import sanitizeHtml from 'sanitize-html'

  export default {
    components: {
      'items-title-rect': ItemsTitleRect,
      'app-slider': Slider
    },
    computed: {
      ifShowFeatured () {
        const browser = typeof window !== 'undefined'
        return (browser && this.viewport)
      },
      slidesPerView () {
        return (this.viewport < 752) ? 1 : 3
      },
      paginationShow () {
        // return (this.viewport < 752) ? true : false
      },
      sliderOption () {
        return {
          paginationable: true,
          paginationClickable: true,
          paginationShow: this.paginationShow,
          setNavBtn: false,
          slidesPerView: this.slidesPerView,
          spaceBetween: 0,
          simulateTouch: true,
          grabCursor: true
        }
      },
      sliderId () {
        return `proj`
      }
    },
    data () {
      return {
        siteUrl: SITE_URL
      }
    },
    methods: {
      borderLeftStyle (sect) {
        return {
          borderLeft: SECTION_MAP[ sect ][ 'borderLeft' ]
        }
      },
      getHref,
      getImage,
      getTruncatedVal,
      getValue,
      goPrev () {
        window.refs[ this.sliderId ].slidePrev()
      },
      goNext () {
        window.refs[ this.sliderId ].slideNext()
      },
      sanitizeHtml
    },
    // name: 'project-list',
    props: {
      sectionfeatured: {
        default: () => { return [] }
      },
      viewport: {
        default: () => { return undefined }
      }
    }
  }
</script>

<style lang="stylus" scoped>
// .featuredstory-foodtravel
//     display flex
//     align-items space-between
//     width 100%
//     // background-color #f5e2c5
//     .header-rect
//         margin-top 5%
//         margin-left 5%

// @media (min-width: 1200px)
//     .featuredstory-foodtravel
//         .header-rect
//             margin-left 8.3%


.project-container 
  font-size 18px
  position relative
  margin-top 5%
  margin-left 8.3%
  margin-right 8.3%

  //.header-rect
    // margin-top 8.3%
    // margin-left 8.3%

  .proj_title
    // border-bottom 5px solid #000

    h3
      width 4rem
      background-color #000
      color #fff
      font-size 1rem
      display flex
      justify-content center
      align-items flex-end
      height 1.5rem
      margin 0

  .proj_list 
    display flex
    align-content flex-start
    flex-wrap wrap
    justify-content space-between
    
    padding 20px 20px 10px 0
    border none

    .proj_item 
      vertical-align top

      padding-left 0
      border-left none
      height 95%

      > div:not([class="proj_item_title"]):not([class="proj_item_desc"])
        position relative
        height 0
        padding-top 66.67%
        
        > a
          .proj_item_img
            height 100%
            width 100%
            position absolute
            top 0
            left 0

      .proj_item_img 
        width 100%
        height 150px
        background-repeat no-repeat
        background-size cover
        background-position center center
        // text-align center
        display flex
        flex-direction column
        justify-content flex-end
        align-items center
        // box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
        .play-btn
            width 50px
            height 50px
            position absolute
            top 40%
            left 45%

      
      .proj_item_title, .proj_item_desc
        background-color #fff
        border-top-width 0
        line-height 1.5rem
        font-size 1.1rem
        padding 10px 0

        a 
          width 100%
          max-height 100%
          margin 10px 0

          &:hover, &:link, &:visited 
            font-weight normal
            border none
      
      .proj_item_title
        a 
          &:hover, &:link, &:visited 
            color rgba(0, 0, 0, 0.8)

      .proj_item_desc
        padding 0 0 10px

        a 
          &:hover, &:link, &:visited 
            color rgba(0, 0, 0, 0.49)


    .swiper-container
      .swiper-wrapper
        .swiper-slide
            .proj_item
                border-left none
                .proj_item_img
                    width 100%
                    height 80%
                    top 10%
                    filter brightness(50%)
                    p
                        display none

        // left
        .swiper-slide-active
          .proj_item
            border-left none
            a
                pointer-events none
                cursor default
            .proj_item_img
                width 100%
                height 80%
                // left 30%
                top 10%
                filter brightness(40%)
                box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                p
                    display none
        // center
        .swiper-slide-next
          .proj_item
            border-left none
            .proj_item_img
                width 100%
                height 100%
                top 0
                filter brightness(100%)
                box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                p
                    display block
                    color white
                    font-size 30px
                    // font-weight bold
                    text-shadow 2px 2px 2px #4d4d4d
                    margin 0 40px
                    margin-bottom 10px
        // right
        .swiper-slide-next + .swiper-slide
            .proj_item
                border-left none
                .proj_item_img
                    width 100%
                    height 80%
                    // left -10%
                    top 10%
                    z-index -2
                    filter brightness(40%)
                    box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                    p
                        display none
  .slide-nav-btn
    background-size contain
    background-repeat no-repeat
    background-position center center
    position absolute
    width 25px
    height 50px
    top 55%
    z-index 20
    cursor pointer

    &.prev
      left -5%
      background-image url(/public/icon/arrowl-foodtravel.png)
    
    &.next
      right -5%
      background-image url(/public/icon/arrowr-foodtravel.png)

// Tablet
@media (min-width 768px) and (max-width 1365px)
  .project-container 
    .proj_list
        .proj_item
            margin-bottom 0
        .swiper-container
            .swiper-wrapper
                .swiper-slide
                    .proj_item
                        border-left none
                        .proj_item_img
                            width 100%
                            height 150%
                            top 25%
                            filter brightness(50%)
                            p
                                display none
                // left
                .swiper-slide-active
                    .proj_item
                        border-left none
                        a
                            pointer-events none
                            cursor default
                        .proj_item_img
                            width 100%
                            height 150%
                            // left 30%
                            top 25%
                            filter brightness(40%)
                            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                            p
                                display none
                        .play-btn
                            display none        
                // center
                .swiper-slide-next
                    .proj_item
                        border-left none
                        // width 200%
                        height 25vh
                        // position absolute
                        // left -100%
                        .proj_item_img
                            width 200%
                            height 200%
                            left -50%
                            top 0
                            filter brightness(100%)
                            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                            p
                                display block
                                color white
                                font-size 30px
                                // font-weight bold
                                text-shadow 2px 2px 2px #4d4d4d
                                margin 0 40px
                                margin-bottom 10px
                // right
                .swiper-slide-next + .swiper-slide
                    .proj_item
                        border-left none
                        .proj_item_img
                            width 100%
                            height 150%
                            // left -10%
                            top 25%
                            z-index -2
                            filter brightness(40%)
                            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                            p
                                display none
                        .play-btn
                            display none 
// Mobile
@media (min-width 0px) and (max-width 767px)
    .project-container
        margin-top 50px
        margin-left 5%
        margin-right 5% 
        .proj_list
            margin-top 20px
            padding 0
            height 45vh
            .proj_item
                margin-bottom 0
            .swiper-container
                .swiper-wrapper
                    .swiper-slide
                        .proj_item
                            border-left none
                            .proj_item_img
                                width 100%
                                height 100%
                                top 0
                                filter brightness(50%)
                                p
                                    display none
                    // left
                    .swiper-slide-next
                        .proj_item
                            border-left none
                            a
                                pointer-events none
                                cursor default
                            .proj_item_img
                                width 100%
                                height 100%
                                left 0
                                top 0
                                filter brightness(40%)
                                box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                                p
                                    display none
                            // .play-btn
                            //     display none        
                    // center
                    .swiper-slide-active
                        .proj_item
                            border-left none
                            // width 100%
                            // height 20vh
                            // position absolute
                            // left -100%
                            .proj_item_img
                                width 100%
                                height 100%
                                left 0
                                top 0
                                filter brightness(100%)
                                box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                                p
                                    display block
                                    color white
                                    font-size 20px
                                    // font-weight bold
                                    text-shadow 2px 2px 2px #4d4d4d
                                    margin 0 20px
                                    margin-bottom 10px
                    // right
                    .swiper-slide-next + .swiper-slide
                        .proj_item
                            border-left none
                            .proj_item_img
                                width 100%
                                height 100%
                                left 0
                                top 0
                                z-index -2
                                filter brightness(40%)
                                box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                                p
                                    display none
                            // .play-btn
                            //     display none
    .slide-nav-btn
      background-size contain
      background-repeat no-repeat
      background-position center center
      position absolute
      width 25px
      height 50px
      top 50vh
      z-index 20
      cursor pointer
</style>

