module.exports = function (browser) {
  this.showPageRoot = (url) => {
    /**
     * cookie A 320394c3-84bd-4eb6-ae59-62eb03919d55
     * cookie B 13f666fc-bfbd-46af-a15c-5cfadadfaa0d
     */
    // const cookie = '320394c3-84bd-4eb6-ae59-62eb03919d55'
    // const cookie = '13f666fc-bfbd-46af-a15c-5cfadadfaa0d'
    return browser
      .url(url)
      // .setCookie({
      //   name     : 'mmid',
      //   value    : cookie,
      //   path     : '/',
      //   domain   : 'localhost',
      //   secure   : false,
      //   httpOnly : false,
      //   // expiry   : 1395002765
      // })
      .waitForElementVisible('#app', 5000)
  }
}