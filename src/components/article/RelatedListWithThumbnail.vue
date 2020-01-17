<template>
  <div
    v-if="(relatedList.length > 0)"
    class="related-container"
  >
    <div class="related_title">
      <h3 />
    </div>
    <div class="related_list">
      <template v-if="isApp">
        <div
          v-for="(o, i) in relatedList"
          :key="i"
          class="related_item"
        >
          <div>
            <a :href="`/app/${getValue(o, [ 'slug' ], '')}`">
              <div
                class="related_item_img"
                :alt="getValue(o, [ 'title' ])"
                :style="{ backgroundImage: getBackgroundImage(getValue(o, [ 'heroImage' ])) }"
              />
            </a>
          </div>
          <div class="related_item_title">
            <a
              :href="`/app/${getValue(o, [ 'slug' ], '')}`"
              v-text="getTruncatedVal(o.title, 22)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(o, i) in relatedList"
          :key="i"
          class="related_item"
        >
          <div>
            <a :href="getHref(o)">
              <div
                class="related_item_img"
                :alt="getValue(o, [ 'title' ])"
                :style="{ backgroundImage: getBackgroundImage(getValue(o, [ 'heroImage' ])) }"
              />
            </a>
          </div>
          <div class="related_item_title">
            <a
              :href="getHref(o)"
              v-text="getTruncatedVal(o.title, 22)"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getHref, getTruncatedVal, getValue } from '../../util/comm'
import { mapState } from 'vuex'
import { find } from 'lodash'

export default {
  name: 'RelatedListThumbnail',
  props: {
    isApp: {
      default: () => false
    },
    relatedList: {
      default: () => { return [] }
    }
  },
  methods: {
    getHref,
    getTruncatedVal,
    getValue,
    getBackgroundImage (id) {
      const imageData = find(this.imagesById, ['id', id])
      const imageUrl = getValue(imageData, ['image', 'resizedTargets', 'mobile', 'url'], '')
      return `url(${imageUrl})`
    }
  },
  computed: {
    ...mapState({
      imagesById: state => state.imagesById
    })
  }
}
</script>
<style lang="stylus">
  .related-container
    font-size 18px
    .related_title
      color #fff
    .related_list
      margin-top 10px
      display flex
      flex-direction row !important
      align-content flex-start
      flex-wrap wrap

      .related_item
        width 31%
        vertical-align top
        margin-bottom 30px
        box-shadow 3px 4px 15px rgba(0, 0, 0, 0.72)
        margin-right 2%
        .related_item_img
          background-repeat no-repeat
          background-size cover
          background-position center center
          padding-top: 75%;

        .related_item_title
          background-color #fff
          border-left 7px solid rgba(140, 140, 140, 0.18)
          border-top-width 0
          line-height 18px
          font-size 13px
          display flex
          justify-content center
          align-items center
          min-height 60px
          a
            width 95%
            max-height 100%
            margin 10px 20px
            &hover, &link, &visited
              color #8c8c8c
              font-weight normal
              border none

  @media (max-width 767px) and (min-width 0px)
    .related-container
      width 100%
      margin 0

      .related_list
        flex-direction column
        width 100%

        .related_item
          width 320px
          margin 30px auto

          .related_item_title
            font-size 1rem

  @media (max-width 320px) and (min-width 0px)
    .related-container
      .related_list
        .related_item
          width 280px

</style>
