<template>
  <ProjectList :projects="projects" :viewport="viewport" />
</template>

<script>

import _ from 'lodash'
import ProjectList from '../components/article/ProjectList.vue'

const fetchProjects = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'projects' ] })
}

export default {
  name: 'project-list',
  components: {
    ProjectList
  },
  data () {
    return {
      viewport: undefined
    }
  },
  asyncData ({ store }) {
    return fetchProjects(store)
  },
  computed: {
    projects () {
      return _.get(this.$store.state, [ 'commonData', 'projects', 'items' ])
    }
  },
  methods: {
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.documentElement.clientWidth || document.body.clientWidth
      }
    }
  },
  mounted () {
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
  }
}

</script>

<style lang="stylus" scoped>

</style>
