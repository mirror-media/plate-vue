<template>
  <div class="article_body">
    <section class="pic-section">
      <img :src="getValue(heroImg, [ 'image', 'url' ])"
            :srcset="`${getValue(heroImg, [ 'image', 'resizedTargets', 'mobile', 'url' ])} 800w,
                      ${getValue(heroImg, [ 'image', 'resizedTargets', 'tablet', 'url' ])} 1200w,
                      ${getValue(heroImg, [ 'image', 'resizedTargets', 'desktop', 'url' ])} 2000w`" />
    </section>
    <section class="pic-section" v-for="(o, i) in contentArr" v-if="getValue(o, [ 'type' ], '') === 'image'">
      <img :src="getValue(o, [ 'content', 0, 'url' ])"
            :srcset="`${getValue(o, [ 'content', 0, 'mobile', 'url' ])} 800w,
                      ${getValue(o, [ 'content', 0, 'tablet', 'url' ])} 1200w,
                      ${getValue(o, [ 'content', 0, 'desktop', 'url' ])} 2000w`" />      
    </section>
  </div>
</template>
<script>
  import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
  import { getValue } from '../../utils/comm'
  import _ from 'lodash'
  export default {
    name: 'ariticle-body-photo',
    computed: {
      heroImg() {
        const { heroImage } = this.articleData
        return heroImage
      },
      contentArr() {
        const { apiData } = _.get(this.articleData, [ 'content' ], [])
        return apiData
      },
      sectionsInfo() {
        const _htmlHeight = document.documentElement.clientHeight
        const _sectArr = document.querySelectorAll('section.pic-section')
        let _sectInfo = []
        _.map(_sectArr, (elem, index) => {
          const _selector = `section.pic-section:nth-child(${(index + 1)})`
          const _eleTop = this.elmYPosition(`section.pic-section:nth-child(${(index + 1)})`)
          const _eleBtm = _eleTop + _htmlHeight
          _sectInfo.push({ _selector, _eleTop, _eleBtm })
        })
        return _sectInfo
      },
      sectCount() {
        return document.querySelectorAll('section.pic-section').length
      }
    },
    data() {
      return {
        scrollingFlag: false,
        sectIndex: 1
      }
    },
    methods: {
      getValue,
      currentYPosition,
      elmYPosition,
      smoothScroll,
      keys() {
        return {37: 1, 38: 1, 39: 1, 40: 1}
      },
      preventDefault(e) {
        e = e || window.event
        if (e.preventDefault)
          e.preventDefault()
        e.returnValue = false
      },
      preventDefaultForScrollKeys(e) {
        // doesn't work
        if (this.keys[e.keyCode]) {
          this.preventDefault(e)
          return false
        }
      },
      disableScroll() {
        if (window.addEventListener) // older FF
          window.addEventListener('DOMMouseScroll', this.preventDefault, false)
        window.onwheel = this.preventDefault // modern standard
        window.onmousewheel = document.onmousewheel = this.preventDefault // older browsers, IE
        window.ontouchmove  = this.preventDefault // mobile
        document.onkeydown  = this.preventDefaultForScrollKeys
      },
      enableScroll() {
          if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', this.preventDefault, false)
          window.onmousewheel = document.onmousewheel = null; 
          window.onwheel = null; 
          window.ontouchmove = null;  
          document.onkeydown = null;  
      },
      scrollOnePage() {
        window.addEventListener('wheel', (e) => {
          const _htmlHeight = document.documentElement.clientHeight
          const _lastDelta = window.wheelDelta
          const _derection = e.wheelDelta
          let _currTop = 0
          let _targEle = 0
          if(_derection < 0) {
            if(!this.scrollingFlag && Math.abs(_derection) > 3) {
              this.sectIndex = (this.sectIndex < this.sectCount) ? this.sectIndex + 1 : this.sectIndex
            }
          } else {
            if(!this.scrollingFlag && Math.abs(_derection) > 3) {
              this.sectIndex = (this.sectIndex > 1) ? this.sectIndex - 1 : this.sectIndex
            }
          }
          _currTop = this.currentYPosition()
          _targEle = this.elmYPosition(`section.pic-section:nth-child(${this.sectIndex})`)              
          if(!this.scrollingFlag && Math.abs(_derection) > 3 && _currTop != _targEle) {
            this.scrollingFlag = true
            this.smoothScroll(`section.pic-section:nth-child(${this.sectIndex})`)
          } else if(Math.abs(_derection) <= 3 && _currTop === _targEle) {
            this.scrollingFlag = false
          }
          window.wheelDelta = _derection

        })
      }
    },
    mounted() {
      this.disableScroll()
      this.scrollOnePage()
    },
    props: {
      articleData: {
        default: () => { return {} }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .article_body
    /*width 100%*/
    .pic-section
      width 100vw
      height 100vh
      img
        width 100%
        object-fit cover
        max-height 100%
    
</style>