<template>
  <div v-show="hasRecommendList" class="recommend-list">
    <div
      v-if="hasRecommendList"
      :class="sectionInfo.name"
      :style="{ borderColor: sectionInfo.color }"
      class="recommend-list-container"
    >
      <h4 :style="{ color: sectionInfo.color }">相關文章</h4>
      <template v-for="(post, index) in filteredRecommends">
        <div
          :key="`recommend-${post.slug}`"
          class="recommend-list__item"
        >
          <a
            :href="getHrefFull(post, isAppPage)"
            target="_blank"
            @click="recommendsClickHandler(get(post, 'slug'))"
            v-text="post.title"
          />
        </div>
        <PopInAd
          v-if="showPopInAdAtSpecificPos && index === 1"
          :key="`popIn-2-${index}`"
          class="recommend-list__item"
        >
          <div id="_popIn_recommend_ad_1"></div>
        </PopInAd>
        <PopInAd
          v-if="showPopInAdAtSpecificPos && index === 2"
          :key="`popIn-1-${index}`"
          class="recommend-list__item"
        >
          <div id="_popIn_recommend_ad_2"></div>
        </PopInAd>
      </template>
      <template v-if="!showPopInAdAtSpecificPos">
        <PopInAd class="recommend-list__item">
          <div id="_popIn_recommend_ad_1"></div>
        </PopInAd>
        <PopInAd class="recommend-list__item">
          <div id="_popIn_recommend_ad_2"></div>
        </PopInAd>
      </template>
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

  export default {
    name: 'RecommendList',
    components: {
      PopInAd,
    },
    props: {
      currArticleId: {
        type: String,
        default: ''
      },
      excludingArticle: {
        type: String,
        default: 'N/A'
      },
      isAppPage: {
        type: Boolean,
        default: false
      },
      recommends: {
        default: () => []
      },
      relateds: {
        default: () => []
      },
      sectionId: {
        default: ''
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
      hasRecommendList () {
        return this.filteredRecommends.length > 0
      },
      recommendsHash () {
        const hashtable = new HashTable()
        map(this.recommends, (a) => {
          hashtable.put(get(a, 'slug'), a)
        })
        return hashtable
      },
      sectionInfo () {
        return ({
          color: get(SECTION_MAP, `${this.sectionId}.bgcolor`, '#414141'),
          name: get(SECTION_MAP, `${this.sectionId}.sectionName`, '')
        })
      },
      showPopInAdAtSpecificPos () {
        return this.filteredRecommends.length >= 3
      }
    },
    mounted () {
      this.referrerSlug = extractSlugFromReferrer(document.referrer)
    },
    methods: {
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
      }
    }
  }

</script>
<style lang="stylus" scoped>
.recommend-list
  clear both
  &-container
    padding 20px 30px
    border 2px solid #414141
  h4
    position relative
    margin 0
    font-size 1.1875rem
    &::before
      content ''
      position absolute
      left -30px
      width 0
      height 0
      border-style solid
      border-width 10px 0 10px 17.3px
      border-color transparent transparent transparent #414141
  >>> a, >>> a:hover, >>> a:link, >>> a:visited
    padding 0
    color rgba(2, 2, 2, 0.5)
    font-size 1.125rem
    line-height 25px
    text-decoration none
    border-bottom none
    cursor pointer
  &__item
    margin-top 15px
    & + .recommend-list__item
      padding 15px 0 0
      border-top 1px solid #c1c1c1

  &-container
    &.news
      h4
        &::before
          border-left-color #30bac8
    &.entertainment
      h4
        &::before
          border-left-color #bf3284
    &.businessmoney
      h4
        &::before
          border-left-color #009045
    &.people
      h4
        &::before
          border-left-color #efa256
    &.international
      h4
        &::before
          border-left-color #911f27
    &.foodtravel
      h4
        &::before
          border-left-color #eac151
    &.mafalda
      h4
        &::before
          border-left-color #662d8e
    &.culture
      h4
        &::before
          border-left-color #009245
    &.watch
      h4
        &::before
          border-left-color #003153
    &.external
      h4
        &::before
          border-left-color #ee5a24
</style>
