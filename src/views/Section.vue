<template>
  <div class="section-view">
    <app-Header :commonData= 'commonData' />
    <div class="section-story" v-for="item in articles" :id="item.id">
      <div class="story-content">
        <a :href="'https://www.mirrormedia.mg/story/'+ item.slug"><h2 v-html="item.title"/></a>
        <div class="story-content__brief" v-html="item.brief.html"></div>
      </div>
      <a :href="'https://www.mirrormedia.mg/story/'+ item.slug">
        <div class="story-img" :style="'background-image:url(' + item.heroImage.image.resizedTargets.desktop.url +')'">
        </div>
      </a>
    </div>
  </div>
</template>

<script>

import _ from 'lodash'
import Header from '../components/Header.vue'
import truncate from 'truncate'

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { })
}

export default {
  name: 'section-view',
  preFetch: fetchCommonData,
  components: {
    'app-Header': Header,
  },
  data () {
    return {
      state: {}
    }
  },
  computed: {
    articles () {
      return this.rep
    },
    commonData() {
      return this.$store.state.commonData
    }
  },
  metaInfo () {
    const title = 'section ' + this.$route.params.title
    return {
      title
    }
  },
  beforeMount () {
    
  },
  mounted() {
    
  }
}
  
</script>
<style lang="stylus" scoped>
.section-view
  box-sizing border-box
  max-width: 960px
  padding 2em 3em
  h2 
    margin: 0;
    font-family: Noto Sans TC,sans-serif
    font-size: 18px
    font-weight: 700
    line-height: 1.5
    letter-spacing: .5px
    color: rgba(0,0,0,.8)
    list-style-type none
.section-story
  position: relative
  margin-bottom: 25px
.story-content
  box-sizing border-box
  width: 480px
  height: 280px
  padding: 15px
  background-color #fff
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.1)
  overflow: hidden
.story-content__brief
  font-size: 15px
  line-height: 1.4
  letter-spacing: .9px
  text-align: justify
  text-overflow: ellipsis
.story-img
  box-sizing border-box
  position: absolute
  top: 0
  right: 0
  width: 380px
  height: 280px
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.1)
  background-size: cover
</style>