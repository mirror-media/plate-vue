<template>
  <div>
    <div v-html="content">
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  // import entities from 'entities'
  import store from '../store'
  const fetchArticles = (store) => {
    return store.dispatch('FETCH_ARTICLES', {
      params: {
        where: {
          '_id': store.state.route.params.id
        }
      }
    })
  }
  export default {
    name: 'questionnaire-view',
    preFetch: fetchArticles,
    data() {
      return {
        state: {}
      }
    },
    computed: {
      content() {
        const { brief, tags, title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return brief[ 'html' ]
      }
    },
    mounted() {
    },
    metaInfo() {
      const { brief , tags, title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
      // console.log(brief.html);
      // console.log(entities.decodeHTML(brief.html));
      return {
        title: title,
        meta: [
          { name: 'keywords', content: '關鍵字' },
          { name: 'description', content: '文章' },
          { name: 'section-id', content: '文章' },
          { name: 'category-id', content: '文章' },
          { name: 'topic-id', content: '文章' },
          { name: 'DFPIP', content: '文章' },
          { name: 'twitter:card', content: '文章' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: '文章' },
          { name: 'twitter:image', content: '文章' },
          { property: 'og:site_name', content: '鏡傳媒 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: '文章desc' },
          { property: 'og:url', content: '文章desc' },
          { property: 'og:image', content: '文章desc' },
        ]
      }
    }
  }

</script>
<style lang="stylus" scoped>
</style>
