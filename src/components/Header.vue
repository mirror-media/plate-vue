<template>
  <div class="header">
    <div class="inner">
      <router-link to="/" exact>
        <img class="logo" src="~public/favicon-48x48.png" alt="logo">
      </router-link>
      <router-link to="/top" v-for="item in headerItem" v-html="item"></router-link>
    </div>
  </div>
</template>

<script>

import _ from 'lodash'

export default {
  name: 'app-header',
  props: {
    commonData: {},
  },
  computed: {
    headerItem() {
      let headerItem = []
      _.forEach(this.commonData.sectionList.endpoints.sections.items, (s) => {
        headerItem.push(s.title)
      })
      _.forEach(this.commonData.topic.items, (t) => {
        //console.log('tt', t)
        t.isFeatured ? headerItem.push(t.name) : ''
      })
      return headerItem
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
  background-color #e5e5e5
  position fixed
  z-index 999
  height 55px
  top 0
  left 0
  right 0
  .inner
    max-width 800px
    box-sizing border-box
    margin 0px auto
    padding 15px 5px
  a
    color rgba(0, 0, 0, .5)
    line-height 24px
    transition color .15s ease
    display inline-block
    vertical-align middle
    font-weight 300
    letter-spacing .075em
    margin-right 1.8em
    &:hover
      color #000
    &.router-link-active
      color #000
      font-weight 400
    &:nth-child(8)
      margin-right 0

.logo
  width 24px
  margin-right 10px
  display inline-block
  vertical-align middle

@media (max-width 860px)
  .header .inner
    padding 15px 30px

@media (max-width 600px)
  body
    font-size 14px
  .header
    .inner
      padding 15px
    a
      margin-right 1em
    .github
      display none  
</style>