<template>
  <div class="latest-main-container" v-if="(latestList.length > 0)">
    <div class="latest-main-container_title desktop-only"><h3>最新文章</h3></div>
    <div class="latest-list">
      <div class="latest-list_item" v-for="(o, i) in latestListBeforeDFPNA3">
        <router-link :to="getHref(o)">
          <div class="latest-list_item_img" :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '') + ')' }"></div>
          <div class="latest-list_item_label tablet-only desktop-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
        </router-link>
        <div class="latest-list_item_title">
          <div class="latest-list_item_label tablet-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
          <router-link :to="getHref(o)">
            <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
            <span class="brief tablet-only desktop-hidden" v-text="getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 60)"></span>
          </router-link>
        </div>
      </div>
      <slot name="dfpNA3"></slot>
      <div class="latest-list_item" v-for="(o, i) in latestListBeforeDFPNA5">
        <router-link :to="getHref(o)">
          <div class="latest-list_item_img" :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '') + ')' }"></div>
          <div class="latest-list_item_label tablet-only desktop-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
        </router-link>
        <div class="latest-list_item_title">
          <div class="latest-list_item_label tablet-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
          <router-link :to="getHref(o)">
            <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
            <span class="brief tablet-only desktop-hidden" v-text="getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 60)"></span>
          </router-link>
        </div>
      </div>
      <slot name="dfpNA5"></slot>
      <div class="latest-list_item" v-for="(o, i) in latestListBeforeDFPNA9">
        <router-link :to="getHref(o)">
          <div class="latest-list_item_img" :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '') + ')' }"></div>
          <div class="latest-list_item_label tablet-only desktop-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
        </router-link>
        <div class="latest-list_item_title">
          <div class="latest-list_item_label tablet-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
          <router-link :to="getHref(o)">
            <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
            <span class="brief tablet-only desktop-hidden" v-text="getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 60)"></span>
          </router-link>
        </div>
      </div>
      <slot name="dfpNA9"></slot>
      <div class="latest-list_item" v-for="(o, i) in latestListAfterDFPNA9">
        <router-link :to="getHref(o)">
          <div class="latest-list_item_img" :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '') + ')' }"></div>
          <div class="latest-list_item_label tablet-only desktop-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
        </router-link>
        <div class="latest-list_item_title">
          <div class="latest-list_item_label tablet-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', 0, 'title' ], '')"></div>
          <router-link :to="getHref(o)">
            <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
            <span class="brief tablet-only desktop-hidden" v-text="getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 60)"></span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP } from '../constants'
import { getHref, getTruncatedVal, getValue } from '../utils/comm'
import sanitizeHtml from 'sanitize-html'

export default {
  name: 'latest-list-main',
  computed: {
    latestListBeforeDFPNA3() {
      return _.take(this.latestList, 2)
    },
    latestListBeforeDFPNA5() {
      return _.slice(this.latestList, 2, 3)
    },
    latestListBeforeDFPNA9() {
      return _.slice(this.latestList, 3, 6)
    },
    latestListAfterDFPNA9() {
      return _.slice(this.latestList, 6, 9)
    },
  },
  data() {
    return {}
  },
  methods: {
    getHref,
    getTruncatedVal,
    getValue,
    getSectionStyle(sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = (this.viewport > 1199) ? { 
        backgroundColor: _.get( SECTION_MAP, [sectionId, 'bgcolor'], 'rgba(140, 140, 140, 0.18)'),
        width:  _.get( SECTION_MAP, [sectionId, 'label-width'], '45px'),
      } : { 
        backgroundColor: _.get( SECTION_MAP, [sectionId, 'bgcolor'], 'rgba(140, 140, 140, 0.18)'),
        width:  _.get( SECTION_MAP, [sectionId, 'label-width-tablet'], '60px'),
      }
      return style
    },
    sanitizeHtml
  },
  props: {
    latestList: {
      default: () => { return [] }
    },
    viewport: {
      default: () => { return undefined }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .latest-main-container
    font-size 1.1rem

    &_title
      color #356d9c

      > h3
        margin-top 0

    .latest-list
      margin-top 10px
      display flex
      align-content flex-start
      flex-wrap wrap
      justify-content space-between

      &_item
        vertical-align top
        margin-bottom 15px

        display flex 
        border-bottom 1px solid rgba(0, 0, 0, 0.28)
        padding-bottom 15px 
        width 100%

        a
          position relative
          display block 
          flex 1 

          .latest-list_item_img
            background-repeat no-repeat
            background-size cover
            background-position center center
            padding-top 100%

          .latest-list_item_label
            position absolute
            height 25px
            width 45px
            background-color #000
            top -25px
            color #fff
            font-size 0.9rem
            display flex 
            justify-content center
            align-items center

        &_title
          background-color #fff
          border-top-width 0
          line-height 1.4rem
          font-size 1rem
          display flex
          justify-content center
          align-items flex-start
          min-height 60px
          padding-top 0 

          flex 1
          flex-direction column 
          padding-left 20px 

          a
            width 100%
            max-height 100%

            h3
              font-size 1.2rem 
              font-weight 300 
              line-height 1.7rem 

            &hover, &link, &visited
              color #8c8c8c
              font-weight normal
              border none

          .latest-list_item_label
            height 35px
            width 60px
            background-color #000
            color #fff
            font-size 1.2rem
            display flex 
            justify-content center
            align-items center

  .tablet-only
    display none !important

  @media (min-width: 600px)  
    .tablet-only
      display block !important

      &.latest-list_item_label
        display flex !important

    .tablet-hidden
      display none !important

    .latest-main-container
      width 100%
      margin 0

      &_title
        overflow hidden

        > h3
          font-size 1.5rem

          &::after
            content ""
            display inline-block
            height .5em
            vertical-align middle
            width 100%
            margin-right -100%
            margin-left 10px
            border-top 5px solid #356d9c
      
      .latest-list
        flex-direction column
        width 100%

        &_item
          width 100%
          border-bottom none

          > a
            .latest-list_item_img
              padding-top 60%

            .latest-list_item_label
              top 0
              right -60px
              height 60px
              width 60px
              font-size 1.2rem
              

          &_title
            flex 1.5
            padding-left 80px
            font-weight 300

            > a
              h3
                margin 0 0 10px
                font-size 1.3rem

  @media (min-width: 1200px)
    .desktop-hidden
      display none !important

    .latest-main-container
      &_title
        overflow hidden

        > h3
          font-size 1.3rem
          margin 0

          &::after
            display none

      .latest-list
        flex-direction row

        &_item
          width 31%
          display block

          > a
            display inline

            .latest-list_item_label
              height 25px
              width 45px
              top -25px
              left 0
              font-size 0.9rem

          &_title
            padding-left 0
            padding-top 5px

            > a
              h3
                font-size 1rem
                font-weight 300

    .tablet-only
      display none
</style>