<template>
  <div>
    <div v-html="content">
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import sanitizeHtml from 'sanitize-html'
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
      const { brief, id, tags, title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
      const pureBrief = sanitizeHtml(_.get(brief, [ 'html' ], ''), { allowedTags: [ 'em' ] })
      const pureTags = tags.map((t) => (t.name))
      console.log(pureTags);
      // console.log(brief.html);
      // console.log(entities.decodeHTML(brief.html));
      console.log(sanitizeHtml(brief.html, { allowedTags: [ 'em' ] }));
      return {
        title: title,
        meta: [
          { name: 'keywords', content: pureTags.toString() },
          { name: 'description', content: pureBrief },
          { name: 'section-id', content: '文章' },
          { name: 'category-id', content: '文章' },
          { name: 'topic-id', content: '文章' },
          { name: 'DFPIP', content: '文章' },
          { name: 'twitter:card', content: '文章' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: pureBrief },
          { name: 'twitter:image', content: '文章' },
          { property: 'og:site_name', content: '鏡傳媒 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: pureBrief },
          { property: 'og:url', content: '/posts/' + id },
          { property: 'og:image', content: '' },
        ]
      }
    }
  }

</script>
<style lang="stylus" scoped>
</style>
