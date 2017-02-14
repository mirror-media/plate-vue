<template>
  <div class="latest-list-container">
    <div class="title"><h4>最新文章</h4></div>
    <div class="list">
      <div class="item" v-for="(o, i) in pureLatest" v-if="i < 6">
        <div class="thumbnail" :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'tiny', 'url' ], '/asset/review.png') + ')' }">
          <a :href="getHref(o)" target="_blank" :style="{ width: '100%', height: '100%', display: 'block' }"></a>
        </div>
        <div class="content">
          <div class="content_category">
            <a :href="getHref(o)" target="_blank">{{ getValue(o, [ 'categories', 0, 'title' ], '新聞') }}</a>
          </div>
          <div class="content_title">
            <a :href="getHref(o)" target="_blank">{{ getTruncatedVal(getValue(o, [ 'title' ], ''), 27) }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getHref, getTruncatedVal, getValue } from '../../utils/comm'
  import _ from 'lodash'

  export default {
    computed: {
      pureLatest() {
        _.remove(this.latest, (i) => {
          return _.get(i, [ 'slug' ], '') === this.currArticleSlug
        })
        return this.latest
      }
    },
    methods: {
      getHref,
      getTruncatedVal,
      getValue
    },
    name: 'latest-list',
    props: {
      latest: {
        default: []
      },
      currArticleSlug: {
        default: ''
      }
    }
  }
</script>
<style lang="stylus" scoped>
.latest-list-container {
  margin-top: 20px;
  width: 300px;
  margin: 20px auto 0;
  .title {
    font-size: 20px;
    color: #fff;
    background: #0a6182;
    border: 1px solid #0a6182;
    padding: 5px 20px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    h4 {
      margin: 0;
    }
  }
  .list {
    width: 100%;
    border: 1px solid #dedede;
    .item {
      margin: 25px 0;
      display: flex;
      padding: 0 20px;
      .thumbnail {
        width: 100px;
        height: 100px;
        min-width: 100px;
        min-height: 100px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
      }
      .content {
        padding: 0 0 0 12px;
        .content_category {
          border-bottom: 1px solid #d4d4d4;
          padding-bottom: 5px;
          font-weight: bold;
        }
        .content_title {
          padding-top: 5px;
          line-height: 20px;
          a:hover, a:link, a:visited {
            color: #6f6f6f;
          }
        }
      }
      &:last-child{
        padding-bottom: 0;
      }
    }
  }
}
</style>
