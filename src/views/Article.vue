<template>
  <div>
    <div><h2>{{ title }}</h2></div>
    <div>credit: {{ credit }}</div>
    <div v-html="content">
    </div>
    <div>相關新聞：</div>
    <div v-for="(o, i) in relateds">
      - <a href="">{{ o.title }}</a>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import sanitizeHtml from 'sanitize-html'
  import store from '../store'
  import truncate from 'truncate'

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
        const { brief, content : { apiData = [] }, tags, title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        const paragraph = apiData.map((o) => {
          return (o.type === 'unstyled') ? o.content.toString() : null
        })
        return '<p>' + paragraph.join('<p/><p>')
      },
      credit() {
        const { cameraMan, designers, engineers, photographers, writers } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        const credit = [ cameraMan, designers, engineers, photographers, writers ].map((o) => {
          const names = (o.length > 0) ? o.map((i) => (i.name)) : 0
          return (names.length > 0) ? names.join('、') : null
        })
        let creditStr = ''
        for(let i in credit) {
          if(credit[ i ]) {
            creditStr += ' ' + credit[ i ]
          }
        }
        return creditStr
      },
      relateds() {
        const { relateds } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return relateds
      },
      title() {
        const { title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return title
      },
    },
    mounted() {
    },
    metaInfo() {
      const { brief, categories, dfpId, fbAppId, fbPagesId, heroImage, id, ogDescription, ogImage, ogTitle, sections, tags, title, topics } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
      const categorieId = _.get(categories, [ 0, 'id' ], '')
      const imageUrl = _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const ogImageUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const pureBrief = truncate(sanitizeHtml(_.get(brief, [ 'html' ], ''), { allowedTags: [ 'em' ] }), 200)
      const pureTags = tags.map((t) => (t.name))
      const sectionId = _.get(sections, [ 0, 'id' ], '')
      const topicId = _.get(topics, [ '_id' ], '')

      return {
        title: title,
        meta: [
          { name: 'keywords', content: '鏡週刊,鏡傳媒,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說,' + pureTags.toString() },
          { name: 'description', content: pureBrief },
          { name: 'section-id', content: sectionId },
          { name: 'category-id', content: categorieId },
          { name: 'topic-id', content: topicId },
          { name: 'DFPIP', content: dfpId },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: (ogTitle.length > 0) ? ogTitle : title },
          { name: 'twitter:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { name: 'twitter:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
          { property: 'fb:app_id', content: fbAppId },
          { property: 'fb:pages', content: fbPagesId },
          { property: 'og:site_name', content: '鏡傳媒 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: (ogTitle.length > 0) ? ogTitle : title },
          { property: 'og:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { property: 'og:url', content: '/posts/' + id },
          { property: 'og:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
        ]
      }
    }
  }

</script>
<style lang="stylus" scoped>
</style>
