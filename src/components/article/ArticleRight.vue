<template>
  <section class="list-container">

    <div class="list-narrow">
      <a :href="getHref(article[0])"><div>
        <div class="list-narrow__img" 
          :style="{ backgroundImage: 'url(' + article[0].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[0])"><h2 v-text="getTitle(article[0].title)"></h2></div>
      </div></a>
      <template v-if="index === 0">
        <slot name="DFPAD1"></slot>      
      </template>
      <template v-else-if="index > 0">
        <a :href="getHref(article[1])">
          <div>
            <div class="list-narrow__img"
              :style="{ backgroundImage: 'url(' + article[1].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
            <div class="list-narrow__title" :class="getSection(article[1])"><h2 v-text="getTitle(article[1].title)"></h2></div>
          </div>
        </a>       
      </template>      
    </div>

    <div class="list-narrow">
      <a :href="getHref(article[2])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + article[2].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[2])"><h2 v-text="getTitle(article[2].title)"></h2></div>
      </div></a>
      <a :href="getHref(article[3])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + article[3].heroImage.image.resizedTargets.mobile.url + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[3])"><h2 v-text="getTitle(article[3].title)"></h2></div>
      </div></a>
    </div>

     <a :href="getHref(article[4])" class="list-wide"><div class="list-wide__img" :style="{ backgroundImage: 'url(' + article[4].heroImage.image.resizedTargets.desktop.url + ')' }">
      <div class="list-wide__title" :class="getSection(article[4])" v-text="article[4].title"></div>
    </div></a>

  </section>
</template>
<script>

import { getHref, getTruncatedVal } from '../../utils/comm'
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