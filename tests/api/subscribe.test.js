/**
 * @jest-environment node
 */

/*

'/api/mgzsubscribe' API endpoint parameters  (* is required)

[ 商品相關 ]
	* items (array of object): 商品
	  * name (string): 商品名稱（雜誌一年份X
	  * amount (positive int): 商品數量
	  * price (positive int): 商品單價
	- discount_code (string): 折扣碼（MR開頭）
[ 購買者相關 ]
	* pur_name (string): 購買者姓名
	* pur_cell (string): 購買者手機
	- pur_phone (string): 購買者電話
	- pur_addr (string): 購買者住址
	* pur_mail (string): 購買者電子信箱
[ 收貨相關 ]
	* rec_name (string): 收件者姓名
	* rec_cell (string): 收件者手機
	- rec_phone (string): 收件者電話
	* rec_addr (string): 收件者住址
	- rec_remark (string): 備註
	* delivery (string): 寄送方式
[ 付款相關 ]
	* prime_token (string): tappay prime token
	* price_total (positive int): 付款總額
[ 發票相關 ]
	- carrier_type (int or undefined): 載具種類，有 mail, 手機條碼與自然人憑證三種可以選
	- carrier_number (string): 視載具種類，為 email, 手機或自然人憑證號碼 (若 carrier_type !== undefined 則必須有此欄位)
	- carrier_title (string): 若載具種類為 undefined, 此欄位為三聯式發票抬頭 (若 carrier_type === undefined 則必須有此欄位)
	- carrier_ubn (string): 若載具種類為 undefined, 此欄位為三聯式發票統編

*/
const { create } = require('lodash')

process.env.NODE_ENV = 'test'

const request = require('supertest')
const express = require('express')

const app = express()
app.use('/api', require('../../api'))

const SAMPLE_BODY = {
	'items': [{
		'name': '訂閱品項',
		'amount': 2,
		'price': 1500
	},{
		'name': '運費',
		'amount': 1,
		'price': 1200
	}],
	'pur_name': 'buyer',
	'pur_cell': '0987-654321',
	'pur_mail': 'test@mail.com',
	'rec_name': 'receiver',
	'rec_cell': '0987-654321',
	'rec_addr': '住址測試字串',
	'delivery': '寄送方式字串',
	'prime_token': 'test_3a2fb2b7e892b914a03c95dd4dd5dc7970c908df67a49527c0a648b2bc9',
	'price_total': 4200,
	'card_last_num': '0000',
	'carrier_title': 'invoice_title'
}

test('Subscribe success', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.carrier_ubn = '00000000'
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(200)
})

test('Bad Argument: missing required fields', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	delete post_data.items
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Field Required: items")
})

test('Bad Argument: invalid mail', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.pur_mail = "invalid mail"
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field Format: pur_mail")
})

test('Bad Argument: invalid phone', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.pur_phone = "invalid phone"
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field Format: pur_phone")
})

test('Bad Argument: invalid price total', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.price_total = "invalid price"
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field Format: price_total")
})

test('Bad Argument: invalid items', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.items = "ivalid items"
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field Format: items")
})

test('Bad Argument: invalid item price', async () => {
	const post_data = JSON.parse(JSON.stringify(SAMPLE_BODY))
	post_data.items[0].price = "ivalid price"
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field Format: price")
})

test('Bad Argument: invoice without title ', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	delete post_data.carrier_title
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Field Required For Specified Carrier Type: carrier_title")
})

test('Bad Argument: carrier without carrier code', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.carrier_type = '0'
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Field Required For Specified Carrier Type: carrier_code")
})

test('Bad Argument: Invalid carrier_code when carrier_type = 0', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.carrier_type = '0'
	post_data.carrier_code = 'invalid code'
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  console.log(response.text)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field Format: carrier_code")
})

test('Bad Argument: Invalid carrier_code when carrier_type = 1', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.carrier_type = '1'
	post_data.carrier_code = 'invalid code'
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field Format: carrier_code")
})

test('Bad Argument: Invalid carrier_code when carrier_type = undefined', async () => {
	const post_data = Object.assign({}, SAMPLE_BODY)
	post_data.carrier_ubn = 'invalid ubn'
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field Format: carrier_code")
})

test('Bad Argument: invalid item price', async () => {
	const post_data = JSON.parse(JSON.stringify(SAMPLE_BODY))
	post_data.items.push({
		'name': '訂閱品項2',
		'amount': 1,
		'price': 10
	})
  const response = await request(app).post('/api/mgzsubscribe').send(post_data)
  expect(response.status).toBe(400)
  expect(response.text).toEqual("Bad Field: Only 1 item other than transportation fee is allowed in items field")
})
