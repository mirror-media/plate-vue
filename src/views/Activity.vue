<template>
  <main class="activity">
    <a href="/" class="activity__logo" id="home">
      <img src="/assets/mirrormedia/icon/logo_black.png" srcset="/assets/mirrormedia/icon/logo_black@2x.png 2x" alt="鏡週刊 Mirror Media" />
    </a>
    <share :direction="`right`" :top="`5px`" :left="`55px`" :color="`#000`" :sharePath="`/activity/${getValue(activity, [ 'id' ])}`" class="activity__share" />
    <div class="activity__menu" v-if="topicId">
      <a :href="`/topic/${topicId}`"><img src="/assets/mirrormedia/icon/home.png" srcset="/assets/mirrormedia/icon/home@2x.png 2x" /></a>
    </div>
    <img :src="getImage(activity, 'desktop')" />
    <h1 v-text="getValue(activity, [ 'name' ])" />
    <activity-timeline :initialNodeIndex="initialNodeIndex" :initialNodes="initialNodes" :viewport="viewport" v-on:openLightbox="openLightbox" />
    <activity-lightbox :initialActivity="activity" :initialNodes="initialNodes" :lightboxIndex="lightboxIndex" :viewport="viewport" v-show="isLightboxOpen" v-on:closeLightbox="closeLightbox" />
    <div class="activity__landscape">
      <figure>
        <img v-lazy="`/assets/mirrormedia/icon/landscape_white.svg`" />
        <p>請將您的裝置轉至直向來繼續閱讀</p>
      </figure>
    </div>
    <div class="activity__curtain" v-show="loadind">
      Loading...
    </div>
  </main>
</template>

<script>

import { FB_APP_ID, FB_PAGE_ID } from '../constants'
import { SITE_MOBILE_URL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE, SITE_URL } from '../constants'
import { getImage, getTruncatedVal, getValue } from '../util/comm.js'
import _ from 'lodash'
import ActivityLightbox from '../components/activity/ActivityLightbox.vue'
import ActivityTimeline from '../components/activity/ActivityTimeline.vue'
import Share from '../components/Share.vue'
import sanitizeHtml from 'sanitize-html'
import titleMetaMixin from '../util/mixinTitleMeta'

const fetchData = (store) => {
  return fetchActivities(store, store.state.route.params.activityId)
}

const fetchActivities = (store, id) => {
  return store.dispatch('FETCH_ACTIVITIES', {
    'params': {
      where: {
        _id: id
      }
    }
  })
}

const fetchAllNodes = (store) => {
  const page = _.get(store.state, [ 'nodes', 'meta', 'page' ], 0) + 1

  return store.dispatch('FETCH_NODES', {
    'params': {
      page: page,
      where: {
        activity: _.get(store.state, [ 'route', 'params', 'activityId' ])
      }
    }
  }).then(() => {
    if (_.get(store.state, [ 'nodes', 'items', 'length' ]) < _.get(store.state, [ 'nodes', 'meta', 'total' ])) {
      fetchAllNodes(store)
    }
  })
}

