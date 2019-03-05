<template>
  <div class="poplist-container" v-if="(pop.length > 0)">
    <div class="pop_title"><h3>熱門文章</h3></div>
    <div class="pop_list">
      <template v-for="(o, i) in popArticles">
        <div class="pop_item">
          <figure>
            <router-link :to="o.slug" :id="'popular-' + i">
              <LazyImage :src="getImage(o, 'mobile')" :caption="getValue(o, [ 'title' ])" />
            </router-link>
            <div class="pop_item--colorBlock" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))" v-text="getValue(o, [ 'sections', '0', 'title' ])" />
          </figure>
          <div class="pop_item_title">
            <router-link :to="o.slug" :id="'popular-' + i" v-text="getTruncatedVal(o.title, 21)" />
          </div>
        </div>
        <slot :name="`microAd${getMicroAdName(i)}`" v-if="(i === 1 || i === 2 || i === 3)"></slot>
      </template>
    </div>
  </div>
</template>
<script>
  import LazyImage from 'src/components/common/LazyImage.vue'
  import { SECTION_MAP } from '../../constants'
  import { getImage, getTruncatedVal, getValue } from '../../util/comm'
  import _ from 'lodash'
  export default {
    name: 'pop-list',
    props: [ 'pop', 'currEnv' ],
    components: {
      LazyImage,
    },
    computed: {
      popArticles () {
        return _.take(this.pop, 6)
      }
    },
    methods: {
      getImage,
      getTruncatedVal,
      getValue,
      getSectionStyle (sect) {
        const sectionId = _.get(sect, [ 'id' ])
        const style = { backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#bcbcbc') }
        return style
      },
      getMicroAdName (index) {
        return index === 1 ? 0 : index === 2 ? 1 : 2
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .poplist-container 
    font-size 18px

    .pop_list 
      margin-top 10px
      display flex
      align-content flex-start
      flex-wrap wrap
      justify-content space-between
      

      .pop_item 
        width 31%
        vertical-align top
        margin-bottom 30px
        figure
          position relative
          width 100%
          padding-top 66.66%
          margin 0
          overflow hidden
          img
            position absolute
            top 0
            left 0
            bottom 0
            right 0
            width 100%
            height 100%
            object-fit cover
            object-position 50% 50%

        &--colorBlock
          display flex
          justify-content center
          align-items center
          position absolute
          left 0
          bottom 0
          height 25px
          color #fff
          font-size 0.9rem
          letter-spacing 1px
          white-space nowrap
          padding 0 10px

        .pop_item_img 
          width 100%
          height 150px
          background-repeat no-repeat
          background-size cover
          background-position center center
        
        .pop_item_title 
          background-color #fff
          border-top-width 0
          line-height 1.5rem
          font-size 1.1rem
          display flex
          justify-content center
          align-items flex-start
        
          a 
            width 100%
            max-height 100%
            margin 10px 0
            padding 0 0 0 10px
        
            &:hover, &:link, &:visited
              color rgba(0, 0, 0, 0.49)
              font-weight normal
              border none
      & >>> .pop_item, & >>> #compass-fit-widget-content
        display flex
        flex-direction row
        align-items center
        figure
          width 33vw
          min-width 33vw
          min-height calc(33vw * 0.68)
          padding-top 0 !important
        a
          margin 0 !important
          min-height calc(33vw * 0.68)
          display flex
          align-items center
      & >>> .pop_item
        margin 0 0 20px 0
      & >>> .pop_item_title
        width 100%

  @media (min-width 0px) and (max-width 1199px)
    .poplist-container 
      .pop_list 
        .pop_item
          width 100%
          
          > div:not([class="pop_item_title"])
            height 0
            position relative          
            padding-top 66.67%

            > a
              .pop_item_img
                position absolute
                top 0
                left 0
                height 100%
          
          .pop_item_title
            font-size 1.2rem
            line-height 1.5rem          
          
</style>
