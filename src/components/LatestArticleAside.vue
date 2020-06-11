<template>
  <div
    v-if="groupedArticle"
    class="latest-aside-container"
  >
    <div class="latest-list">
      <div class="latest-list_item">
        <a
          v-if="groupedArticle.style !== 'projects' && groupedArticle.style !== 'campaign' && groupedArticle.style !== 'readr'"
          :href="getHref(groupedArticle)"
          target="_blank"
          @click="sendGaClickEvent('home', 'group')"
        >
          <div
            v-lazy:background-image="getImage(groupedArticle, 'mobile')"
            class="latest-list_item_img"
          />
        </a>
        <a
          v-if="groupedArticle.style === 'projects' || groupedArticle.style === 'campaign' || groupedArticle.style === 'readr'"
          :href="getHrefFull(groupedArticle)"
          target="_blank"
          @click="sendGaClickEvent('home', 'group')"
        >
          <div
            v-lazy:background-image="getImage(groupedArticle, 'mobile')"
            class="latest-list_item_img"
          />
        </a>
        <div class="latest-list_item_title">
          <a
            v-if="groupedArticle.style !== 'projects' && groupedArticle !== 'campaign' && groupedArticle !== 'readr'"
            :href="getHref(groupedArticle)"
            target="_blank"
            @click="sendGaClickEvent('home', 'group')"
            v-text="getTruncatedVal(groupedArticle.title, 22)"
          />
          <a
            v-if="groupedArticle.style === 'projects' || groupedArticle.style === 'campaign' || groupedArticle.style === 'readr'"
            :href="getHrefFull(groupedArticle)"
            target="_blank"
            @click="sendGaClickEvent('home', 'group')"
            v-text="getTruncatedVal(groupedArticle.title, 22)"
          />
        </div>
      </div>

      <div
        v-for="(o, i) in (getValue(groupedArticle, [ 'relateds' ]) || []).slice(0, 2)"
        :key="`latest-list_item-${i}`"
        class="latest-list_item"
      >
        <div class="latest-list_item_title">
          <a
            v-if="o.style !== 'projects' && o.style !== 'campaign' && o.style !== 'readr'"
            :href="getHref(o)"
            target="_blank"
            @click="sendGaClickEvent('home', 'group')"
            v-text="getTruncatedVal(o.title, 22)"
          />
          <a
            v-if="o.style === 'projects' || o.style === 'campaign' || o.style === 'readr'"
            :href="getHrefFull(o)"
            target="_blank"
            @click="sendGaClickEvent('home', 'group')"
            v-text="getTruncatedVal(o.title, 22)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getHref, getHrefFull, getImage, getTruncatedVal, getValue, sendGaClickEvent } from '../util/comm'

export default {
  name: 'LatestListAside',
  props: {
    groupedArticle: {
      type: Object,
      default: undefined
    }
  },
  methods: {
    getHref,
    getHrefFull,
    getImage,
    getTruncatedVal,
    getValue,
    sendGaClickEvent
  }
}
</script>
<style lang="stylus" scoped>
.label-width-auto
  white-space nowrap
  padding 0 20px !important
  width auto !important

.latest-aside-container
  margin-bottom 30px

  &.last.fixed
    position fixed
    top 30px
    right auto
    width calc(1024px * 0.25 - 30px)

  .latest-list
    .latest-list_item

      &:last-child
        .latest-list_item_title
          &::after
            display none

      > a
        position relative
        display block

        .latest-list_item_img
          padding-top 66.67%
          width 100%
          background-position center center
          background-repeat no-repeat
          background-size cover
          &[lazy=loading]
            background-size 40%

        .latest-list_item_label
          position absolute
          height 35px
          white-space nowrap
          padding 0 20px
          color #fff
          font-size 1.2rem
          display flex
          justify-content center
          align-items center

          bottom 0
          left 10%
          z-index 10

      &_title
        color rgba(0, 0, 0, 0.65)
        display flex
        justify-content flex-start
        align-items center
        border-bottom 1px solid rgba(0, 0, 0, 0.25)

        border-left 1px solid rgba(0, 0, 0, 0.25)
        border-right 1px solid rgba(0, 0, 0, 0.25)
        padding 15px 10px
        font-size 1.3rem
        line-height 1.7rem
        box-shadow 0 0 6px rgba(0,0,0,0.25)
        position relative

        &::after
          content ""
          display block
          width 100%
          height 12px
          position absolute
          left 0
          bottom -6px
          z-index 10
          background-color #ffffff
          border-bottom 1px solid #999

        font-weight 300
        width 90%
        margin 0 auto

        > a
          color rgba(0, 0, 0, 0.65)

@media (min-width: 600px)
  .latest-aside-container
    width 48%

    .latest-list
      .latest-list_item
        > a
          .latest-list_item_label
            height 35px
            top auto
            bottom 0
            left 0
            font-size 1.2rem

        &_title
          font-size 1.5rem
          padding 20px 0
          line-height 1.9rem
          font-weight 300
          width 100%
          border-left none
          border-right none
          box-shadow none

          &::after
            display none

@media (min-width: 1200px)
  .latest-aside-container
    width 100%

    .latest-list
      .latest-list_item
        > a
          .latest-list_item_label
            height 25px
            padding 0 10px
            font-size 0.9rem
            top auto
            bottom 0
            left 0

        &_title
          color rgba(0, 0, 0, 0.35)
          font-size 1rem
          padding 10px 0
          line-height 1.4rem
          font-weight 400

          > a
            color rgba(0, 0, 0, 0.35)
</style>
