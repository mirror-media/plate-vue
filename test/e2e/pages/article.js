module.exports = function (browser) {
  this.showArticleContainer = () => {
    return browser.assert.elementPresent('.article-container')
  }
}