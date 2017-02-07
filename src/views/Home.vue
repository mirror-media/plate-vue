<template>
  <div class="section-view">
    <app-Header :commonData= 'commonData' />
    <div class="dfp-test">DFP 970 X 250</div>
    <editor-choice :editorChoice= 'editorChoice'/>
    <section class="container">
      <latest-article :latestArticle= 'latestArticle'/>
      <latest-project />
    </section>
  </div>
</template>

<script>

import _ from 'lodash'
import Header from '../components/Header.vue'
import EditorChoice from '../components/EditorChoice.vue'
import LatestArticle from '../components/LatestArticle.vue'
import LatestProject from '../components/LatestProject.vue'
import truncate from 'truncate'

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { })
}

const fetchEditorChoice = (store) => {
  return store.dispatch('FETCH_EDITORCHOICE', { })
}

const fetchLatestArticle = (store) => {
  return store.dispatch('FETCH_LATESTARTICLE', { })
}


const fetchData = (store) => {
  return fetchCommonData(store).then(() => {
    return fetchEditorChoice(store).then(() => {
      return fetchLatestArticle(store)
    })
  })
}

export default {
  name: 'home-view',
  preFetch: fetchData,
  components: {
    'app-Header': Header,
    'editor-choice': EditorChoice,
    'latest-article': LatestArticle,
    'latest-project': LatestProject,
  },
  data () {
    return {
      commonData: this.$store.state.commonData,
      editorChoice: this.$store.state.editorChoice,
      latestArticle: this.$store.state.latestArticle
    }
  },
  computed: {
    articles () {
      return this.rep
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

.dfp-test
  width 970px
  height 250px
  margin 0 auto 20px
  background-color #a8dadc

</style>