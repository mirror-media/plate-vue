<template>
  <section class="list-container">

    <div class="list-narrow">
      <a :href="getHref(article[0])"><div>
        <div class="list-narrow__img" 
          :style="{ backgroundImage: 'url(' + getImage(article[0], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[0])">
          <h2 v-text="getTitle(article[0].title)" :class="getSection(article[0])"></h2>
          <p v-text="getBrief(article[0], 42)"></p>
        </div>
      </div></a>
      <a :href="getHref(article[1])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[1], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[1])">
          <h2 v-text="getTitle(article[1].title)" :class="getSection(article[1])"></h2>
          <p v-text="getBrief(article[1], 42)"></p>
        </div>
      </div></a>       
    </div>

    <div class="list-narrow">
      <a :href="getHref(article[2])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[2], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[2])">
          <h2 v-text="getTitle(article[2].title)" :class="getSection(article[2])"></h2>
          <p v-text="getBrief(article[2], 42)"></p>
        </div>
      </div></a>
      <a :href="getHref(article[3])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[3], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[3])">
          <h2 v-text="getTitle(article[3].title)" :class="getSection(article[3])"></h2>
          <p v-text="getBrief(article[3], 42)"></p>
        </div>
      </div></a>
    </div>

     <a :href="getHref(article[4])" class="list-wide"><div class="list-wide__img" :style="{ backgroundImage: 'url(' + getImage(article[4], 'desktop') + ')' }">
      <div class="list-wide__title" :class="getSection(article[4])">
        <h2 :class="getSection(article[4])" v-text="getTitle(article[4].title)"></h2>
        <p v-text="getBrief(article[4], 42)"></p>
      </div>
    </div></a>

  </section>
</template>
<script>

import { getBrief, getHref, getImage, getTruncatedVal } from '../../utils/comm'
import _ from 'lodash'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export default {
  name: 'articleRight',
  data () {
    return {
    }
  },
  props: {
    article: {},
    index: 0
  },
  computed: {
    
  },
  methods: {
    getBrief,
    getHref,
    getImage,
    getTruncatedVal,
    getTitle(title) {
      return truncate(title, 14)
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