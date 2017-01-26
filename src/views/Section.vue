<template>
  <div class="section-view">
    <app-Header :commonData= 'commonData' />
    <editor-choice :editorChoice= 'editorChoice' />
  </div>
</template>

<script>

import _ from 'lodash'
import EditorChoice from '../components/EditorChoice.vue'
import Header from '../components/Header.vue'
import truncate from 'truncate'

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { })
}

const fetchEditorChoice = (store) => {
  return store.dispatch('FETCH_EDITORCHOICE', { })
}

const fetchData = (store) => {
  return fetchCommonData(store).then(() => {
    return fetchEditorChoice(store)
  })
}

export default {
  name: 'section-view',
  preFetch: fetchData,
  components: {
    'app-Header': Header,
    'editor-choice': EditorChoice,
  },
  data () {
    return {
      editorChoice: this.$store.state.editorChoice,
      commonData: this.$store.state.commonData
    }
  },
  computed: {
    articles () {
      return this.rep
    }
  },
  metaInfo () {
    const title = 'section ' + this.$route.params.title
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
.section-story
  position: relative
  margin-bottom: 25px
.story-content
  box-sizing border-box
  width: 480px
  height: 280px
  padding: 15px
  background-color #fff
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.1)
  overflow: hidden
.story-content__brief
  font-size: 15px
  line-height: 1.4
  letter-spacing: .9px
  text-align: justify
  text-overflow: ellipsis
.story-img
  box-sizing border-box
  position: absolute
  top: 0
  right: 0
  width: 380px
  height: 280px
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.1)
  background-size: cover
</style>