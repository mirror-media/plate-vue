const { get, isString } = require('lodash')

export const isValidJSONString = str => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const handlerError = (err, res) => {
  const text = get(res, 'text') || get(err, 'message', '{}')
  return {
    status: (typeof(get(res, 'status')) === 'number' && get(res, 'status')) || get(err, 'status') || 500,
    text: !isValidJSONString(text)
      ? isString(text)
      ? `{message:${text}}`
      : `{}`
      : text
  }
}