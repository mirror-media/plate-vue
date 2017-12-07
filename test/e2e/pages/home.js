const { getRole } = require('../util')

module.exports = function (browser) {
  this.showHomeView = () => {
    return browser.assert.elementPresent('.home-view')
  }
  this.showMmTv = () => {
    return browser.getCookie('mmid', function callback(result) {
      const mmid = result.value
      const role = getRole({ mmid, distribution: [
        { id: 'A', weight: 50 },
        { id: 'B', weight: 50 } ]
      })
      if (role === 'A') {
        return this.assert.elementPresent('aside > .mmtv-aside')
      } else {
        return this
      }
    })
  }
}