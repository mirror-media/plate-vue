<template>
  <div class="related-list-container">
    <div class="list" :style="containerStyle">
      <div class="title"><h4 :style="titleStyle">相關文章</h4></div>
      <div class="item" v-for="(o, i) in relateds" v-if="o">
        <div class="title">
          <router-link :to="getHref(o)" v-text="getValue(o, [ 'title' ], '')" :id="'related' + abIndicator + '-' + o.name" v-if="o.style !== 'projects'"></router-link>
          <a :href="getHref(o)" v-text="getValue(o, [ 'title' ], '')" :id="'related' + abIndicator + '-' + o.name" v-if="o.style === 'projects'"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { SECTION_MAP } from '../../constants'
  import { getHref, getValue } from '../../util/comm'
  import { currentYPosition, elmYPosition } from 'kc-scroll'
  import _ from 'lodash'
  import sanitizeHtml from 'sanitize-html'
  import truncate from 'truncate'

  export default {
    computed: {
      containerStyle () {
        return { border: _.get(SECTION_MAP, [ this.sectionId, 'border' ], '2px solid #414141;') }
      },
      titleStyle () {
        return { color: _.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;') }
      },
      sectionId () {
        return _.get(this.$store, [ 'state', 'articles', 'items', 0, 'sections', 0, 'id' ])
      }
    },
    methods: {
      makeRelatedFixed () {
        const articleDom = document.querySelector('.article_main')
        const asideTop = elmYPosition('.article_aside')
        const asideDom = document.querySelector('.article_aside')
        const tHtml = document.documentElement

        const customCSS = `.related-list-container .list > .title::before { content: ""; border-color: transparent transparent transparent ${_.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;')} }`
        const custCss = document.createElement('style')
        custCss.appendChild(document.createTextNode(customCSS))
        document.querySelector('body').appendChild(custCss)

        window.addEventListener('scroll', (e) => {
          const relatedDom = document.querySelector('.related-list-container')
          if (!relatedDom || !asideDom.offsetLeft) { return }
          const currTop = currentYPosition()
          const currBottom = currentYPosition() + tHtml.clientHeight
          // const mainBottom = elmYPosition('.article_main') + document.querySelector('.article_main').clientHeight
          const asideHeight = asideDom.clientHeight
          const asideBottom = asideTop + asideHeight
          const mainHeight = articleDom.clientHeight

          if (window.relatedTop < asideBottom && relatedDom.getAttribute('style')) {
            relatedDom.removeAttribute('style')
            window.relatedTop = elmYPosition('.related-list-container')
          }

          if (window.relatedTop && currTop > window.relatedTop && relatedDom.clientHeight < tHtml.clientHeight) {
            // const footerTop = elmYPosition('.article_footer > div:first-child')
            const footerTop = elmYPosition('.article_footer')
            relatedDom.setAttribute('style', 'position: fixed; top: 0; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
            if (footerTop < (currTop + relatedDom.clientHeight + 50)) {
              relatedDom.setAttribute('style', 'position: fixed; top: ' + (footerTop - (currTop + relatedDom.clientHeight + 50)) + 'px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
            }
          } else if (window.relatedTop && currBottom >= window.relatedBottom && relatedDom.clientHeight >= tHtml.clientHeight && mainHeight > asideHeight) {
            // const footerTop = elmYPosition('.article_footer > div:first-child')
            const footerTop = elmYPosition('.article_footer')
            relatedDom.setAttribute('style', 'position: fixed; bottom: 20px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
            if (footerTop < (currBottom + 50)) {
              relatedDom.setAttribute('style', 'position: fixed; bottom: ' + ((currBottom + 50) - footerTop) + 'px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
            }
          } else {
            relatedDom.removeAttribute('style')
            window.relatedTop = elmYPosition('.related-list-container')
            window.relatedBottom = elmYPosition('.related-list-container') + relatedDom.clientHeight
            window.relatedWidth = relatedDom.offsetWidth
            window.relatedOffsetLeft = (relatedDom.offsetLeft + relatedDom.offsetParent.offsetLeft)
          }
        })
        window.addEventListener('resize', (e) => {
          this.updateRelatedListStyle()
        })
      },
      getBrief (rawBrief) {
        return truncate(sanitizeHtml(rawBrief, { allowedTags: [ 'em' ] }), 70)
      },
      getHref,
      getValue,
      updateRelatedListStyle () {
        const tHtml = document.documentElement
        const currTop = currentYPosition()
        const currBottom = currentYPosition() + tHtml.clientHeight
        // const mainBottom = elmYPosition('.article_main') + document.querySelector('.article_main').clientHeight
        const aside = document.querySelector('.article_aside')
        if (!aside) { return }
        const asideHeight = aside.clientHeight

        const mainHeight = document.querySelector('.article_main').clientHeight
        const relatedDom = document.querySelector('.related-list-container')
        if (!relatedDom || !aside.offsetLeft) { return }
        if (window.relatedTop && currTop > window.relatedTop && relatedDom.clientHeight < tHtml.clientHeight) {
          relatedDom.removeAttribute('style')
          window.relatedOffsetLeft = (relatedDom.offsetLeft + relatedDom.offsetParent.offsetLeft)
          relatedDom.setAttribute('style', 'position: fixed; top: 0; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
        } else if (window.relatedTop && currBottom >= window.relatedBottom && relatedDom.clientHeight >= tHtml.clientHeight && mainHeight > asideHeight) {
          const footerTop = elmYPosition('.article_footer')
          // const footerTop = elmYPosition('.article_footer > div:first-child')
          relatedDom.removeAttribute('style')
          window.relatedOffsetLeft = (relatedDom.offsetLeft + relatedDom.offsetParent.offsetLeft)
          relatedDom.setAttribute('style', 'position: fixed; bottom: 20px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
          if (footerTop < (currBottom + 20)) {
            relatedDom.setAttribute('style', 'position: fixed; bottom: ' + ((currBottom + 20) - footerTop) + 'px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
          }
        } else {
          relatedDom.removeAttribute('style')
        }
      }
    },
    mounted () {
      this.makeRelatedFixed()
    },
    name: 'related-list',
    props: {
      relateds: {
        default: () => ([])
      },
      abIndicator: {
        default: () => ('')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .related-list-container 
    width 300px
    margin 0 auto 20px
    background-color #fff

    .list
      margin-top 20px
      padding 20px 0
      margin 20px auto 0
      display flex
      flex-direction column
      align-items center
      justify-content center

      & > div 
        width 230px
      
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
          left -35px
          display block
        
      
      .item 
        margin 20px 0
        padding-bottom 20px
        border-bottom 1px solid #c1c1c1

        .title 
          font-size 18px
          line-height 25px
        
        .brief 
          line-height 20px
          padding-top 10px
          
          a:hover, a:link, a:visited 
            color #6f6f6f
          
        
        &:last-child
          border-bottom none
          padding-bottom 0
        
      
    
  
</style>
