<template>
  <section class="relateds-in-content" :id="`relateds-in-content-${id}`">
    <h3>往下繼續閱讀</h3>
    <div v-for="related in relateds" :key="related.id" class="related">
      <div class="related__title">
        <a :id="`related-title-${related.slug}`" :href="getHref(related)" target="_blank" v-text="related.title"></a>
      </div>
      <a v-if="getImage(related.heroImage)" :id="`related-img-${related.slug}`" :href="getHref(related)" class="related__img" target="_blank">
        <LazyImage :src="getImage(related.heroImage)" :alt="related.title" />
      </a>
    </div>
  </section>
</template>
<script>
import LazyImage from 'src/components/common/LazyImage.vue'
import uuidv4 from 'uuid/v4'
import verge from 'verge'
import { currentYPosition, elmYPosition, } from 'kc-scroll'
import { get } from 'lodash'
import { getHref } from '../../util/comm'

const showAdCover = store => store.dispatch('SHOW_AD_COVER')
const debugDFP = require('debug')('CLIENT:DFP')

export default {
  name: 'RelatedListInContent',
  components: {
    LazyImage,
  },
  data () {
    return {
      id: '',
      isAdCoverCalledYet: false,
    }
  },
  props: {
    relateds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    getHref,
    getImage (id) {
      const item = this.$store.state.imagesById.find(image => image.id === id)
      const image = get(item, 'image.resizedTargets.mobile.url') || get(item, 'image.url')
      return image ? image : undefined
    },
    scrollEventHandlerForAd () {
      if (this.isAdCoverCalledYet) { return }
      const currentTop = currentYPosition()
      const eleTop = elmYPosition(`#relateds-in-content-${this.id}`)
      const device_height = verge.viewportH()
      if (currentTop + device_height > eleTop && eleTop > 0) {
        debugDFP('SHOW ADCOVER!')
        showAdCover(this.$store)
        this.isAdCoverCalledYet = true
        window.removeEventListener('scroll', this.scrollEventHandlerForAd)
      }
    },
  },
  mounted () {
    this.id = uuidv4()
    /**
     * Have ad-cover be rendered as soon as #article-body-content gets visible.
     */
    window.addEventListener('scroll', this.scrollEventHandlerForAd)
  },
  watch: {
    '$route.fullPath': function () {
      window.removeEventListener('scroll', this.scrollEventHandlerForAd)
      this.isAdCoverCalledYet = false
      window.addEventListener('scroll', this.scrollEventHandlerForAd)     
    }    
  }
}
</script>
<style lang="stylus" scoped>
.relateds-in-content
  margin-bottom 20px
  clear both
  > h3
    margin 0 0 .6em
    color #000
    font-size 1.25rem
    font-weight 600
  .related
    display flex
    position relative
    padding-left 10px
    background-color #eee
    &::before
      content ''
      position absolute
      top 0
      left 0
      width 10px
      height 100%
      background-color #808080
    & + .related
      margin-top 1em
    &__title
      flex 1
      display flex
      align-items center
      padding 1em
      a
        display inline-block
        display -webkit-box
        padding 0
        color #808080
        font-size 1.125rem
        line-height 1.3
        max-height 46.8px
        -webkit-line-clamp 2
        -webkit-box-orient vertical
        text-overflow ellipsis
        border-bottom none
        overflow hidden
    &__img
      position relative
      width 33% 
      padding 0 !important
      border-bottom none !important
      &::after
        content ''
        display block
        top 0
        width 100%
        padding-top 75%
      img
        display block
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        width 100%
        height 100%
        object-fit cover
        object-position center center

@media (min-width 767px)
  .relateds-in-content
    .related
      &__title
        padding 1em 2em
      &__img
        width 25%

@media (min-width 900px)
  .relateds-in-content
    margin-bottom 0
    .related
      &__img
        width 20%
</style>
