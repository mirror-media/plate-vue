export const FILTER_WORDING = {
  FILTER_TITLE: '篩選條件',
  FILTER_GENDER: '性別',
  FILTER_PRICE: '價格',
  FILTER_BRAND: '品牌',
  FILTER_MATERIAL: '材質',
  FILTER_FUNCTION: '功能',
  FILTER_CORE: '機芯',
  FILTER_CLEAR: '全部清除'
}

export const WORDING = {
  SPEC: '詳細規格',
  TYPE: '手錶名稱',
  MATERIAL: '錶殼材質',
  SERIES: '系列名稱',
  FUNCTIONS: '搭載功能',
  WATERPROOF: '防水深度',
  MOVEMENT: '機芯型號',
  RELATED: '相關文章'
}

export const FILTER_OPTIONS_PRICE = [
  { name: 'NTD30,000以下', from: 0, to: 29999 },
  { name: 'NTD30,000 ~ NTD70,000', from: 30000, to: 69999 },
  { name: 'NTD70,000 ~ NTD150,000', from: 70000, to: 149999 },
  { name: 'NTD150,000 ~ NTD300,000', from: 150000, to: 299999 },
  { name: 'NTD300,000 ~ NTD500,000', from: 300000, to: 499999 },
  { name: 'NTD500,000 ~ NTD1,500,000', from: 500000, to: 1499999 },
  { name: 'NTD1,500,000 ~ NTD3,000,000', from: 1500000, to: 2999999 },
  { name: 'NTD3,000,000以上', from: 3000000 }
  // { name: '三萬元以下', from: 0, to: 29999 },
  // { name: '三萬元 ~ 七萬元', from: 30000, to: 69999 },
  // { name: '七萬元 ~ 十五萬元', from: 70000, to: 149999 },
  // { name: '十五萬元 ~ 三十萬元', from: 150000, to: 299999 },
  // { name: '三十萬元 ~ 五十萬元', from: 300000, to: 499999 },
  // { name: '五十萬元 ~ 一百五十萬元', from: 500000, to: 1499999 },
  // { name: '一百五十萬元 ~ 三百萬元', from: 1500000, to: 2999999 },
  // { name: '三百萬元以上', from: 3000000 }
]

export const FILTER_OPTIONS_GENDER = [
  { name: '男錶款' },
  { name: '女錶款' },
  { name: '中性錶款' }
]

export const FILTER_OPTIONS_MATERIAL = [
  { name: '不鏽鋼' },
  { name: '半金' },
  { name: '銅' },
  { name: '黃金' },
  { name: '玫瑰金' },
  { name: '白金' },
  { name: '鉑金' },
  { name: '鈦金屬' },
  { name: '特殊合金' },
  { name: '複合材質' }
]

export const FILTER_OPTIONS_CORE = [
  { name: '自動上鏈' },
  { name: '手動上鏈' },
  { name: '石英' },
  { name: '光動能' },
  { name: '人動電能' },
  { name: 'GPS' },
  { name: '電波' },
  { name: '智能錶' }
]

export const FILTER_MULTI = [
  'function'
]
