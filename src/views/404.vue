<template>
  <div class="notFound-view">
    <div class="notFound__img">
      <img src="/public/404.jpg" alt="404 Not Found">
    </div>
  </div>
</template>

<script>

import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../constants'

export default {
  name: 'notFound-view',
  metaInfo () {
    const title = SITE_TITLE
    const description = SITE_DESCRIPTION

    return {
      title,
      meta: [
          { name: 'keywords', content: '鏡週刊,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說' },
          { name: 'description', content: description },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: '/public/notImage.png' },
          { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:url', content: SITE_URL },
          { property: 'og:image', content: '/public/notImage.png' }
      ]
    }
  },
  mounted () {
    window.ga('send', 'pageview', this.$route.path, { title: '404 - Page Not Found' })
    setTimeout(() => {
      this.$router.push('/')
    }, 3000)
  }
}

</script>
<style lang="stylus" scoped>

.notFound-view
  display flex
  justify-content center
  align-items center
  width 100vw
  height 100vh
  background-color #2c5970

.notFound__img
  width 100%
  > img
    width 100%

</style>
