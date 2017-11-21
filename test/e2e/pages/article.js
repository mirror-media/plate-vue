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
    return browser.assert.elementPresent('div.article-heromedia')
  }
  this.showDivAriticle = () => {
    return browser.assert.elementPresent('div.article')
  }
  this.showDivArticleBody = () => {
    return browser
      .assert.elementPresent('div.article_body')
      .assert.elementPresent('div.article_basic-info')
      .assert.elementPresent('div.article_title')
      // .assert.elementPresent('div.article_subtitle')
      .assert.elementPresent('div.article_credit')
  }
  this.showDivAriticleMain = () => {
    return browser
      .assert.elementPresent('main.article_main')
      .assert.elementPresent('main.article_main > .brief')
      .assert.elementPresent('main.article_main > article.content')
      .assert.elementPresent('main.article_main > .article_main_related_bottom')
      .assert.elementPresent('main.article_main > .article_main_tags')
  }
}