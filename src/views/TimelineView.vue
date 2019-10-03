<template>
  <div class="timeline-view">
    <section>
      <header-full :commonData='commonData' :section='sectionName' :sections='commonData.sections' />
    </section>
    <spinner :show="loading"></spinner>
    <section :style="{ position: 'relative' }">
      <div class="titleBox"/>
      <figure class="post-image" :style="{ background: 'url(https://www.mirrormedia.mg/assets/images/20170320141850-acc898b5c64351723a13f93a9981fdf5.jpg) center center / cover no-repeat' }"></figure>
    </section>

    <div class="timelineWrapper">
      <section class="tweet" v-for="item in rep">
        <div class="description">
          <div class="datetime" v-text="moment(item.created_at).format('mm/dd HH:MM')"></div>
          <div class="content" v-html="twitterAutoLink(item.text, item.entities.urls)"></div>
          <div class="share"></div>
        </div>
        <div class="box topLine">
          <div class="clock"></div>
          <div class="innerBox leftLine">
            <div class="datetime-top mobile-only" v-text="moment(item.created_at).format('mm/dd HH:MM')"></div>
            <div class="heroImg">
              <a :href="`https://twitter.com/MirrorWatchTW/status/${getValue(item, [ 'id_str' ], '')}`">
                <img :src="getValue(item, [ 'extended_entities', 'media', 0, 'media_url_https' ], '/assets/mirrormedia/notImage.png')" 
                    v-if="getValue(item, [ 'extended_entities', 'media', 0, 'media_url_https' ])"  />
              </a>
            </div>
            <div class="content mobile-only" v-html="twitterAutoLink(item.text, item.entities.urls)"></div>
            <div class="share mobile-only"></div>
          </div>
        </div>
      </section>
    </div>
    <div class="container more-container" :style="{ marginBottom: '20px' }">
      <more v-on:loadMore="loadMore" />
    </div>
    <footer-full :commonData='commonData' :section='sectionName' />
  </div>
</template>

<script>
import { getValue, unLockJS } from '../util/comm'
import _ from 'lodash'
import FooterFull from '../components/FooterFull.vue'
import HeaderFull from '../components/HeaderFull.vue'
import More from '../components/More.vue'
import Spinner from '../components/Spinner.vue'
import moment from 'moment'
import titleMetaMixin from '../util/mixinTitleMeta'
import twitter from 'twitter-text'

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections' ] })
}

const fetchData = (store) => {
  return fetchCommonData(store)
}

function fetchTwitter (url) {
  const superagent = require('superagent')
  const apiHost = '/api'
  return new Promise(resolve => {
    superagent
    .get(apiHost + url)
    .end((err, response) => {
      if (!err && response) {
        resolve(JSON.parse(response.text))
      } else {
        resolve('{\'error\':' + err + '}')
      }
    })
  })
}

export default {
  name: 'timeline-view',
  data () {
    return {
      commonData: this.$store.state.commonData,
      loading: true,
      openSearch: false,
      openSide: false,
      rep: '',
      sectionName: this.$store.state.route.params.title
    }
  },
  components: {
    'footer-full': FooterFull,
    'header-full': HeaderFull,
    'more': More,
    Spinner
  },
  computed: {
    lastItemId () {
      return _.get(_.last(this.rep), 'id', 0)
    }
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    return {
      title: 'Timeline :: ' + _.upperCase(this.$route.params.title),
      meta: `
        <meta name="description" content="${'Timeline :: ' + _.upperCase(this.$route.params.title)}">
      `
    }
  },
  methods: {
    checkIfLockJS () {
      unLockJS()
    },
    closeSearchBar () {
      this.openSearch = false
    },
    closeSideBar () {
      this.openSide = false
    },
    getValue,
    loadMore () {
      fetchTwitter(`/twitter?screen_name=MirrorWatchTW&count=10&max_id=${this.lastItemId}`).then(
        response => {
          if (response.length > 0 && !response[0][ 'code' ]) {
            this.rep = this.rep.concat(response)
          }
          this.loading = false
        },
        error => {
          console.error('Failed!', error) //eslint-disable-line
        }
      )
    },
    moment,
    openSearchBar () {
      this.openSearch = true
    },
    openSideBar () {
      this.openSide = true
    },
    twitterAutoLink: twitter.autoLink
  },
  mounted () {
    this.checkIfLockJS()
    window.ga('send', 'pageview', { title: `Timeline :: ${_.upperCase(this.$route.params.title)}`, location: document.location.href })
  },
  asyncData ({ store }) {
    return fetchData(store)
  },
  beforeMount () {
    fetchTwitter(`/twitter?screen_name=MirrorWatchTW&count=10`).then(
      response => {
        if (response.length > 0 && !response[0][ 'code' ]) {
          this.rep = response
        }
        this.loading = false
      },
      error => {
        console.error('Failed!', error) //eslint-disable-line
      }
    )
  }
}
</script>

