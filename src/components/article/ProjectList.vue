<template>
  <div class="project-container" v-if="(projects.length > 0)">
    <div class="proj_title"><h3>聚焦鏡</h3></div>
    <div class="proj_list">
      <app-slider :option="sliderOption" v-if="ifShowProjects" :slideId="sliderId">
        <template scope="props">
          <swiper-slide :is="props.slide" v-for="(o, i) in projects" v-if="i < 10">
            <div class="proj_item">
              <div>
                <a :href="`https://mirrormedia.mg/projects/${o.slug}`" >
                  <div class="proj_item_img"
                      :style="{ backgroundImage: 'url(' + getImage(o, 'mobile') + ')' }">
                  </div>
                </a>
              </div>
              <div class="proj_item_title">
                <a :href="`https://mirrormedia.mg/projects/${o.slug}`" >
                  {{ getTruncatedVal(o.title, 22) }}
                </a>
              </div>
            </div>
          </swiper-slide>
        </template>
      </app-slider>
    </div>
  </div>
</template>
<script>
  import { SECTION_MAP } from '../../constants'
  import { getHref, getImage, getTruncatedVal, getValue } from '../../utils/comm'
  import Slider from '../Slider.vue'
  import _ from 'lodash'

  export default {
    components: {
      'app-slider': Slider
    },
    computed: {
      ifShowProjects() {
        const browser = typeof window !== 'undefined'
        return (browser && this.viewport) ? true : false
      },
      slidesPerView() {
        return (this.viewport < 768) ? 1 : 3
      },
      sliderOption() {
        return {
          paginationable: true,
          paginationClickable: true,
          paginationHide: false,
          setNavBtn: true,
          slidesPerView: this.slidesPerView,
          spaceBetween: 30,
        }
      },
      sliderId() {
        return `proj`
      }
    },
    methods: {
      borderLeftStyle(sect) {
        return {
          borderLeft: SECTION_MAP[ sect ][ "borderLeft" ]
        }
      },
      getHref,
      getImage,
      getTruncatedVal,
      getValue,
    },
    name: 'project-list',
    props: {
      projects: {
        default: () => { return [] }
      },
      viewport: {
        default: () => { return undefined }
      }
    },
  }
</script>
<style lang="stylus">
.project-container 
  font-size 18px

  .proj_list 
    margin-top 10px
    display flex
    align-content flex-start
    flex-wrap wrap
    justify-content space-between

    .proj_item 
      vertical-align top
      margin-bottom 30px

      > div:not([class="proj_item_title"])
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
      
      .proj_item_title 
        background-color #fff
        border-left 7px solid #414141
        border-top-width 0
        line-height 1.5rem
        font-size 1.2rem
        display flex
        justify-content center
        align-items center
        min-height 60px


        a 
          width 95%
          max-height 100%
          margin 10px 20px

          &:hover, &:link, &:visited 
            color #8c8c8c
            font-weight normal
            border none
          
  .swiper-button-prev 
    background-image url(/public/icon/left-2017.png)!important

  .swiper-button-next 
    background-image url(/public/icon/right-2017.png)!important

@media (min-width 0px) and (max-width 499px)
  .project-container 
    .proj_list
      .proj_item
        margin-bottom 0
</style>
