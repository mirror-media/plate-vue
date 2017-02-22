<template>
  <div class="poplist-container" v-if="(pop.length > 0)">
    <div class="pop_title"><h3>熱門文章</h3></div>
    <div class="pop_list">
      <div class="pop_item" v-for="(o, i) in pop" v-if="i < 9">
        <div>
          <a :href="reviseSlug(o.slug)" >
            <div class="pop_item_img"
                  :style="{ backgroundImage: 'url(' + getValue(o, [ 'heroImage', 'image', 'resizedTargets', 'mobile', 'url' ], '') + ')' }">
            </div>
          </a>
        </div>
        <div class="pop_item_title">
          <a :href="reviseSlug(o.slug)" v-text="getTruncatedVal(o.title, 22)"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getHref, getTruncatedVal, getValue } from '../../utils/comm'
  export default {
    methods: {
      getHref,
      getTruncatedVal,
      getValue,
      reviseSlug(rawSlug) {
        const newSlug = rawSlug.replace('story', 'post')
        return newSlug
      },
    },
    name: 'pop-list',
    props: {
      pop: {
        default: () => {return []}
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .poplist-container {
    font-size: 18px;
    .pop_list {
      margin-top: 10px;
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      justify-content: space-between;
      .pop_item {
        width: 31%;
        vertical-align: top;
        margin-bottom: 30px;
        .pop_item_img {
          width: 100%;
          height: 150px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
        }
        .pop_item_title {
          background-color: #fff;
          /*border: 1px solid #e0e0e0;*/
          border-left: 7px solid rgba(140, 140, 140, 0.18);
          border-top-width: 0;
          line-height: 18px;
          font-size: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
          a {
            width: 95%;
            max-height: 100%;
            margin: 10px 20px;
            &:hover, &:link, &:visited {
              color: #8c8c8c;
              font-weight: normal;
              border: none;
            }
          }
        }
      }
    }
  }
</style>
