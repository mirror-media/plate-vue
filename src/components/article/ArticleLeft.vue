<template>
  <section class="list-container">

    <article-wide :article="article[0]" :briefAmount="briefAmount" />

    <div class="list-narrow">
      <!-- <vue-dfp :is="props.vueDfp" pos="LPCNA12" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" v-if="hasDFP"/> -->
      <article-narrow :article="article[1]" :briefAmount="briefAmount" />
      <article-narrow :article="article[2]" :briefAmount="briefAmount" />
    </div>

    <div class="list-narrow">
      <article-narrow :article="article[3]" :briefAmount="briefAmount" />
      <article-narrow :article="article[4]" :briefAmount="briefAmount" />
    </div>

  </section>
</template>
<script>

import ArticleNarrow from './ArticleNarrow.vue'
import ArticleWide from './ArticleWide.vue'

export default {
  name: 'articleLeft',
  components: {
    'article-narrow': ArticleNarrow,
    'article-wide': ArticleWide
  },
  props: [ 'article', 'briefAmount', 'hasDFP', 'props' ]
}

</script>
