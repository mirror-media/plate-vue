import Vue from 'vue'
import Vuex from 'vuex'
import { DFPID, FB_APP_ID, FB_PAGES_ID } from '../../api/config'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const state = {
  activities: {},
  articles: {},
  articlesByUUID: {
    CATEGORY: {},
    SECTION: {},
    TAG: {},
    TOPIC: {}
  },
  articlesPopList: {},
  articlesRecommendList: {},
  articlesGroupedList: {},
  audios: {},
  authors: [],
  commonData: {},
  contact: {},
  dfpId: DFPID,
  editorChoice: {},
  eventEmbedded: {},
  eventLogo: {},
  eventMod: {},
  external: {},
  externals: {},
  fbAppId: FB_APP_ID,
  fbPagesId: FB_PAGES_ID,
  highlightNodes: {},
  images: {},
  imagesById: [],
  isTimeToShowAdCover: false,
  latestArticle: {},
  latestArticles: {},
  latestNewsFromJson: {},
  nodes: {},
  ogimage: {},
  playlist: {
    info: {}
  },
  searchResult: {},
  tag: {},
  tags: [],
  timeline: {},
  topic: {},
  topics: {},
  uuid: '',
  videos: {},
  viewport: {
    height: 0,
    width: 0
  },
}

export function createStore () {
  return new Vuex.Store({
    state,
    actions,
    mutations,
    getters
  })
}
