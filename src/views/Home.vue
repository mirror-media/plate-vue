<template>
  <div class="section-view">
    <app-Header :commonData= 'commonData' />
    <div class="dfp-test">DFP 970 X 250</div>
    <editor-choice :editorChoice= 'editorChoice'/>
    <section class="container list">
      <latest-article :latestArticle= 'latestArticle'/>
      <latest-project />
      <more v-if="hasMore" :page= 'page' v-on:loadMore="loadMore"/>
    </section>
    <section class="container">
      <app-footer></app-footer>
    </section>
  </div>
</template>

<script>

import _ from 'lodash'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import EditorChoice from '../components/EditorChoice.vue'
import LatestArticle from '../components/LatestArticle.vue'
import LatestProject from '../components/LatestProject.vue'
import More from '../components/More.vue'
import truncate from 'truncate'

const MAXRESULT = 15
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { })
}

const fetchEditorChoice = (store) => {
  return store.dispatch('FETCH_EDITORCHOICE', { })
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

const fetchData = (store) => {
  return fetchCommonData(store).then(() => {
    return fetchEditorChoice(store).then(() => {
      return fetchLatestArticle(store, PAGE)
    })
  })
}

export default {
  name: 'home-view',
  preFetch: fetchData,
  components: {
    'app-footer': Footer,
    'app-Header': Header,
    'editor-choice': EditorChoice,
    'latest-article': LatestArticle,
    'latest-project': LatestProject,
    'more': More
  },
  data () {
    return {
      commonData: this.$store.state.commonData,
      editorChoice: this.$store.state.editorChoice,
      page: PAGE
    }
  },
  computed: {
    hasMore () {
      return _.get(this.latestArticle, [ 'items', 'length' ], 0) < _.get(this.latestArticle, [ 'meta', 'total' ], 0)
    },
    latestArticle () {
      return this.$store.state.latestArticle
    }
  },
  methods: {
    loadMore () {
      console.log('cc')
      this.page += 1
      this.$store.dispatch('FETCH_LATESTARTICLE', {
        params: {
          'max_results': MAXRESULT,
          'page': this.page,
          'sort':'-publishedDate'
        }
      })
    }
  },
  metaInfo () {
    const title = '鏡傳媒 Mirror Media '
    return {
      title
    }
  },
  beforeMount () {
    
  },
  mounted() {
    
  }
}
  
</script>
<style lang="stylus" scoped>
.section-view
  box-sizing border-box
  h2 
    margin: 0;
    font-family: Noto Sans TC,sans-serif
    font-size: 18px
    font-weight: 700
    line-height: 1.5
    letter-spacing: .5px
    color: rgba(0,0,0,.8)
    list-style-type none

.list
  &.container
    flex-direction: row
    flex-wrap: wrap

.dfp-test
  width 970px
  height 250px
  margin 0 auto 20px
  background-color #a8dadc

</style>