<template>
  <div class="related-list-container" v-if="ifshow">
    <div class="title"><h4>相關文章</h4></div>
    <div class="item" v-for="(o, i) in relateds">
      <div class="title"><a :href="`/post/${getValue(o, [ 'slug'], '')}`" target="_blank">{{ o.title }}</a></div>
    </div>
  </div>
</template>
<script>
  import { currentYPosition, elmYPosition, getValue } from '../../utils/comm'
  import sanitizeHtml from 'sanitize-html'
  import truncate from 'truncate'

  export default {
    methods: {

      makeRelatedFixed() {
        const articleDom = document.querySelector('.article_main')
        const asideTop = elmYPosition('.article_aside')
        const asideDom = document.querySelector('.article_aside')
        const tHtml = document.documentElement;
        const relatedDom = document.querySelector('.related-list-container')

        window.onscroll = (e) => {
          if(!relatedDom) { return }
          const currTop = currentYPosition()
          const currBottom = currentYPosition() + tHtml.clientHeight
          // const mainBottom = elmYPosition('.article_main') + document.querySelector('.article_main').clientHeight
          const asideHeight = asideDom.clientHeight
          const asideBottom = asideTop + asideHeight
          const mainHeight = articleDom.clientHeight

          if( window.relatedTop < asideBottom && relatedDom.getAttribute('style')) {
            relatedDom.removeAttribute('style')
            window.relatedTop = elmYPosition('.related-list-container')
          }

          if(window.relatedTop && currTop > window.relatedTop && relatedDom.clientHeight < tHtml.clientHeight) {
            const footerTop = elmYPosition('.article_footer > div:first-child')
            relatedDom.setAttribute('style', 'position: fixed; top: 0; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
            if(footerTop < (currTop + relatedDom.clientHeight + 50)) {
              relatedDom.setAttribute('style', 'position: fixed; top: ' + (footerTop - (currTop + relatedDom.clientHeight + 50)) + 'px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
            }
          } else if(window.relatedTop && currBottom >= window.relatedBottom && relatedDom.clientHeight >= tHtml.clientHeight && mainHeight > asideHeight) {
            const footerTop = elmYPosition('.article_footer > div:first-child')
            relatedDom.setAttribute('style', 'position: fixed; bottom: 20px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
            if(footerTop < (currBottom + 50)) {
              relatedDom.setAttribute('style', 'position: fixed; bottom: ' + ((currBottom + 50) - footerTop) + 'px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
            }
          } else {
            relatedDom.removeAttribute('style')
            window.relatedTop = elmYPosition('.related-list-container')
            window.relatedBottom = elmYPosition('.related-list-container') + relatedDom.clientHeight
            window.relatedWidth = relatedDom.offsetWidth
            window.relatedOffsetLeft  = (relatedDom.offsetLeft + relatedDom.offsetParent.offsetLeft)
          }
        }
        window.onresize = (e) => {
          this.updateRelatedListStyle()
        }
      },
      getBrief(rawBrief) {
        return truncate(sanitizeHtml(rawBrief, { allowedTags: [ 'em' ] }), 70)
      },
      getValue,
      updateRelatedListStyle() {
        const tHtml = document.documentElement;
        const currTop = currentYPosition()
        const currBottom = currentYPosition() + tHtml.clientHeight
        // const mainBottom = elmYPosition('.article_main') + document.querySelector('.article_main').clientHeight
        const mainHeight = document.querySelector('.article_main').clientHeight
        const relatedDom = document.querySelector('.related-list-container')
        if(!relatedDom) { return }
        const relatedTop = elmYPosition('.related-list-container')
        if(window.relatedTop && currTop > window.relatedTop && relatedDom.clientHeight < tHtml.clientHeight) {
          relatedDom.removeAttribute('style')
          window.relatedOffsetLeft  = (relatedDom.offsetLeft + relatedDom.offsetParent.offsetLeft)
          relatedDom.setAttribute('style', 'position: fixed; top: 0; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
        } else if(window.relatedTop && currBottom >= window.relatedBottom && relatedDom.clientHeight >= tHtml.clientHeight && mainHeight > asideHeight) {
          const footerTop = elmYPosition('.article_footer > div:first-child')
          relatedDom.removeAttribute('style')
          window.relatedOffsetLeft  = (relatedDom.offsetLeft + relatedDom.offsetParent.offsetLeft)
          relatedDom.setAttribute('style', 'position: fixed; bottom: 20px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
          if(footerTop < (currBottom + 20)) {
            relatedDom.setAttribute('style', 'position: fixed; bottom: ' + ((currBottom + 20) - footerTop) + 'px; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft + 'px;')
          }
        } else {
          relatedDom.removeAttribute('style')
        }

      },
    },
    mounted() {
      this.makeRelatedFixed()
    },
    name: 'related-list',
    props: {
      ifshow: {
        default: false
      },
      relateds: {
        default: []
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .related-list-container {
    margin-top: 20px;
    padding: 20px 0;
    border: 1px solid #c1c1c1;
    box-shadow: 0 0 5px #c1c1c1;
    width: 300px;
    margin: 20px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    div {
      width: 230px;
    }
    .title {
      font-size: 19px;
      h4 {
        margin: 0;
      }
    }
    .item {
      margin: 20px 0;
      padding-bottom: 20px;
      border-bottom: 1px solid #c1c1c1;
      .title {
        font-size: 18px;
        line-height: 25px;
      }
      .brief {
        line-height: 20px;
        padding-top: 10px;
        a:hover, a:link, a:visited {
  		    color: #6f6f6f;
  			}
      }
      &:last-child{
        border-bottom: none;
        padding-bottom: 0;
      }
    }
  }
</style>
