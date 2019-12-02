<template>
  <div class="related-list">
    <div
      v-if="filteredRecommends.length > 0"
      class="related-list__list"
      :style="containerStyle()"
    >
      <div class="related-list__list__title">
        <h4 :style="titleStyle()">
          相關文章
        </h4>
      </div>
      <template v-if="!isAd">
        <template v-for="(o, i) in filteredRecommends">
          <div
            v-if="o"
            :key="i"
            class="related-list__list__item"
          >
            <div class="title">
              <a
                @click="recommendsClickHandler(get(o, 'slug'))"
                :href="getHrefFull(o, isAppPage)"
                target="_blank"
                v-text="get(o, 'title', '')"
              >
              </a>
            </div>
          </div>
          <div
            v-if="i === showPopInAdAt"
            :key="i"
            class="related-list__list__item"
          >
            <popin-ad>
              <div id="_popIn_recommend_ad_1"></div>
            </popin-ad>
          </div>
        </template>
      </template>
      <div
        v-if="showPopInAdAt === 0"
        class="related-list__list__item"
      >
        <popin-ad>
          <div id="_popIn_recommend_ad_1"></div>
        </popin-ad>
      </div>
    </div>
  </div>
</template>
<script>
  import { get, map, take } from 'lodash'
  import { RELATED_LIST_MAX, RECOMM_HITORY_MAX_IN_LOCALSTORAGE, SECTION_MAP } from '../../constants'
  import { extractSlugFromReferrer, getHrefFull, sendGaClickEvent } from '../../util/comm'
  import Deque from 'double-ended-queue'
  import HashTable from 'jshashtable'
  import PopInAd from '../PopInAd.vue'

  const debug = require('debug')('CLIENT:RecommendList')
  const fetchRecommendList = (store, id) => {
    debug('id', id)
    return store.dispatch('FETCH_ARTICLE_RECOMMEND_LIST', {
      params: {
        id: id
      }
    })
  }

  export default {
    name: 'RecommendList',
    components: {
      'popin-ad': PopInAd
    },
    props: {
      currArticleId: {
        default: () => ''
      },
      excludingArticle: {
        default: () => ('N/A')
      },
      isAd: {
        default: () => false
      },
      isAppPage: {
        type: Boolean,
        default: false
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
    },
    data () {
      return {
        referrerSlug: 'N/A'
      }
    },
    computed: {
      filteredRecommends () {
        const dqueue = this.getRecommClickHistory()
        const excludingArticlesLen = this.relateds.length
        const recommendListHash = this.recommendsHash
        if (this.referrerSlug !== 'N/A') { recommendListHash.remove(this.referrerSlug) }
        if (this.excludingArticle !== 'N/A') { recommendListHash.remove(this.excludingArticle) }
        for (let i = 0; i < excludingArticlesLen; i += 1) { recommendListHash.remove(get(this.relateds[ i ], 'slug', '')) }
        dqueue.toArray().map((slug) => { recommendListHash.remove(slug) })
        debug(recommendListHash.values())
        return take(recommendListHash.values(), RELATED_LIST_MAX - excludingArticlesLen)
      },
      recommendsHash () {
        const hashtable = new HashTable()
        map(this.recommends, (a) => {
          hashtable.put(get(a, 'slug'), a)
        })
        return hashtable
      },
      showPopInAdAt () {
        if (!this.filteredRecommends.length) {
          return 0
        }
        return this.filteredRecommends.length < 3 ? this.filteredRecommends.length - 1 : 3
      }
    },
    watch: {
      currArticleId: function () {
        fetchRecommendList(this.$store, this.currArticleId)
      },
      sectionId: function () {
        document.querySelector('.relatedBtmStyle').innerHTML = `.related-list .related-list__list > .related-list__list__title::before { content: ""; border-color: transparent transparent transparent ${get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;')} }`
      },
    },
    beforeMount () {
      fetchRecommendList(this.$store, this.currArticleId)
    },
    mounted () {
      const customCSS = `.related-list .related-list__list > .related-list__list__title::before { content: ""; border-color: transparent transparent transparent ${get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;')} }`
      const custCss = document.createElement('style')
      custCss.setAttribute('class', 'relatedBtmStyle')
      custCss.appendChild(document.createTextNode(customCSS))
      document.querySelector('body').appendChild(custCss)
      this.referrerSlug = extractSlugFromReferrer(document.referrer)
    },
    methods: {
      containerStyle () {
        return { border: `2px solid ${get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141')}` }
      },
      getHrefFull,
      getRecommClickHistory () {
        const recommsClickHistory = (process.browser) && localStorage.getItem('recommsClickHistory')
        const dqueue = new Deque(RECOMM_HITORY_MAX_IN_LOCALSTORAGE)
        recommsClickHistory && dqueue.push(...recommsClickHistory.split(','))
        return dqueue
      },
      get,
      recommendsClickHandler (slug) {
        try {
          const dqueue = this.getRecommClickHistory()
          debug('Event click detected.', slug)
          if (dqueue.toArray().length >= RECOMM_HITORY_MAX_IN_LOCALSTORAGE) {
            dqueue.dequeue()
          }
          dqueue.enqueue(slug)
          setTimeout(() => localStorage.setItem('recommsClickHistory', dqueue.toString()), 1000)
          sendGaClickEvent('article', 'recommend')
        } catch (e) {
          debug(e)
        }
      },
      titleStyle () {
        return { color: get(SECTION_MAP, [ this.sectionId, 'bgcolor' ], '#414141;') }
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
