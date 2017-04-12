<template>
  <vue-dfp-provider :dfpUnits="dfpUnits" :dfpid="dfpid" :section="sectionId" :options="dfpOptions">
    <template scope="props" slot="dfpPos">

      <div class="list-view" v-if="pageStyle == 'feature'">
        <section style="width: 100%;">
          <app-header :commonData= 'commonData' />
        </section>
        <div class="topic" v-if="type === 'TOPIC'">
          <div class="topic-title"><h1></h1></div>
          <leading :type="getValue(topic, [ 'leading' ])" v-if="getValue(topic, [ 'leading' ])" :mediaData="topic"/>
        </div>
        <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCHD" extClass="desktop-only" :dfpUnits="props.dfpUnits" 
          :section="props.section" :dfpId="props.dfpId" />
        <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LMBHD" extClass="mobile-only" :dfpUnits="props.dfpUnits" 
          :section="props.section" :dfpId="props.dfpId" />
        <div class="list-title container" :class="sectionName">
          <span class="list-title__text" v-text="title"></span>
          <div class="list-title__colorBlock" :class="sectionName"></div>
        </div>
        <article-list :articles='articles.items' :hasDFP='hasDFP' v-if="title !== 'Audio' && name !== 'videohub' ">
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA3" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpNA3" :dfpId="props.dfpId" />
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA5" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpNA5" :dfpId="props.dfpId" />
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LPCNA9" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpNA9" :dfpId="props.dfpId" />
          <vue-dfp v-if="hasDFP" :is="props.vueDfp" pos="LMBL1" :dfpUnits="props.dfpUnits" :section="props.section" slot="dfpL1" :dfpId="props.dfpId" />
        </article-list>
        <audio-list :audios="audios.items" v-if="title == 'Audio'" />
        <video-list :playlist="playlist.items" v-if="name == 'videohub'"/>
        <section class="container">
          <more v-if="hasMore" v-on:loadMore="loadMore" />
        </section>
        <section class="footer container">
          <vue-dfp v-if="type !== 'TOPIC' && title !== 'Topic'" :is="props.vueDfp" pos="LPCFT" extClass="desktop-only" :dfpUnits="props.dfpUnits" 
            :section="props.section" :dfpId="props.dfpId" />
          <vue-dfp v-if="type !== 'TOPIC' && title !== 'Topic'" :is="props.vueDfp" pos="LMBFT" extClass="mobile-only" :dfpUnits="props.dfpUnits" 
            :section="props.section" :dfpId="props.dfpId" />
          <vue-dfp v-if="type === 'TOPIC' && getValue(topic, ['dfp'], '').length > 0" :is="props.vueDfp" pos="LPCFT" extClass="desktop-only" :dfpUnits="props.dfpUnits" 
            :section="props.section" :dfpId="props.dfpId" :unitId="getValue(topic, ['dfp'], '')" />
          <vue-dfp v-if="type === 'TOPIC' && getValue(topic, ['mobileDfp'], '').length > 0" :is="props.vueDfp" pos="LMBFT" extClass="mobile-only" :dfpUnits="props.dfpUnits" 
            :section="props.section" :dfpId="props.dfpId" :unitId="getValue(topic, ['mobileDfp'], '')" />
          <app-footer />
        </section>
        <share />
      </div>

      <div class="listFull-view" v-if="pageStyle === 'full'">
        <section>
          <header-full :commonData='commonData' :sectionName='sectionName' :sections='commonData.sections' />
        </section>
        <article-leading :articles='articles.items' :props="props" v-if="type === 'SECTION'"/>
        <editorChoice-full :sectionfeatured='sectionfeatured' v-if="type === 'SECTION'"/>
        <latestArticle-full :articles='articles.items' :props="props" v-if="type === 'SECTION'" />
        <leading-watch v-if="(type == 'TAG' && pageStyle == 'full') || (type === 'TOPIC' && sectionName === 'watch')"
          :tag='tag' :topic='topic' :type='type'/>
        <article-list-full :articles='articles.items'
          v-if="type === 'TAG' || (type === 'TOPIC' && sectionName === 'watch')" />
        <more-full v-if="hasMore && (!loading)" v-on:loadMore="loadMore" />
        <loading :show="loading" />
        <vue-dfp :is="props.vueDfp" pos="LPCFT" extClass="desktop-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <vue-dfp :is="props.vueDfp" pos="LMBFT" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
        <footer-full :commonData='commonData' :sectionName='sectionName' />
      </div>
      <div class="dfp-cover" v-show="showDfpCoverAdFlag && viewport < 1199">
        <div class="ad">
          <vue-dfp :is="props.vueDfp" pos="LMBCVR" extClass="mobile-only" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
          <div class="close" @click="closeCoverAd"></div>
        </div>
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>

