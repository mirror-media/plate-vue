module.exports = function (browser) {
  this.showPageRoot = (url) => {
    return browser
      .url(url)
      .waitForElementVisible('#app', 5000)
  }
}