<template>
  <UIWideLayout>
    <a
      class="logo"
      href="https://www.mirrormedia.mg/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://www.mirrormedia.mg/assets/mirrormedia/icon/logo_black.svg"
        alt="鏡週刊 Mirror Media"
      >
    </a>
    <UIWideIndex
      v-show="isMounted"
      :current="current"
      :items="indexes"
      :openIndex="openIndex"
      @closeIndex="openIndex = false"
      @scrollTo="handleScrollTo"
      @openIndex="openIndex = true"
    />
    <UIWideIntro :article="article" />
    <UIWideArticle :content="article.content" />
    <UIWideRelateds
      v-if="hasRelateds"
      :items="relateds"
    />
    <UIWideUpdatedAt
      v-if="updatedAt"
      :updatedAt="updatedAt"
    />
  </UIWideLayout>
</template>

<script>
import { get, throttle } from 'lodash'
import { mapState } from 'vuex'
import { smoothScroll } from 'kc-scroll'
import UIWideArticle from './UIWideArticle.vue'
import UIWideIndex from './UIWideIndex.vue'
import UIWideIntro from './UIWideIntro.vue'
import UIWideLayout from './UIWideLayout.vue'
import UIWideRelateds from './UIWideRelateds.vue'
import UIWideUpdatedAt from './UIWideUpdatedAt.vue'
import sanitizeHtml from 'sanitize-html'

export default {
  name: 'ContainerArticleWide',
  components: {
    UIWideArticle,
    UIWideIndex,
    UIWideIntro,
    UIWideLayout,
    UIWideRelateds,
    UIWideUpdatedAt
  },
  data () {
    return {
      current: 0,
      initialized: false,
      isMounted: false,
      openIndex: false
    }
  },
  computed: {
    ...mapState({
      articleRawData: state => get(state, 'articles.items.0', {}),
      relatedImages: state => get(state, 'imagesById', [])
    }),
    article () {
      return this.restructureArticle(this.articleRawData)
    },
    hasRelateds () {
      return this.relateds.length > 0
    },
    indexes () {
      const content = this.article.content || []
      return content
        .filter((item) => get(item, 'content.0') && item.type === 'header-one')
        .map((item) => ({
          id: item.id,
          content: sanitizeHtml(item.content[0], { allowedTags: [] })
        }))
    },
    relateds () {
      const items = this.article.relateds || []
      return items.map(item => Object.assign({
        image: this.relatedImages.find(image => image.id === item.heroImage)
      }, item))
    },
    updatedAt () {
      return this.article.updatedAt
    }
  },
  mounted () {
    this.isMounted = true
    window.addEventListener('load', () => {
      this.detectCurrent()
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('resize', this.handleResize)
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    detectCurrent () {
      const items = [...document.querySelectorAll('.wide-article > h2')]
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      this.current = 0
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect()
        if (rect.top <= viewportHeight) {
          this.current = index + 1
        }
      })
      this.initialized = true
    },
    getBrief (briefApiData) {
      return briefApiData
        .filter((paragraph) => paragraph.type === 'unstyled')
        .reduce((acc, cur) => `${acc}<p>${get(cur, 'content.0')}</p>`, '')
    },
    handleResize: throttle(function () {
      this.detectCurrent()
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth
      if (viewportWidth >= 1200) {
        this.openIndex = false
      }
    }, 300),
    handleScroll: throttle(function () {
      this.detectCurrent()
    }, 300),
    handleScrollTo (id) {
      smoothScroll(`#header-${id}`)
    },
    processItemsName (items = []) {
      return items.map((item) => item.name).join(' ')
    },
    restructureArticle (article) {
      return {
        brief: this.getBrief(get(article, 'brief.apiData'), {}),
        cameraMan: this.processItemsName(article.cameraMan),
        content: get(article, 'content.apiData'),
        extendByline: article.extendByline,
        heroImage: get(article, 'heroImage.image.resizedTargets', {}),
        photographers: this.processItemsName(article.photographers),
        publishedDate: article.publishedDate,
        relateds: (article.relateds || []),
        title: article.title,
        updatedAt: article.updatedAt,
        writers: this.processItemsName(article.writers)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.logo {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 900;
  width: 44px;
  img {
    display: block;
    width: 100%;
  }
}

</style>
