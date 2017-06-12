<template v-if="getArticleStyle(article) !== 'projects'">
  <router-link :to="getHref(article)" :id="'latest-'+ getName(article)"><div>
    <div class="list-narrow__img" 
      :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></div>
    <div class="list-narrow__title" :class="getSection(article)">
      <h2 v-text="getTitle(article.title)" :class="getSection(article)"></h2>
      <p v-text="getBrief(article, briefAmount)"></p>
    </div>
  </div></router-link>
</template>
<template v-if="getArticleStyle(article) === 'projects'">
  <a :href="`https://www.mirrormedia.mg${getHref(article)}`" :id="'latest-'+ getName(article)" v-if=""><div>
    <div class="list-narrow__img" 
      :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></div>
    <div class="list-narrow__title" :class="getSection(article)">
      <h2 v-text="getTitle(article.title)" :class="getSection(article)"></h2>
      <p v-text="getBrief(article, briefAmount)"></p>
    </div>
  </div></a>
</template>
<script>

import { getBrief, getHref, getImage, getName } from '../../util/comm'
import _ from 'lodash'
import truncate from 'truncate'

export default {
  name: 'articleNarrow',
  props: [ 'article', 'briefAmount' ],
  methods: {
    getArticleStyle (article) {
      return _.get(article, [ 'style' ])
    },
    getBrief,
    getHref,
    getImage,
    getName,
    getTitle (title) {
      return truncate(title, 19)
    },
    getSection (article) {
      return _.get(article, 'sections[0].name') ? _.get(article, 'sections[0].name') : 'other'
    }
  }
}

</script>
