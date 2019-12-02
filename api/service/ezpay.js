const { get, map, reduce, } = require('lodash')
const { API_TIMEOUT, EZPAY, } = require('../config')
const superagent = require('../agent')
const CryptoJS = require('crypto-js')
const moment = require('moment')
const rawurlencode = require('locutus/php/url/rawurlencode')
const truncate = require('html-truncate')

const CARRIER_TYPE = { PHONE: '0', NATURAL: '1', EXPAY: '2', }

const issueInvoice = async (req, res, next) => {
	const data = req.body
	const total_price = reduce(get(data, 'items'), (i, item) => i + (get(item, 'price') * get(item, 'amount')), 0)
	const payload = {
    RespondType: 'JSON',
    Version: get(EZPAY, 'VERSION', '1.4'),
    TimeStamp: Math.round(Date.now() / 1000),
    MerchantOrderNo: get(data, 'order_id'),
    Status: get(EZPAY, 'TYPE', '1'),
    Category: get(data, 'carrier_type') === undefined ? 'B2B' : 'B2C',
    CarrierType: get(data, 'carrier_type'),
    BuyerName: get(data, 'pur_name'),
    BuyerEmail: get(data, 'pur_mail', '-'),
    PrintFlag: get(data, 'printFlag', 'Y'),
    ItemName: map(get(data, 'items'), item => get(item, 'name', '')).join('|'),
    ItemCount: map(get(data, 'items'), item => get(item, 'amount', '')).join('|'),
    ItemUnit: map(get(data, 'items'), item => get(EZPAY, 'UNIT')).join('|'),
    ItemPrice: map(get(data, 'items'), item => get(item, 'price', '')).join('|'),
    ItemAmt: map(get(data, 'items'), item => get(item, 'price') * get(item, 'amount')).join('|'),
    TaxType: get(EZPAY, 'TAX_TYPE', '3'), //Only handle tex-free option for now
    TaxRate: 0,
    TaxAmt: 0,
    Amt: total_price,
    TotalAmt: total_price,
  }
  let message = `Paid by credit card: ****-****-****-${get(data, ['tappay', 'card_last_four_digit'], '')}.`

  if (payload.Status === '3') {
    payload.CreateStatusTime = moment(Date.now() + get(EZPAY, 'SCHEDULE', 60 * 1000)).format('YYYY-MM-DD')
  }

  if (payload.Category === 'B2B') {
    
    payload.PrintFlag = 'Y'
    payload.BuyerName = get(data, 'carrier_title', '-')
    payload.BuyerAddress = get(data, 'pur_addr', '-')
    if (get(data, 'carrier_ubn')) {
    	payload.BuyerUBN = get(data, 'carrier_ubn')
    }
    delete payload.CarrierType
  
  } else if (payload.Category === 'B2C') {

    if (get(data, 'loveCode') && /^[0-9]{3,7}$/.test(get(data, 'loveCode', ''))) {
      
      payload.LoveCode = get(data, 'loveCode')
      payload.PrintFlag = 'Y'
      delete payload.CarrierType

    }else{
			
			switch (payload.CarrierType) {
        case '0':
        case '1':
        	payload.CarrierNum = get(data, 'carrier_code').trim()
          break
        case '2':
          payload.CarrierNum = get(data, 'carrier_code').trim()
          payload.BuyerEmail = get(data, 'carrier_code').trim()
          break
        default:
          delete payload.CarrierType
          payload.PrintFlag = 'Y'
      }
    }
  }
  payload.Comment = truncate(message, 68)


  const KEY = get(EZPAY, 'KEY', '')
  const IV = get(EZPAY, 'IV', '')

  const payload_string = map(payload, (item, key) => `${key}=${rawurlencode(item)}`).join('&')
  const encrypted = CryptoJS.AES.encrypt(payload_string, CryptoJS.enc.Utf8.parse(KEY), {
    iv: CryptoJS.enc.Utf8.parse(IV), 
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const ciphertext = encrypted.toString(CryptoJS.format.Hex)

  const bytes = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(ciphertext) }, CryptoJS.enc.Utf8.parse(KEY), {
    iv: CryptoJS.enc.Utf8.parse(IV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,    
  })
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8)

  let response = {}
  try {
  	response = await superagent
	  .post(get(EZPAY, 'HOST', ''))
	  .type('form')
	  .send({
	    MerchantID_: get(EZPAY, 'ID', ''),
	    PostData_: ciphertext,
	  })
	  .timeout(API_TIMEOUT)
  } catch (error) {
		console.log(error)
  }

  const result = JSON.parse(response.text)
  req.body.invoice = result
  next()
}

module.exports = {
	issueInvoice,
}
