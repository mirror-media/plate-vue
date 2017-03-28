<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" section="home">
    <template scope="props" slot="dfpPos">
      <div class="home-view">
        <section style="width: 100%;">
          <app-Header v-if="true" :commonData= 'commonData' />
        </section>
        <leading v-if="hasEvent" :type="eventType" :mediaData="eventData" :style="{ margin: '30px auto 0' }" class="event" />
        <editor-choice :editorChoice= 'editorChoice'/>
        <section class="container list">
          <aside>
            <div class="aside-title mobile-only"><h2>最新文章</h2></div>
            <LatestArticleAside :latestList="latestArticle" :viewport="viewport" />
            <LatestArticleAside :latestList="latestArticle" :viewport="viewport" />
            <LatestArticleAside :latestList="latestArticle" :viewport="viewport" />
            <LatestArticleAside :latestList="latestArticle" :viewport="viewport" />
          </aside>
          <main>
            <LatestArticleMain :latestList="latestArticle" :viewport="viewport" />
            <ProjectList class="desktop-only" :projects="projects" :viewport="viewport" />
            <PopularArticles :popList="popularlist" />
          </main>
        </section>
        <loading :show="loading" />
        <section class="container">
          <app-footer />
        </section>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>

import { currentYPosition, elmYPosition } from 'kc-scroll'
import { DFP_ID, DFP_UNITS, SITE_URL } from '../constants'
import _ from 'lodash'
import EditorChoice from '../components/EditorChoice.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LatestArticleAside from '../components/LatestArticleAside.vue'
import LatestArticleMain from '../components/LatestArticleMain.vue'
import Leading from '../components/Leading.vue'
import Loading from '../components/Loading.vue'
import PopularArticles from '../components/PopularArticles.vue'
import ProjectList from '../components/article/ProjectList.vue'
import VueDfpProvider from 'kc-vue-dfp/DfpProvider.vue'
import moment from 'moment'
import truncate from 'truncate'

const MAXRESULT = 20
const PAGE = 1

const fetchSSRData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sections', 'choices' ] } )
}

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'posts-vue', 'projects', 'topics' ] } )
}

const fetchEvent = (store) => {
  return store.dispatch('FETCH_EVENT', {
    params: {
      'max_results': 1,
      'where': {
        isFeatured: true
      }
    }
  })
}

const fetchLatestArticle = (store, page) => {
  return store.dispatch('FETCH_LATESTARTICLES', {
    params: {
      'max_results': MAXRESULT,
      'page': page,
      'sort':'-publishedDate'
    }
  })
}

const fetchPop = (store) => {
  return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
}

