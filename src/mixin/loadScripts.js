import {
  alexa,
  autoAdsAsyncSrc,
  autoAdsScript,
  dableScript,
  fb_sdk,
  gtm_mirrormedia,
  gtm_likr,
  scorecardresearch
} from '../constants/thirdPartyScripts'

const debug = require('debug')('CLIENT:loadScripts')

async function insertScript ({ async, codes, id, src, position }) {
  const script = document.createElement('script')
  async ? script.setAttribute('async', true) : ''
  id ? script.setAttribute('id', id) : ''
  src ? script.setAttribute('src', src) : ''
  codes ? script.innerHTML = codes : ''

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
      insertScript({ codes: gtm_mirrormedia }).then(() => insertScript({ codes: gtm_likr })),
      insertScript({ codes: fb_sdk }),
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
