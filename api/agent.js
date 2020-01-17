const superagent = require('superagent')

const agent =
  superagent
    .agent()
    .use(req => {
      req.on('abort', () => {
        console.error('[superagent] encounter a abort event in plate-vue')
        console.error(`[superagent] request url is: ${req.url}`)
      })
    })

module.exports = agent
