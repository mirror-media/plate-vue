<template>
  <div class="headline">
    <HeaderR/>
    <!-- <Header :commonData="$store.state.commonData" /> -->
    <main>
      <iframe src="https://load-balancer.likr.com.tw/news_page_new/main_page/mirrormedia.php" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" id="Iframe">
      </iframe>
    </main>
    <section class="footer container">
      <Footer />
    </section>
  </div>
</template>
<script>

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import HeaderR from '../components/HeaderR.vue'
import titleMetaMixin from '../util/mixinTitleMeta'
import { FB_APP_ID, FB_PAGE_ID, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL } from '../constants'
import { get } from 'lodash'

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] })
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
  asyncData ({ store }) {
    return Promise.all([
      fetchCommonData(store),
      fetchPartners(store)
    ])
  },
  components: {
    Footer,
    Header,
    HeaderR
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    return {
      title: `今日頭條 - ${SITE_TITLE}`,
      meta: `
        <meta name="robots" content="index">
        <meta name="keywords" content="${SITE_KEYWORDS}">
        <meta name="description" content="${SITE_DESCRIPTION}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${SITE_TITLE}">
        <meta name="twitter:description" content="${SITE_DESCRIPTION}">
        <meta name="twitter:image" content="${SITE_OGIMAGE}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="${SITE_TITLE}">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${SITE_TITLE}">
        <meta property="og:description" content="${SITE_DESCRIPTION}">
        <meta property="og:url" content="${SITE_URL}">
        <meta property="og:image" content="${SITE_OGIMAGE}">
      `,
      custom: `
        <script src="https://load-balancer.likr.com.tw/news_page_new/css_and_js/include_iframe.js"><\/script>
        <link href="https://load-balancer.likr.com.tw/news_page_new/css_and_js/include_iframe.css" rel="stylesheet">
      `
    }
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
