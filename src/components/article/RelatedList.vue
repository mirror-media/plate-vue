<template>
  <div class="related-list-container">
    <div class="title"><h4>相關文章</h4></div>
    <div class="item" v-for="(o, i) in relateds">
      <div class="title"><a :href="`/post/${getValue(o, [ 'name'], '')}`">{{ o.title }}</a></div>
      <div class="brief"><a :href="`/post/${getValue(o, [ 'name'], '')}`">{{ getBrief(getValue(o, [ 'brief', 'apiData', 0, 'content', 0], '')) }}</a></div>
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
        window.onscroll = (e) => {
          const relatedDom = document.querySelector('.related-list-container')
          const currTop = currentYPosition()
          const relatedTop = elmYPosition('.related-list-container')
          if(window.relatedTop && currTop > window.relatedTop) {
            relatedDom.setAttribute('style', 'position: fixed; top: 0; width: ' + window.relatedWidth + 'px; left: ' + window.relatedOffsetLeft  + 'px;')
          } else {
            relatedDom.removeAttribute('style')
            window.relatedTop = elmYPosition('.related-list-container')
            window.relatedWidth = relatedDom.offsetWidth
            window.relatedOffsetLeft  = (relatedDom.offsetLeft + relatedDom.offsetParent.offsetLeft)
          }
        }
      },
      getBrief(rawBrief) {
        return truncate(sanitizeHtml(rawBrief, { allowedTags: [ 'em' ] }), 70)
      },
      getValue
    },
    mounted() {
      this.makeRelatedFixed()
    },
    name: 'related-list',
    props: {
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
