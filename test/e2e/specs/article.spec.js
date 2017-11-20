module.exports = {
  'Show basic page' : function (browser) {
    browser
      .page.basic().showPageRoot('http://localhost:8080/story/20171024fin015/')
      .page.article().showArticleContainer()
      .end()
  }
};