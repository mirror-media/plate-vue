<template>
  <section class="articleListLight">
    <div class="listContainer">
      <template v-for="item in articles">
        <list-article-block-light :key="item.id" :article="item" :viewport="viewport"></list-article-block-light>
      </template>
    </div>
    <latest-list :latest="latest" v-if="showLatestList"/>
  </section>
</template>

<script>

import LatestList from './article/LatestList.vue'
import ListArticleBlockLight from './list/ListArticleBlockLight.vue'

export default {
  name: 'ArticleListLight',
  components: {
    'latest-list': LatestList,
    'list-article-block-light': ListArticleBlockLight
  },
  props: {
    articles: {
      type: Array,
      required: true
    },
    latest: {
      type: Array,
      required: true
    },
    showLatest: {
      type: Boolean,
      default: false
    },
    viewport: {
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    showLatestList () {
      return this.showLatest && this.viewport >= 900
    }
  }
}
</script>
<style lang="stylus" scoped>

.articleListLight
  margin-top .5em

@media (min-width: 900px)
  .articleListLight
    display flex
    justify-content space-between
    width 768px
    margin 0 auto
  .listContainer
    width calc(100% - 360px)
    margin-top 20px

@media (min-width: 1200px)
  .articleListLight
    width 1024px
</style>
