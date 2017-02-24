<template>
  <div class="leading">
    <div class="leading-slideshow" v-if="type === 'slideshow'">
      <app-slider :option="sliderOption">
        <template scope="props">
          <swiper-slide :is="props.slide" v-for="(o, i) in slideshowImgs">
            <!--<img data-src=${_.get(item.content, [ 0, 'url' ], '')} width=\"\"
                         data-srcset=\"${_.get(item.content, [ 0, 'mobile', 'url' ], '')} 800w,
                                       ${_.get(item.content, [ 0, 'tablet', 'url' ], '')} 1200w,
                                       ${_.get(item.content, [ 0, 'desktop', 'url' ], '')} 2000w\"
                         class=\"swiper-lazy\"/>-->
            <div class="swiper-lazy-preloader"></div>
          </swiper-slide>
        </template>
      </app-slider>
    </div>
  </div>
</template>

<script>
import Slider from './Slider.vue'
export default {
  components: {
    Slider
  },
  computed: {
    sliderOption() {
      return {
        paginationable: true,
        paginationClickable: true,
        paginationHide: false,
        setNavBtn: false
      }
    },
    slideshowImgs() {
      if(this.type === 'slideshow') {
        return []
      } else {
        return []
      }
    },
  },
  methods: {
    
  },
  name: 'leading',
  props: {
    mediaData: {
      default: () => { return {} }
    },
    type: {
      default: () => { return {} }
    }
  },
}
  
</script>
<style lang="stylus" scoped>


</style>