<template>
  <section class="latest-article-by-section">
    <h3 :style="{ borderLeftColor: sectionColor }" v-text="section.title"></h3>
    <div class="latest-article-by-section-container">
      <a
        :href="`/story/${highlight.slug}`"
        class="latest-article-by-section__img"
        data-gtm-category="home"
        data-gtm="latest_category"
        target="_blank">
        <LazyImage :src="highlightImage" :caption="highlight.title" />
      </a>
      <div class="latest-article-by-section__articles">
        <div v-for="(article, index) in articles" :key="article.id" class="article">
          <span v-text="index + 1"></span>
          <h3>
            <a
              :href="`/story/${article.slug}`"
              data-gtm-category="home"
              data-gtm="latest_category"
              target="_blank"
              v-text="article.title" ></a>
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import LazyImage from 'src/components/common/LazyImage.vue'
import { SECTION_MAP } from '../constants'
import { get } from 'lodash'

export default {
  name: 'LatestArticleBySection',
  props: {
    section: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    LazyImage,
  },
  computed: {
    articles () {
      return get(this.section, 'news')
    },
    highlight () {
      return this.articles[0]
    },
    highlightImage () {
      return get(this.articles, '0.heroImage.mobile.url', '/assets/mirrormedia/notImage.png')
    },
    sectionColor () {
      return get(SECTION_MAP, [ this.section.id, 'bgcolor' ])
    }
  }
}
</script>
<style lang="stylus" scoped>
.latest-article-by-section
  h3
    margin 0
    font-size 1rem
  > h3
    padding-left 10px
    color #808080
    border-left 10px solid #000

  &-container
    display flex
    margin-top 10px
  &__img
    display block
    position relative
    width 33%
    padding-top calc(33% * 0.6666)
    font-size 0
    img
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      width 100%
      height 100%
      object-fit cover
      object-position center center
  &__articles
    flex 1
    display flex
    flex-direction column
    margin-left 30px
    color #000
    .article
      flex 1
      display flex
      align-items center
      & + .article
        border-top 1px solid #d3d3d3
      span
        margin-right 10px
        color #808080
        font-size 2.5rem
      h3
        flex 1
        display flex
        align-items center
        a
          color #000
          line-height 1.4
</style>
