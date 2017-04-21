<template>
  <section class="list-container">

    <div class="list-narrow">
      <article-narrow :article="article[0]" :briefAmount="briefAmount" />
      <article-narrow :article="article[1]" :briefAmount="briefAmount" />    
    </div>

    <div class="list-narrow">
      <article-narrow :article="article[2]" :briefAmount="briefAmount" />
      <article-narrow :article="article[3]" :briefAmount="briefAmount" />
      <!-- <vue-dfp :is="props.vueDfp" pos="LPCNA4" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" v-if="hasDFP"/> -->
    </div>

    <article-wide :article="article[4]" :briefAmount="briefAmount" />

  </section>
</template>
<script>

import ArticleNarrow from './ArticleNarrow.vue'
import ArticleWide from './ArticleWide.vue'

export default {
  name: 'articleRight',
  components: {
    'article-narrow': ArticleNarrow,
    'article-wide': ArticleWide
  },
  props: [ 'article', 'briefAmount', 'hasDFP', 'props' ]
}

</script>
