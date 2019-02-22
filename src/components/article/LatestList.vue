<template>
  <div class="latest-list-container">
    <div class="title"><h4 v-text="$t('article.latest')"></h4></div>
    <div class="list">
      <div class="item" v-for="(o, i) in pureLatest" v-if="i < 6">
        <div class="thumbnail">
          <LazyImage :src="getImage(o, 'tiny')" :alt="getValue(o, [ 'title' ])"/>
          <router-link :to="{ path: getHref(o) }" :id="'latest-' + o.name" :style="{ width: '100%', height: '100%', display: 'block' }" v-if="o.style !== 'projects'"></router-link>
          <a :href="`${site_url}${getHref(o)}`" :id="'latest-' + o.name" :style="{ width: '100%', height: '100%', display: 'block' }" v-if="o.style === 'projects'"></a>
        </div>
        <div class="content">
          <div class="content_category">
            <router-link :to="{ path: getHref(o) }" :id="'latest-' + o.name" v-if="o.style !== 'projects'">{{ getValue(o, [ 'categories', 0, 'title' ], '新聞') }}</router-link>
            <a :href="`${site_url}${getHref(o)}`" :id="'latest-' + o.name" v-if="o.style === 'projects'">{{ getValue(o, [ 'categories', 0, 'title' ], '新聞') }}</a>
          </div>
          <div class="content_title">
            <router-link :to="{ path: getHref(o) }" :id="'latest-' + o.name" v-if="o.style !== 'projects'">{{ getTruncatedVal(getValue(o, [ 'title' ], ''), 27) }}</router-link>
            <a :href="`${site_url}${getHref(o)}`" :id="'latest-' + o.name" v-if="o.style === 'projects'">{{ getTruncatedVal(getValue(o, [ 'title' ], ''), 27) }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import LazyImage from 'src/components/common/LazyImage.vue'
  import { SITE_URL } from '../../constants'
  import { getHref, getImage, getTruncatedVal, getValue } from '../../util/comm'
  import _ from 'lodash'

  // const debug = require('debug')('CLIENT:LatestList')

  export default {
    components: {
      LazyImage,
    },
    computed: {
      site_url () {
        return SITE_URL
      },
      pureLatest () {
        return _.filter(this.latestList, (o) => { return _.get(o, [ 'slug' ], '') !== this.currArticleSlug })
      },
      latestList () {
        return _.get(this.$store, 'state.latestArticle.items', [])
      }
    },
    methods: {
      getHref,
      getImage,
      getTruncatedVal,
      getValue
    },
    name: 'LatestList',
    props: {
      currArticleSlug: {
        default: ''
      },
    }
  }
</script>
<style lang="stylus" scoped>
.latest-list-container 
  margin-top 20px
  width 300px
  margin 20px auto 0
  .title 
    font-size 20px
    color #fff
    background #0a6182
    border 1px solid #0a6182
    padding 5px 20px
    height 36px
    display flex
    align-items center
    justify-content flex-start
    h4 
      margin 0
  
  .list 
    width 100%
    border 1px solid #dedede
    .item 
      margin 25px 0
      display flex
      padding 0 20px
      .thumbnail 
        width 100px
        height 100px
        min-width 100px
        min-height 100px
        position relative
        img
          position absolute
          left 0
          top 0
          width 100%
          height 100%
          object-fit cover
      
      .content 
        padding 0 0 0 12px
        .content_category 
          border-bottom 1px solid #d4d4d4
          padding-bottom 5px
          font-weight bold
        
        .content_title 
          padding-top 5px
          line-height 20px
          a:hover, a:link, a:visited 
            color #6f6f6f
      
      &:last-child
        padding-bottom 0

</style>
