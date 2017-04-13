<template>
  <div class="project-container" v-if="(projects.length > 0)">
    <div class="proj_title"><h3>聚焦鏡</h3></div>
    <div class="proj_list">
      <app-slider :option="sliderOption" v-if="ifShowProjects" :slideId="sliderId">
        <template scope="props">
          <swiper-slide :is="props.slide" v-for="(o, i) in projects" v-if="i < 10">
            <div class="proj_item">
              <div>
                <a :href="`${siteUrl}/projects/${o.slug}`" :id="'projects-' + o.name + '-1'">
                  <div class="proj_item_img"
                      :style="{ backgroundImage: 'url(' + getImage(o, 'mobile') + ')' }">
                  </div>
                </a>
              </div>
              <div class="proj_item_title">
                <a :href="`${siteUrl}/projects/${o.slug}`" :id="'projects-' + o.name + '-2'">
                  {{ getTruncatedVal(o.title, 20) }}
                </a>
              </div>
              <div class="proj_item_desc">
                <a :href="`${siteUrl}/projects/${o.slug}`" :id="'projects-' + o.name + '-3'">
                  {{ getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 20) }}
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
  import { SECTION_MAP, SITE_URL } from '../../constants'
  import { getHref, getImage, getTruncatedVal, getValue } from '../../utils/comm'
  import Slider from '../Slider.vue'
  import sanitizeHtml from 'sanitize-html'

  export default {
    components: {
      'app-slider': Slider
    },
    computed: {
      ifShowProjects () {
        const browser = typeof window !== 'undefined'
        return (browser && this.viewport)
      },
      slidesPerView () {
        return (this.viewport < 768) ? 1 : 3
      },
      sliderOption () {
        return {
          paginationable: true,
          paginationClickable: true,
          paginationHide: false,
          setNavBtn: false,
          slidesPerView: this.slidesPerView,
          spaceBetween: 30
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
    name: 'project-list',
    props: {
      projects: {
        default: () => { return [] }
      },
      viewport: {
        default: () => { return undefined }
      }
    }
  }
</script>
<style lang="stylus">
.project-container 
  font-size 18px
  position relative

  .proj_title
    border-bottom 5px solid #000

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
    border 1px solid rgba(0, 0, 0, 0.29)

    .swiper-container
      .swiper-wrapper
        .swiper-slide-active
          .proj_item
            border-left none

    .proj_item 
      vertical-align top

      padding-left 30px
      border-left 1px solid rgba(0, 0, 0, 0.18)
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


  .slide-nav-btn
    background-size contain
    background-repeat no-repeat
    background-position center center
    position absolute
    width 25px
    height 50px
    top 50%
    z-index 20
    cursor pointer

    &.prev
      left 0
      background-image url(/public/icon/B-left.png)
    
    &.next
      right 0
      background-image url(/public/icon/B-right.png)


@media (min-width 0px) and (max-width 499px)
  .project-container 
    .proj_list
      .proj_item
        margin-bottom 0
</style>
