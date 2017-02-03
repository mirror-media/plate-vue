<template>
  <section class="latestArticle grid grid-4-fifth">
    <article-center />
  </section>
</template>
<script>

import _ from 'lodash'
import ArticleCenter from '../components/article/ArticleCenter.vue'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export default {
  name: 'latestArticle',
  components: {
    'article-center': ArticleCenter,
  },
  data () {
    return {
    }
  },
  props: {
    latestArticle: this.latestArticle
  },
  computed: {
    
  },
  methods: {
    
  },
  beforeMount () {
   
  },
  mounted() {
  }
}

</script>
<style lang="stylus" scoped>

.latestArticle
  margin 20px 0

.article-container
  width 100%
  height 350px

</style>