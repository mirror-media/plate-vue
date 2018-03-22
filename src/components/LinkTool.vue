<template>
    <router-link v-if="shouldShowItem(post)" :to="getHref(post)" :target="target">
      <slot name="content"></slot>
    </router-link>
    <a v-else :href="getHrefFull(post)" :target="target">
      <slot name="content"></slot>
    </a>
</template>
<script>
  import { getHref, getHrefFull } from '../util/comm'

  export default {
    name: 'LinkTool',
    data () {
      return {}
    },
    methods: {
      getHref,
      getHrefFull,
      shouldShowItem (article) {
        return article.style !== 'projects' && article.style !== 'campaign' && article.style !== 'readr'
      },
    },
    mounted () {},
    props: [ 'post', 'target' ]
  }
</script>
<style lang="stylus">
</style>