import { AUTHOR, CAMPAIGN_ID, CATEGORY, FB_APP_ID, FB_PAGE_ID, MARKETING_ID, SECTION, SITE_URL, TAG, TOPIC, TOPIC_WATCH_ID } from '../constants/index'
import { DFP_ID, DFP_UNITS } from '../constants'
import { getImage, getValue } from '../utils/comm'
import _ from 'lodash'
import ArticleLeading from '../components/ArticleLeading.vue'
import ArticleList from '../components/ArticleList.vue'
import ArticleListFull from '../components/ArticleListFull.vue'
import AudioList from '../components/AudioList.vue'
import Cookie from 'vue-cookie'
import EditorChoiceFull from '../components/EditorChoiceFull.vue'
import Footer from '../components/Footer.vue'
import FooterFull from '../components/FooterFull.vue'
import Header from '../components/Header.vue'
import HeaderFull from '../components/HeaderFull.vue'
import LatestArticleFull from '../components/LatestArticleFull.vue'
import Leading from '../components/Leading.vue'
import LeadingWatch from '../components/LeadingWatch.vue'
import Loading from '../components/Loading.vue'
import More from '../components/More.vue'
import MoreFull from '../components/MoreFull.vue'
import Share from '../components/Share.vue'
import VideoList from '../components/VideoList.vue'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import store from '../store'

const MAXRESULT = 9
const LOADMOREMAXRESULT = 12
const PAGE = 1

const fetchCommonData = (store) => {
  return store.dispatch('FETCH_COMMONDATA', { 'endpoints': [ 'sectionfeatured', 'sections', 'topics' ] })
}

