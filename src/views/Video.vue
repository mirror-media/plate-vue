<template>
  <VueDfpProvider :dfpid="DFP_ID" :dfpUnits="DFP_UNITS" :options="dfpOptions" :mode="currEnv()" section="5975ab2de531830d00e32b2f">
    <template slot-scope="props" slot="dfpPos">
      <HeaderR :props="props" :showDfpHeaderLogo="showDfpHeaderLogo" />
      <template v-if="isSingleVideo">
        <SingleVideoBody :playlist="playlist" :video="video" :videos="videos">
          <vue-dfp :is="props.vueDfp" v-if="viewport >= 1200" slot="PCHD" :config="props.config" class="dfp" pos="PCHD" />
          <vue-dfp :is="props.vueDfp" v-else slot="MBHD" :config="props.config" class="dfp" pos="MBHD" />
          <vue-dfp :is="props.vueDfp" v-if="viewport >= 1200" slot="PCFT" :config="props.config" class="dfp" pos="PCFT" />
          <vue-dfp :is="props.vueDfp" v-else slot="MBFT" :config="props.config" class="dfp" pos="MBFT" />
        </SingleVideoBody>
      </template>
      <template v-else>
        <VideoLeading>
          <vue-dfp :is="props.vueDfp" v-if="viewport >= 1200" slot="LPCHD" :config="props.config" class="dfp" pos="LPCHD" />
          <vue-dfp :is="props.vueDfp" v-else slot="LMBHD" :config="props.config" class="dfp" pos="LMBHD" />
        </VideoLeading>
        <template v-for="(item, index) in playlist">
          <VideoList :key="item.id" :items="$store.state.playlist[item.id]" :playlist="item" @loadmore="handleLoadmore">
            <router-link v-if="!isCategoryPage" slot="more" :to="`/category/${OATH_PLAYLIST[item.id].categoryName}`" class="btn--more">看更多<img src="/assets/mirrormedia/icon/arrow-slideshow-blue-right.png" alt="看更多"></router-link>
            <vue-dfp :is="props.vueDfp" v-if="isCategoryPage && viewport >= 1200" :key="`${index}-LPCFT`" slot="LPCFT" :config="props.config" class="dfp" pos="LPCFT" />
            <vue-dfp :is="props.vueDfp" v-else-if="isCategoryPage" :key="`${index}-LMBFT`" slot="LMBFT" :config="props.config" class="dfp" pos="LMBFT" />
          </VideoList>
          <template v-if="!isCategoryPage && index === 2">
            <vue-dfp :is="props.vueDfp" v-if="viewport >= 1200" :key="`${index}-LPCFT`" :config="props.config" class="dfp" pos="LPCFT" />
            <vue-dfp :is="props.vueDfp" v-else :key="`${index}-LMBFT`" :config="props.config" class="dfp" pos="LMBFT" />
          </template>
        </template>
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
import { chunk, get, truncate, } from 'lodash'

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
  .catch(() => {
    const e = new Error()
    e.massage = 'Page Not Found'
    e.code = '404'
    throw e
  })
}

const fetchVideo = (store, { id }) => {
  return store.dispatch('FETCH_OATH_VIDEO', {
    id,
  })
  .catch(() => {
    const e = new Error()
    e.massage = 'Page Not Found'
    e.code = '404'
    throw e
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
    const jobs = [
      fetchCommonData(store),
      fetchPartners(store),
    ]
    route.fullPath.match(/\/video\//) ? jobs.push(fetchVideo(store, { id: route.fullPath.split('/')[2] })) : ''
    const playlist = Object.keys(OATH_PLAYLIST)
    const playlistSplit = chunk(playlist, 4)
    playlistSplit.map(list => {
      const ids = list.reduce((acc, cur, index) => index === 0 ? cur : `${acc},${cur}`, '')
      jobs.push(fetchPlaylist(store, { ids: ids }))
    })
    playlist.map(id => {
      let maxResults = 4
      if (route.fullPath.match(/\/category\//)) {
        const playlistInfo = Object.entries(OATH_PLAYLIST).find(item => item[1].categoryName === route.fullPath.split('/')[2])
        const playlistId = playlistInfo[0]
        maxResults = id === playlistId ? 12 : maxResults
      }
      jobs.push(fetchVideoByPlaylist(store, { id: id, params: { max_results: maxResults }}))
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
    let description = get(videohub, 'ogDescription') || get(videohub, 'description')
    let image = get(videohub, 'ogImage') || get(videohub, 'image')
    description = description ? truncate(description, { length: 197 }) : SITE_DESCRIPTION
    image = image ? get(image, 'image.resizedTargets.desktop.url') : SITE_OGIMAGE

    switch (true) {
      case /\/category\//.test(this.$route.fullPath):
        title = get(this.playlist[0], 'name')
        break
      case /\/video\//.test(this.$route.fullPath):
        title = get(this.video, 'name')
        break
      default:
        title = get(videohub, 'ogTitle') || get(videohub, 'title')
    }

    if (!title && process.env.VUE_ENV === 'server') {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    }

    if (this.$route.fullPath.match(/(\/category\/|\/video\/)/)) {
      title = `${title} - ${SITE_TITLE}`
    }

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
    isSingleVideoPage () {
      return this.$route.fullPath.match(/\/video\//)
    },
    playlist () {
      const playlist = this.$store.state.playlist.info || []
      if (this.isCategoryPage) {
        const category = this.$route.fullPath.split('/')[2]
        const playlistInfo = Object.entries(OATH_PLAYLIST).find(item => item[1].categoryName === category)
        return playlist.filter(item => item.id === playlistInfo[0])
      } else if (this.isSingleVideoPage) {
        const video = this.videos.find(video => video.id === this.video.id)
        const playlistId = video ? video.playlistId : ''
        return playlistId ? playlist.filter(item => item.id === playlistId) : ''
      } else {
        const filtered = playlist.filter(item => this.$store.state.playlist[item.id] && this.$store.state.playlist[item.id].length > 0)
        return filtered.sort((a, b) => OATH_PLAYLIST[a.id].order - OATH_PLAYLIST[b.id].order)
      }
    },
    section () {
      const sections = get(this.$store, 'state.commonData.sections.items') || []
      return sections.filter(section => section.name === 'videohub')[0]
    },
    title () {
      if (this.isCategoryPage) {
        return `${this.playlist[0].name} - ${SITE_TITLE}`
      } else if (this.isSingleVideoPage) {
        return this.video.name
      } else {
        return `${this.section.title} - ${SITE_TITLE}`
      }
    },
    video () {
      if (this.isSingleVideoPage) {
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
  watch: {
    '$route.fullPath' () {
      this.sendGA()
    }
  },
  beforeMount () {
    fetchEvent(this.$store, 'embedded'),
    fetchEvent(this.$store, 'logo'),
    this.updateViewport()
    window.addEventListener('resize', this.updateViewport)
  },
  mounted () {
    this.sendGA()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateViewport)
  },
  methods: {
    currEnv,
    handleLoadmore ({ id, offset }) {
      fetchVideoByPlaylist(this.$store, { id: id, params: { max_results: 12, offset: offset }})
    },
    sendGA () {
      const categoryLabel = this.$route.fullPath.match(/section/)
        ? ``
        : Object.entries(OATH_PLAYLIST).find(item => item[0] === this.playlist[0].id)[1].categoryName
      window.ga('set', 'contentGroup1', this.section.name)
      window.ga('set', 'contentGroup2', categoryLabel)
      window.ga('set', 'contentGroup3', '')
      window.ga('send', 'pageview', { title: this.title, location: document.location.href })
    },
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
