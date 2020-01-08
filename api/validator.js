const { get } = require('lodash')

// Validate email
function isValidEmail(s) {
  const re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(s)
}

// Validate phone (numbers and dash)
function isValidPhone(s) {
	const re = /^[\d-]+$/
  return re.test(s)
}

// Validate integer
function isValidPositiveInt(i) {
  return typeof i === 'number' && i !== NaN && i >= 0
}

const validateSubscribeParams = (req, res, next) => {
	const fields_required = ['items', 'pur_name', 'pur_cell', 'pur_mail', 'rec_name', 'rec_cell', 'rec_addr', 'delivery', 'prime_token', 'price_total', 'card_last_num']
	fields_required.forEach((attr) => {
		if (!get(req.body, attr)){
			return res.status(400).send('Field Required: ' + attr)
		}
	})

	const fields_email = ['pur_mail']
	fields_email.forEach((attr) => {
		const param = get(req.body, attr)
		if (param && !isValidEmail(param)){
			return res.status(400).send('Bad Field Format: ' + attr)
		}
	})

	const fields_phone = ['pur_phone', 'pur_cell', 'rec_phone', 'rec_cell']
	fields_phone.forEach((attr) => {
		const param = get(req.body, attr)
		if (param && !isValidPhone(param)){
			return res.status(400).send('Bad Field Format: ' + attr)
		}
	})

	if (!isValidPositiveInt(get(req.body, 'price_total'))){
		return res.status(400).send('Bad Field Format: price_total')
	}

	if (!Array.isArray(req.body.items)) {
		return res.status(400).send('Bad Field Format: items')
	}

	req.body.items.forEach((item) => {
		if (!get(item, 'name')) {
			return res.status(400).send('Field Required in items: name')
		}

		//Currently, we only allow 1 item other than tranportation fee
		const item_name = get(item, 'name')
		if (item_name !== '運費') {
			if (req.body.item_name != undefined) {
				return res.status(400).send('Bad Field: Only 1 item other than transportation fee is allowed in items field')
			} else {
				req.body.item_name = item_name
				req.body.item_amount = get(item, 'amount')
				req.body.item_price = get(item, 'price')
			}
		}

		const amount = get(item, 'amount')
		if (!amount) {
			return false, 'Field Required in items: amount'
		} else if (!isValidPositiveInt(amount)) {
			return res.status(400).send('Bad Field Format: amount')
		}

		const price = get(item, 'price')
		if (!price) {
			return res.status(400).send('Field Required in items: price')
		} else if (!isValidPositiveInt(price)) {
			return res.status(400).send('Bad Field Format: price')
		}
	})

	const carrier_type = get(req.body, 'carrier_type')
	if (carrier_type === undefined) {
		if (!get(req.body, 'carrier_title')) {
			return res.status(400).send('Field Required For Specified Carrier Type: carrier_title')
		}
		const ubn = get(req.body, 'carrier_ubn')
		if ( ubn && !/^\d{8}$/.test(ubn)) {
			return res.status(400).send('Bad Field Format: carrier_code')	
		}
	} else {
		const carrier_code = get(req.body, 'carrier_code')
		if (!carrier_code) {
			return res.status(400).send('Field Required For Specified Carrier Type: carrier_code')
		}

		switch (carrier_type) {
			case '0':
				if (!/^\/[A-Z0-9.+\-]{7}$/.test(carrier_code)) {
					return res.status(400).send('Bad Field Format: carrier_code')
				}
				break
			case '1':
				if (!/^[A-Z]{2}[0-9]{14}$/.test(carrier_code)) {
					return res.status(400).send('Bad Field Format: carrier_code')
				}
				break
			case '2':
				break
			default:
				return res.status(400).send('Bad Field Value: carrier_type')
		}
	}

	next()

}

module.exports = {
	validateSubscribeParams
}