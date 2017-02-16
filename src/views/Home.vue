<template>
  <div class="section-view">
    <app-Header :commonData= 'commonData' />
    <div id="dfp-test" class="dfp-test">DFP 970 X 250</div>
    <editor-choice :editorChoice= 'editorChoice'/>
    <section class="container list">
      <latest-article :latestArticle= 'latestArticle'/>
      <latest-project :project= 'commonData.projects.items' />
    </section>
    <loading :show="loading" />
    <section class="container">
      <more v-if="hasMore" v-on:loadMore="loadMore" />
    </section>
    <section class="container">
      <app-footer></app-footer>
    </section>
  </div>
</template>

<script>

import { currentYPosition, elmYPosition } from 'kc-scroll'
import _ from 'lodash'
import EditorChoice from '../components/EditorChoice.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LatestArticle from '../components/LatestArticle.vue'
import LatestProject from '../components/LatestProject.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import truncate from 'truncate'

const MAXRESULT = 15
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'posts-vue', 'choices' ] } )
}

const fetchLatestArticle = (store, page) => {
  return store.dispatch('FETCH_LATESTARTICLE', {
    params: {
      'max_results': MAXRESULT,
      'page': page,
      'sort':'-publishedDate'
    }
  })
}

export default {
  name: 'home-view',
  preFetch: fetchCommonData,
  components: {
    'app-footer': Footer,
    'app-Header': Header,
    'editor-choice': EditorChoice,
    'latest-article': LatestArticle,
    'latest-project': LatestProject,
    'loading': Loading,
    'more': More
  },
  data () {
    return {
      commonData: this.$store.state.commonData,
      editorChoice: this.$store.state.editorChoice,
      hasScrollLoadMore: false,
      loading: false,
      page: PAGE,
      
    }
  },
  computed: {
    hasMore () {
      return _.get(this.latestArticle, [ 'items', 'length' ], 0) < _.get(this.latestArticle, [ 'meta', 'total' ], 0)
    },
    latestArticle () {
      return this.$store.state.latestArticle
    },
  },
  methods: {
    loadMore () {
      this.page += 1
      this.loading = true
      fetchLatestArticle(this.$store, this.page).then(() => {
        this.loading = false
      })
    },
    handleScroll () {
      window.onscroll = (e) => {
        let firstPageArticleHeight = document.getElementById('latestArticle').offsetHeight
        let firstPageArticleBottom = elmYPosition('#latestArticle') + ( firstPageArticleHeight )
        let currentBottom = currentYPosition() + window.innerHeight
        if ( ( currentBottom > firstPageArticleBottom ) && !this.hasScrollLoadMore) {
          this.hasScrollLoadMore = true
          this.loadMore()
        }
      } 
    }
  },
  metaInfo () {
    const title = '鏡傳媒 Mirror Media'
    return {
      title
    }
  },
  beforeMount () {
    
  },
  mounted() {
    this.handleScroll()
  }
}
  
</script>
<style lang="stylus" scoped>
.section-view
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
    flex-direction row
    flex-wrap wrap
    align-items flex-start
    
</style>