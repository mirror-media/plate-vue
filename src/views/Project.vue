<template>
  <ProjectList :projects="projects" :viewport="viewport" :class="projectClass" target="_blank" :excludingProjects="excludingProjects" />
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
    excludingProjects () {
      return _.get(this.$store, [ 'state', 'route', 'query', 'excluding' ], '').split(',')
    },
    projects () {
      return _.get(this.$store.state, [ 'commonData', 'projects', 'items' ])
    },
    projectClass () {
      const isStyleLight = _.get(this.$store, [ 'state', 'route', 'params', 'style' ], 'light') !== 'dark'
      return {
        light: isStyleLight,
        dark: !isStyleLight
      }
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

<style lang="stylus">
body
  background-color transparent
.project-container
  &.dark
    background-color #000
    > .proj_list
      border none
      > .swiper-container
        > .swiper-wrapper
          > .swiper-slide
            > .proj_item
              border-left 1px solid rgba(255, 255, 255, 0.49)
              background-color #000
              > .proj_item_title
                background-color #000
                > a
                  color rgba(255, 255, 255, 0.8)
              > .proj_item_desc
                background-color #000
                > a
                  color rgba(255, 255, 255, 0.8)
    > .slide-nav-btn
      opacity 0.75    
      &.prev
        background-image url(/public/icon/B-left-white.png)
      &.next
        background-image url(/public/icon/B-right-white.png)
      &:hover
        opacity 1



</style>
