<template>
  <section class="list-container">

    <div class="list-narrow">
      <router-link :to="getHref(article[0])" :id="'latest-'+ getName(article[0])"><div>
        <div class="list-narrow__img" 
          :style="{ backgroundImage: 'url(' + getImage(article[0], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[0])">
          <h2 v-text="getTitle(article[0].title)" :class="getSection(article[0])"></h2>
          <p v-text="getBrief(article[0], briefAmount)"></p>
        </div>
      </div></router-link>
      <router-link :to="getHref(article[1])" :id="'latest-'+ getName(article[1])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[1], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[1])">
          <h2 v-text="getTitle(article[1].title)" :class="getSection(article[1])"></h2>
          <p v-text="getBrief(article[1], briefAmount)"></p>
        </div>
      </div></router-link>
      <!-- <vue-dfp :is="props.vueDfp" pos="LPCNA7" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" v-if="hasDFP"/> -->
    </div>

    <router-link :to="getHref(article[2])" :id="'latest-'+ getName(article[2])" class="list-wide"><div class="list-wide__img" :style="{ backgroundImage: 'url(' + getImage(article[2], 'desktop') + ')' }">
      <div class="list-wide__title" :class="getSection(article[2])">
        <h2 v-text="getTitle(article[2].title)" :class="getSection(article[2])"></h2>
        <p v-text="getBrief(article[2], briefAmount)"></p>
      </div>
    </div></router-link>

    <div class="list-narrow">
      <router-link :to="getHref(article[3])" :id="'latest-'+ getName(article[3])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[3], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[3])">
          <h2 v-text="getTitle(article[3].title)" :class="getSection(article[3])"></h2>
          <p v-text="getBrief(article[3], briefAmount)"></p>
        </div>
      </div></router-link>
      <router-link :to="getHref(article[4])" :id="'latest-'+ getName(article[4])"><div>
        <div class="list-narrow__img"
          :style="{ backgroundImage: 'url(' + getImage(article[4], 'mobile') + ')' }"></div>
        <div class="list-narrow__title" :class="getSection(article[4])">
          <h2 v-text="getTitle(article[4].title)" :class="getSection(article[4])"></h2>
          <p v-text="getBrief(article[4], briefAmount)"></p>
        </div>
      </div></router-link>
    </div>

  </section>
</template>
<script>

import { getBrief, getHref, getImage, getName, getTruncatedVal } from '../../utils/comm'
import _ from 'lodash'
import truncate from 'truncate'

export default {
  name: 'articleCenter',
  data () {
    return {
    }
  },
  props: [ 'article', 'briefAmount', 'hasDFP', 'props' ],
  methods: {
    getBrief,
    getHref,
    getImage,
    getName,
    getTruncatedVal,
    getTitle (title) {
      return truncate(title, 19)
    },
    getSection (article) {
      return _.get(article, 'sections[0].name') ? _.get(article, 'sections[0].name') : 'other'
    }
  }
}

</script>
