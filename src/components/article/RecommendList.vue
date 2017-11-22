<template>
  <div class="recommend-main-container" v-if="(recommendList.length > 0)">
    <div class="recommend-list">
      <template v-for="(articles, index) in recommendArticleArr">
        <div class="recommend-list_item" v-for="(o, i) in recommendArticleArr[ index ]">
          <router-link :to="getHref(o)" :id="`recommend-${getValue(o, [ 'slug' ], Date.now())}-1`"  v-if="o.style !== 'projects' && o.style !== 'campaign'" :target="target">
            <div class="recommend-list_item_img" v-lazy:background-image="getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')"></div>
            <div class="recommend-list_item_label tablet-only desktop-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getLabel(o)"></div>
          </router-link>
          <a :href="`https://www.mirrormedia.mg${getHref(o)}`" :id="`recommend-${getValue(o, [ 'slug' ], Date.now())}-1`"  v-if="o.style === 'projects' || o.style === 'campaign'" tid="ee" :target="target">
            <div class="recommend-list_item_img" v-lazy:background-image="getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')"></div>
            <div class="recommend-list_item_label tablet-only desktop-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getLabel(o)"></div>
          </a>
          <div class="recommend-list_item_title">
            <div class="recommend-list_item_label tablet-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getLabel(o)"></div>
            <router-link :to="getHref(o)" :id="`recommend-${getValue(o, [ 'slug' ], Date.now())}-2`"  v-if="o.style !== 'projects'" :target="target">
              <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
              <span class="brief tablet-only desktop-hidden" v-text="getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 60)"></span>
            </router-link>
            <a :href="getHref(o)" :id="`recommend-${getValue(o, [ 'slug' ], Date.now())}-2`"  v-if="o.style === 'projects'" :target="target">
              <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
              <span class="brief tablet-only desktop-hidden" v-text="getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 60)"></span>
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP } from '../../constants'
import { currEnv, getHref, getTruncatedVal, getValue } from '../../util/comm'
import { microAds } from '../../constants/microAds'
import sanitizeHtml from 'sanitize-html'

export default {
  name: 'recommend-list-main',
  computed: {
    currUrl () {
      return this.$route.fullPath
    },
    recommendArticleArr () {
      return [ this.recommendList ]
    }
  },
  data () {
    return {
      currEnv: 'prod',
      microAdLoded: {},
      microAds
    }
  },
  methods: {
    getHref,
    getTruncatedVal,
    getValue,
    getSectionStyle (sect) {
      const sectionId = _.get(sect, [ 'id' ])
      // let device = 'label-width'
      // if (this.viewport < 600) {
      //   device = 'label-width-mobile'
      // } else if (this.viewport > 599 && this.viewport < 1200) {
      //   device = 'label-width-tablet'
      // }

      const style = {
        backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#bcbcbc')
      }
      return style
    },
    getLabel (article) {
      const section = _.get(article, [ 'sections', 0, 'title' ], '')
      const category = _.get(article, [ 'categories', 0, 'title' ], '')
      return (section.length > 0) ? section : category
    },
    updateSysStage () {
      this.currEnv = currEnv()
    },
    sanitizeHtml
  },
  mounted () {
    this.updateSysStage()
  },
  props: {
    recommendList: {
      default: () => { return [] }
    },
    target: {
      default: () => ('_self')
    },
    viewport: {
      default: () => { return undefined }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .label-width-auto
    white-space nowrap
    padding 0 20px !important

  .recommend-main-container
    font-size 1.1rem

    &_title
      color #356d9c
      overflow hidden

      > h3
        margin .5em 0 0
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

    .recommend-list
      margin-top 10px
      display flex
      align-content flex-start
      flex-wrap wrap
      justify-content space-between

      .ad-container
        margin-bottom 15px
        border-bottom 1px solid rgba(0,0,0,0.28)
        width 100%
        padding-bottom 15px

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
          text-decoration none
          cursor pointer
          border-bottom none
          padding-bottom 0

          .recommend-list_item_img
            background-repeat no-repeat
            background-size cover
            background-position center center
            padding-top 100%
            &[lazy=loading]
              background-size 40%

          .recommend-list_item_label
            position absolute
            height 25px
            white-space nowrap
            padding 0 10px
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

            &:hover, &:link, &:visited
              color #8c8c8c
              font-weight normal
              border none

          .recommend-list_item_label
            height 35px
            white-space nowrap
            padding 0 10px
            background-color #000
            color #fff
            font-size 1.2rem
            display flex 
            justify-content center
            align-items center

  .tablet-only
    display none !important
  @media (min-width: 600px) and (max-width: 1199px)
    .recommend-main-container
      .recommend-list
        &_item
          > a
            .recommend-list_item_label
              width 60px
              white-space normal
  @media (min-width: 600px)  
    .tablet-only
      display block !important

      &.recommend-list_item_label
        display flex !important

    .tablet-hidden
      display none !important

    .recommend-main-container
      width 100%
      margin 0

      &_title

        > h3
          margin .5em 0

      
      .recommend-list
        flex-direction column
        width 100%

        .ad-container
          border-bottom none

        &_item
          width 100%
          border-bottom none

          > a
            .recommend-list_item_img
              padding-top 60%

            .recommend-list_item_label
              top 0
              right -60px
              height 60px
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

    .recommend-main-container
      &_title
        overflow hidden

        > h3
          font-size 1.3rem
          margin 0

          &::after
            display none

      .recommend-list
        flex-direction row

        .ad-container
          width 31%

        &_item
          width 31%
          display block

          > a
            .recommend-list_item_label
              height 25px
              white-space normal
              padding 0 10px
              top auto
              bottom 0
              left 0
              right auto
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
