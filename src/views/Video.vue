<template>
  <!-- <VueDfpProvider :dfpid="DFP_ID" :dfpUnits="DFP_UNITS" :options="dfpOptions" :section="section.id" :mode="currEnv()"> -->
  <VueDfpProvider :dfpid="DFP_ID" :dfpUnits="DFP_UNITS" :options="dfpOptions" :mode="currEnv()">
    <template slot-scope="props" slot="dfpPos">
      <HeaderR :props="props" :showDfpHeaderLogo="showDfpHeaderLogo" />
      <template v-if="isSingleVideo">
        <SingleVideoBody :playlist="playlist" :video="video" :videos="videos"></SingleVideoBody>
      </template>
      <template v-else>
        <VideoLeading>
          <vue-dfp :is="props.vueDfp" v-if="viewport >= 1200" slot="LPCHD" :config="props.config" class="dfp" pos="LPCHD" />
          <vue-dfp :is="props.vueDfp" v-else slot="LMBHD" :config="props.config" class="dfp" pos="LMBHD" />
        </VideoLeading>
        <VideoList v-for="item in playlist" :key="item.id" :items="take($store.state.playlist[item.id], 4)" :playlist="item">
          <router-link v-if="!isCategoryPage" slot="more" :to="`/category/${OATH_PLAYLIST[item.id].categoryName}`" class="btn--more">看更多<img src="/assets/mirrormedia/icon/arrow-slideshow-blue-right.png" alt="看更多"></router-link>
        </VideoList>
      </template>
      <section class="footer container">
        <Footer />
      </section>
      <LiveStream v-if="hasEventEmbedded" :mediaData="eventEmbedded" />
      <Share right="20px" bottom="20px" />
    </template>
  </VueDfpProvider>
</template>
<script>
import DfpCover from '../components/DfpCover.vue'
import Footer from '../components/Footer.vue'
import HeaderR from '../components/HeaderR.vue'
import LiveStream from '../components/LiveStream.vue'
import SingleVideoBody from '../components/video/SingleVideoBody.vue'
import Share from '../components/Share.vue'
import VideoLeading from '../components/video/VideoLeading.vue'
import VideoList from '../components/video/VideoList.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import moment from 'moment'
import titleMetaMixin from '../util/mixinTitleMeta'
import { DFP_ID, DFP_UNITS, DFP_OPTIONS, FB_APP_ID, FB_PAGE_ID, OATH_PLAYLIST } from '../constants'
import { SITE_MOBILE_URL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_OGIMAGE, SITE_TITLE, SITE_URL} from '../constants'
import { consoleLogOnDev, currEnv, sendAdCoverGA, updateCookie } from '../util/comm'
import { chunk, get, take, truncate, } from 'lodash'

const debug = require('debug')('CLIENT:VIEWS:video')

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] })
    .catch(err => {
      if (err.status === 404) {
        const e = new Error()
        e.massage = 'Page Not Found'
        e.code = '404'
        throw e
      } else {
        throw err
      }
    })
}

const fetchEvent = (store, eventType = 'embedded') => {
  return store.dispatch('FETCH_EVENT', {
    params: {
      max_results: 1,
      where: {
        isFeatured: true,
        eventType: eventType
      }
    }
  })
}

const fetchPlaylist = (store, { ids, params = {} }) => {
  return store.dispatch('FETCH_OATH_PLAYLIST', {
    ids,
    params
  })
}

const fetchVideo = (store, { id }) => {
  return store.dispatch('FETCH_OATH_VIDEO', {
    id,
  })
}

const fetchVideoByPlaylist = (store, { id, params = {} }) => {
  return store.dispatch('FETCH_OATH_VIDEO_BY_PLAYLIST', {
    id,
    params
  })
}

const fetchPartners = (store) => {
  return store.dispatch('FETCH_PARTNERS', {
    params: {
      max_results: 25,
      page: 1
    }
  })
}

