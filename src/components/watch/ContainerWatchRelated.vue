<template>
  <UIWatchRelated
    :slug="post.slug"
    :published-date="publishedDate"
    :title="post.title"
  />
</template>
<script>

import UIWatchRelated from './UIWatchRelated.vue'
import moment from 'moment'

export default {
  name: 'ContainerWatchRelated',
  components: {
    UIWatchRelated
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    publishedDate () {
      return moment(new Date(this.post.publishedDate)).format('YYYY/MM/DD')
    }
  }
}
</script>
