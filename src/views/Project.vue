<template>
  <ProjectSliderContainer :projects="filteredProjects" />
</template>

<script>
import { get } from 'lodash'
import ProjectSliderContainer from 'src/components/project/ProjectSliderContainer.vue'

const fetchProjects = store => store.dispatch('FETCH_COMMONDATA', { endpoints: ['projects'] })

export default {
  name: 'ProjectList',
  components: {
    ProjectSliderContainer
  },
  asyncData ({ store }) {
    return fetchProjects(store)
  },
  computed: {
    excludingProjects () {
      return get(this.$route, 'query.excluding', '').split(',')
    },
    filteredProjects () {
      return this.projects.filter(project => !this.excludingProjects.some(item => item === project.slug))
    },
    projects () {
      return get(this.$store, 'state.commonData.projects.items')
    }
  }
}
</script>
