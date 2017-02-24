'use strict'

export const  SECTION_MAP = {
  '57e1e0e5ee85930e00cad4e9': { 'bgcolor': '#30bac8', 'borderLeft' : '7px solid #30bac8', 'border' : '2px solid #30bac8'  },
  '57e1e11cee85930e00cad4ea': { 'bgcolor': '#bf3284', 'borderLeft' : '7px solid #bf3284', 'border' : '2px solid #bf3284'  },
  '57dfe399ee85930e00cad4d6': { 'bgcolor': '#eac151', 'borderLeft' : '7px solid #eac151', 'border' : '2px solid #eac151'  },
  '57dfe3b0ee85930e00cad4d7': { 'bgcolor': '#c1d16e', 'borderLeft' : '7px solid #c1d16e', 'border' : '2px solid #c1d16e'  }
}

export const DFP_UNITS = {
  'home': {
    'SPCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'SPCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },
    'TEST': { 'aduid' : 'test_pc_list_NA1', 'dimensions':'fluid', 'cont-class':[ '' ] }
  },
  '57e1e0e5ee85930e00cad4e9': { //news-people
    'SPCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'SPCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },

    'PCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'PCR1': { 'aduid':'mm_mobile_wat_300x250_L1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'center' ] },
    'PCR2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250,300x600', 'cont-class':[ 'ad-container', 'center' ] },
    'PCAR': { 'aduid':'test_pc_np_ap_640x390_IR', 'dimensions':'640x390', 'cont-class':[ 'ad-container' ] },
    'PCE1': { 'aduid':'test_pc_np_ap_300x250_E1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCE2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },
    'MBHD': { 'aduid':'test_mobile_np_ap_300x250_HD', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR1': { 'aduid':'test_mobile_np_ap_300x250_AT1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR2': { 'aduid':'test_mobile_np_ap_300x250_AT2', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBE1': { 'aduid':'test_mobile_np_ap_300x250_E1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBFT': { 'aduid':'test_mobile_np_ap_320x100_FT', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBCVR': { 'aduid' : 'test_mobile_hp_320x480_FS', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'TEST': { 'aduid' : 'test_pc_list_NA1', 'dimensions':'fluid', 'cont-class':[ 'articleList-block' ] }
  },
  '57e1e11cee85930e00cad4ea': { //entertainment
    'SPCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'SPCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },

    'PCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'PCR1': { 'aduid':'mm_mobile_wat_300x250_L1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'center' ] },
    'PCR2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250,300x600', 'cont-class':[ 'ad-container', 'center' ] },
    'PCAR': { 'aduid':'test_pc_np_ap_640x390_IR', 'dimensions':'640x390', 'cont-class':[ 'ad-container' ] },
    'PCE1': { 'aduid':'test_pc_np_ap_300x250_E1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCE2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },
    'MBHD': { 'aduid':'test_mobile_np_ap_300x250_HD', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR1': { 'aduid':'test_mobile_np_ap_300x250_AT1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR2': { 'aduid':'test_mobile_np_ap_300x250_AT2', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBE1': { 'aduid':'test_mobile_np_ap_300x250_E1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBFT': { 'aduid':'test_mobile_np_ap_320x100_FT', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBCVR': { 'aduid' : 'test_mobile_hp_320x480_FS', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'TEST': { 'aduid' : 'test_pc_list_NA1', 'dimensions':'fluid', 'cont-class':[ 'articleList-block' ] }
  },
  '57dfe399ee85930e00cad4d6': { //food-travle
    'SPCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'SPCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },

    'PCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'PCR1': { 'aduid':'mm_mobile_wat_300x250_L1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'center' ] },
    'PCR2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250,300x600', 'cont-class':[ 'ad-container', 'center' ] },
    'PCAR': { 'aduid':'test_pc_np_ap_640x390_IR', 'dimensions':'640x390', 'cont-class':[ 'ad-container' ] },
    'PCE1': { 'aduid':'test_pc_np_ap_300x250_E1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCE2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },
    'MBHD': { 'aduid':'test_mobile_np_ap_300x250_HD', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR1': { 'aduid':'test_mobile_np_ap_300x250_AT1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR2': { 'aduid':'test_mobile_np_ap_300x250_AT2', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBE1': { 'aduid':'test_mobile_np_ap_300x250_E1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBFT': { 'aduid':'test_mobile_np_ap_320x100_FT', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBCVR': { 'aduid' : 'test_mobile_hp_320x480_FS', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'TEST': { 'aduid' : 'test_pc_list_NA1', 'dimensions':'fluid', 'cont-class':[ 'articleList-block' ] }
  },
  '57dfe3cfee85930e00cad4d8': { //hot-video
    'SPCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'SPCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },

    'PCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'PCR1': { 'aduid':'mm_mobile_wat_300x250_L1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'center' ] },
    'PCR2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250,300x600', 'cont-class':[ 'ad-container', 'center' ] },
    'PCAR': { 'aduid':'test_pc_np_ap_640x390_IR', 'dimensions':'640x390', 'cont-class':[ 'ad-container' ] },
    'PCE1': { 'aduid':'test_pc_np_ap_300x250_E1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCE2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },
    'MBHD': { 'aduid':'test_mobile_np_ap_300x250_HD', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR1': { 'aduid':'test_mobile_np_ap_300x250_AT1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR2': { 'aduid':'test_mobile_np_ap_300x250_AT2', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBE1': { 'aduid':'test_mobile_np_ap_300x250_E1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBFT': { 'aduid':'test_mobile_np_ap_320x100_FT', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBCVR': { 'aduid' : 'test_mobile_hp_320x480_FS', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'TEST': { 'aduid' : 'test_pc_list_NA1', 'dimensions':'fluid', 'cont-class':[ 'articleList-block' ] }
  },
  '57dfe3b0ee85930e00cad4d7': { //watch
    'SPCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'SPCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },
    
    'PCHD': { 'aduid':'test_pc_np_ap_970x250_HD', 'dimensions':'970x250', 'cont-class':[ 'ad-container', 'center', 'margin-top-0' ] },
    'PCR1': { 'aduid':'mm_mobile_wat_300x250_L1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'center' ] },
    'PCR2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250,300x600', 'cont-class':[ 'ad-container', 'center' ] },
    'PCAR': { 'aduid':'test_pc_np_ap_640x390_IR', 'dimensions':'640x390', 'cont-class':[ 'ad-container' ] },
    'PCE1': { 'aduid':'test_pc_np_ap_300x250_E1', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCE2': { 'aduid':'mm_pc_hp_300x250_1st', 'dimensions':'300x250', 'cont-class':[ 'ad-container', 'margin-top-30px' ] },
    'PCFT': { 'aduid':'test_pc_np_ap_970x90_FT', 'dimensions':'970x90,970x90', 'cont-class':[ 'ad-container' ] },
    'MBHD': { 'aduid':'test_mobile_np_ap_300x250_HD', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR1': { 'aduid':'test_mobile_np_ap_300x250_AT1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBAR2': { 'aduid':'test_mobile_np_ap_300x250_AT2', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBE1': { 'aduid':'test_mobile_np_ap_300x250_E1', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBFT': { 'aduid':'test_mobile_np_ap_320x100_FT', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'MBCVR': { 'aduid' : 'test_mobile_hp_320x480_FS', 'dimensions':'', 'cont-class':[ 'ad-container' ] },
    'TEST': { 'aduid' : 'test_pc_list_NA1', 'dimensions':'fluid', 'cont-class':[ 'articleList-block' ] }
  },
}

export const DFP_ID = '40175602'
export const DFP_OPTIONS = {
  dfpID: '',
  setTargeting: {},
  setCategoryExclusion: '',
  setLocation: '',
  enableSingleRequest: true,
  collapseEmptyDivs: 'original',
  refreshExisting: true,
  disablePublisherConsole: false,
  disableInitialLoad: false,
  setCentering: false,
  noFetch: false,
  namespace: undefined,
  sizeMapping: [],
  afterAdBlocked: undefined,
  afterEachAdLoaded: undefined,
  afterAllAdsLoaded: undefined
}

export const SOCIAL_LINK = {
  SUBSCRIBE: 'https://goo.gl/forms/g2ny8HzAXTAfwH6I2',
  LINE: 'https://line.me/R/ti/p/%40cuk1273e',
  WEIBO: 'http://www.weibo.com/u/6030041924?is_all=1',
  FACEBOOK: 'https://www.facebook.com/mirrormediamg/',
  WECHAT: '#',
  INSTAGRAM: 'https://www.instagram.com/mirror_media/',
  FEED: 'https://www.mirrormedia.mg/story/rss.xml',
  EMAIL: 'mailto:mirror885@mirrormedia.mg'
}

export const AUTHOR = 'AUTHOR'

export const CATEGORY = 'CATEGORY'

export const SEARCH = 'SEARCH'

export const SECTION = 'SECTION'

export const TAG = 'TAG'

export const TOPIC = 'TOPIC'
