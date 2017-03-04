<template>
  <section class="list-container">

    <div class="list-narrow">
      <a :href="getHref(article[5])"><div>
        <div class="list-narrow__img" 
          :style="{ backgroundImage: 'url(' + article[5].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[5])"><h2 v-text="getTitle(article[5].title)"></h2></div>
      </div></a>
      <a :href="getHref(article[6])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + article[6].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[6])"><h2 v-text="getTitle(article[6].title)"></h2></div>
      </div></a>
    </div>

    <a :href="getHref(article[7])" class="list-wide"><div class="list-wide__img" :style="{ backgroundImage: 'url(' + article[7].heroImage.image.resizedTargets.desktop.url + ')' }">
      <div class="list-wide__title" :class="getSection(article[7])" v-text="article[7].title"></div>
    </div></a>

    <div class="list-narrow">
      <a :href="getHref(article[8])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + article[8].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[8])"><h2 v-text="getTitle(article[8].title)"></h2></div>
      </div></a>
      <a :href="getHref(article[9])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + article[9].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[9])"><h2 v-text="getTitle(article[9].title)"></h2></div>
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
    getHref,
    getTruncatedVal,
    getTitle(title) {
      return truncate(title, 22)
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