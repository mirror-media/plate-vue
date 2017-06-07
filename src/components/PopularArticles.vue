<template>
  <div class="poplist-container" v-if="(popList.length > 0)">
    <div class="pop_title"><h3>熱門文章</h3></div>
    <div class="pop_list">
      <div class="pop_item" v-for="(o, i) in popList" v-if="i < 10">
        <div class="pop_item_label" v-text="getValue(o, [ 'sections', 0, 'title' ], '')" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))"></div>
        <div class="pop_item_title">
          <!--router-link :to="o.slug" v-text="getTruncatedVal(o.title, 40)"  :id="`popular-${Date.now()}`" v-if="o.style !== 'projects'"></router-link-->
          <a :href="o.slug" v-text="getTruncatedVal(o.title, 40)" :id="`popular-${Date.now()}`"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { SECTION_MAP } from '../constants'
  import { getHref, getImage, getTruncatedVal, getValue } from '../util/comm'
  import _ from 'lodash'

  export default {
    name: 'popular-list',
    methods: {
      getHref,
      getImage,
      getTruncatedVal,
      getValue,
      getSectionStyle (sect) {
        const sectionId = _.get(sect, [ 'id' ])
        const style = { backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#000') }
        return style
      }
    },
    props: {
      popList: {
        default: () => { return [] }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .poplist-container
    .pop_title
      margin 30px 0 0
      color #356d9c
      font-size 1.1rem
      overflow hidden

      > h3
        margin-bottom 0
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

    .pop_list
      display flex
      flex-wrap wrap
      justify-content space-between

      .pop_item
        width 100%
        border-bottom 1px solid rgba(0, 0, 0, 0.2)
        padding 15px 0 20px
        display flex

        &:last-child
          border-bottom none

        &_label
          margin-right 10px
          color #fff
          display flex
          justify-content center
          align-items center
          flex-wrap wrap
          width 60px
          height 60px
          font-size 1.2rem
          flex 0 0 60px

        &_title
          font-size 1.2rem
          font-weight 300
          line-height 1.6rem

  @media (min-width: 1200px)
    .poplist-container
      .pop_title
        overflow hidden

        > h3
          &::after
            display none

      .pop_list
        .pop_item
          width 48%

          &:last-child
            border-bottom 1px solid rgba(0, 0, 0, 0.2)

          &_label
            width 40px
            height 40px
            font-size 0.8rem
            flex 0 0 40px

          &_title
            font-size 1rem
            font-weight 300
            line-height 1.4rem

</style>
