<template>
  <section id="editorChoice" class="editorChoice">
    <Slider v-if="!isMobile">
      <template v-slot:swiper-out-of-wrapper>
        <h2>編輯精選</h2>
      </template>
      <a
        v-for="item in editorChoice"
        :key="`swiper-slide-${item.slug}`"
        :href="getLinkHref(item)"
        :style="{ backgroundImage: `url(${item.heroImage.image.resizedTargets.tablet.url})` }"
        class="swiper-slide"
        target="_blank"
        @click="sendGaClickEvent('home', 'choice')"
      >
        <div class="swiper-slide__curtain" />
        <p class="swiper-slide__title" v-text="item.title" />
      </a>
    </Slider>
    <div v-if="isMobile" class="editorChoice--mobile">
      <div class="editorChoice__eyebrow"><h2>編輯精選</h2></div>
      <div v-for="item in editorChoice" class="editorChoice__block" :key="item.slug">
        <a
          :href="getLinkHref(item)"
          :target="target"
          class="editorChoice__block--img"
          @click="sendGaClickEvent('home', 'choice')">
          <LatestAriticleImg class="figure"
            :src="getImage(item, 'mobile')" :id="get(item, 'heroImage.id', Date.now())"
            :key="get(item, 'heroImage.id', Date.now())"></LatestAriticleImg>
          <div :style="getSectionStyle(get(item, 'sections.0', ''))" v-text="get(item, 'sections.0.title', '')"></div>
        </a>
        <div class="editorChoice__block--title" :class="getSection(item)">
          <div :style="getSectionStyle(get(item, 'sections.0', ''))" v-text="get(item, 'sections.0.title', '')"></div>
          <a
            :href="getLinkHref(item)"
            :target="target"
            @click="sendGaClickEvent('home', 'choice')">
            <h2 v-text="getTitle(item)"></h2>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import { SECTION_MAP } from 'src/constants'
import { getHref, getImage, getSection, sendGaClickEvent } from 'src/util/comm'
import LatestAriticleImg from 'src/components/LatestAriticleImg.vue'
import Slider from 'src/components/Slider.vue'
import truncate from 'truncate'
import { get } from 'lodash'

const GA_TRACE_QUERY = '?utm_source=mmweb&utm_medium=editorchoice'

export default {
  name: 'editorChoice',
  components: {
    LatestAriticleImg,
    Slider
  },
  props: {
    editorChoice: {
      default: () => { return this.editorChoice }
    },
    target: {
      default: () => ('_self')
    }
  },
  computed: {
    isMobile () {
      return get(this.$store, 'state.viewport.width') < 1200
    }
  },
  methods: {
    get,
    getImage,
    getLinkHref (article) {
      return article.style === 'projects'
        ? `https://www.mirrormedia.mg${getHref(article)}`
        : `${getHref(article)}${GA_TRACE_QUERY}`
    },
    getSection,
    getTitle (article) {
      return truncate(get(article, 'title'), 24)
    },
    getSectionStyle (sect) {
      const sectionId = get(sect, 'id')
      const style = {
        backgroundColor: get(SECTION_MAP, [sectionId, 'bgcolor'], '#bcbcbc')
      }
      return style
    },
    sendGaClickEvent
  }
}
</script>
<style lang="stylus" scoped>

.editorChoice
  .swiper-container
    h2
      position absolute
      top 20px
      left 20px
      z-index 10
      margin 0
      color #fff
      font-size 1rem
      font-weight 500
      user-select none
      text-shadow #000 .1em .1em .5em
  .swiper-slide
    padding-top 56.25%
    background-size cover
    background-position center center
    background-repeat no-repeat
    &__title
      position absolute
      left 10%
      bottom 45px
      width 80%
      color #fff
      text-align justify
      font-size 2rem
      font-weight 500
      line-height 1.5
    &__curtain
      position absolute
      left 0
      right 0
      bottom 0
      height 60%
      background-image linear-gradient(transparent, rgba(0,0,0,1))

  >>> .swiper-button-prev, >>> .swiper-button-next
    width 30px
    height 57px
    margin-top -29px
    background-image url(/assets/mirrormedia/icon/arrow1-2017.png)
    background-size contain
  >>> .swiper-button-prev
    left 15px
  >>> .swiper-button-next
    right 15px
    transform rotate(180deg)

.editorChoice
  > h2
    display none
  &__slides
    display none
    &--img
      position absolute
      width 100%
      height 100%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover

  &__menu
    display none
  &--mobile
    display flex
    flex-direction column
    width 90%
    margin 0 auto
    > div:not(:last-child):not(:first-child)
      margin-bottom 20px
    .editorChoice__block--img
      position relative
      color #fff
      display block
      .figure
        width 100%
        padding-top 66.66%
        margin 0
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
      > div:not(.figure)
        position absolute
        height 35px
        background-color #000
        display flex
        justify-content center
        align-items center
        font-size 1.2rem
        top auto
        bottom 0
        left 0
        white-space nowrap
        padding 0 20px !important
    .editorChoice__block--title
      padding 0.5em 0
      h2
        margin 0
        font-size 1.25rem
        line-height 1.6rem
        font-weight normal
      > div
        display none

  &__eyebrow
    width 100%
    margin-bottom 10px
    color #356d9c
    h2
      margin 0
      overflow hidden
      &::after
        content ""
        display inline-block
        height .5em
        vertical-align middle
        width 100%
        margin-right -100%
        margin-left 10px
        border-top 5px solid #356d9c

@media (max-width: 599px)
  .editorChoice--mobile
    width 100%
    > div
      &:not(:last-child):not(:first-child)
        margin 0
        border-bottom 1px solid #fff
    .editorChoice__eyebrow
      width 90%
      margin 0 auto 10px
      h2
        &::after
          content none
    .editorChoice__block
      position relative
    .editorChoice__block--img
      > div
        &:not(.figure)
          display none
      .figure
        padding-top 56.25%
    .editorChoice__block--title
      position absolute
      bottom 0
      padding-top 0
      padding-bottom 0
      width 100%
      > div
        display inline-flex
        justify-content center
        align-items center
        height 30px
        padding 0 .5em
        color #fff
        font-size 1rem
        white-space nowrap
      h2
        color #fff
        text-shadow 1.4px 1.4px 1.9px rgba(0, 0, 0, 0.2)
        background-color rgba(0, 0, 0, 0.7)
        padding 10px

@media (min-width: 600px)
  .editorChoice
    &--mobile
      flex-direction row
      flex-wrap wrap
      justify-content space-between
      width 100%
      > div:nth-child(2)
        width 100%
      > div:not(:first-child):not(:nth-child(2))
        width calc( (100% - 30px)/2 )
      .editorChoice__block--title
        height 65px

@media (min-width: 1200px)
  .editorChoice
    display block
    position relative
    width 100%
    margin-bottom 15px
    > h2
      display block
      margin 0 0 10px
      color #356d9c
      font-size 1.3rem
      line-height 1.15
      font-weight 400
    .editorChoice__slides
      display block
      width 100%
      height 576px
    .editorChoice__menu
      display flex
      position absolute
      left 0
      right 0
      bottom 0
      z-index 10
      width 100%
      background-color rgba(246,246,246,.8)
      min-height 76px
      a:not(:last-child)
        border-right 1px solid rgba(204, 204, 204, 0.75)
      &--item
        display flex
        justify-content center
        align-items center
        flex-grow 1
        flex-basis 0
        padding .5em 1em
        color #000
        span
          text-align justify
          line-height 1.3
          font-weight 300
        &.active
          background-color #356d9c
          color #fff
    &--mobile
      display none

</style>
