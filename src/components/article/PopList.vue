<template>
  <div class="poplist-container" v-if="(pop.length > 0)">
    <div class="pop_title"><h3>熱門文章</h3></div>
    <div class="pop_list">
      <!--<slot name="dfpad"></slot>-->
      <div class="pop_item" v-for="(o, i) in pop" v-if="i < 9">
        <div>
          <router-link :to="o.slug" >
            <div class="pop_item_img"
                  :style="{ backgroundImage: 'url(' + getImage(o, 'mobile') + ')' }">
            </div>
          </router-link>
        </div>
        <div class="pop_item_title" :style="getSectionStyle(getValue(o, [ 'sections', 0 ], ''))">
          <router-link :to="o.slug" v-text="getTruncatedVal(o.title, 22)"></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { SECTION_MAP } from '../../constants'
  import { getHref, getImage, getTruncatedVal, getValue } from '../../utils/comm'
  import _ from 'lodash'
  export default {
    computed: {},
    methods: {
      getHref,
      getImage,
      getTruncatedVal,
      getValue,
      getSectionStyle(sect) {
        const sectionId = _.get(sect, [ 'id' ])
        const style = { borderLeft: _.get( SECTION_MAP, [sectionId, 'borderLeft'], '7px solid rgba(140, 140, 140, 0.18);') }
        return style
      }
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
          align-items center
        
          a 
            width 95%
            max-height 100%
            margin 10px 20px
        
            &:hover, &:link, &:visited
              color rgba(0, 0, 0, 0.49)
              font-weight normal
              border none

  @media (min-width 0px) and (max-width 499px)
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

  @media (min-width 500px) and (max-width 767px)
    .poplist-container 
      .pop_list 
        .pop_item
          width 45%
        
      
    
  
</style>
