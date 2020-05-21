<template>
  <section class="watch-article">
    <div class="watch-article__intro">
      <picture class="watch-article__image">
        <source
          media="(min-width: 1024px)"
          :srcset="watchImage.desktop"
        >
        <source
          media="(min-width: 768px)"
          :srcset="watchImage.tablet"
        >
        <img
          :src="watchImage.mobile"
          :alt="watch.style"
          loading="lazy"
        >
      </picture>
      <div class="watch-article__info">
        <h1
          class="watch-article__heading"
          v-text="watch.style"
        />
        <h2
          class="watch-article__subheading"
          v-text="watch.brand"
        />
        <h2
          class="watch-article__subheading"
          v-text="watch.type"
        />
        <p class="watch-article__price">
          {{ watch.price | formatPrice }}
        </p>
        <UIWatchCollapse class="watch-article__collapse">
          <template v-slot:heading>
            <th>基本資料</th>
          </template>
          <template v-slot:collapsible-row>
            <tr v-if="specSize">
              <td>錶殼尺寸</td>
              <td v-text="specSize" />
            </tr>
            <tr v-if="specColor">
              <td>面盤顏色</td>
              <td v-text="specColor" />
            </tr>
            <tr v-if="specMaterial">
              <td>材質</td>
              <td v-text="specMaterial" />
            </tr>
            <tr v-if="specMovement">
              <td>機芯</td>
              <td v-text="specMovement" />
            </tr>
            <tr v-if="specPower">
              <td>動力儲存</td>
              <td v-text="specPower" />
            </tr>
            <tr v-if="specGa">
              <td>發表年份</td>
              <td v-text="specGa" />
            </tr>
            <tr v-if="specWaterproof">
              <td>防水性能</td>
              <td v-text="specWaterproof" />
            </tr>
            <tr v-if="specLuminous">
              <td>夜光功能</td>
              <td v-text="specLuminous" />
            </tr>
            <tr v-if="specLimit">
              <td>限量支數</td>
              <td v-text="specLimit" />
            </tr>
          </template>
        </UIWatchCollapse>
        <UIWatchCollapse
          v-if="hasFunction"
          :default-collapsed="true"
          class="watch-article__collapse"
        >
          <template v-slot:heading>
            <th>搭載功能</th>
          </template>
          <template v-slot:collapsible-row>
            <tr
              v-for="feature in watch.watchfunction"
              :key="feature"
            >
              <td v-text="feature" />
            </tr>
          </template>
        </UIWatchCollapse>
      </div>
    </div>
    <ContainerWatchIframe
      v-if="embedYoutube"
      :iframe-src="embedYoutube"
      class="watch-article__iframe"
    />
    <article
      class="watch-article__content"
      v-html="watch.content"
    />
    <div
      v-if="hasSimilar"
      class="watch-article__block related-watch"
    >
      <p class="watch-article__block-heading">
        相似錶款
      </p>
      <div class="watch-article__related-watch">
        <a
          v-for="item in watch.relatedwatch"
          :key="item.name"
          :href="`/watch/${item.name}`"
          class="watch-article__watch"
          target="_blank"
          rel="noopener noreferrer"
          @click="$emit('sendGa', 'related_watch')"
        >
          <UIWatch
            :img-src="item.imgSrc"
            :name="item.name"
            :brand="item.brand"
            :price="item.price"
          />
        </a>
      </div>
    </div>
    <div
      v-if="hasRelated"
      class="watch-article__block"
    >
      <p class="watch-article__block-heading">
        相關文章
      </p>
      <div class="watch-article__related-list">
        <UIWatchRelated
          v-for="post in watch.relateds"
          :key="post.slug"
          :post="post"
          class="watch-article__related-item"
          @click="$emit('sendGa', 'latest_watch_article')"
        />
      </div>
    </div>
  </section>
</template>
<script>

import ContainerWatchIframe from './ContainerWatchIframe.vue'
import UIWatch from '../listWatch/UIWatch.vue'
import UIWatchCollapse from './UIWatchCollapse.vue'
import UIWatchRelated from './UIWatchRelated.vue'
import _ from 'lodash'

