<template>
  <div class="related-list-container-bottom">
    <div class="list" :style="containerStyle()">
      <div class="title"><h4 :style="titleStyle()">相關文章</h4></div>
      <div class="item" v-for="(o, i) in relateds" v-if="o">
        <div class="title" v-if="!isApp">
          <router-link :to="getHref(o)" v-text="getValue(o, [ 'title' ], '')" :id="`related${abIndicator}-${o.name}-btm`" v-if="o.style !== 'projects' && o.style !== 'campaign' && o.style !== 'readr'"></router-link>
          <a :href="getHrefFull(o)" v-text="getValue(o, [ 'title' ], '')" :id="`related${abIndicator}-${o.name}-btm`" v-if="o.style === 'projects' || o.style === 'campaign' || o.style === 'readr'"></a>
        </div>
        <div class="title" v-if="isApp">
          <router-link :to="`/app/${getValue(o, [ 'slug' ], '')}`" v-text="getValue(o, [ 'title' ], '')" :id="`related${abIndicator}-${o.name}-btm`" v-if="o.style !== 'projects' && o.style !== 'campaign' && o.style !== 'readr'"></router-link>
          <a :href="getHrefFull(o)" v-text="getValue(o, [ 'title' ], '')" :id="`related${abIndicator}-${o.name}-btm`" v-if="o.style === 'projects' || o.style === 'campaign' || o.style === 'readr'"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { SECTION_MAP } from '../../constants'
  import { getHref, getHrefFull, getValue } from '../../util/comm'
  import _ from 'lodash'

  export default {
    computed: { },
    methods: {
      getHref,
      getHrefFull,
      getValue,
      containerStyle () {
        return { border: `2px solid ${_.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141')}` }
      },
      titleStyle () {
        return { color: _.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;') }
      }
    },
    mounted () {
      const customCSS = `.related-list-container-bottom .list > .title::before { content: ""; border-color: transparent transparent transparent ${_.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;')} }`
      const custCss = document.createElement('style')
      custCss.setAttribute('class', 'relatedBtmStyle')
      custCss.appendChild(document.createTextNode(customCSS))
      document.querySelector('body').appendChild(custCss)
    },
    watch: {
      sectionId: function () {
        document.querySelector('.relatedBtmStyle').innerHTML = `.related-list-container-bottom .list > .title::before { content: ""; border-color: transparent transparent transparent ${_.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;')} }`
      }
    },
    name: 'related-list-container-bottom',
    props: {
      isApp: {
        default: () => false
      },
      relateds: {
        default: () => ([])
      },
      abIndicator: {
        default: () => ('')
      },
      sectionId: {
        default: () => ('')
      }
    }
  }

</script>
<style lang="stylus" scoped>
  .related-list-container-bottom
    width 100%
    margin 0 auto
    clear both

    .list
      margin-top 20px
      padding 20px 0
      margin 20px auto 0
      display flex
      flex-direction column
      align-items center
      justify-content center
      
      & > div 
        width 85%
      
      & > .title 
        font-size 19px

        h4 
          margin -20px 0 0
        
        &::before 
          content ''
          width 0
          height 0
          border-style solid
          border-width 10px 0 10px 20px
          position relative
          top 0
          left -9%
          display block
        
      
      .item 
        margin 15px 0 0
        padding-bottom 15px
        border-bottom 1px solid #c1c1c1

        .title 
          font-size 18px
          line-height 25px

          a, a:hover, a:link, a:visited 
            color rgba(2, 2, 2, 0.5)
            text-decoration none
            cursor pointer
            border-bottom none
        
        .brief 
          line-height 20px
          padding-top 10px
          
          a:hover, a:link, a:visited 
            color #6f6f6f
          
        
        &:last-child
          border-bottom none
          padding-bottom 0
  
</style>