export default {
  name: 'home-view',
  components: {
    'app-footer': Footer,
    'app-Header': Header,
    'editor-choice': EditorChoice,
    'leading': Leading,
    'loading': Loading,
    LatestArticleAside,
    LatestArticleMain,
    PopularArticles,
    ProjectList,
    VueDfpProvider,
  },
  preFetch: fetchSSRData,
  beforeRouteEnter (to, from, next) {
    if(process.env.VUE_ENV === 'client' && to.path !== from.path) {
      next(vm => {
        if (_.get(vm.$store, ['state', 'commonData', 'sections', 'items']) || _.get(vm.$store, ['state', 'commonData', 'choices', 'items'])) {
          fetchSSRData(vm.$store)
          fetchPop(vm.$store)
        }
      })
    } else {
      next()
    }
  },
  data () {
    return {
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      hasScrollLoadMore: _.get(this.$store.state, ['latestArticles', 'meta', 'page'], PAGE) > 1 ? true : false,
      loading: false,
      page: _.get(this.$store.state, ['latestArticles', 'meta', 'page'], PAGE),
      viewport: undefined,
    }
  },
  computed: {
    commonData () {
      return this.$store.state.commonData
    },
    editorChoice () {
      if ( _.get(this.$store.state.editorChoice, ['items', 'length']) > 4) {
        return _.get(this.$store.state.editorChoice, ['items'])
      } else {
        let orig = _.values(_.get(this.$store.state, ['editorChoice', 'items']))
        let xorBy = _.xorBy(_.get(this.$store.state, ['editorChoice', 'items']), _.get(this.$store.state, ['latestArticles', 'items']), 'title')
        return _.concat(orig, _.take(xorBy, (5 - _.get(this.$store.state.editorChoice, ['items', 'length']))))
      }
    },
    event () {
      return this.$store.state.event
    },
    eventData () {
      return _.get(this.event, ['items', '0'])
    },
    eventType () {
      return this.is404 ? 'image' : _.get(this.event, ['items', '0', 'eventType'])
    },
    hasEvent () {
      const _eventStartTime = moment(new Date(_.get(this.event, ['items', 0, 'startDate'])))
      const _eventEndTime = moment(new Date(_.get(this.event, ['items', 0, 'endDate'])))
      const _now = moment()
      return (_eventStartTime && _eventEndTime && (_now >= _eventStartTime) && (_now <= _eventEndTime)) ? true : false
    },
    latestArticle () {
      let xorBy = _.xorBy( _.get(this.$store.state, ['editorChoice', 'items']), _.get(this.$store.state, ['latestArticles', 'items']), 'id')
      let latestArticle = _.slice(xorBy, (5 - _.get(this.$store.state.editorChoice, ['items', 'length'])))
      return latestArticle
    },
    popularlist() {
      const { report = [] } = _.get(this.$store, [ 'state', 'articlesPopList' ])
      return report
    },
    projects () {
      return _.get(this.commonData, ['projects', 'items'])
    }
  },
  methods: {
    updateViewport() {
        if(process.env.VUE_ENV === 'client') {
          this.viewport = document.querySelector('body').offsetWidth
        }
    },
  },
  metaInfo () {
    let title = '鏡週刊 Mirror Media'
    let description = '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'

    return {
      title,
      meta: [
          { name: 'keywords', content: '鏡週刊,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說'},
          { name: 'description', content: description },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: '/public/notImage.png' },
          { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:url', content: SITE_URL },
          { property: 'og:image', content: '/public/notImage.png' },
      ]
    }
  },
  beforeMount() {
    fetchCommonData(this.$store)
    fetchPop(this.$store)
    fetchEvent(this.$store)
  },
  mounted() {
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
  }
}
  
</script>
<style lang="stylus" scoped>
.editorChoice
  margin-top 40px

.home-view
  width 100%
  box-sizing border-box

  h2 
    margin: 0;
    font-family Noto Sans TC,sans-serif
    font-size 18px
    font-weight 700
    line-height 1.5
    letter-spacing .5px
    color rgba(0,0,0,.8)
    list-style-type none

.list
  &.container
    width 100%

    aside
      .aside-title
        // overflow hidden
        padding: 0 2rem;

        h2
          font-size 1.5rem
          color #356d9c
          font-weight 400
          overflow hidden
          margin-bottom 10px

          &::after
            content ""
            display inline-block
            height .5em
            vertical-align middle
            width 100%
            margin-right -100%
            margin-left 10px
            border-top 5px solid #356d9c

    main
      width 80%
      margin 0 auto

@media (min-width: 600px)
  .list
    &.container
      width 100%
      padding 0 2rem

      // main

      aside
        display flex
        flex-wrap wrap
        justify-content space-between

        .aside-title
          width 100%
          color #356d9c
          margin-bottom 10px
          // overflow hidden

          h2
            font-size 1.5rem
            color #356d9c

            &::after
              content ""
              display inline-block
              height .5em
              vertical-align middle
              width 100%
              margin-right -100%
              margin-left 10px
              border-top 5px solid #356d9c

      main
        width 100%

@media (min-width: 1200px)
  .list
    &.container
      width 1024px
      padding 0
      flex-direction row
      flex-wrap wrap
      align-items flex-start

      main
        width 75%

      aside
        width 25%
        padding 0 30px 0 0
    
</style>