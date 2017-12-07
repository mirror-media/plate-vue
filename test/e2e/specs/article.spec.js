module.exports = {
  before: function () {
    console.log('Start to e2e test article page...')
  },
  after: function () {
    console.log('Finished article e2e test.')
  },
  'Show basic page' : function (browser) {
    browser
      .page.basic().showPageRoot('http://localhost:8080/story/20171024fin015/')
      .page.article().showArticleContainer()
      .page.article().showDFPAdPoses()
      .page.article().showHeroMedia()
      .page.article().showDivAriticle()
      .page.article().showDivArticleBody()
      .page.article().showDivAriticleMain()
      .page.article().showRecommendList()
      .end()
  }
}