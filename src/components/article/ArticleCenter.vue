<template>
  <section class="list-container">

    <div class="list-narrow">
      <router-link :to="getHref(article[5])"><div>
        <div class="list-narrow__img" 
          :style="{ backgroundImage: 'url(' + getImage(article[5], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[5])">
          <h2 v-text="getTitle(article[5].title)" :class="getSection(article[5])"></h2>
          <p v-text="getBrief(article[5], 42)"></p>
        </div>
      </div></router-link>
      <router-link :to="getHref(article[6])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[6], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[6])">
          <h2 v-text="getTitle(article[6].title)" :class="getSection(article[6])"></h2>
          <p v-text="getBrief(article[6], 42)"></p>
        </div>
      </div></router-link>
    </div>

    <router-link :to="getHref(article[7])" class="list-wide"><div class="list-wide__img" :style="{ backgroundImage: 'url(' + getImage(article[7], 'desktop') + ')' }">
      <div class="list-wide__title" :class="getSection(article[7])">
        <h2 v-text="getTitle(article[7].title)" :class="getSection(article[7])"></h2>
        <p v-text="getBrief(article[7], 42)"></p>
      </div>
    </div></router-link>

    <div class="list-narrow">
      <router-link :to="getHref(article[8])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[8], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[8])">
          <h2 v-text="getTitle(article[8].title)" :class="getSection(article[8])"></h2>
          <p v-text="getBrief(article[8], 42)"></p>
        </div>
      </div></router-link>
      <router-link :to="getHref(article[9])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[9], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[9])">
          <h2 v-text="getTitle(article[9].title)" :class="getSection(article[9])"></h2>
          <p v-text="getBrief(article[9], 42)"></p>
        </div>
      </div></router-link>
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
  name: 'articleCenter',
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
      return  _.get(article, 'sections[0].name') ? _.get(article, 'sections[0].name') : 'other'
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