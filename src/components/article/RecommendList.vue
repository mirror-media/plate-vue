<template>
  <div class="recommend-main-container">
    <div class="recommend-list" v-if="(recommendList.length > 0)">
      <template v-for="(articles, index) in recommendArticleArr">
        <div class="recommend-list_item" v-for="(o, i) in recommendArticleArr[ index ]" v-if="i < 9">
          <router-link :to="'/story/' + getValue(o, [ 'slug' ])" :id="`recommend-${getValue(o, [ 'slug' ], Date.now())}-1`">
            <div class="recommend-list_item_img">
              <lazy-component>
                <img :alt="getTruncatedVal(o.title, 22)" :src="getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '')">
              </lazy-component>
            </div>
          </router-link>
          <div class="recommend-list_item_title">
            <div class="recommend-list_item_label" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getLabel(o)"></div>
            <router-link :to="'/story/' + getValue(o, [ 'slug' ])" :id="`recommend-${getValue(o, [ 'slug' ], Date.now())}-2`" :target="target">
              <h3 v-text="getTruncatedVal(o.title, 22)"></h3>
            </router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { SECTION_MAP, SITE_DOMAIN } from '../../constants'
import { getHref, getTruncatedVal, getValue } from '../../util/comm'

export default {
  name: 'recommend-list-main',
  computed: {
    currUrl () {
      return this.$route.fullPath
    },
    recommendArticleArr () {
      const origRecommendList = _.map(this.recommendList, (a) => (Object.assign({}, a)))
      const filteredRecommendList = origRecommendList.length > 9 && (this.referrerSlug !== 'N/A' || this.excludingArticle !== 'N/A')
        ? _.filter(origRecommendList, (a) => (_.get(a, [ 'slug' ]) !== this.referrerSlug) && (_.get(a, [ 'slug' ]) !== this.excludingArticle))
        : origRecommendList
      const excludingArticlesLen = this.excludingArticles.length
      for (let i = 0; i < excludingArticlesLen; i += 1) {
        if (filteredRecommendList.length < 9) { return }
        _.remove(filteredRecommendList, { slug: _.get(this.excludingArticles[ i ], [ 'slug' ]) })
      }
      return [ filteredRecommendList ]
    }
  },
  data () {
    return {
      currEnv: 'prod',
      referrerSlug: 'N/A'
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
      const section = _.get(article, [ 'sections', 0, 'title' ], 'ceshi')
      const category = _.get(article, [ 'categories', 0, 'title' ], 'FASDFF')
      return (section.length > 0) ? section : category
    },
    extracSlugFromreferrer (referrer = '') {
      const filteredReferrer = referrer.replace(/^https?:\/\//, '').replace(/\?[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*$/, '')
      const referrerArr = filteredReferrer.split('/')
      if ((referrerArr[ 0 ].indexOf(SITE_DOMAIN) > -1 || referrerArr[ 0 ].indexOf('localhost') > -1) && referrerArr[ 1 ] === 'story') {
        this.referrerSlug = referrerArr[ 2 ]
      }
    }
  },
  mounted () {
    this.extracSlugFromreferrer(document.referrer)
  },
  props: {
    excludingArticle: {
      default: () => ('N/A')
    },
    excludingArticles: {
      default: () => ([])
    },
    recommendList: {
      default: () => ([])
    },
    target: {
      default: () => ('_self')
    },
    viewport: {
      default: () => (undefined)
    }
  }
}
</script>
<style lang="stylus" scoped>
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
      justify-content flex-start

      &_item
        vertical-align top
        margin-bottom 15px

        display flex
        padding-bottom 15px 
        width 100%
        height calc((33vw * 3) / 4)
        overflow hidden

        a
          position relative
          display block 
          text-decoration none
          cursor pointer
          border-bottom none
          padding-bottom 0
          width 33%

          .recommend-list_item_img
            background-repeat no-repeat
            background-size cover
            background-position center center
            padding-top calc(100% - 30px)
            &[lazy=loading]
              background-size 40%
            > div
              position absolute
              top 0
              left 0
              width 100%
              height 100%
              >img
                object-fit cover
                object-position center center
                width 100%
                height 100%
            

        &_title
          background-color #fff
          border-top-width 0
          line-height 1.4rem
          font-size 1rem
          display block
          min-height 60px
          padding-top 0 
          width 66%
          position relative

          a
            width 100%
            max-height 100%
            padding-top 19px
            padding-left 10px

            h3
              font-size 0.8rem 
              font-weight 300 
              line-height 1rem 
              margin 10px 0

            &:hover, &:link, &:visited
              color #8c8c8c
              font-weight normal
              border none

          .recommend-list_item_label
            height 20px
            white-space nowrap
            padding 0 10px
            background-color #000
            color #fff
            font-size 0.8rem
            display flex
            position absolute
            top 0
            left 10px
            align-items flex-start
            

  @media (min-width: 375px)  
    .recommend-main-container
      .recommend-list
        &_item
          &_title
            a
              h3
                font-size 1rem
                line-height 1.4rem
  @media (min-width: 414px)  
    .recommend-main-container
      .recommend-list
        &_item
          a
            .recommend-list_item_img
              padding-top calc(100% - 45px)

  @media (min-width: 768px)
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

        &_item
          width calc(33% - 10px)
          height auto
          display block
          &:not(:nth-child(3n+3))
            margin-right 15px

          > a
            width 100%

          &_title
            padding-left 0
            padding-top 5px
            width 100%

            > a
              padding-left 0
              padding-top 0
              h3
                font-size 1rem
                font-weight 300
            .recommend-list_item_label
              left 0
              top -30px
              height 30px
              font-size 1rem
              align-items center

</style>
