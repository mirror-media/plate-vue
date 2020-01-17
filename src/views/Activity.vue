<template>
  <main class="activity">
    <a href="/" class="activity__logo" id="home">
      <img src="/assets/mirrormedia/icon/logo_black.png" srcset="/assets/mirrormedia/icon/logo_black@2x.png 2x" alt="鏡週刊 Mirror Media" />
    </a>
    <share :direction="`right`" :top="`5px`" :left="`55px`" :color="`#000`" :sharePath="`/activity/${get(activity, 'id')}`" class="activity__share" />
    <div class="activity__menu" v-if="topicId">
      <a :href="`/topic/${topicId}`"><img src="/assets/mirrormedia/icon/home.png" srcset="/assets/mirrormedia/icon/home@2x.png 2x" /></a>
    </div>
    <img :src="getImage(activity, 'desktop')" />
    <h1 v-text="get(activity, 'name')" />
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

import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../constants'
import { getImage, getTruncatedVal } from '../util/comm.js'
import { find, findIndex, get } from 'lodash'
import ActivityLightbox from '../components/activity/ActivityLightbox.vue'
import ActivityTimeline from '../components/activity/ActivityTimeline.vue'
import Share from '../components/Share.vue'
import sanitizeHtml from 'sanitize-html'

const fetchData = (store) => {
  return fetchActivities(store, store.state.route.params.activityId)
}

const fetchActivities = (store, id) => {
  return store.dispatch('FETCH_ACTIVITIES', {
    params: {
      where: {
        _id: id
      }
    }
  })
}

const fetchAllNodes = (store) => {
  const page = get(store.state, ['nodes', 'meta', 'page'], 0) + 1

  return store.dispatch('FETCH_NODES', {
    params: {
      page: page,
      where: {
        activity: get(store.state, ['route', 'params', 'activityId'])
      }
    }
  }).then(() => {
    if (get(store.state, ['nodes', 'items', 'length']) < get(store.state, ['nodes', 'meta', 'total'])) {
      fetchAllNodes(store)
    }
  })
}

export default {
  name: 'AppActivity',
  components: {
    'activity-lightbox': ActivityLightbox,
    'activity-timeline': ActivityTimeline,
    share: Share
  },
  asyncData ({ store }) {
    return fetchData(store)
  },
  metaInfo () {
    const url = `${SITE_URL}/activity/${this.$route.params.activityId}`
    const ogTitle = `${get(this.activity, 'name')} - ${SITE_TITLE}`
    const ogImage = get(this.$store, 'state.activities.items.0.heroImage.image.resizedTargets.desktop.url')
    const image = ogImage || '/assets/mirrormedia/notImage.png'
    const ogDescription = sanitizeHtml(get(this.$store, 'state.activities.items.0.brief.html'), { allowedTags: [] })
    const description = ogDescription !== '' ? getTruncatedVal(ogDescription, 197) : SITE_DESCRIPTION
    return {
      title: get(this.activity, 'name'),
      meta: [
        { name: 'robots', content: 'index' },
        { vmid: 'description', name: 'description', content: description },
        { vmid: 'og:title', property: 'og:title', content: ogTitle },
        { vmid: 'og:description', property: 'og:description', content: description },
        { vmid: 'og:url', property: 'og:url', content: url },
        { vmid: 'og:image', property: 'og:image', content: image },
        { vmid: 'twitter:title', name: 'twitter:title', content: ogTitle },
        { vmid: 'twitter:description', name: 'twitter:description', content: description },
        { vmid: 'twitter:image', name: 'twitter:image', content: image }
      ]
    }
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
      return get(this.$store.state, ['activities', 'items', '0'])
    },
    initialNodeIndex () {
      return findIndex(get(this.$store.state, ['nodes', 'items']), this.featureNode)
    },
    featureNode () {
      return find(get(this.$store.state, ['nodes', 'items']), { isFeatured: true })
    },
    hasAllNodes () {
      return get(this.$store.state, ['nodes', 'items', 'length']) >= get(this.$store.state, ['nodes', 'meta', 'total'])
    },
    initialNodes () {
      return get(this.$store.state, ['nodes', 'items'])
    },
    topicId () {
      return get(this.$route, ['params', 'topicId'])
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
    get,
    getImage,
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
    window.ga('send', 'pageview', { title: `${get(this.activity, ['name'])} - ${SITE_TITLE}`, location: `${SITE_URL}/activity/${this.$route.params.activityId}` })
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
