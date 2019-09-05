<template>
  <div class="poplist-container" v-if="(pop.length > 0)">
    <div class="pop_title"><h3>熱門文章</h3></div>
    <div class="pop_list">
      <template v-for="(o, i) in popArticles">
        <div class="pop_item">
          <figure>
            <a :href="o.slug" target="_blank" @click="sendGaClickEvent('article', 'popular')">
              <LazyImage :src="getImage(o, 'mobile')" :caption="get(o, 'title')" />
            </a>
            <div class="pop_item--colorBlock" :style="getSectionStyle(get(o, 'sections.0', ''))" v-text="get(o, 'sections.0.title')" />
          </figure>
          <div class="pop_item_title">
            <a :href="o.slug" @click="sendGaClickEvent('article', 'popular')" v-text="getTruncatedVal(o.title, 21)" target="_blank" />
          </div>
        </div>
        <slot :name="`microAd${getMicroAdName(i)}`" v-if="(i === 1 || i === 2 || i === 3)"></slot>
      </template>
    </div>
  </div>
</template>
<script>
  import LazyImage from 'src/components/common/LazyImage.vue'
  import { SECTION_MAP } from 'src/constants'
  import { getImage, getTruncatedVal, sendGaClickEvent } from 'src/util/comm'
  import { get, take } from 'lodash'
  export default {
    name: 'pop-list',
    props: [ 'pop' ],
    components: {
      LazyImage,
    },
    computed: {
      popArticles () {
        return take(this.pop, 9)
      }
    },
    methods: {
      get,
      getImage,
      getTruncatedVal,
      getSectionStyle (sect) {
        const sectionId = get(sect, 'id')
        const style = { backgroundColor: get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#bcbcbc') }
        return style
      },
      getMicroAdName (index) {
        return index === 1 ? 0 : index === 2 ? 1 : 2
      },
      sendGaClickEvent
    }
  }
</script>
<style lang="stylus" scoped>
  .poplist-container 
    font-size 18px
    margin 40px auto
    .pop_title
      > h3
        font-size 1.5rem
    .pop_list 
      margin-top 10px
      display flex
      align-content flex-start
      flex-wrap wrap
      justify-content space-between

      .pop_item
        display block
        width calc(50% - 5px)
        vertical-align top
        margin-bottom 30px

        &:first-child
          width 100%

        > div:not([class="pop_item_title"])
          height 0
          position relative          
          padding-top 66.67%


        figure
          position relative
          width 100%
          padding-top 66.66%
          margin 0
          overflow hidden
          > a
            padding-top 66.66%
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

        .pop_item_title 
          background-color #fff
          border-top-width 0
          line-height 1.5rem
          font-size 1.2rem
          display flex
          justify-content center
          align-items flex-start
          a 
            width 100%
            max-height 100%
            padding .2em 0 0
            &:hover, &:link, &:visited
              color #000
              font-weight normal
              border none
      >>> #compass-fit-widget-content
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

</style>
