<template>
  <header class="headerFull">
    
  </header>
</template>
<script>

import { SOCIAL_LINK } from '../constants/index'
import _ from 'lodash'

export default {
  name: 'header-full',
  props: {
    commonData: {},
  },
  data () {
    return {
      searchVal: '',
    }
  },
  methods: {
    search (searchVal = '') {
      this.$router.push('/search/'+ this.searchVal)
    }
  },
  computed: {
    headerItem () {
      
    },
    socialLink () {
      return SOCIAL_LINK
    }
  }
}

</script>
<style lang="stylus" scoped>


</style>
