<template>
  <div class="project-container">
    <div
      v-if="(filteredProjects.length > 0)"
      class="proj_list"
    >
      <Slider
        :autoplay="false"
        :initial-slide="1"
        :show-swiper-pagination="false"
      >
        <div
          v-for="(o, i) in filteredProjects"
          :key="`${i}-${Date.now()}`"
          class="proj_item swiper-slide"
        >
          <div>
            <a
              :href="`${getHrefFull(o)}`"
              :target="target"
              @click="sendGaClickEvent('article', 'projects')"
            >
              <div
                class="proj_item_img"
                :title="get(o, 'title')"
                :style="{ backgroundImage: 'url(' + getImage(o, 'mobile') + ')' }"
              />
            </a>
          </div>
          <div class="proj_item_title">
            <a
              :href="`${getHrefFull(o)}`"
              :target="target"
              @click="sendGaClickEvent('article', 'projects')"
            >
              {{ getTruncatedVal(o.title, 20) }}
            </a>
          </div>
          <div class="proj_item_desc">
            <a
              :href="`${getHrefFull(o)}`"
              :target="target"
              @click="sendGaClickEvent('article', 'projects')"
            >
              {{ getTruncatedVal(sanitizeHtml( get(o, 'brief.html', ''), { allowedTags: [ ] }), 20) }}
            </a>
          </div>
        </div>
      </Slider>
    </div>
  </div>
</template>
<script>
import { filter, get, includes } from 'lodash'
import { getHrefFull, getImage, getTruncatedVal, sendGaClickEvent } from '../../util/comm'
import Slider from '../Slider.vue'
import sanitizeHtml from 'sanitize-html'

export default {
  name: 'ProjectList',
  components: {
    Slider
  },
  props: {
    excludingProjects: {
      type: Array,
      default: () => []
    },
    projects: {
      type: Array,
      default: () => []
    },
    target: {
      type: String,
      default: '_self'
    }
  },
  computed: {
    filteredProjects () {
      return filter(this.projects, (o) => {
        return !includes(this.excludingProjects, o.slug)
      })
    }
  },
  methods: {
    get,
    getHrefFull,
    getImage,
    getTruncatedVal,
    sanitizeHtml,
    sendGaClickEvent
  }
}
</script>
<style lang="stylus" scoped>

.project-container
  font-size 18px
  .swiper-container
    border 1px solid rgba(0,0,0,0.29)
  .swiper-slide
    width calc(100% / 3)
    max-width calc(100% / 3)
  >>> .swiper-button-prev, >>> .swiper-button-next
    width 25px
    height 50px
    background-size contain
    background-repeat no-repeat
    background-position center center
  >>> .swiper-button-prev
    left 0
    background-image url(/assets/mirrormedia/icon/B-left.png)
  >>> .swiper-button-next
    right 0
    background-image url(/assets/mirrormedia/icon/B-right.png)
  .proj_item
    margin 20px 0
    padding 0 30px
    & + .proj_item
      border-left 1px solid rgba(0,0,0,0.18)
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
      height 100%
      background-repeat no-repeat
      background-size cover
      background-position center center
    .proj_item_title, .proj_item_desc
      background-color #fff
      border-top-width 0
      line-height 1.5rem
      font-size 1.1rem
    .proj_item_title
      padding 10px 0
    .proj_item_desc
      a
        color rgba(0,0,0,0.49)

</style>
