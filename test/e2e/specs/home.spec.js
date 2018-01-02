module.exports = {
  before: function () {
    console.log('Start to e2e test home page...')
  },
  after: function () {
    console.log('Finished home e2e test.')
  },
  'Show basic page' : function (browser) {
    browser
      .page.basic().showPageRoot('http://localhost:8080/')
      .page.home().showHomeView()
      // .page.home().showMmTv()
      .end()
  }
};