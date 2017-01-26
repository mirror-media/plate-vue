<template>
  <section class="container">
    <div class="headline align-right">
      <div class="headline-content grid grid-2">
        <h1 v-text="getTitle(article[0], 40)"></h1>
        <p class="headline-content__brief" v-text="getBrief(article[0], 150)"></p>
        <p class="headline-content__writers" v-text="getWriters(article[0])"></p>
        <p class="headline-content__date" v-text=""></p>
      </div>
      <div class="headline__img grid grid-3" :style="{ backgroundImage: 'url(' + article[0].heroImage.image.url + ')' }"></div>
    </div>
    <div class="choices">
      <div class="grid grid-3" :style="{ backgroundImage: 'url(' + article[1].heroImage.image.url + ')' }">
        <div class="choices__content">
          <h2 v-text="article[1].title"></h2>
        </div>
      </div>
      <div class="grid grid-1">
        <div class="choices__img" :style="{ backgroundImage: 'url(' + article[2].heroImage.image.url + ')' }"></div>
        <div class="choices__text">
          <h3 v-text="getTitle(article[2], 30)"></h3>
          <p v-text="getBrief(article[2], 45)"></p>
        </div>
      </div>
      <div class="grid grid-1">
        <div class="choices__img" :style="{ backgroundImage: 'url(' + article[3].heroImage.image.url + ')' }"></div>
        <div class="choices__text">
          <h3 v-text="getTitle(article[3], 30)"></h3>
          <p v-text="getBrief(article[3], 45)"></p>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import _ from 'lodash'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export default {
  name: 'editorChoice',
  data () {
    return {
      // article: [],
    }
  },
  props: {
    editorChoice: {},
  },
  computed: {
    article() {
      let section = this.$route.params.title
      let article = _.get(this.editorChoice.items, [ section ])
      return article
    }
  },
  methods: {
    getTitle: function(article, words) {
      return truncate( _.get(article, [ 'title' ]), words)
    },
    getBrief: function(article , words) {
      let brief = sanitizeHtml( _.get(article, [ 'brief','html' ]), { allowedTags: [ ] })
      let content = sanitizeHtml( _.get(article, [ 'content','html' ]), { allowedTags: [ ] })
      let briefContent = (brief.length >0) ? brief : content
      return truncate(briefContent, words)
    },
    getWriters: function(article) {
      let writers = '文｜' + _.map(article.writers, (n)=> { return _.get(n, [ 'name' ], null) } ).join('、')
      return writers
    },
    getDate: function(article) {
      return moment(_.get(article, [ 'publishedDate' ])).format('MMM. DD, YYYY')
    }
  },
  beforeMount () {
    // let section = this.$route.params.title
    // let article = _.get(this.editorChoice.items, [ section ])
    // //console.log(Math.random())
    // this.article = article
  },
  mounted() {
    // this.style = article
  }
}

</script>
<style lang="stylus" scoped>

section, div
  box-sizing border-box

a, p, h1, h2, h3 {
  font-family "Songti TC", "LiSong Pro", "NSimSun", serif
}

.container
  width 100%
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin 0 auto

.grid
  padding 0 1em

.grid-1
  width calc(100% / 5)

.grid-2
  width calc(100% / 5 * 2)

.grid-3
  width calc(100% / 5 * 3)

.grid-4
  width calc(100% / 5 * 4)

.headline
  position: relative
  width 105%
  height 350px

  &-content
    position relative
    z-index 110
    float left
    height 100%
    padding-left 0

    h1
      width 120%
      color #000
      font-size 1.8em
      font-family "Songti TC", "LiSong Pro", "NSimSun", serif
      font-weight 700
    p
      padding 0 40px 0 0
      font-family "Songti TC", "LiSong Pro", "NSimSun", serif
      line-height 23px
      text-align justify

    &__brief
      margin 1em 0

    &__writers
      margin 0.3em 0

    &__date
      margin 0.3em 0

  &__img
    position relative
    z-index 100
    float left
    height 100%
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover

.choices
  width 100%
  height 350px
  margin-top 30px

  > div
    float left
    height 100%

  .grid-3
    position relative
    width calc(100% / 5 * 3 - 1em)
    margin-right 1em
    background-position 0% 50%
    background-repeat no-repeat
    background-size cover

  &__content
    position absolute
    bottom 0
    width calc(100% / 3)
    height calc(100% / 3 * 2)
    margin-left -1em
    font-size 1em
    font-family "Songti TC", "LiSong Pro", "NSimSun", serif
    background-color #fff

    h2
      position absolute
      bottom 0

  &__img
    height calc(100% / 3)
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover

  &__text
    h3
      font-size 1em

@media (min-width 600px)
  .container
    width 100%

@media (min-width 900px)
  .container
    width 100%
@media (min-width 1200px)
  .container
    width 1024px
@media (min-width 1800px)
  .container
    width 1024px
</style>