<template>
  <section class="articleList container">

    <template v-for="(item, index) in articles">
      <listArticle-block :index="index" :initialArticle="item" :initialTogglePause="togglePause" v-on:pauseAllAudio="pauseAllAudio" :key="getValue(item, [ 'id' ], Date.now())"/>
      <slot :name="`microAd${getMicroAdName(index)}`" v-if="(index === 1 || index === 2 || index === 5) && hasDFP"></slot>
    </template>
    
  </section>
</template>

<script>

import { getValue } from '../util/comm'
import ListArticleBlock from './list/ListArticleBlock.vue'

export default {
  name: 'articleList',
  components: {
    'listArticle-block': ListArticleBlock
  },
  props: [ 'articles', 'hasDFP', 'currEnv' ],
  data () {
    return {
      togglePause: undefined
    }
  },
  methods: {
    getMicroAdName (index) {
      return index === 1 ? 0 : index === 2 ? 1 : 2
    },
    getValue,
    pauseAllAudio (index) {
      this.togglePause = index
    }
  }
}
</script>
<style lang="stylus" scoped>

.articleList
  &.container
    flex-direction column
    flex-wrap wrap
    margin-top .5em

  &__dfp
    &--l1
      width calc( 100% - 20px )
      margin 0 10px 40px

.nativeDFP
  width 100%
  margin-bottom 40px
  background-color #f4f1e9
  box-shadow 5px 5px 5px #bcbcbc
  transition all .3s ease-in-out

@media (min-width: 600px)
  .articleList
    &.container
      flex-direction row
      justify-content flex-start
      width calc(100% - 30px)
    
  .nativeDFP
    width calc( (100% - 40px) / 2 )
    margin 0 10px 40px
    &:hover
      transform translateY(-20px)
      box-shadow 5px 15px 5px #bcbcbc

@media (min-width: 1200px)
  .articleList
    &.container
      width 1044px
  .nativeDFP
    width calc( (100% - 60px) / 3 )
  

</style>
