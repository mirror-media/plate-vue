'use strict'

export const SECTION_MAP = {
  '57e1e0e5ee85930e00cad4e9': { 'bgcolor': '#30bac8', 'borderLeft': '7px solid #30bac8', 'border': '2px solid #30bac8', 'ifShowPoplist': true, 'label-width': '45px', 'label-width-tablet': '60px', 'label-width-mobile': '60px' },
  '57e1e11cee85930e00cad4ea': { 'bgcolor': '#bf3284', 'borderLeft': '7px solid #bf3284', 'border': '2px solid #bf3284', 'ifShowPoplist': true, 'label-width': '45px', 'label-width-tablet': '60px', 'label-width-mobile': '60px' },
  '57dfe399ee85930e00cad4d6': { 'bgcolor': '#eac151', 'borderLeft': '7px solid #eac151', 'border': '2px solid #eac151', 'ifShowPoplist': true, 'label-width': '65px', 'label-width-tablet': '60px', 'label-width-mobile': '85px' },
  '57dfe3b0ee85930e00cad4d7': { 'bgcolor': '#c1d16e', 'borderLeft': '7px solid #c1d16e', 'border': '2px solid #c1d16e', 'ifShowPoplist': false, 'label-width': '45px', 'label-width-tablet': '60px', 'label-width-mobile': '60px' }
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

export const DFP_UNITS = {
  'default': { // default
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    'MBHD': { 'aduid': 'mm_mobile_other_ap_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'MBAR1': { 'aduid': 'mm_mobile_other_ap_300x250_AT1', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBAR2': { 'aduid': 'mm_mobile_other_ap_300x250_AT2', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBE1': { 'aduid': 'mm_mobile_other_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBFT': { 'aduid': 'mm_mobile_other_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // MBHD, MBL1, MBFT : position on listing page
    'LMBHD': { 'aduid': 'mm_mobile_other_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL1': { 'aduid': 'mm_mobile_other_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBFT': { 'aduid': 'mm_mobile_other_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    'PCHD': { 'aduid': 'test_pc_np_ap_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCR1': { 'aduid': 'test_pc_np_ap_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCR2': { 'aduid': 'test_pc_np_ap_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCAR': { 'aduid': 'mm_pc_other_ap_640x390_AT1', 'dimensions': '1x1,640x390', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ 'clear: both' ] },
    'PCE1': { 'aduid': 'test_pc_np_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCE2': { 'aduid': 'test_pc_np_ap_300x250_E2', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCFT': { 'aduid': 'test_pc_np_ap_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    'PCPOP3': { 'aduid': 'mm_RWD_other_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP5': { 'aduid': 'mm_RWD_other_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP7': { 'aduid': 'mm_RWD_other_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    // SPCHD, SPCFT : position on listing page
    'LPCHD': { 'aduid': 'test_pc_np_ap_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'LPCFT': { 'aduid': 'test_pc_np_ap_970x90_FT', 'dimensions': '970x90,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 20px auto 0' ] },
    'LPCNA3': { 'aduid': 'mm_RWD_other_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA5': { 'aduid': 'mm_RWD_other_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA9': { 'aduid': 'mm_RWD_other_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] }
  },
  'home': { //  homepage
    'LMBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LMBHD': { 'aduid': 'mm_mobile_hp_320x100_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'LMBFS': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL1': { 'aduid': 'mm_mobile_hp_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin-bottom: 35px;' ] },
    'LMBFT': { 'aduid': 'mm_mobile_hp_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin-top: 20px' ] },
    'LMBNA4': { 'aduid': 'mm_mobile_hp_fluid_NA4', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LMBNA7': { 'aduid': 'mm_mobile_hp_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LMBNA12': { 'aduid': 'mm_mobile_hp_fluid_NA12', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LMBNA3': { 'aduid': 'mm_mobile_hp_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LMBNA5': { 'aduid': 'mm_mobile_hp_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LMBNA9': { 'aduid': 'mm_mobile_hp_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LPCHD': { 'aduid': 'mm_pc_hp_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LPCFT': { 'aduid': 'mm_pc_hp_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin-top: 20px' ] },
    'LPCNA4': { 'aduid': 'mm_PC_hp_fluid_NA4', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA7': { 'aduid': 'mm_PC_hp_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA12': { 'aduid': 'mm_PC_hp_fluid_NA12', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA3': { 'aduid': 'mm_PC_hp_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA5': { 'aduid': 'mm_PC_hp_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA9': { 'aduid': 'mm_PC_hp_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] }
  },
  'other': { //  topic

    'SMBHD': { 'aduid': 'mm_mobile_wat_sec_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'SMBL1': { 'aduid': 'mm_mobile_wat_sec_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'SMBL2': { 'aduid': 'mm_mobile_wat_sec_300x250_L2', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'SMBL3': { 'aduid': 'mm_mobile_wat_sec_300x250_L3', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin-bottom: 20px' ] },
    'SMBFT': { 'aduid': 'mm_mobile_wat_sec_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ 'margin-bottom: 10px' ] },
    // SPCHD, SPCR1, SPCR2, SPCR3, SPCR4, SPCFT : position on desktop section page
    'SPCHD': { 'aduid': 'mm_pc_wat_sec_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'SPCR1': { 'aduid': 'mm_pc_wat_sec_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'SPCR2': { 'aduid': 'mm_pc_wat_sec_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'SPCR3': { 'aduid': 'mm_pc_wat_sec_300x250_R3', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ 'margin-bottom: 10px' ] },
    'SPCR4': { 'aduid': 'mm_pc_wat_sec_300x600_R4', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'SPCFT': { 'aduid': 'mm_pc_wat_sec_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ 'margin-bottom: 35px' ] },

    // MBHD, MBAR1, MBAR2, MBE1, MBFT : position on mobile article page
    'MBHD': { 'aduid': 'mm_mobile_other_ap_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'MBAR1': { 'aduid': 'mm_mobile_other_ap_300x250_AT1', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBAR2': { 'aduid': 'mm_mobile_other_ap_300x250_AT2', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBE1': { 'aduid': 'mm_mobile_other_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBFT': { 'aduid': 'mm_mobile_other_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },

    'LMBHD': { 'aduid': 'mm_mobile_other_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL1': { 'aduid': 'mm_mobile_other_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 0' ] },
    'LMBFT': { 'aduid': 'mm_mobile_other_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    'PCHD': { 'aduid': 'mm_pc_other_ap_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCR1': { 'aduid': 'mm_pc_other_ap_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCR2': { 'aduid': 'mm_pc_other_ap_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCAR': { 'aduid': 'mm_pc_other_ap_640x390_AT1', 'dimensions': '1x1,640x390', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ 'clear: both' ] },
    'PCE1': { 'aduid': 'mm_pc_other_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCE2': { 'aduid': 'mm_pc_other_ap_300x250_E2', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCFT': { 'aduid': 'mm_pc_other_ap_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    'PCPOP3': { 'aduid': 'mm_RWD_other_ap_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP5': { 'aduid': 'mm_RWD_other_ap_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP7': { 'aduid': 'mm_RWD_other_ap_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },

    'LPCHD': { 'aduid': 'mm_pc_other_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'LPCFT': { 'aduid': 'mm_pc_other_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto' ] },
    'LPCNA3': { 'aduid': 'mm_RWD_other_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA5': { 'aduid': 'mm_RWD_other_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA9': { 'aduid': 'mm_RWD_other_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] }
  },
  '57e1e0e5ee85930e00cad4e9': { // news-people
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    'MBHD': { 'aduid': 'mm_mobile_np_ap_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'MBAR1': { 'aduid': 'mm_mobile_np_ap_300x250_AT1', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBAR2': { 'aduid': 'mm_mobile_np_ap_300x250_AT2', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBE1': { 'aduid': 'mm_mobile_np_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBFT': { 'aduid': 'mm_mobile_np_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // MBHD, MBL1, MBFT
    'LMBHD': { 'aduid': 'mm_mobile_np_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL1': { 'aduid': 'mm_mobile_np_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 0' ] },
    'LMBFT': { 'aduid': 'mm_mobile_np_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'LMBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    'PCHD': { 'aduid': 'mm_pc_np_ap_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ], 'size-mapping': 'default' },
    'PCR1': { 'aduid': 'mm_pc_np_ap_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCR2': { 'aduid': 'mm_pc_np_ap_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCAR': { 'aduid': 'mm_pc_np_ap_640x390_AT1', 'dimensions': '1x1,640x390', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ 'clear: both' ] },
    'PCE1': { 'aduid': 'mm_pc_np_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCE2': { 'aduid': 'mm_pc_np_ap_300x250_E2', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCFT': { 'aduid': 'mm_pc_np_ap_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    'PCPOP3': { 'aduid': 'mm_RWD_np_ap_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP5': { 'aduid': 'mm_RWD_np_ap_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP7': { 'aduid': 'mm_RWD_np_ap_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    // SPCHD, SPCFT : position on listing page
    'LPCHD': { 'aduid': 'mm_pc_np_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'LPCFT': { 'aduid': 'mm_pc_np_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 20px auto' ] },
    'LPCNA3': { 'aduid': 'mm_RWD_np_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA5': { 'aduid': 'mm_RWD_np_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA9': { 'aduid': 'mm_RWD_np_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] }
  },
  '57e1e11cee85930e00cad4ea': { // entertainment
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    'MBHD': { 'aduid': 'mm_mobile_ent_ap_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'MBAR1': { 'aduid': 'mm_mobile_ent_ap_300x250_AT1', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBAR2': { 'aduid': 'mm_mobile_ent_ap_300x250_AT2', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBE1': { 'aduid': 'mm_mobile_ent_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBFT': { 'aduid': 'mm_mobile_ent_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // MBHD, MBL1, MBFT : position on listing page
    'LMBHD': { 'aduid': 'mm_mobile_ent_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL1': { 'aduid': 'mm_mobile_ent_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 0' ] },
    'LMBFT': { 'aduid': 'mm_mobile_ent_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'LMBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    'PCHD': { 'aduid': 'mm_pc_ent_ap_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCR1': { 'aduid': 'mm_pc_ent_ap_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCR2': { 'aduid': 'mm_pc_ent_ap_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCAR': { 'aduid': 'mm_pc_ent_ap_640x390_AT1', 'dimensions': '1x1,640x390', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ 'clear: both' ] },
    'PCE1': { 'aduid': 'mm_pc_ent_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCE2': { 'aduid': 'mm_pc_ent_ap_300x250_E2', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCFT': { 'aduid': 'mm_pc_ent_ap_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    'PCPOP3': { 'aduid': 'mm_RWD_ent_ap_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP5': { 'aduid': 'mm_RWD_ent_ap_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP7': { 'aduid': 'mm_RWD_ent_ap_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    // SPCHD, SPCFT : position on listing page
    'LPCHD': { 'aduid': 'mm_pc_ent_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'LPCFT': { 'aduid': 'mm_pc_ent_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 20px auto' ] },
    'LPCNA3': { 'aduid': 'mm_RWD_ent_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA5': { 'aduid': 'mm_RWD_ent_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA9': { 'aduid': 'mm_RWD_ent_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] }
  },
  '57dfe399ee85930e00cad4d6': { // food-travle
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    'MBHD': { 'aduid': 'mm_mobile_fnt_ap_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'MBAR1': { 'aduid': 'mm_mobile_fnt_ap_300x250_AT1', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBAR2': { 'aduid': 'mm_mobile_fnt_ap_300x250_AT2', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBE1': { 'aduid': 'mm_mobile_fnt_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBFT': { 'aduid': 'mm_mobile_fnt_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // MBHD, MBL1, MBFT : position on listing page
    'LMBHD': { 'aduid': 'mm_mobile_fnt_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL1': { 'aduid': 'mm_mobile_fnt_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 0' ] },
    'LMBSL1': { 'aduid': 'mm_mobile_fnt_sec_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 0' ] },
    'LMBFT': { 'aduid': 'mm_mobile_fnt_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'LMBSFT': { 'aduid': 'mm_mobile_fnt_sec_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'LMBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    'PCHD': { 'aduid': 'mm_pc_fnt_ap_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCR1': { 'aduid': 'mm_pc_fnt_ap_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCR2': { 'aduid': 'mm_pc_fnt_ap_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCAR': { 'aduid': 'mm_pc_fnt_ap_640x390_AT1', 'dimensions': '1x1,640x390', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ 'clear: both' ] },
    'PCE1': { 'aduid': 'mm_pc_fnt_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCE2': { 'aduid': 'mm_pc_fnt_ap_300x250_E2', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCFT': { 'aduid': 'mm_pc_fnt_ap_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    'PCPOP3': { 'aduid': 'mm_RWD_fnt_ap_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP5': { 'aduid': 'mm_RWD_fnt_ap_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP7': { 'aduid': 'mm_RWD_fnt_ap_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    // SPCHD, SPCFT : position on listing page
    'LPCHD': { 'aduid': 'mm_pc_fnt_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'LPCFT': { 'aduid': 'mm_pc_fnt_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 20px auto' ] },
    'LPCSFT': { 'aduid': 'mm_pc_fnt_sec_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 20px auto' ] },
    'LPCR1': { 'aduid': 'mm_pc_fnt_300x600_R1', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'LPCSR1': { 'aduid': 'mm_pc_fnt_sec_300x600_R1', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'LPCNA3': { 'aduid': 'mm_RWD_fnt_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA5': { 'aduid': 'mm_RWD_fnt_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA9': { 'aduid': 'mm_RWD_fnt_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] }
  },
  '57dfe3cfee85930e00cad4d8': { // hot-video
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    'MBHD': { 'aduid': 'mm_mobile_other_ap_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'MBAR1': { 'aduid': 'mm_mobile_other_ap_300x250_AT1', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBAR2': { 'aduid': 'mm_mobile_other_ap_300x250_AT2', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBE1': { 'aduid': 'mm_mobile_other_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBFT': { 'aduid': 'mm_mobile_other_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // MBHD, MBL1, MBFT : position on listing page
    'LMBHD': { 'aduid': 'mm_mobile_other_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL1': { 'aduid': 'mm_mobile_other_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 0' ] },
    'LMBFT': { 'aduid': 'mm_mobile_other_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    'PCHD': { 'aduid': 'mm_pc_other_ap_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCR1': { 'aduid': 'mm_pc_other_ap_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'PCR2': { 'aduid': 'mm_pc_other_ap_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'PCAR': { 'aduid': 'mm_pc_other_ap_640x390_AT1', 'dimensions': '1x1,640x390', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ 'clear: both' ] },
    'PCE1': { 'aduid': 'mm_pc_other_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCE2': { 'aduid': 'mm_pc_other_ap_300x250_E2', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCFT': { 'aduid': 'mm_pc_other_ap_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    'PCPOP3': { 'aduid': 'mm_RWD_other_ap_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP5': { 'aduid': 'mm_RWD_other_ap_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP7': { 'aduid': 'mm_RWD_other_ap_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    // SPCHD, SPCFT : position on listing page
    'LPCHD': { 'aduid': 'mm_pc_other_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'LPCFT': { 'aduid': 'mm_pc_other_970x90_FT', 'dimensions': '970x90,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin: 20px auto 0' ] },
    'LPCNA3': { 'aduid': 'mm_RWD_other_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA5': { 'aduid': 'mm_RWD_other_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA9': { 'aduid': 'mm_RWD_other_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] }
  },
  '57dfe3b0ee85930e00cad4d7': { // watch
    // -- Section Page
    // SMBHD, SMBL1, SMBL2, SMBL3, SMBFT : position on mobile section page
    'SMBHD': { 'aduid': 'mm_mobile_wat_sec_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'SMBL1': { 'aduid': 'mm_mobile_wat_sec_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'SMBL2': { 'aduid': 'mm_mobile_wat_sec_300x250_L2', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'SMBL3': { 'aduid': 'mm_mobile_wat_sec_300x250_L3', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin-bottom: 20px' ] },
    'SMBFT': { 'aduid': 'mm_mobile_wat_sec_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ 'margin-bottom: 10px' ] },
    // SPCHD, SPCR1, SPCR2, SPCR3, SPCR4, SPCFT : position on desktop section page
    'SPCHD': { 'aduid': 'mm_pc_wat_sec_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'SPCR1': { 'aduid': 'mm_pc_wat_sec_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'SPCR2': { 'aduid': 'mm_pc_wat_sec_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'SPCR3': { 'aduid': 'mm_pc_wat_sec_300x250_R3', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ 'margin-bottom: 10px' ] },
    'SPCR4': { 'aduid': 'mm_pc_wat_sec_300x600_R4', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'SPCFT': { 'aduid': 'mm_pc_wat_sec_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ 'margin-bottom: 35px' ] },
    // -- Category, Article Page
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    'MBHD': { 'aduid': 'mm_mobile_wat_ap_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'MBAR1': { 'aduid': 'mm_mobile_wat_ap_300x250_AT1', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBAR2': { 'aduid': 'mm_mobile_wat_ap_300x250_AT2', 'dimensions': '1x1,300x250', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ '' ] },
    'MBE1': { 'aduid': 'mm_mobile_wat_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBFT': { 'aduid': 'mm_mobile_wat_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'MBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // MBHD, MBL1, MBFT : position on listing page
    'LMBHD': { 'aduid': 'mm_mobile_wat_300x250_HD', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL1': { 'aduid': 'mm_mobile_wat_300x250_L1', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL2': { 'aduid': 'mm_mobile_wat_300x250_L2', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'LMBL3': { 'aduid': 'mm_mobile_wat_300x250_L3', 'dimensions': '300x250', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin-bottom: 20px' ] },
    'LMBFT': { 'aduid': 'mm_mobile_wat_ap_320x100_FT', 'dimensions': '300x250,320x100', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ 'margin-bottom: 10px' ] },
    'LMBCVR': { 'aduid': 'mm_mobile_hp_320x480_FS', 'dimensions': '320x480', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    'PCHD': { 'aduid': 'mm_pc_wat_ap_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCR1': { 'aduid': 'mm_pc_wat_ap_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCR2': { 'aduid': 'mm_pc_wat_ap_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    'PCAR': { 'aduid': 'mm_pc_wat_ap_640x390_AT1', 'dimensions': '1x1,640x390', 'cont-class': [ 'ad-container', 'margin-top-0', 'center' ], 'cont-style': [ 'clear: both' ] },
    'PCE1': { 'aduid': 'mm_pc_wat_ap_300x250_E1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCE2': { 'aduid': 'mm_pc_wat_ap_300x250_E2', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    'PCFT': { 'aduid': 'mm_pc_wat_ap_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ] },
    'PCFF': { 'aduid': 'mm_pc_wat_ap_200x200_floating', 'dimensions': '200x200', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ] },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    'PCPOP3': { 'aduid': 'mm_RWD_wat_ap_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP5': { 'aduid': 'mm_RWD_wat_ap_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'PCPOP7': { 'aduid': 'mm_RWD_wat_ap_fluid_NA7', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'pop_item', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    // SPCHD, SPCFT : position on listing page
    'LPCHD': { 'aduid': 'mm_pc_wat_970x250_HD', 'dimensions': '970x250,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'width: 970px', 'margin: 20px auto 0' ] },
    'LPCR1': { 'aduid': 'mm_pc_wat_300x250_R1', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LPCR2': { 'aduid': 'mm_pc_wat_300x600_R2', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LPCR3': { 'aduid': 'mm_pc_wat_300x250_R3', 'dimensions': '300x250', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ 'margin-bottom: 10px' ] },
    'LPCR4': { 'aduid': 'mm_pc_wat_300x600_R4', 'dimensions': '300x250,300x600', 'cont-class': [ 'ad-container', 'center', 'margin-top-0' ], 'cont-style': [ '' ] },
    'LPCFT': { 'aduid': 'mm_pc_wat_970x90_FT', 'dimensions': '970x90', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ 'margin-bottom: 35px' ] },
    'LPCNA3': { 'aduid': 'mm_RWD_wat_fluid_NA3', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA5': { 'aduid': 'mm_RWD_wat_fluid_NA5', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] },
    'LPCNA9': { 'aduid': 'mm_RWD_wat_fluid_NA9', 'dimensions': 'fluid', 'cont-class': [ 'ad-container', 'articleList-block', 'margin-top-0' ], 'cont-style': [ 'background-color: #f4f1e9' ] }
  }
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
  disableInitialLoad: true,
  setCentering: false,
  noFetch: false,
  namespace: undefined,
  sizeMapping: [],
  afterAdBlocked: undefined,
  afterEachAdLoaded: undefined,
  afterAllAdsLoaded: undefined
}

export const GA_ID = 'UA-83609754-1'
export const GA_TEST_ID = 'UA-83609754-2'

export const SOCIAL_LINK = {
  AD: 'https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam',
  DOWNLOADAPP: 'http://hyperurl.co/mmfooter',
  EMAIL: 'mailto:mirror885@mirrormedia.mg',
  FACEBOOK: 'https://www.facebook.com/mirrormediamg/',
  FACEBOOK_FOODTRAVEL: 'https://www.facebook.com/MirrorMediaFoodTravel/',
  FEED: 'https://www.mirrormedia.mg/rss/rss.xml',
  INSTAGRAM: 'https://www.instagram.com/mirror_media/',
  LINE: 'https://line.me/R/ti/p/%40cuk1273e',
  SUBSCRIBE: 'https://goo.gl/forms/g2ny8HzAXTAfwH6I2',
  WECHAT: '#',
  WEIBO: 'http://www.weibo.com/u/6030041924?is_all=1'
}

export const AUTHOR = 'AUTHOR'

export const CATEGORY = 'CATEGORY'

export const SEARCH = 'SEARCH'

export const SECTION = 'SECTION'

export const TAG = 'TAG'

export const TOPIC = 'TOPIC'

export const SECTION_WATCH_ID = '57dfe3b0ee85930e00cad4d7'

export const SECTION_FOODTRAVEL_ID = '57dfe399ee85930e00cad4d6'

export const AUDIO_ID = '58ef372a7bce2b0e0048288c'

export const CAMPAIGN_ID = '5859e7e5c0ff6d0d00246263'

export const MARKETING_ID = '57fca2f5c9b7a70e004e6df9'

export const VIDEOHUB_ID = '5800999c9a51540d009e0447'

export const TOPIC_PROTEST_ID = '59151f0ff2179c0d0089b7d5'

export const TOPIC_WATCH_ID = '586cd15c3c1f950d00ce2e78'

export const SITE_DESCRIPTION = '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'

export const SITE_KEYWORDS = '鏡週刊,mirror media,新聞人物,娛樂焦點,美食旅遊,瑪法達'

export const SITE_OGIMAGE = 'https://www.mirrormedia.mg/public/notImage.png'

export const SITE_TITLE = '鏡週刊 Mirror Media'

export const SITE_URL = 'https://www.mirrormedia.mg'

export const SITE_DOMAIN = 'mirrormedia.mg'

export const FB_APP_ID = '175313259598308'

export const FB_PAGE_ID = '1855418728011324'
