<template>
  <div class="latest-main-container" v-if="(latestList.length > 0)">
    <div class="title"><h3>最新文章</h3></div>
    <div class="latest-list">
      <template v-for="(articles, index) in latestArticleArr">
        <div class="latest-list_item" v-for="(o, i) in latestArticleArr[ index ]">
          <router-link :to="getHref(o)" :id="`latest-${getValue(o, [ 'slug' ], Date.now())}-1`" v-if="shouldShowItem(o)" :target="target">
            <div class="latest-list_item_img" v-lazy:background-image="getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')"></div>
            <div class="latest-list_item_label tablet tablet-only desktop-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getLabel(o)"></div>
          </router-link>
          <a :href="getHrefFull(o)" :id="`latest-${getValue(o, [ 'slug' ], Date.now())}-1`" v-if="!shouldShowItem(o)" tid="ee" :target="target">
            <div class="latest-list_item_img" v-lazy:background-image="getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')"></div>
            <div class="latest-list_item_label tablet-only desktop-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getLabel(o)"></div>
          </a>
          <div class="latest-list_item_title">
            <div class="latest-list_item_label tablet-hidden" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getLabel(o)"></div>
            <router-link :to="getHref(o)" :id="`latest-${getValue(o, [ 'slug' ], Date.now())}-2`" v-if="shouldShowItem(o)" :target="target">
              <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
              <span class="brief tablet-only desktop-hidden" v-text="getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 60)"></span>
            </router-link>
            <a :href="getHrefFull(o)" :id="`latest-${getValue(o, [ 'slug' ], Date.now())}-2`" v-if="!shouldShowItem(o)" :target="target">
              <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
              <span class="brief tablet-only desktop-hidden" v-text="getTruncatedVal(sanitizeHtml( getValue(o, [ 'brief', 'html' ], ''), { allowedTags: [ ] }), 60)"></span>
            </a>
          </div>
        </div>
        <micro-ad :currEnv="currEnv" :currUrl="currUrl" 
                  :id="`${getValue(microAds, [ 'homepage', index, 'pcId' ])}`"
                  v-if="index < 3 && viewport > 1199"
                  class="latest-list_item nativeDFP margin-top-0"></micro-ad>        
        <micro-ad :currEnv="currEnv" :currUrl="currUrl" 
                  :id="`${getValue(microAds, [ 'homepage', index, 'mobileId' ])}`"
                  v-if="index < 3 && viewport < 600"
                  class="latest-list_item nativeDFP margin-top-0"></micro-ad>        
      </template>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP } from '../constants'
import { currEnv, getHref, getHrefFull, getTruncatedVal, getValue } from '../util/comm'
import { microAds } from '../constants/microAds'
import MicroAd from '../components/MicroAd.vue'
import sanitizeHtml from 'sanitize-html'

export default {
  name: 'latest-list-main',
  computed: {
    currUrl () {
      return this.$route.fullPath
    },
    latestListBeforeDFPNA3 () {
      return _.take(this.latestList, 2)
    },
    latestListBeforeDFPNA5 () {
      return _.slice(this.latestList, 2, 3)
    },
    latestListBeforeDFPNA9 () {
      return _.slice(this.latestList, 3, 6)
    },
    latestListAfterDFPNA9 () {
      return _.slice(this.latestList, 6)
    },
    latestArticleArr () {
      return [ this.latestListBeforeDFPNA3, this.latestListBeforeDFPNA5, this.latestListBeforeDFPNA9, this.latestListAfterDFPNA9 ]
    }
  },
  components: {
    MicroAd
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
    getHrefFull,
    getTruncatedVal,
    getValue,
    getSectionStyle (sect) {
      const sectionId = _.get(sect, [ 'id' ])
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
    sanitizeHtml,
    shouldShowItem (article) {
      return article.style !== 'projects' && article.style !== 'campaign' && article.style !== 'readr'
    },
  },
  mounted () {
    this.updateSysStage()
  },
  props: {
    latestList: {
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
  .latest-main-container
    font-size 1.0625rem
    & > .title
      color #356d9c
      overflow hidden
      h3
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
    .latest-list
      margin-top 10px
      display flex
      align-content flex-start
      justify-content space-between
      flex-wrap wrap
      .ad-container
        margin-bottom 15px
        padding-bottom 15px
        border-bottom 1px solid rgba(0,0,0,0.28)
        width 100%
      &_item
        display flex 
        width 100%        
        vertical-align top
        margin-bottom 15px
        border-bottom 1px solid rgba(0, 0, 0, 0.28)
        padding-bottom 15px
        a
          position relative
          display block 
          // flex 1
          flex 0 0 27%
        &_img
          background-repeat no-repeat
          background-size cover
          background-position center center
          padding-top 100%
          &[lazy=loading]
            background-size 40%
        &_label
          position absolute
          top 0
          padding 0 10px
          height 30px
          white-space nowrap
          background-color #000
          color #fff
          font-size 1rem
          display flex 
          justify-content center
          align-items center
          &.tablet
            top -25px
            height 25px
        &_title
          background-color #fff
          border-top-width 0
          min-height 60px
          padding-top 35px
          padding-left 20px
          line-height 1.5rem
          font-size 1.0625rem 

          display flex
          justify-content center
          align-items flex-start
          flex-direction column 

          position relative
          a
            width 100%
            max-height 100%
            h3
              line-height 1.5rem
              font-size 1.0625rem 
              font-weight 300 
              margin 0
            &:hover, &:link, &:visited
              color #8c8c8c
              font-weight normal
              border none
  .tablet-only
    display none !important

  @media (min-width: 600px) and (max-width: 1199px)
    .tablet-only
      display block !important
    .tablet-hidden
      display none !important  
    .latest-main-container
      .latest-list
        &_item
          &_label
            width 60px
            white-space normal
            &.tablet
              display flex !important
              top 0
              right -60px
              height 60px
              z-index 1
  @media (min-width: 600px)
    .latest-main-container
      width 100%
      margin 0
      font-size 1.1rem
      & > .title
        > h3
          margin .5em 0
      .latest-list
        flex-direction column
        width 100%
        .ad-container
          border-bottom none
        &_item
          width 100%
          border-bottom none
          > a
            flex 1
          &_img
            padding-top 60%
          &_label
            font-size 1.2rem

          &_title
            flex 1.5
            padding-top 0
            padding-left 80px
            font-weight 600

            > a
              h3
                margin 0 0 10px
                font-size 1.3rem
                font-weight normal
              .brief
                font-weight 300
  @media (min-width: 1200px)
    .desktop-hidden
      display none !important
    .tablet-only
      display none
    .latest-main-container
      & > .title
        overflow hidden
        > h3
          font-size 1.3rem
          margin 0
          &::after
            display none
      .latest-list
        flex-direction row
        .ad-container
          width 31%
        &_item
          width 31%
          display block
          &_label
            font-size 0.9rem
            height 25px
            white-space normal
            padding 0 10px
            top -25px
            left 0
          &_title
            padding-left 0
            padding-top 5px
            > a
              h3
                font-size 1rem
                font-weight 300
</style>
