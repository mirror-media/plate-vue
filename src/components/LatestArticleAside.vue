<template>
  <div class="latest-aside-container" v-if="groupedArticle">
    <div class="latest-list">
      <div class="latest-list_item">
        <router-link :to="getHref(groupedArticle)" :id="`latest-group-${getValue(groupedArticle, [ 'slug' ], Date.now())}-1`">
          <div class="latest-list_item_img" :style="{ backgroundImage: 'url(' + getValue(groupedArticle, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '') + ')' }"></div>
          <div class="latest-list_item_label" :style="getSectionStyle(getValue(groupedArticle, [ 'sections', 0 ], ''))" v-text="getValue(groupedArticle, [ 'sections', 0, 'title' ], '')"></div>
        </router-link>
        <div class="latest-list_item_title" :style="getSectionStyleBorderTop(getValue(groupedArticle, [ 'sections', 0 ], ''))">
          <router-link :to="getHref(groupedArticle)" v-text="getTruncatedVal(groupedArticle.title, 22)" :id="`latest-group-${getValue(groupedArticle, [ 'slug' ], Date.now())}-2`"></router-link>
        </div>
      </div>

      <div class="latest-list_item" v-for="(o, i) in getValue(groupedArticle, [ 'relateds' ])" v-if="i < 3">
        <div class="latest-list_item_title" :style="getSectionStyleBorderTop(getValue(o, [ 'sections', 0 ], ''))">
          <router-link :to="getHref(o)" v-text="getTruncatedVal(o.title, 22)" :id="`latest-group-${getValue(o, [ 'slug' ], Date.now())}-1`"></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP } from '../constants'
import { getHref, getTruncatedVal, getValue } from '../utils/comm'

export default {
  name: 'latest-list-aside',
  methods: {
    getHref,
    getTruncatedVal,
    getValue,
    getSectionStyle (sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = (this.viewport > 1199) ? {
        backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], 'rgba(140, 140, 140, 0.18);'),
        width: _.get(SECTION_MAP, [ sectionId, 'label-width' ], '45px')
      } : {
        backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], 'rgba(140, 140, 140, 0.18);'),
        width: _.get(SECTION_MAP, [ sectionId, 'label-width-tablet' ], '60px')
      }
      return style
    },
    getSectionStyleBorderTop (sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = (this.viewport > 1199) ? {
        borderTopColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], 'rgba(140, 140, 140, 0.18)'),
        borderTopWidth: '5px'
      } : {
        borderTopColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], 'rgba(140, 140, 140, 0.18)'),
        borderTopWidth: '10px'
      }
      return style
    }
  },
  props: {
    groupedArticle: {
      default: () => { return undefined }
    },
    viewport: {
      default: () => { return undefined }
    }
  }
}
</script>
<style lang="stylus" scoped>
.latest-aside-container
  margin-bottom 30px

  .latest-list
    .latest-list_item
      &:first-child
        .latest-list_item_title
          border-top-style solid

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

        .latest-list_item_label
          position absolute
          height 35px
          width 60px
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
        justify-content center
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
            width 60px
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
            width 45px
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
