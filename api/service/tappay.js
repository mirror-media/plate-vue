const { get, reduce } = require('lodash')
const { TAPPAY, API_TIMEOUT,  API_DEADLINE} = require('../config')
const superagent = require('../agent')

const payByPrime = async (req, res, next) => {

	// Member Pay with Prime Token
	const req_body = {
		partner_key: get(TAPPAY, 'PARTNERKEY'),
		merchant_id: get(TAPPAY, 'MERCHANTID'),
		currency: get(TAPPAY, 'CURRENCY', 'TWD'),
		prime: get(req.body, 'prime_token'),
		amount: get(req.body, 'price_total'),
		details: reduce(get(req.body, 'items'), (s, item) => s === "" ? item.name : [s, item.name].join(",") , ""),
		cardholder: {
			phone_number: get(req.body, 'pur_cell'),
			name: get(req.body, 'pur_name'),
			email: get(req.body, 'pur_mail'),
		},
		order_number: get(req.body, 'order_id'),
		bank_transaction_id: get(req.body, 'order_id') + 'T' + parseInt(Date.now()/1000)
	}

	let response = {}
	try {
		response = await superagent
	  .post(TAPPAY.PRIMEURL)
	  .send(req_body)
	  .set("x-api-key", TAPPAY.PARTNERKEY)
	  .set("Content-Type", "application/json")
	  .timeout(
	    {
	      response: API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
	      deadline: API_DEADLINE ? API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
	    }
	  )
	} catch (error){
		console.error(`[ERROR] POST to tappay api.`, `${error}`)
		return res.status(500).send("Error occured while request to tappay")
	}

	response = response.body
	if (response.status !== 0) {
		// delete private information before send to log
		if (response.card_info !== undefined){
			delete response.card_info.bin_code
			delete response.card_info.expiry_date
		}

		console.error(`[ERROR] Tappay payment.`, `${response}`)
	}

	req.body.tappay = {
		status: get(response, 'status'),
		message: get(response, 'msg'),
		bank_result_code: get(response, 'bank_result_code'),
		bank_result_msg: get(response, 'bank_result_msg'),
		rec_trade_id: get(response, 'rec_trade_id'),
		bank_transaction_id: get(response, 'bank_transaction_id'),
		card_issuer: get(response, ['card_info', 'bank_id']),
		card_last_four_digit: get(response, ['card_info', 'last_four']),
	}

	next()
}

module.exports = {
	payByPrime,
}