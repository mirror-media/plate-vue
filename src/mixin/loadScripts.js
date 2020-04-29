import {
  alexa,
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

    const jobs = [
      insertScript({ codes: gtmMirrormedia }).then(() => insertScript({ codes: gtmLikr })),
      insertScript({ codes: fbSdk }),
      insertScript({ async: true, defer: true, src: 'https://connect.facebook.net/zh_TW/sdk.js' }),
      insertScript({ codes: scorecardresearch }).then(() => insertScript({ codes: alexa })),
      insertScript({ codes: dableScript, position: 'body' })
    ]

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
