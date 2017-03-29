<template>
  <div class="latest-aside-container" v-if="(latestList.length > 0)">
    <div class="latest-list">
      <div class="latest-list_item" v-for="(o, i) in latestList" v-if="i < 4">
        <router-link :to="getHref(o)" v-if="i < 1">
          <div class="latest-list_item_img" :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '') + ')' }"></div>
          <div class="latest-list_item_label" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
        </router-link>
        <div class="latest-list_item_title" :style="getSectionStyleBorderTop(getValue(o, [ 'sections', 0 ], ''))">
          <router-link :to="getHref(o)" v-text="getTruncatedVal(o.title, 22)"></router-link>
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
    getSectionStyle(sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = (this.viewport > 1199) ? { 
        backgroundColor: _.get( SECTION_MAP, [sectionId, 'bgcolor'], 'rgba(140, 140, 140, 0.18);'),
        width:  _.get( SECTION_MAP, [sectionId, 'label-width'], '45px'),
      } : { 
        backgroundColor: _.get( SECTION_MAP, [sectionId, 'bgcolor'], 'rgba(140, 140, 140, 0.18);'),
        width:  _.get( SECTION_MAP, [sectionId, 'label-width-tablet'], '60px'),
      }
      return style
    },
    getSectionStyleBorderTop(sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = (this.viewport > 1199) ? { 
        borderTopColor: _.get( SECTION_MAP, [sectionId, 'bgcolor'], 'rgba(140, 140, 140, 0.18)'),
        borderTopWidth: '5px'
      } : { 
        borderTopColor: _.get( SECTION_MAP, [sectionId, 'bgcolor'], 'rgba(140, 140, 140, 0.18)'),
        borderTopWidth: '10px'
      }
      return style
    }
  },
  props: {
    latestList: {
      default: () => { return [] }
    },
    viewport: {
      default: () => { return undefined }
    }
  },
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
        border-bottom 1px solid rgba(0, 0, 0, 0.35)

        border-left 1px solid rgba(0, 0, 0, 0.35)
        border-right 1px solid rgba(0, 0, 0, 0.35)
        padding 15px 10px
        font-size 1.3rem
        line-height 1.7rem
        box-shadow 0 0 6px rgba(0,0,0,0.5)
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
          display inline

          .latest-list_item_label
            height 35px
            width 60px
            top -35px
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
          // > a

@media (min-width: 1200px)  
  .latest-aside-container
    width 100%

    .latest-list
      .latest-list_item
        > a
        //   .latest-list_item_img
          .latest-list_item_label
            height 25px
            width 45px
            top -25px
            font-size 0.9rem
        
        &_title
          color rgba(0, 0, 0, 0.35)
          font-size 1rem
          padding 10px 0
          line-height 1.4rem
          font-weight 400
          
          > a
            color rgba(0, 0, 0, 0.35)
</style>