export default {
  name: 'activityB',
  components: {
    'activity-lightbox': ActivityLightbox,
    'activity-timeline': ActivityTimeline,
    'share': Share
  },
  mixins: [ titleMetaMixin ],
  asyncData ({ store }) {
    return fetchData(store)
  },
  data () {
    return {
      isLightboxOpen: false,
      lightboxIndex: 0,
      loadind: true,
      viewport: 0
    }
  },
  computed: {
    activity () {
      return _.get(this.$store.state, [ 'activities', 'items', '0' ])
    },
    initialNodeIndex () {
      return _.findIndex(_.get(this.$store.state, [ 'nodes', 'items' ]), this.featureNode)
    },
    featureNode () {
      return _.find(_.get(this.$store.state, [ 'nodes', 'items' ]), { 'isFeatured': true })
    },
    hasAllNodes () {
      return _.get(this.$store.state, [ 'nodes', 'items', 'length' ]) >= _.get(this.$store.state, [ 'nodes', 'meta', 'total' ])
    },
    initialNodes () {
      return _.get(this.$store.state, [ 'nodes', 'items' ])
    },
    topicId () {
      return _.get(this.$route, [ 'params', 'topicId' ])
    }
  },
  methods: {
    closeLightbox () {
      this.isLightboxOpen = false
    },
    openLightbox (index) {
      this.lightboxIndex = index
      this.isLightboxOpen = true
    },
    getImage,
    getTruncatedVal,
    getValue,
    updateViewport () {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = document.documentElement.clientWidth || document.body.clientWidth
        this.windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      }
    }
  },
  beforeMount () {
    if (!this.hasAllNodes) {
      fetchAllNodes(this.$store)
    }
  },
  mounted () {
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
    this.loadind = false
    window.ga('set', 'contentGroup1', '')
    window.ga('set', 'contentGroup2', '')
    window.ga('set', 'contentGroup3', '')
    window.ga('send', 'pageview', { title: `${_.get(this.activity, [ 'name' ])} - ${SITE_TITLE}`, location: `${SITE_URL}/activity/${this.$route.params.activityId}` })
  },
  metaSet () {
    const url = `${SITE_URL}/activity/${this.$route.params.activityId}`
    const ogImage = _.get(this.$store.state, [ 'activities', 'items', '0', 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ], null)
    const image = ogImage || '/assets/mirrormedia/notImage.png'
    const ogDescription = sanitizeHtml(_.get(this.$store.state, [ 'activities', 'items', '0', 'brief', 'html' ]), { allowedTags: [] })
    const description = ogDescription !== '' ? this.getTruncatedVal(ogDescription, 197) : SITE_DESCRIPTION
    return {
      url: `${SITE_MOBILE_URL}/activity/${this.$route.params.activityId}`,
      title: `${_.get(this.activity, [ 'name' ])} - ${SITE_TITLE}`,
      meta: `
        <meta name="robots" content="index">
        <meta name="keywords" content="${SITE_KEYWORDS}">
        <meta name="description" content="${description}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${_.get(this.activity, [ 'name' ])} - ${SITE_TITLE}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${image}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="${_.get(this.activity, [ 'name' ])} - ${SITE_TITLE}">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${_.get(this.activity, [ 'name' ])} - ${SITE_TITLE}">
        <meta property="og:description" content="${description}">
        <meta property="og:url" content="${url}">
        <meta property="og:image" content="${image}">
      `
    }
  }
}
</script>

<style lang="stylus" scoped>

.activity
  position relative
  width 100vw
  height 100vh
  padding-bottom calc(30vh + 44px)
  background-color #000
  overflow hidden
  &__logo
    position fixed
    z-index 999
    top 5px
    left 5px
    width 40px
    height 40px
    > img
      width 100%
      image-rendering -webkit-optimize-contrast
  &__menu
    display flex
    flex-direction column
    align-items center
    justify-content space-around
    position fixed
    z-index 970
    top 5px
    right 5px
    width 40px
    height 40px
    background-color #000
    border-radius 50%
    cursor pointer
    a
      font-size 0
    img
      width 100%
      height 100%
  &__landscape
    display none
    align-items center
    justify-content center
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 1000
    width 100vw
    height 100vh
    background-color #1a1a1a
    background-repeat repeat-x
    background-size contain
    figure
      text-align center
      color #fff
      img
        width 60px
        animation-name rotate
        animation-duration 2s
        animation-iteration-count infinite
      p
        margin-top 40px
  > img
    width 100%
    height 100%
    object-fit cover
    object-position 50% 50%
  > h1
    position absolute
    top 70px
    left 50%
    transform translateX(-50%)
    width 70%
    margin 0
    color #fff
    text-align center
    font-size 1.6rem
    font-weight 300
    text-shadow 2px 2px 8px #000

.hamburgerBar
  display block
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 20px
  height 1.5px
  background-color #fff
  &-1
    top calc(50% - 6px)
  &-3
    top calc(50% + 6px)

@keyframes rotate
  from
    transform rotate(0deg)
  to
    transform rotate(90deg)

@media (min-width: 600px) and (orientation: portrait)
  .activity
    padding-bottom calc(25vh + 44px)
    > h1
      font-size 2rem

@media (min-width: 900px)
  .activity
    padding-bottom 25vh
    > h1
      top 5px
      line-height 40px

@media only screen and (max-width: 900px) and (orientation: landscape) 
  .activity
    &__landscape
      display flex

</style>
