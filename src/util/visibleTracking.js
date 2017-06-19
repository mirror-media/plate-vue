import { currentYPosition, elmYPosition } from 'kc-scroll'
import _ from 'lodash'

let TRCKING_TARGET

export function visibleTracking (trackingTargs) {
  const browser = typeof window !== 'undefined'
  if (browser) {
    TRCKING_TARGET = trackingTargs
    window.removeEventListener('scoll', visitTargets)
    window.addEventListener('scroll', visitTargets)
  }
}

function visitTargets () {
  const currTopY = currentYPosition()
  const winHeight = document.documentElement.clientHeight || document.body.clientHeight
  _.map(TRCKING_TARGET, (o, i) => {
    if (!o.seenFlag) {
      isVisible(o.target, { top: currTopY, bottom: currTopY + (winHeight / 2) }).then((isSeen) => {
        TRCKING_TARGET[i].seenFlag = isSeen
        if (isSeen) {
          window.ga && window.ga('send', 'event', 'article', 'visible', TRCKING_TARGET.desc)
        }
      })
    }
  })
}

function isVisible (targ, currY) {
  return new Promise((resolve) => {
    const targPoY = elmYPosition(targ)
    if (targPoY >= currY.top && targPoY <= currY.bottom) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}
