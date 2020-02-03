<template>
  <div class="latest-list">
    <div
      class="latest-list__heading"
      v-text="$t('article.latest')"
    />
    <div class="latest-list__items">
      <div
        v-for="item in items"
        :key="`latest-${item.slug}`"
        class="latest"
      >
        <a
          class="latest__thumbnail"
          :href="getHref(item, isAppPage)"
          target="_blank"
          @click="sendGaClickEvent('article', 'latest')"
        >
          <LazyImage
            :src="getImage(item, 'tiny')"
            :alt="get(item, 'title')"
          />
        </a>
        <a
          class="latest__content"
          :href="getHref(item, isAppPage)"
          target="_blank"
          @click="sendGaClickEvent('article', 'latest')"
        >
          <div
            class="latest__content-category"
            v-text="get(item, 'categories.0.title', '新聞')"
          />
          <p
            class="latest__content-title"
            v-text="item.title"
          />
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import LazyImage from 'src/components/common/LazyImage.vue'
import { get } from 'lodash'
import { getHref, getImage, sendGaClickEvent } from '../../util/comm'

export default {
  name: 'LatestList',
  components: {
    LazyImage
  },
  props: {
    latests: {
      type: Array,
      default: () => []
    },
    isAppPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    items () {
      return this.latests.slice(0, 6) || []
    }
  },
  methods: {
    get,
    getHref,
    getImage,
    sendGaClickEvent
  }
}
</script>
<style lang="stylus" scoped>

.latest-list
  p
    margin 0
  &__heading
    height 36px
    padding-left 25px
    color #fff
    font-size 1.25rem
    font-weight bold
    line-height 36px
    background #0a6182
  &__items
    padding 20px
    border 1px solid #dedede
    border-top none

.latest
  display flex
  a
    display inline-block
  & + .latest
    margin-top 25px
  &__thumbnail
    width 100px
    height 100px
    img
      width 100%
      height 100%
      object-fit cover
      object-position center center
  &__content
    flex 1
    margin-left 15px
    &-category
      padding-bottom 5px
      font-weight bold
      border-bottom 1px solid #d4d4d4
    &-title
      display -webkit-box
      padding-top 5px
      color #6f6f6f
      line-height 1.4
      -webkit-line-clamp 3
      -webkit-box-orient vertical
      height calc(1em * 1.4 * 3)
      overflow hidden

</style>