const fetchListData = (store, type, sectionStyle, to) => {
  let uuid
  switch (type) {
    case AUTHOR:
      uuid = to.params.authorId
      return fetchArticlesByAuthor(store, uuid, {
        page: PAGE,
        max_results: MAXRESULT
      })
      break
    case SECTION:
      uuid = _.get(_.find(_.get(store.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'id' ])
      switch (sectionStyle) {
        case 'full':
          return fetchArticlesByUuid(store, uuid, SECTION, {
            page: PAGE,
            max_results: MAXRESULT,
            related: 'full'
          })
          break
        default:
          return fetchArticlesByUuid(store, uuid, SECTION, {
            page: PAGE,
            max_results: MAXRESULT
          })
      }
      break
    case TAG:
      uuid = to.params.tagId
      return fetchTag(store, uuid).then(() => {
        return fetchArticlesByUuid(store, uuid, TAG, {
          page: PAGE,
          max_results: MAXRESULT
        })
      })
      break
    case CATEGORY:
      const catName = to.params.title
      switch (catName) {
        case 'audio':
          return fetchAudios(store, {
            page: PAGE,
            max_results: MAXRESULT
          })
          break
        case 'videohub':
          return fetchYoutubePlaylist(store, MAXRESULT)
          break
        case 'campaign':
          uuid = CAMPAIGN_ID
          return fetchArticlesByUuid(store, uuid, CATEGORY, {
            page: PAGE,
            max_results: MAXRESULT
          })
          break
        case 'marketing':
          uuid = MARKETING_ID
          return fetchArticlesByUuid(store, uuid, CATEGORY, {
            page: PAGE,
            max_results: MAXRESULT
          })
          break
        default:
          uuid = _.get(_.find(_.get(store.state.commonData, [ 'categories' ]), { 'name': to.params.title }), [ 'id' ])
          return fetchArticlesByUuid(store, uuid, CATEGORY, {
            page: PAGE,
            max_results: MAXRESULT
          })
      }
      break
    case TOPIC:
      uuid = to.params.topicId
      const topic = _.find(_.get(store.state.commonData, [ 'topics', 'items' ]), { 'id': uuid })
      
      return fetchArticlesByUuid(store, uuid, TOPIC, {
        page: PAGE,
        max_results: LOADMOREMAXRESULT
      }).then(() => {
        return (!topic) ? fetchTopicByUuid(store, uuid).then(() => {
          return fetchTopicImagesByUuid(store, uuid, type, {
            max_results: 25
          })
        }) : null
      })
      break
  }
}

const fetchListDataBeforeRouteUpdate = (store, type, sectionStyle, to) => {
  let uuid
  switch (type) {
    case AUTHOR:
      uuid = to.params.authorId
      return fetchArticlesByAuthor(store, uuid, {
        page: PAGE
      })
      break
    case SECTION:
      uuid = _.get(_.find(_.get(store.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'id' ])
      switch (sectionStyle) {
        case 'full':
          return fetchArticlesByUuid(store, uuid, SECTION, {
            page: PAGE,
            max_results: MAXRESULT,
            related: 'full'
          })
          break
        default:
          return fetchArticlesByUuid(store, uuid, SECTION, {
            page: PAGE,
            max_results: MAXRESULT
          })
      }
      break
    case TAG:
      uuid = to.params.tagId
      return fetchTag(store, uuid).then(() => {
        return fetchArticlesByUuid(store, uuid, TAG, {
          page: PAGE,
          max_results: MAXRESULT
        })
      })
      break
    case CATEGORY:
      const catName = to.params.title
      switch (catName) {
        case 'audio':
          return fetchAudios(store, {
            page: PAGE,
            max_results: MAXRESULT
          })
          break
        case 'videohub':
          return fetchYoutubePlaylist(store, MAXRESULT)
          break
        case 'campaign':
          uuid = CAMPAIGN_ID
          return fetchArticlesByUuid(store, uuid, CATEGORY, {
            page: PAGE,
            max_results: MAXRESULT
          })
          break
        case 'marketing':
          uuid = MARKETING_ID
          return fetchArticlesByUuid(store, uuid, CATEGORY, {
            page: PAGE,
            max_results: MAXRESULT
          })
          break
        default:
          uuid = _.get(_.find(_.get(store.state.commonData, [ 'categories' ]), { 'name': to.params.title }), [ 'id' ])
          return fetchArticlesByUuid(store, uuid, CATEGORY, {
            page: PAGE,
            max_results: MAXRESULT
          })
      }
      break
    case TOPIC:
      uuid = to.params.topicId
      const topic = _.find(_.get(store.state.commonData, [ 'topics', 'items' ]), { 'id': uuid })
      return fetchArticlesByUuid(store, uuid, TOPIC, {
        page: PAGE,
        max_results: LOADMOREMAXRESULT
      }).then(() => {
        return (!topic) ? fetchTopicByUuid(store, uuid).then(() => {
          return fetchTopicImagesByUuid(store, uuid, type, {
            max_results: 25
          })
        }) : null
      })
      break
  }
}

const fetchArticlesByAuthor = (store, uuid, params) => {
  return store.dispatch('FETCH_ARTICLES', {
    params: Object.assign({
      page: PAGE,
      max_results: MAXRESULT,
      where: {
        '$or': [
          { writers: uuid },
          { photographers: uuid },
          { camera_man: uuid },
          { designers: uuid },
          { engineers: uuid }
        ]
      },
      sort: '-publishedDate'
    }, params)
  })
}

const fetchArticlesByUuid = (store, uuid, type, params) => {
  return store.dispatch('FETCH_ARTICLES_BY_UUID', {
    'uuid': uuid,
    'type': type,
    'params': params
  })
}

const fetchAudios = (store, params = {}) => {
  return store.dispatch('FETCH_AUDIOS', {
    'params': params
  })
}

const fetchTag = (store, id) => {
  return store.dispatch('FETCH_TAG', {
    'id': id
  })
}

const fetchTopics = (store, params) => {
  return store.dispatch('FETCH_TOPIC_BY_UUID', {
    'params': params
  })
}

const fetchTopicByUuid = (store, uuid) => {
  return store.dispatch('FETCH_TOPIC_BY_UUID', {
    'params': {
      where: {
        _id: uuid
      }
    }
  })
}

const fetchTopicImagesByUuid = (store, uuid, type, params) => {
  return store.dispatch('FETCH_IMAGES', {
    'uuid': uuid,
    'type': type,
    'params': params
  })
}

const fetchYoutubePlaylist = (store, limit, pageToken = '') => {
  return store.dispatch('FETCH_YOUTUBE_PLAY_LIST', {
    'limit': limit,
    'pageToken': pageToken
  })
}

const fetchData = (store) => {
  return fetchCommonData(store).then(() => {
    const _type = _.toUpper(_.split(store.state.route.path, '/')[1])
    const _sectionStyle = _.get(_.find(_.get(store.state.commonData, [ 'sections', 'items' ]), { 'name': store.state.route.params.title }), [ 'style' ])
    return fetchListData(store, _type, _sectionStyle, store.state.route)
  })
}

export default {
  name: 'list-view',
  components: {
    'app-footer': Footer,
    'app-header': Header,
    'article-leading': ArticleLeading,
    'article-list': ArticleList,
    'article-list-full': ArticleListFull,
    'audio-list': AudioList,
    'editorChoice-full': EditorChoiceFull,
    'footer-full': FooterFull,
    'header-full': HeaderFull,
    'latestArticle-full': LatestArticleFull,
    'leading': Leading,
    'leading-watch': LeadingWatch,
    'loading': Loading,
    'more': More,
    'more-full': MoreFull,
    'share': Share,
    'video-list': VideoList,
    VueDfpProvider
  },
  preFetch: fetchData,
  mounted () {
    if (this.type === SECTION || this.type === TOPIC || this.type === TAG) {
      this.insertCustomizedMarkup()
    }
    this.updateViewport()
    window.addEventListener('resize', () => {
      this.updateViewport()
    })
  },
  beforeRouteEnter (to, from, next) {
    const type = _.toUpper(_.split(to.path, '/')[1])
    if (process.env.VUE_ENV === 'client' && to.path !== from.path && from.matched && from.matched.length > 0) {
      console.log([to, from])
        const sectionStyle = _.get(_.find(_.get(store.state.commonData, [ 'sections', 'items' ]),
            { 'name': _.get(to, [ 'params', 'title' ]) }), [ 'style' ])
        fetchCommonData(store).then(() => {
          console.log('fetch common data sucessfully')
          fetchListData(store, type, sectionStyle, to).then(() => {
            console.log('fetch common data sucessfully')            
          }).then(() => {
            next()
          })
        })
    } else {
      console.log('first rendering')
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.page = PAGE
    const type = _.toUpper(_.split(to.path, '/')[1])
    const sectionStyle = _.get(_.find(_.get(this.$store.state.commonData, [ 'sections', 'items' ]), { 'name': to.params.title }), [ 'style' ])
    fetchListDataBeforeRouteUpdate(this.$store, type, sectionStyle, to).then(() => {
      next()
    })
  },
  data () {
    return {
      commonData: this.$store.state.commonData,
      dfpid: DFP_ID,
      dfpUnits: DFP_UNITS,
      loading: false,
      page: PAGE,
      showDfpCoverAdFlag: false,
      viewport: undefined,
    }
  },
  computed: {
    articles () {
      switch (this.type) {
        case AUTHOR:
          return this.$store.state.articles
          break
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return this.$store.state.commonData.topics
          } else {
            return this.$store.state.articlesByUUID
          }
          break
        case TOPIC:
          return this.$store.state.articlesByUUID
          break
        default:
          return this.$store.state.articlesByUUID
      }
    },
    audios () {
      return this.$store.state.audios
    },
    customCSS () {
      switch (this.type) {
        case SECTION:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'css' ], null)
        case TAG:
          return _.get(this.tag, [ 'css' ])
        case TOPIC:
          const _style = _.get(this.topic, [ 'style' ], null)
          return _style
        default:
          return null
      }
    },
    customJS () {
      switch (this.type) {
        case SECTION:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'javascript' ], null)
        case TOPIC:
          const _javascript = _.get(this.topic, [ 'javascript' ], null)
          return _javascript
        default:
          return null
      }
    },
    dfpOptions() {
      return {
        afterEachAdLoaded: (event) => {
          const dfpCover = document.querySelector(`#${event.slot.getSlotElementId()}`)
          const position = dfpCover.getAttribute('pos')
          if(position === 'LMBCVR' || position === 'MBCVR') {
            const adDisplayStatus = dfpCover.currentStyle ? dfpCover.currentStyle.display : window.getComputedStyle(dfpCover, null).display
            if(adDisplayStatus === 'none') {
              this.showDfpCoverAdFlag = false
            } else {
              this.updateCookie()
            }
          }
        },
        setCentering: true,
      }
    },
    hasDFP () {
      return !(this.type === TOPIC || this.$route.params.title === 'topic')
    },
    hasMore () {
      switch (this.name) {
        case 'audio':
          return _.get(this.audios, [ 'items', 'length' ], 0) < _.get(this.audios, [ 'meta', 'total' ], 0)
          break
        case 'videohub':
          return _.get(this.playlist, [ 'items', 'length' ], 0) < _.get(this.playlist, [ 'pageInfo', 'totalResults' ], 0)
          break
        default:
          return _.get(this.articles, [ 'items', 'length' ], 0) < _.get(this.articles, [ 'meta', 'total' ], 0)
      }
    },
    name () {
      switch (this.type) {
        case CATEGORY:
          return this.$route.params.title
      }
    },
    section () {
      return _.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title })
    },
    sectionName () {
      switch (this.type) {
        case CATEGORY:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), (s) => {
            return _.find(s.categories, { 'id': this.uuid })
          }), [ 'name' ], 'other')
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'other'
          } else {
            return this.$route.params.title
          }
        case TAG:
          return _.get(this.tag, 'sections[0].name')
        case TOPIC:
          if (_.get(this.$route, [ 'params', 'topicId' ]) === TOPIC_WATCH_ID) {
            return 'watch'
          }
          return 'other'
        default:
          return 'other'
      }
    },
    sectionfeatured () {
      return _.get(_.pick(_.get(this.$store.state.commonData, [ 'sectionfeatured', 'items' ]), this.sectionName), [ this.sectionName ])
    },
    sectionId () {
      switch (this.type) {
        case CATEGORY:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), (s) => {
            return _.find(s.categories, { 'id': this.uuid })
          }), [ 'id' ], 'other')
        case SECTION:
          return _.get(this, [ 'uuid' ], 'other')
        default:
          return 'other'
      }
    },
    pageStyle () {
      switch (this.type) {
        case TAG:
          return _.get(this.$store.state, [ 'tag', 'style' ], 'feature')
          break
        case TOPIC:
          if (this.$route.params.topicId === TOPIC_WATCH_ID) {
            return 'full'
          }
          return 'feature'
        default:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'style' ], 'feature')
      }
    },
    playlist () {
      return this.$store.state.playlist
    },
    tag () {
      return _.get(this.$store.state, [ 'tag' ])
    },
    title () {
      switch (this.type) {
        case AUTHOR:
          return this.$route.params.authorName
        case CATEGORY:
          switch (this.$route.params.title) {
            case 'audio':
              return 'Audio'
            case 'marketing':
              return '企劃特輯'
            case 'campaign':
              return '活動專區'
            default:
              return _.get(_.find(_.get(this.commonData, [ 'categories' ]), { 'name': this.$route.params.title }), [ 'title' ])
          }
        case SECTION:
          if (this.$route.params.title === 'topic') {
            return 'Topic'
          } else {
            return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'title' ])
          }
          break
        case TAG:
          return _.get(this.tag, [ 'name' ])
        case TOPIC:
          if (_.get(this.$route, [ 'params', 'topicId' ]) === TOPIC_WATCH_ID) {
            return '錶展特區'
          }
          return _.get(_.find(_.get(this.commonData, [ 'topics', 'items' ]), { 'id': this.$route.params.topicId }), [ 'name' ])
      }
    },
    topic () {
      if (this.type === TOPIC) {
        return (this.$store.state.topic.items)
          ? _.assign(_.get(this.$store.state, [ 'topic', 'items', '0' ]), { images: _.get(this.$store.state, [ 'images' ]) })
          : _.find(_.get(this.commonData, [ 'topics', 'items' ]), { 'id': this.uuid })
      } else {
        return _.get(this.$store.state, [ 'topic' ])
      }
    },
    type () {
      return _.toUpper(_.split(this.$route.path, '/')[1])
    },
    uuid () {
      switch (this.type) {
        case AUTHOR:
          return this.$route.params.authorId
        case CATEGORY:
          return _.get(_.find(_.get(this.commonData, [ 'categories' ]), { 'name': this.$route.params.title }), [ 'id' ])
        case SECTION:
          return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { 'name': this.$route.params.title }), [ 'id' ])
        case TAG:
          return this.$route.params.tagId
        case TOPIC:
          return this.$route.params.topicId
      }
    }
  },
  methods: {
    closeCoverAd() {
      this.showDfpCoverAdFlag = false
    },
    getImage,
    getValue,
    insertCustomizedMarkup () {
      const custCss = document.createElement('style')
      const custScript = document.createElement('script')
      custCss.setAttribute('id', 'custCSS')
      custScript.setAttribute('id', 'custJS')
      if (this.customCSS) {
        custCss.appendChild(document.createTextNode(this.customCSS))
      }
      if (this.customJS) {
        custScript.appendChild(document.createTextNode(this.customJS))
      }
      document.querySelector('body').appendChild(custCss)
      document.querySelector('body').appendChild(custScript)
    },
    loadMore () {
      this.page += 1
      this.loading = true
      switch (this.type) {
        case AUTHOR:
          fetchArticlesByAuthor(this.$store, this.uuid, {
            page: this.page,
            max_results: LOADMOREMAXRESULT
          }).then(() => {
            this.articles = this.$store.state.articles
            this.loading = false
          })
          break
        case SECTION:
          switch (this.pageStyle) {
            case 'full':
              fetchArticlesByUuid(this.$store, this.uuid, SECTION, {
                page: this.page,
                max_results: LOADMOREMAXRESULT,
                related: 'full'
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
                this.loading = false
              })
              break
            default:
              if (this.$route.params.title === 'topic') {
                fetchTopics(this.$store, {
                  page: this.page,
                  max_results: LOADMOREMAXRESULT
                }).then(() => {
                  const orig = _.values(this.articles[ 'items' ])
                  const concat = _.concat(orig, _.get(this.$store.state, [ 'topic', 'items' ]))
                  this.articles[ 'meta' ] = _.get(this.$store.state, [ 'topic', 'meta' ])
                  this.articles[ 'items' ] = concat
                  this.loading = false
                })
              } else {
                fetchArticlesByUuid(this.$store, this.uuid, SECTION, {
                  page: this.page,
                  max_results: LOADMOREMAXRESULT
                }).then(() => {
                  this.articles = this.$store.state.articlesByUUID
                  this.loading = false
                })
              }
          }
          break
        default:
          switch (this.name) {
            case 'audio':
              fetchAudios(this.$store, {
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.audios = this.$store.state.audios
                this.loading = false
              })
              break
            case 'videohub':
              const pageToken = _.get(this.playlist, [ 'nextPageToken' ])
              fetchYoutubePlaylist(this.$store, MAXRESULT, pageToken).then(() => {
                this.playlist = this.$store.state.playlist
                this.loading = false
              })
              break
            case 'marketing':
              fetchArticlesByUuid(this.$store, MARKETING_ID, this.type, {
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
                this.loading = false
              })
              break
            case 'campaign':
              fetchArticlesByUuid(this.$store, CAMPAIGN_ID, this.type, {
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
                this.loading = false
              })
              break
            default:
              fetchArticlesByUuid(this.$store, this.uuid, this.type, {
                page: this.page,
                max_results: MAXRESULT
              }).then(() => {
                this.articles = this.$store.state.articlesByUUID
                this.loading = false
              })
          }
      }
    },
    updateCookie() {
      const cookie = Cookie.get('visited')
      if(!cookie) {
        Cookie.set('visited', 'true', { expires: '10m' })
        this.showDfpCoverAdFlag = true
      } else {
        this.showDfpCoverAdFlag = false
      }
    },
    updateCustomizedMarkup () {
      const custCss = document.querySelector('#custCSS')
      const custScript = document.querySelector('#custJS')
      if (!custCss || !custScript) { this.insertCustomizedMarkup(); return }
      if (this.customCSS) {
        custCss.innerHTML = this.customCSS
      }
      if (this.customJS) {
        custScript.innerHTML = this.customJS
      }
    },
    updateViewport() {
        if(process.env.VUE_ENV === 'client') {
          this.viewport = document.querySelector('body').offsetWidth
        }
    },
  },
  metaInfo () {
    const type = this.type
    const description = '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
    let ogImage
    let ogTitle
    let ogDescription
    let sectionName
    _.get(this, [ 'type' ]) === 'SECTION' || _.get(this, [ 'type' ]) === 'CATEGORY' ? sectionName = _.get(this, [ 'sectionName' ]) : ''
    switch (type) {
      case SECTION:
        const imageURL = _.get(this.section, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ], null) ? _.get(this.section, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) : _.get(this.section, [ 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ], null)
        sectionName = _.get(this, [ 'sectionName' ])
        ogImage = imageURL ? imageURL : '/public/notImage.png'
        ogTitle = _.get(this.section, [ 'ogTitle' ], null) ? _.get(this.section, [ 'ogTitle' ]) : _.get(this.section, [ 'title' ], this.title)
        ogDescription = _.get(this.section, [ 'ogDescription' ], null) ? _.get(this.section, [ 'ogDescription' ]) : _.get(this.section, [ 'description' ])
        break
      case TOPIC:
        ogImage = _.get(this.topic, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ], null) ? _.get(this.topic, [ 'ogImage', 'image', 'resizedTargets', 'desktop', 'url' ]) : '/public/notImage.png'
        if (this.$route.params.topicId === 'topic') {
          ogTitle = 'Topic'
        } else {
          ogTitle = _.get(this.topic, [ 'ogTitle' ], null) ? _.get(this.topic, [ 'ogTitle' ]) : _.get(this.topic, [ 'title' ], this.title)
        }
        ogDescription = _.get(this.topic, [ 'ogDescription' ], null) ? _.get(this.topic, [ 'ogDescription' ]) : description
        break
      default:
        ogTitle = this.title
        ogImage = '/public/notImage.png'
        ogDescription = description
    }
    if(!ogTitle && process.env.VUE_ENV === 'server') {
      throw { massage : 'Page Not Found', code: '404' }
    }
    const title = ogTitle + ' - 鏡週刊 Mirror Media'

    return {
      title,
      meta: [
          { name: 'keywords', content: '鏡週刊,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說' },
          { name: 'description', content: ogDescription },
          { name: 'section-name', content: sectionName },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: ogDescription },
          { name: 'twitter:image', content: ogImage },
          { property: 'fb:app_id', content: FB_APP_ID },
          { property: 'fb:pages', content: FB_PAGE_ID },
          { property: 'og:site_name', content: '鏡週刊 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: ogDescription },
          { property: 'og:url', content: SITE_URL },
          { property: 'og:image', content: ogImage }
      ]
    }
  },
  updated () {
    this.updateCustomizedMarkup()
  }
}