<style lang="stylus" scoped>
.timeline-view
  background-color #fff
  box-sizing border-box

  .spinner
    position absolute
    top 5px
    right 5px
    bottom auto

  div.titleBox 
    background url('https://www.mirrormedia.mg/assets/images/20170320153732-080767900ee77ee4eb5afe2a26eb225f.png') 50% 50% no-repeat
    background-size contain
    width 390px
    max-width 80%
    height 200px
    z-index 9
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    margin auto

  .post-image 
    margin 0
    background-repeat no-repeat
    background-size cover
    width 100vw
    height 80vh

  div.timelineWrapper 
    padding 40px 70px
    width 1024px
    margin 0 auto

    section.tweet 
      background transparent
      margin 0 auto
      display flex

      .description
        flex 1
        display flex
        flex-direction column
        justify-content flex-start
        align-items flex-end
        width 25%
        margin-bottom 40px

        .datetime 
          font-family Arial
          font-size 24px
          font-weight bold
          font-style normal
          font-stretch normal
          letter-spacing 2px
          text-align left
          color #565656
          width 100%
          text-align right
          padding-right 20px
          padding-top 5px

        .content
          padding-right 20px
          width 100%
          overflow-wrap break-word

      .box 
        flex 3
        position relative
        margin-top 18px
        width 75%
    
      .innerBox 
        margin-left 45px
        padding-left 40px
        height 100%

      .topLine 
        border-top 5px #B3B83F solid

      .leftLine 
        border-left 5px #B3B83F solid

      .clock 
        position absolute
        top -23px
        left 28px
        height 40px
        width 40px
        background url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQ4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40ODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAg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') 50% 50% no-repeat / cover

      .heroImg 
        width 95%

      .heroImg img
        width 100%
        height auto

      .content 
        margin-top 20px
        font-size 22px
        font-weight 300
        font-style normal
        font-stretch normal
        line-height 1.55
        text-align right
        color #000000

      .hashTag 
        margin-top 20px
        font-size 18px
        font-weight 500
        font-style normal
        font-stretch normal
        line-height 1.33
        text-align left
        color #0b4fa2

      .share 
        width 40px
        height 40px
        background url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjQgMjQ7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgaWQ9ImluZm8iLz48ZyBpZD0iaWNvbnMiPjxwYXRoIGQ9Ik0yMS43LDEwLjJsLTYuNi02QzE0LjYsMy43LDE0LDQuMiwxNCw1djNjLTQuNywwLTguNywyLjktMTAuNiw2LjhjLTAuNywxLjMtMS4xLDIuNy0xLjQsNC4xICAgYy0wLjIsMSwxLjMsMS41LDEuOSwwLjZDNi4xLDE2LDkuOCwxMy43LDE0LDEzLjdWMTdjMCwwLjgsMC42LDEuMywxLjEsMC44bDYuNi02QzIyLjEsMTEuNCwyMi4xLDEwLjYsMjEuNywxMC4yeiIgaWQ9InNoYXJlIi8+PC9nPjwvc3ZnPg==') 50% 50% no-repeat / cover
        margin-right 20px

    a.tweet-url.hashtag 
      font-size 18px
      font-weight 500
      font-style normal
      font-stretch normal
      line-height 1.33
      text-align left
      color #0b4fa2


    .content 
      a 
        font-size 18px
        font-weight 500
        font-style normal
        font-stretch normal
        line-height 1.33
        text-align right
        color #0b4fa2

@media (min-width 0px) and (max-width 767px)
  .timeline-view
    div.timelineWrapper
      padding 40px 20px

      section.tweet
        .description
          display none
          
        .box
          margin-top 0
        
          .clock
            display none

          .leftLine
            padding-left 0
            margin-left 0
            margin-bottom 30px

            .datetime-top
              color #fff
              width 100%
              background-color #b3b83f
              height 2rem
              line-height 2rem
              padding-left 30px
              font-weight 400
              font-size 1.3rem
              letter-spacing 2px
              font-family Arial
            
            .content
              text-align left
              padding-left 20px
            
            .share
              margin-left 20px

            .heroImg
              width 100%

    .more-container
      padding 0 20px

@media (min-width 768px)
  .mobile-only
    display none

@media (min-width 0px) and (max-width 899px)
  .timeline-view
    div.timelineWrapper
      section.tweet  
        .description
          .datetime
            font-size 1.3rem
          
        .content
          font-size 1.3rem

    .post-image
      height 66.66667vw

@media (min-width 0px) and (max-width 1199px)
  .timeline-view
    div.timelineWrapper
      width 100%


</style>