export default {
  name: 'AppVideo',
  components: {
    DfpCover,
    Footer,
    HeaderR,
    LiveStream,
    SingleVideoBody,
    Share,
    VideoLeading,
    VideoList,
    VueDfpProvider,
  },
  asyncData ({ store, route }) {
    // const playlist = Object.keys(OATH_PLAYLIST).reduce((acc, cur, index) => index === 0 ? cur : `${acc},${cur}`, '')
    const jobs = [
      fetchCommonData(store),
      fetchEvent(store, 'embedded'),
      fetchEvent(store, 'logo'),
      fetchPartners(store),
    ]
    route.fullPath.match(/\/video\//) ? jobs.push(fetchVideo(store, { id: route.fullPath.split('/')[2] })) : ''
    const playlist = chunk(Object.keys(OATH_PLAYLIST), 4)
    playlist.map(list => {
      const ids = list.reduce((acc, cur, index) => index === 0 ? cur : `${acc},${cur}`, '')
      jobs.push(fetchPlaylist(store, { ids: ids }))
    })
    return Promise.all(jobs)
  },
  mixins: [ titleMetaMixin ],
  metaSet () {
    const ogUrl = `${SITE_URL}${this.$route.fullPath}`
    const relUrl = `${SITE_MOBILE_URL}${this.$route.fullPath}`
    const sections = get(this.$store, 'state.commonData.sections.items', []) || []
    const videohub = sections.filter(section => section.name === 'videohub')[0]
    let title
    let description
    let image

    if (videohub) {
      title = videohub.ogTitle || videohub.title
      description = videohub.ogDescription || videohub.description
      image = videohub.ogImage || videohub.image
    }

    title = title ? `${title} - ${SITE_TITLE}` : SITE_TITLE
    description = description ? truncate(description, { length: 197 }) : SITE_DESCRIPTION
    image = image ? get(image, 'image.resizedTargets.desktop.url') : SITE_OGIMAGE

    return {
      url: relUrl,
      title: title,
      meta: `
        <meta name="mm-opt" content="">
        <meta name="robots" content="index">
        <meta name="keywords" content="${SITE_KEYWORDS}">
        <meta name="description" content="${description}">
        <meta name="section-name" content="videohub">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${image}">
        <meta property="fb:app_id" content="${FB_APP_ID}">
        <meta property="fb:pages" content="${FB_PAGE_ID}">
        <meta property="og:site_name" content="${SITE_TITLE}">
        <meta property="og:locale" content="zh_TW">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:url" content="${ogUrl}">
        <meta property="og:image" content="${image}">
      `
    }
  },
  data () {
    return {
      DFP_ID,
      DFP_UNITS,
      OATH_PLAYLIST,
      showDfpHeaderLogo: false,
      viewport: 0,
    }
  },
  props: {
    isSingleVideo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dfpOptions () {
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded: (event) => {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')

          const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
          const loadInnityAd = () => {
            debug('Event "noad2" is detected!!')
            if (this.showDfpCoverAd2Flag && !this.showDfpCoverInnityFlag) {
              sendAdCoverGA('innity')
              debug('noad2 detected and go innity')
              this.showDfpCoverInnityFlag = true
            }
          }
          window.addEventListener('noad2', loadInnityAd)
          window.parent.addEventListener('noad2', loadInnityAd)

          switch (position) {
            case 'LMBCVR':
              sendAdCoverGA('dfp')
              if (adDisplayStatus === 'none') {
                updateCookie({ currEnv: this.dfpMode }).then((isVisited) => {
                  this.showDfpCoverAd2Flag = !isVisited
                })
              } else {
                updateCookie({ currEnv: this.dfpMode }).then((isVisited) => {
                  this.showDfpCoverAdFlag = !isVisited
                })
              }
              break
            case 'LMBCVR2':
              sendAdCoverGA('ad2')
              consoleLogOnDev({ msg: 'ad2 loaded' })
              if (adDisplayStatus === 'none') {
                consoleLogOnDev({ msg: 'dfp response no ad2' })
              }
              break
            case 'LMBCVR3':
                debug('adInnity loaded')
                sendAdCoverGA('innity')
                if (adDisplayStatus === 'none') {
                  debug('dfp response no innity')
                }
                break                   
            case 'LOGO':
              if (adDisplayStatus === 'none') {
                this.showDfpHeaderLogo = false
              } else {
                this.showDfpHeaderLogo = true
              }
              break
          }
        },
        setCentering: true
      })
    },
    eventEmbedded () {
      return get(this.$store, 'state.eventEmbedded.items.0')
    },
    eventLogo () {
      return get(this.$store, 'state.eventLogo.items.0')
    },
    hasEventEmbedded () {
      const _now = moment()
      const _eventStartTime = moment(new Date(get(this.eventEmbedded, [ 'startDate' ])))
      let _eventEndTime = moment(new Date(get(this.eventEmbedded, [ 'endDate' ])))
      if (_eventEndTime && (_eventEndTime < _eventStartTime)) {
        _eventEndTime = moment(new Date(get(this.eventEmbedded, [ 'endDate' ]))).add(12, 'h')
      }
      return (_eventStartTime && _eventEndTime && (_now >= _eventStartTime) && (_now <= _eventEndTime))
    },
    isCategoryPage () {
      return this.$route.fullPath.match(/category/)
    },
    playlist () {
      const playlist = this.$store.state.playlist.info || []
      if (this.isCategoryPage) {
        const category = this.$route.fullPath.split('/')[2]
        const playlistInfo = Object.entries(OATH_PLAYLIST).find(item => item[1].categoryName === category)
        return playlist.filter(item => item.id === playlistInfo[0])
      } else {
        const filtered = playlist.filter(item => this.$store.state.playlist[item.id] && this.$store.state.playlist[item.id].length > 0)
        return filtered.sort((a, b) => OATH_PLAYLIST[a.id].order - OATH_PLAYLIST[b.id].order)
      }
    },
    section () {
      const sections = get(this.$store, 'state.commonData.sections.items') || []
      return sections.filter(section => section.name === 'videohub')[0]
    },
    video () {
      if (this.$route.fullPath.match(/\/video\//)) {
        const id = this.$route.fullPath.split('/')[2]
        return this.$store.state.videos[id]
      }
      return 
    },
    videos () {
      const videos = []
      Object.keys(this.$store.state.playlist)
        .filter(key => key !== 'info')
        .map(key => {
          this.$store.state.playlist[key].map(item => videos.push(item))
        })
      return videos
    }
  },
  beforeMount () {
    const playlist = Object.keys(OATH_PLAYLIST)
    playlist.map(id => fetchVideoByPlaylist(this.$store, { id: id }))
    this.updateViewport()
    window.addEventListener('resize', this.updateViewport)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateViewport)
  },
  methods: {
    currEnv,
    take,
    updateViewport () {
      this.viewport = document.documentElement.clientWidth || document.body.clientWidth
    }
  }
}
</script>
<style lang="stylus" scoped>
.dfp
  display inline-block
  width 100%
  margin 20px auto

.btn--more
  display flex
  align-items center
  padding 0
  margin 10px 0 0 auto
  color #064f77
  font-size .75rem
  font-weight 600
  background-color transparent
  border none
  img
    height 1em
    margin-left 5px

@media (min-width: 1200px)
  .btn--more
    font-size 1rem
</style>