</script>
<style lang="stylus" scoped>

$color-news = #30bac8
$color-entertainment = #bf3284
$color-foodtravel = #eac151
$color-watch = #c1d16e
$color-projects = #000
$color-other = #bcbcbc

.list
  &-view
    background-color #f2f2f2
    .topic
      width 100%
      height 700px
      background-color rgba(135, 156, 169, 0.15)
      margin-bottom 20px
      background-repeat no-repeat
      background-position center center
      background-size cover
      padding 50px
      
      &-title
        height 200px
        width 400px
        display flex
        justify-content center
        align-items center  
        color #fff
        background-size contain
        background-position center center
        background-repeat no-repeat
      
  &-title
    &.container
      position relative
      align-items center
      flex-direction row
      margin-top 40px
      padding 0 2em

    &__text
      font-size 3rem

    &__colorBlock
      flex-grow 1
      height 10px
      margin-left: 10px
      &.news-people
        background linear-gradient(to right, $color-news 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.entertainment
        background linear-gradient(to right, $color-entertainment 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.foodtravel
        background linear-gradient(to right, $color-foodtravel 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.watch
        background linear-gradient(to right, $color-watch 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.projects
        background linear-gradient(to right, $color-projects 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.hotvideo
        background linear-gradient(to right, $color-other 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

      &.other
        background linear-gradient(to right, $color-other 0%, rgba(242, 242, 242, 1) 70%, rgba(242, 242, 242, 1) 100%)

.listFull
  &-view
    background-color #f5f5f5

@media (min-width: 600px)
  .list
    &-title
      &.container
        padding-left 0

@media (min-width: 1200px)
  .listFull
    &-dfp
      width 970px
      &.dfp-FT
        height 90px

.footer
  &.container
    flex-direction column
    align-items stretch

.news-people
  color $color-news

.entertainment
  color $color-entertainment

.foodtravel
  color $color-foodtravel

.watch
  color $color-watch

.projects
  color $color-projects

.other
  color $color-other

</style>
