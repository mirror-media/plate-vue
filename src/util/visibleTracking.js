import { currentYPosition, elmYPosition } from 'kc-scroll'
import _ from 'lodash'

let TRACKING_TARGET

export function visibleTracking (trackingTargs) {
  const browser = typeof window !== 'undefined'
  if (browser) {
    TRACKING_TARGET = _.map(trackingTargs, (t) => (Object.assign({}, t)))
    window.removeEventListener('scroll', visitTargets)
    window.addEventListener('scroll', visitTargets)
  }
}

function visitTargets () {
  const currTopY = currentYPosition()
  const winHeight = document.documentElement.clientHeight || document.body.clientHeight
  _.map(TRACKING_TARGET, (o, i) => {
    if (!o.seenFlag) {
      isVisible(o.target, { top: currTopY, bottom: currTopY + ((winHeight * 2) / 3) }).then((isSeen) => {
        TRACKING_TARGET[i].seenFlag = isSeen
        if (isSeen) {
          window.ga && window.ga('send', 'event', 'article', 'visible', TRACKING_TARGET[i].desc, {
            location: document.location.href,
            nonInteraction: false
          })
        }
      })
    }
  })
}

function isVisible (targ, currY) {
  return new Promise((resolve) => {
    const targPoY = elmYPosition(targ, () => {
      return resolve(false)
    })
    if (targPoY >= currY.top && targPoY <= currY.bottom) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}
