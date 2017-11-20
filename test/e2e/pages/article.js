module.exports = function (browser) {
  this.showArticleContainer = () => {
    return browser.assert.elementPresent('.article-container')
  }
  this.showDFPAdPoses = () => {
    return browser
      .assert.elementPresent('.ad-container[pos="PCHD"]')
      .assert.elementPresent('.ad-container[pos="MBHD"]')
      .assert.elementPresent('.ad-container[pos="PCFT"]')
      .assert.elementPresent('.ad-container[pos="MBFT"]')
  }
  this.showHeroMedia = () => {
    return browser
      .assert.elementPresent('div.article-heromedia')
  }
  this.showDivAriticle = () => {
    return browser
      .assert.elementPresent('div.article')
  }
}