import {
  alexa,
  autoAdsAsyncSrc,
  autoAdsScript,
  dableScript,
  fbSdk,
  gtmMirrormedia,
  gtmLikr,
  scorecardresearch
} from '../constants/thirdPartyScripts'

const debug = require('debug')('CLIENT:loadScripts')

async function insertScript ({ async, codes, defer, id, src, position }) {
  const script = document.createElement('script')
  async && script.setAttribute('async', true)
  defer && script.setAttribute('defer', true)
  id && script.setAttribute('id', id)
  src && script.setAttribute('src', src)
  if (codes) {
    script.innerHTML = codes
  }

  if (position && document[position]) {
    document[position].appendChild(script)
  } else {
    document.head.appendChild(script)
  }
}

export default {
  mounted () {
    let isScriptLoaded = false

    const isAppPage = location.pathname.match(/\/app\//g)
    const jobs = [
      insertScript({ codes: gtmMirrormedia }).then(() => insertScript({ codes: gtmLikr })),
      insertScript({ codes: fbSdk }),
      insertScript({ async: true, defer: true, src: 'https://connect.facebook.net/zh_TW/sdk.js' }),
      insertScript({ codes: scorecardresearch }).then(() => insertScript({ codes: alexa })),
      insertScript({ codes: dableScript, position: 'body' })
    ]

    if (isAppPage && !document.querySelector('#autoAdsAsyncSrc')) {
      jobs.push(insertScript({ async: true, id: 'autoAdsAsyncSrc', src: autoAdsAsyncSrc }))
      jobs.push(insertScript({ codes: autoAdsScript, id: 'autoAdsScript' }))
    }

    if (window && !isScriptLoaded) {
      window.addEventListener('load', () => {
        Promise.all(jobs)
          .then(() => {
            isScriptLoaded = true
            debug('scripts loaded')
          })
          .catch(err => {
            isScriptLoaded = false
            debug('scripts load error', err)
          })
      })
    }
  }
}