export default {
  name: 'UIWatchArticle',
  filters: {
    formatPrice (value) {
      return `NT$${value.toLocaleString()}`
    }
  },
  components: {
    ContainerWatchIframe,
    UIWatch,
    UIWatchCollapse,
    UIWatchRelated
  },
  props: {
    watch: {
      type: Object,
      required: true
    }
  },
  computed: {
    embedYoutube () {
      return this.watch.embedYoutube
    },
    hasFunction () {
      return this.watch.watchfunction.length > 0
    },
    hasRelated () {
      return this.watch.relateds.length > 0
    },
    hasSimilar () {
      return this.watch.relatedwatch.length > 0
    },
    // 面盤顏色
    specColor () {
      return this.watch.color
    },
    // 發表年份
    specGa () {
      return this.watch.ga
    },
    // 限量支數
    specLimit () {
      return this.watch.limit
    },
    // 夜光/夜光功能
    specLuminous () {
      return this.watch.luminous
    },
    // 材質
    specMaterial () {
      return this.watch.material
    },
    // 機芯
    specMovement () {
      return this.watch.movement
    },
    // 動力/動力儲存
    specPower () {
      return this.watch.power
    },
    // 錶殼尺寸
    specSize () {
      return this.watch.size
    },
    // 防水/防水性能
    specWaterproof () {
      return this.watch.waterproof
    },
    watchImage () {
      return _.get(this.watch, 'watchImage', {})
    }
  }
}
</script>
<style lang="stylus" scoped>
.watch-article
  padding 0 0 18px
  &__image
    display block
    img
      width 100%
  &__info
    width 300px
    margin 0 auto
  &__heading
    margin 0
    color rgba(0, 0, 0, 0.87)
    font-size 26px
    font-weight 900
    line-height 1.23
  &__subheading
    margin 11px 0 0
    color rgba(0, 0, 0, 0.87)
    font-size 18px
    font-weight normal
    line-height 1.78
  &__price
    margin 9px 0 0
    color rgba(0, 0, 0, 0.87)
    font-size 18px
    font-weight 600
  &__collapse
    margin-top 30px
    & + .watch-article__collapse
      margin-top 0
  &__iframe
    margin-top 31px
  &__content
    margin 30px 0 0
    padding 10px
    color rgba(0, 0, 0, 0.87)
    line-height 2
    background-color rgba(216, 216, 216, 0.15)
    >>> *
      margin 0
      & + *
        margin-top 2em
  &__block
    margin-top 30px
  &__related
    &-watch
      display flex
      flex-wrap wrap
      padding 0 6px
    &-list
      margin-top 20px
  &__watch
    display block
    width calc((100% - 16px) / 2)
    margin 33px 4px 0
    .watch
      width 100%
  &__block-heading
    display flex
    align-items center
    margin 0
    color rgba(0, 0, 0, 0.87)
    font-size 26px
    font-weight 900
    letter-spacing 1px
    &:before
      content ''
      display inline-block
      width 16px
      height 68px
      margin-right 13px
      background-color #000
      vertical-align middle

@media (max-width: 767px)
  .watch-article__related-item
    & + .watch-article__related-item
      margin-top 10px

@media (min-width: 768px)
  .watch-article
    > *
      width 80%
      max-width 1024px
      margin-left auto
      margin-right auto
    &__intro
      display flex
      align-items flex-start
      margin 0 auto
      padding 35px 0 0
      > *
        flex 1
    &__image
      border 1px solid rgba(0, 0, 0, 0.15)
    &__info
      margin-left 20px
    &__content
      padding 77px 69px
      text-align center
      text-indent 2em
    &__block
      display flex
      flex-wrap wrap
      margin-top 80px
      &.related-watch
        width calc(80% + 24px)
        .watch-article__block-heading
          padding-left 12px
    &__related
      &-watch
        padding 0
      &-list
        display flex
        flex-wrap wrap
        width calc(100% + 40px)
        margin 0 -20px
      &-item
        width calc((100% - 120px) / 3)
        margin 20px 20px 0
        & + .watch-article__related-item
          margin-top 20px
    &__watch
      width calc((100% - 72px) / 3)
      margin 33px 12px 0
    &__block-heading
      width 100%
@media (min-width: 1200px)
  .watch-article
    > *
      width 1024px
    &__info
      flex none
      width 410px
      margin-left 44px
    &__heading
      font-size 36px
    &__subheading, &__price
      font-size 24px
    &__iframe, &__content
      margin-top 80px
    &__block
      &.related-watch
        width 1102px
        max-width none
        .watch-article__block-heading
          padding-left 39px
    &__related
      padding 0 0 94px
      &-list
        width calc(100% + 50px)
        margin 0 -25px
      &-item
        width calc((100% - 150px) / 3)
        margin 25px 25px 0
        & + .watch-article__related-item
          margin-top 25px
    &__watch
      position relative
      width calc((100% - 312px) / 4)
      margin 28px 39px 0
      &:not(:nth-child(4n)):before
        content ''
        position absolute
        top 50%
        right -38px
        transform translateY(-50%)
        width 2px
        height 274px
        background-color rgba(0, 0, 0, 0.1)
</style>
