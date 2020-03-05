<template>
  <ProjectSliderPresentational
    v-if="hasProjects"
    :is-style-dark="isStyleDark"
    :link-target="linkTarget"
    :projects="projects"
    @sendGaEvent="sendGaEvent"
  />
</template>
<script>
import { get } from 'lodash'
import { sendGaClickEvent } from 'src/util/comm'
import ProjectSliderPresentational from 'src/components/project/ProjectSliderPresentational.vue'

export default {
  name: 'ProjectSliderContainer',
  components: {
    ProjectSliderPresentational
  },
  props: {
    linkTarget: {
      type: String,
      default: '_blank'
    },
    projects: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    hasProjects () {
      return this.projects.length > 0
    },
    isStyleDark () {
      return get(this.$route, 'params.style') === 'dark'
    }
  },
  methods: {
    sendGaEvent () {
      sendGaClickEvent('article', 'projects')
    }
  }
}
</script>
