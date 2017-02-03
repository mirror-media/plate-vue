<template>
  <section class="article-container">
    <div class="grid-1-fourth">
      
    </div>
    <div class="grid-2-fourth">
      
    </div>
    <div class="grid-1-fourth">
      
    </div>
  </section>
</template>
<script>

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
    
  },
  computed: {
    
  },
  methods: {
    
  },
  beforeMount () {
   
  },
  mounted() {
  }
}

</script>
<style lang="stylus" scoped>

.article-container
  > div
    float left
    height 100%

</style>