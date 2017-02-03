<template>
  <div class="latest-list-container">
    <div class="title"><h4>最新文章</h4></div>
    <div class="item" v-for="(o, i) in latest" v-if="i < 6">
      <div class="thumbnail" :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'tiny', 'url'], '/asset/logo.png') + ')' }"></div>
      <div class="content">
        <div class="content_category">
          {{ getValue(o, [ 'categories', 0, 'title'], '國際') }}
        </div>
        <div class="content_title">
          <a href="">{{ o.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getValue } from '../../utils/comm'

  export default {
    methods: {
      getValue
    },
    name: 'latest-list',
    props: {
      latest: {
        default: []
      }
    }
  }
</script>
<style lang="stylus" scoped>
.latest-list-container {
  margin-top: 20px;
  padding: 20px 20px;
  border: 1px solid #c1c1c1;
  box-shadow: 0 0 5px #c1c1c1;
  width: 300px;
  margin: 20px auto 0;
  .title {
    font-size: 18px;
    h4 {
      margin: 0 0 25px;
    }
  }
  .item {
    margin: 20px 0;
    padding-bottom: 10px;
    display: flex;
    .thumbnail {
      width: 70px;
      height: 70px;
      min-width: 70px;
      min-height: 70px;
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
</style>
