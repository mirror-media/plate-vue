<template>
  <div class="related-list">
    <div class="related-list__list" :style="containerStyle()">
      <div class="related-list__list__title"><h4 :style="titleStyle()">相關文章</h4></div>
      <template v-for="(o, i) in relateds">
        <div class="related-list__list__item" v-if="o">
          <div class="title">
            <router-link :to="routerLinkUrl(o)" v-text="getValue(o, [ 'title' ], '')" :id="`related-${getValue(o, [ 'slug' ], Date.now())}`" v-if="shouldShowItem(o)"></router-link>
            <a :href="getHrefFull(o)" v-text="getValue(o, [ 'title' ], '')" :id="`related-${getValue(o, [ 'slug' ], Date.now())}`" v-else></a>
          </div>
        </div>
      </template>
      <template v-if="!isAd">
        <template v-for="(o, i) in filteredRecommends">
          <div class="related-list__list__item" v-if="o">
            <div class="title">
              <router-link @click.native="recommendsClickHandler(getValue(o, [ 'slug' ]), $event)" :to="routerLinkUrl(o)" v-text="getValue(o, [ 'title' ], '')" :id="`recommend-${getValue(o, [ 'slug' ], Date.now())}`" v-if="shouldShowItem(o)"></router-link>
              <a @click="recommendsClickHandler(getValue(o, [ 'slug' ]), $event)" :href="getHrefFull(o)" v-text="getValue(o, [ 'title' ], '')" :id="`recommend-${getValue(o, [ 'slug' ], Date.now())}`" v-else></a>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { SECTION_MAP, RELATED_LIST_MAX, RECOMM_HITORY_MAX_IN_LOCALSTORAGE } from '../../constants'
  import { extractSlugFromreferrer, getHref, getHrefFull, getValue } from '../../util/comm'
  import Deque from 'double-ended-queue'
  import HashTable from 'jshashtable'

  const debug = require('debug')('CLIENT:RelatedListWithRecommendList')
  export default {
    computed: {
      filteredRecommends () {
        const dqueue = this.getRecommClickHistory()
        const excludingArticlesLen = this.relateds.length
        const recommendListHash = this.recommendsHash
        if (this.referrerSlug !== 'N/A') { recommendListHash.remove(this.referrerSlug) }
        if (this.excludingArticle !== 'N/A') { recommendListHash.remove(this.excludingArticle) }
        for (let i = 0; i < excludingArticlesLen; i += 1) { recommendListHash.remove(_.get(this.relateds[ i ], [ 'slug' ], '')) }
        dqueue.toArray().map((slug) => { recommendListHash.remove(slug) })
        debug(recommendListHash.values())
        return _.take(recommendListHash.values(), RELATED_LIST_MAX - excludingArticlesLen)
      },
      recommendsHash () {
        const hashtable = new HashTable()
        _.map(this.recommends, (a) => {
          hashtable.put(_.get(a, [ 'slug' ]), a)
        })
        return hashtable
      }
    },
    data () {
      return {
        referrerSlug: 'N/A'
      }
    },
    methods: {
      getHref,
      getHrefFull,
      getValue,
      containerStyle () {
        return { border: `2px solid ${_.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141')}` }
      },
      getRecommClickHistory () {
        const recommsClickHistory = (process.browser) && localStorage.getItem('recommsClickHistory')
        const dqueue = new Deque(RECOMM_HITORY_MAX_IN_LOCALSTORAGE)
        recommsClickHistory && dqueue.push(...recommsClickHistory.split(','))
        return dqueue
      },
      routerLinkUrl (article) {
        return !this.isApp ? getHref(article) : `/app/${getValue(article, [ 'slug' ], '')}`
      },
      recommendsClickHandler (slug, event) {
        try {
          const dqueue = this.getRecommClickHistory()
          debug('Event click detected.', slug)
          if (dqueue.toArray().length >= RECOMM_HITORY_MAX_IN_LOCALSTORAGE) {
            dqueue.dequeue()
          }
          dqueue.enqueue(slug)
          setTimeout(() => localStorage.setItem('recommsClickHistory', dqueue.toString()), 1000)
        } catch (e) {
          debug(e)
        }
      },
      shouldShowItem (article) {
        return article.style !== 'projects' && article.style !== 'campaign' && article.style !== 'readr'
      },
      titleStyle () {
        return { color: _.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;') }
      }
    },
    mounted () {
      const customCSS = `.related-list .related-list__list > .related-list__list__title::before { content: ""; border-color: transparent transparent transparent ${_.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;')} }`
      const custCss = document.createElement('style')
      custCss.setAttribute('class', 'relatedBtmStyle')
      custCss.appendChild(document.createTextNode(customCSS))
      document.querySelector('body').appendChild(custCss)
      this.referrerSlug = extractSlugFromreferrer(document.referrer)
    },
    watch: {
      sectionId: function () {
        document.querySelector('.relatedBtmStyle').innerHTML = `.related-list .related-list__list > .related-list__list__title::before { content: ""; border-color: transparent transparent transparent ${_.get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;')} }`
      }
    },
    name: 'related-list',
    props: {
      abIndicator: {
        default: () => ('')
      },
      excludingArticle: {
        default: () => ('N/A')
      },
      isApp: {
        default: () => false
      },
      isAd: {
        default: () => false
      },
      recommends: {
        default: () => ([])
      },
      relateds: {
        default: () => ([])
      },
      sectionId: {
        default: () => ('')
      }
    }
  }

</script>
<style lang="stylus" scoped>
  .related-list
    width 100%
    margin 0 auto
    clear both

    &__list
      margin-top 20px
      padding 20px 30px 30px
      margin 20px auto 0
      
      > div
        width 100%

      &__title 
        font-size 19px
        position relative

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
          left -30px
          display block

      &__item 
        margin 15px 0 0
        padding-bottom 15px
        border-bottom 1px solid #c1c1c1

        > .title 
          font-size 18px
          line-height 25px

          a, a:hover, a:link, a:visited 
            color rgba(2, 2, 2, 0.5)
            text-decoration none
            cursor pointer
            border-bottom none
        
        > .brief 
          line-height 20px
          padding-top 10px
          
          a:hover, a:link, a:visited 
            color #6f6f6f
          
        &:last-child
          border-bottom none
          padding-bottom 0
</style>
