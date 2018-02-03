'use strict'
import dfpUnitId from './dfpUnit.js'

export const SECTION_MAP = {
  // news
  '57e1e0e5ee85930e00cad4e9': { 'bgcolor': '#30bac8' },
  // entertainment
  '57e1e11cee85930e00cad4ea': { 'bgcolor': '#bf3284' },
  // businessmoney category-business-money
  '596441d04bbe120f002a319a': { 'bgcolor': '#009045' },
  'category-business-money': { 'bgcolor': '#009045' },
  // people
  '596441604bbe120f002a3197': { 'bgcolor': '#efa256' },
  // videohub
  '5975ab2de531830d00e32b2f': { 'bgcolor': '#969696' },
  // international
  '5964400d4bbe120f002a3191': { 'bgcolor': '#911f27' },
  // foodtravel
  '57dfe399ee85930e00cad4d6': { 'bgcolor': '#eac151' },
  // mafalda
  '5971aa8ce531830d00e32812': { 'bgcolor': '#662d8e' },
  // culture
  '5964418a4bbe120f002a3198': { 'bgcolor': '#009245' },
  // watch
  '57dfe3b0ee85930e00cad4d7': { 'bgcolor': '#c1d16e' },
  // external
  'external': { 'bgcolor': '#ee5a24' }
}

export const DFP_SIZE_MAPPING = {
  'default': [
    { browser: [ 0, 0 ], ad_sizes: [] },
    { browser: [ 970, 200 ], ad_sizes: [ [ 1, 1 ], [ 970, 90 ], [ 970, 250 ], [ 300, 250 ], [ 300, 600 ] ] }
  ],
  'mobile-only': [
    { browser: [ 1, 1 ], ad_sizes: [ [ 1, 1 ], [ 320, 100 ], [ 300, 250 ], [ 320, 480 ] ] },
    { browser: [ 970, 200 ], ad_sizes: [] }
  ]
}

export const DFP_UNITS = dfpUnitId
export const DFP_ID = '40175602'
export const DFP_OPTIONS = {
  dfpID: '',
  setTargeting: {},
  setCategoryExclusion: '',
  setLocation: '',
  enableSyncRendering: false,
  enableSingleRequest: true,
  collapseEmptyDivs: 'original',
  refreshExisting: true,
  disablePublisherConsole: false,
  disableInitialLoad: true,
  setCentering: false,
  noFetch: false,
  namespace: undefined,
  sizeMapping: [],
  afterAdBlocked: undefined,
  afterEachAdLoaded: undefined,
  afterAllAdsLoaded: undefined
}

export const VPON_CONFIG = {
  vpon_ad_test: '0',
  // vpon_ad_licensy_key: '8a8081825d0c002f015d35a443c237c0',
  vpon_ad_licensy_key: '8a8081825e98980c015e9d59341707d0',
  vpon_ad_format: 'mi',
  debug: true
}

export const GA_ID = 'UA-83609754-1'
export const GA_TEST_ID = 'UA-83609754-2'

export const SOCIAL_LINK = {
  AD: 'https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam',
  AUTH: 'https://www.mirrormedia.mg/story/webauthorize/',
  DOWNLOADAPP: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',
  EMAIL: 'mailto:mirror885@mirrormedia.mg',
  FACEBOOK: 'https://www.facebook.com/mirrormediamg/',
  FACEBOOK_FOODTRAVEL: 'https://www.facebook.com/MirrorMediaFoodTravel/',
  FEED: 'https://www.mirrormedia.mg/rss/rss.xml',
  INSTAGRAM: 'https://www.instagram.com/mirror_media/',
  LINE: 'https://line.me/R/ti/p/%40cuk1273e',
  MAGAZINE: 'https://mybook.taiwanmobile.com/ebook/store_front/activities/2017PC/MIR88/',
  SUBSCRIBE: 'https://goo.gl/forms/g2ny8HzAXTAfwH6I2',
  WECHAT: '#',
  WEIBO: 'http://www.weibo.com/u/6030041924?is_all=1'
}

export const AUTHOR = 'AUTHOR'

export const CATEGORY = 'CATEGORY'

export const EXTERNALS = 'EXTERNALS'

export const SEARCH = 'SEARCH'

export const SECTION = 'SECTION'

export const TAG = 'TAG'

export const TOPIC = 'TOPIC'

export const SECTION_FOODTRAVEL_ID = '57dfe399ee85930e00cad4d6'

export const SECTION_WATCH_ID = '57dfe3b0ee85930e00cad4d7'

export const CATEGORY＿INTERVIEW_ID = '5975642de531830d00e32a5b'

export const CATEGORY＿ORALREADING_ID = '58ef372a7bce2b0e0048288c'

export const AUDIO_ID = '58ef372a7bce2b0e0048288c'

export const CAMPAIGN_ID = '5859e7e5c0ff6d0d00246263'

export const MARKETING_ID = '57fca2f5c9b7a70e004e6df9'

export const VIDEOHUB_ID = '5975ab2de531830d00e32b2f'

export const TOPIC_FINPROJECT_ID = '5948a49fe28c300d0035971a'

export const TOPIC_PROTEST_ID = '59151f0ff2179c0d0089b7d5'

export const TOPIC_WATCH_ID = '586cd15c3c1f950d00ce2e78'

export const TAG_INTERVIEW_ID = '59647e9e4bbe120f002a3282'

export const TAG_ORALREADING_ID = '59647e964bbe120f002a3281'

export const SITE_DESCRIPTION = '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'

export const SITE_KEYWORDS = '鏡週刊,mirror media,新聞人物,娛樂焦點,美食旅遊,瑪法達'

export const SITE_OGIMAGE = 'https://www.mirrormedia.mg/public/notImage.png'

export const SITE_TITLE = '鏡週刊 Mirror Media'

export const SITE_TITLE_SHORT = '鏡週刊'

export const SITE_URL = 'https://www.mirrormedia.mg'

export const SITE_PROJ_URL = 'https://projects.mirrormedia.mg'

export const SITE_DOMAIN = 'mirrormedia.mg'

export const FB_APP_ID = '175313259598308'

export const FB_PAGE_ID = '1855418728011324'

export const MM_TV_CH = '鏡電視'

export const RELATED_LIST_MAX = 10

export const RECOMM_HITORY_MAX_IN_LOCALSTORAGE = 10
