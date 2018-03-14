<template>
  <div class="latest-aside-container" v-if="groupedArticle">
    <div class="latest-list">
      <div class="latest-list_item">
        <router-link :to="getHref(groupedArticle)" :id="`group${isLast}-latest-${index}-${getValue(groupedArticle, [ 'slug' ], Date.now())}-img`"  v-if="groupedArticle.style !== 'projects' && groupedArticle.style !== 'campaign' && groupedArticle.style !== 'readr'" :target="target">
          <div class="latest-list_item_img" v-lazy:background-image="getValue(groupedArticle, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')"></div>
        </router-link>
        <a :href="getHrefFull(groupedArticle)" :id="`group${isLast}--${index}latest-${getValue(groupedArticle, [ 'slug' ], Date.now())}-img`"  v-if="groupedArticle.style === 'projects' || groupedArticle.style === 'campaign' || groupedArticle.style === 'readr'" :target="target">
          <div class="latest-list_item_img" v-lazy:background-image="getValue(groupedArticle, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')"></div>
        </a>
        <div class="latest-list_item_title">
          <router-link :to="getHref(groupedArticle)" v-text="getTruncatedVal(groupedArticle.title, 22)" :id="`group${isLast}-latest-${index}-${getValue(groupedArticle, [ 'slug' ], Date.now())}`" v-if="groupedArticle.style !== 'projects' && groupedArticle !== 'campaign' && groupedArticle !== 'readr'" :target="target"></router-link>
          <a :href="getHrefFull(groupedArticle)" v-text="getTruncatedVal(groupedArticle.title, 22)" :id="`group${isLast}-latest-${index}-${getValue(groupedArticle, [ 'slug' ], Date.now())}`" v-if="groupedArticle.style === 'projects' || groupedArticle.style === 'campaign' || groupedArticle.style === 'readr'" :target="target"></a>
        </div>
      </div>

      <div class="latest-list_item" v-for="(o, i) in getValue(groupedArticle, [ 'relateds' ])" v-if="i < 3">
        <div class="latest-list_item_title">
          <router-link :to="getHref(o)" v-text="getTruncatedVal(o.title, 22)" :id="`group${isLast}-latest-${index}-${getValue(o, [ 'slug' ], Date.now())}`" v-if="o.style !== 'projects' && o.style !== 'campaign' && o.style !== 'readr'" :target="target"></router-link>
          <a :href="getHrefFull(o)" v-text="getTruncatedVal(o.title, 22)" :id="`group${isLast}-latest-${index}-${getValue(o, [ 'slug' ], Date.now())}`" v-if="o.style === 'projects' || o.style === 'campaign' || o.style === 'readr'" :target="target"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP } from '../constants'
import { getHref, getHrefFull, getTruncatedVal, getValue } from '../util/comm'

export default {
  name: 'latest-list-aside',
  data () {
    return {
      nodeTopStatic: 0,
      nodeLeftStatic: 0,
      nodeWidthStatic: 0
    }
  },
  methods: {
    getHref,
    getHrefFull,
    getTruncatedVal,
    getValue,
    getSectionStyle (sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = (this.viewport > 1199) ? {
        backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], 'rgba(140, 140, 140, 0.18);')
      } : {
        backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], 'rgba(140, 140, 140, 0.18);')
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
    },
    fetchNodeStaticStyle (node) {
      node.style.position = 'static'
      this.nodeTopStatic = node.offsetTop
      this.nodeLeftStatic = node.offsetLeft
      this.nodeWidthStatic = node.clientWidth
    },
    sticky () {
      const { nodeTopStatic, nodeLeftStatic, nodeWidthStatic } = this
      const node = this.$el
      const currentScroll = document.body.scrollTop || document.documentElement.scrollTop
      if (currentScroll >= nodeTopStatic - 30) {
        node.style.position = 'fixed'
        node.style.top = '0px'
        node.style.left = nodeLeftStatic + 'px'
        node.style.width = nodeWidthStatic + 'px'
        node.style['margin-top'] = '30px'
      } else {
        node.style.position = 'static'
        node.style['margin-top'] = '0px'
      }
    },
    resize () {
      // Recalculate node static style and determine stick to the top or not
      this.fetchNodeStaticStyle(this.$el)
      this.sticky()

      // Remove and register scroll event again, prevent inconsistently position of node
      window.removeEventListener('scroll', this.sticky, false)
      window.addEventListener('scroll', this.sticky)
    },
    handleScroll () {
      this.fetchNodeStaticStyle(this.$el)
      this.sticky()
      window.removeEventListener('scroll', this.sticky, false)
      window.addEventListener('scroll', this.sticky)
    },
    handleResize () {
      window.removeEventListener('resize', this.resize, false)
      window.addEventListener('resize', this.resize)
    },
    setUpEventHandler () {
      if (this.viewport > 1199) {
        if (this.$el.className.includes('last')) {
          // Wait for the ad container of LPCHD show up
          // while(document.querySelector('div[pos=LPCHD]').hasAttribute("data-google-query-id")) {
          //   console.log(document.querySelector('div[pos=LPCHD]').hasAttribute("data-google-query-id"))
          //   // this.handleScroll()
          //   // this.handleResize()
          //   break
          // }
          setTimeout(this.handleScroll, 3000)
          setTimeout(this.handleResize, 3000)
        }
      }
    }
  },
  props: {
    groupedArticle: {
      default: () => { return undefined }
    },
    index: {
      default: () => { return 0 }
    },
    needStick: {
      default: () => { return true }
    },
    target: {
      default: () => ('_self')
    },
    viewport: {
      default: () => { return undefined }
    },
    isLast: null
  },
  mounted () {
    this.needStick ? this.setUpEventHandler() : ''
  },
  updated () {
    this.needStick ? this.setUpEventHandler() : ''
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
