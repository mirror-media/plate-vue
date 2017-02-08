<template>
  <section class="list-container">

    <a :href="getHref(article[10])" class="list-wide"><div class="list-wide__img" :style="{ backgroundImage: 'url(' + article[10].heroImage.image.resizedTargets.desktop.url + ')' }">
      <div class="list-wide__title" :class="getSection(article[10])" v-text="article[10].title"></div>
    </div></a>

    <div class="list-narrow">
      <a :href="getHref(article[11])"><div>
        <div class="list-narrow__img" 
          :style="{ backgroundImage: 'url(' + article[11].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[11])"><h2 v-text="getTitle(article[11].title)"></h2></div>
      </div></a>
      <a :href="getHref(article[12])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + article[12].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[12])"><h2 v-text="getTitle(article[12].title)"></h2></div>
      </div></a>
    </div>

    <div class="list-narrow">
      <a :href="getHref(article[13])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + article[13].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[13])"><h2 v-text="getTitle(article[13].title)"></h2></div>
      </div></a>
      <a :href="getHref(article[14])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + article[14].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[14])"><h2 v-text="getTitle(article[14].title)"></h2></div>
      </div></a>
    </div>

  </section>
</template>
<script>

import { getHref, getTruncatedVal } from '../../utils/comm'
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
    article: this.article
  },
  computed: {
    
  },
  methods: {
    getHref,
    getTruncatedVal,
    getTitle(title) {
      return truncate(title, 22)
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