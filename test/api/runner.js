process.env.NODE_ENV = 'testing'
var server = require('../../server.js')

server.ready.then(() => {
  var opts = process.argv.slice(2)

  var spawn = require('cross-spawn')
  var runner = spawn('mocha', opts, { stdio: 'inherit' })

  runner.on('exit', function (code) {
    server.close()
    process.exit(code)
  })

  runner.on('error', function (err) {
    server.close()
    throw err
  })
})