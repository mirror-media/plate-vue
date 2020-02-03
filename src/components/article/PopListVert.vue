<template>
  <section class="popListVert">
    <div class="popListVert__title">
      熱門文章
    </div>
    <div class="popListVert-list">
      <template v-for="(o, i) in popArticles">
        <div
          :key="`popListVert${i}`"
          class="popListVert-list__item"
        >
          <a
            :href="o.slug"
            class="popListVert-list__item--img"
            target="_blank"
            @click="sendGaClickEvent('article', 'popular')"
          >
            <LazyImage
              :src="getImage(o, 'tiny')"
              :alt="get(o, 'title')"
            />
          </a>
          <div class="popListVert-list__item--text">
            <div
              :style="getSectionStyle(get(o, 'sections.0', ''))"
              v-text="get(o, 'sections.0.title')"
            />
            <h2>
              <a
                :href="o.slug"
                target="_blank"
                @click="sendGaClickEvent('article', 'popular')"
                v-text="o.title"
              />
            </h2>
          </div>
        </div>
        <slot
          v-if="i === 1"
          name="microAdNA3"
        />
        <slot
          v-if="i === 2"
          name="microAdNA5"
        />
        <slot
          v-if="i === 5"
          name="microAdNA9"
        />
      </template>
    </div>
  </section>
</template>

<script>
import LazyImage from 'src/components/common/LazyImage.vue'
import { SECTION_MAP } from '../../constants'
import { getImage, getTruncatedVal, sendGaClickEvent } from '../../util/comm'
import { get, take } from 'lodash'

export default {
  name: 'PopListVert',
  components: {
    LazyImage
  },
  props: {
    pop: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    popArticles () {
      return take(this.pop, 9)
    }
  },
  methods: {
    getImage,
    getTruncatedVal,
    get,
    getSectionStyle (sect) {
      const sectionId = get(sect, 'id')
      const style = { backgroundColor: get(SECTION_MAP, `${sectionId}.bgcolor`, '#bcbcbc') }
      return style
    },
    sendGaClickEvent
  }
}
</script>

<style lang="stylus">
.popListVert
  width 100%
  border 1px solid #dedede
  &__title
    padding .3em 1em
    color #fff
    font-size 18px
    letter-spacing 1px
    background-color #0c5a80
  &-list
    padding 1em 1em
    div:first-child
      margin-top 0
    div:last-child
      margin-bottom 0
    &__item
      display flex
      justify-content space-between
      margin 1.3em 0
      &--img
        position relative
        width 48%
        padding-top calc(48% * 0.6666)
        img
          position absolute
          top 0
          left 0
          bottom 0
          right 0
          width 100%
          height 100%
          object-fit cover
          object-position 50% 50%
      &--text
        width 48%
        text-align justify
        > div
          display inline-block
          height 25px
          padding 0 5px
          color #fff
          font-size 0.9rem
          letter-spacing 1px
          line-height 25px
        h2
          margin .8em 0 0
          font-size 1rem
          font-weight 700
          a
            display -webkit-box
            -webkit-line-clamp 3
            -webkit-box-orient vertical
            height calc(1em * 1.15 * 3)
            overflow hidden

</style>
