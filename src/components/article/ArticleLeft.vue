<template>
  <section class="list-container">

    <a :href="getHref(article[10])" class="list-wide"><div class="list-wide__img" :style="{ backgroundImage: 'url(' + getImage(article[10], 'desktop') + ')' }">
      <div class="list-wide__title" :class="getSection(article[10])">
        <h2 v-text="getTitle(article[10].title)" :class="getSection(article[10])"></h2>
        <p v-text="getBrief(article[10], 43)"></p>
      </div>
    </div></a>

    <div class="list-narrow">
      <a :href="getHref(article[11])"><div>
        <div class="list-narrow__img" 
          :style="{ backgroundImage: 'url(' + getImage(article[11], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[11])">
          <h2 v-text="getTitle(article[11].title)" :class="getSection(article[11])"></h2>
          <p v-text="getBrief(article[11], 42)"></p>
        </div>
      </div></a>
      <a :href="getHref(article[12])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[12], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[12])">
          <h2 v-text="getTitle(article[12].title)" :class="getSection(article[12])"></h2>
          <p v-text="getBrief(article[12], 42)"></p>
        </div>
      </div></a>
    </div>

    <div class="list-narrow">
      <a :href="getHref(article[13])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[13], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[13])">
          <h2 v-text="getTitle(article[13].title)" :class="getSection(article[13])"></h2>
          <p v-text="getBrief(article[13], 42)"></p>
        </div>
      </div></a>
      <a :href="getHref(article[14])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[14], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[14])">
          <h2 v-text="getTitle(article[14].title)" :class="getSection(article[14])"></h2>
          <p v-text="getBrief(article[14], 42)"></p>
        </div>
      </div></a>
    </div>

  </section>
</template>
<script>

import { getBrief, getHref, getImage, getTruncatedVal } from '../../utils/comm'
import _ from 'lodash'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export default {
  name: 'articleLeft',
  data () {
    return {
    }
  },
  props: {
    article: {}
  },
  computed: {
    
  },
  methods: {
    getBrief,
    getHref,
    getImage,
    getTruncatedVal,
    getTitle(title) {
      return truncate(title, 20)
    },
    getSection(article) {
      return  _.get(article, 'sections[0].name') ? _.get(article, 'sections[0].name') : ' '
    }
  },
  beforeMount () {
   
  },
  mounted() {
  }
}

</script>
<style lang="stylus" scoped>

</style>