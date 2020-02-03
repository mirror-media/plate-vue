<template>
  <div class="headline">
    <Header />
    <main>
      <iframe
        id="Iframe"
        src="https://load-balancer.likr.com.tw/news_page_new/main_page/mirrormedia.php"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        frameborder="0"
      />
    </main>
    <section class="footer container">
      <Footer />
    </section>
  </div>
</template>
<script>

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import { get } from 'lodash'

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { endpoints: ['sectionfeatured', 'sections', 'topics'] })
}

const fetchPartners = (store) => {
  const page = get(store.state, 'partners.meta.page', 0) + 1
  return store.dispatch('FETCH_PARTNERS', {
    params: {
      max_results: 25,
      page: page
    }
  }).then(() => {
    if (get(store.state, 'partners.items.length') < get(store.state, 'partners.meta.total')) {
      return fetchPartners(store)
    }
  })
}

export default {
  name: 'HeadlinePage',
  components: {
    Footer,
    Header
  },
  asyncData ({ store }) {
    return Promise.all([
      fetchCommonData(store),
      fetchPartners(store)
    ])
  },
  metaInfo: {
    title: '今日頭條',
    meta: [
      { name: 'robots', content: 'index' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://load-balancer.likr.com.tw/news_page_new/css_and_js/include_iframe.css' }
    ],
    script: [
      { src: 'https://load-balancer.likr.com.tw/news_page_new/css_and_js/include_iframe.js' }
    ]
  }
}
</script>
<style lang="stylus" scoped>
.headline
  main
    width 90%
    margin 0 auto

@media (min-width: 600px)
  .headline
    main
      width calc(100% - 4rem)

@media (min-width: 1200px)
  .headline
    main
      width 1024px

</style>
