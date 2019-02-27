import verge from 'verge'
import { currentYPosition, elmYPosition, } from 'kc-scroll'
import { isEleFixed } from 'src/util/comm'
const debug = require('debug')('CLIENT:ADTRACKER')
export const adtracker = async ({ el, slot, position, isAdEmpty }) => {
  // debug('REGISTER ADTRACKER:', slot)
  let isEverInSight = false
  let isEverViewed = false
  let handler = () => {
    if (isEverViewed) { return }
    const isPositionFixed = isEleFixed(el)
    const deviceHeight = verge.viewportH()
    const currPosTop = currentYPosition()
    const currPosBottom = !isPositionFixed ? currPosTop + deviceHeight : deviceHeight
    const elTop = elmYPosition(`#${slot}`)
    const elHeight = el.clientHeight || 0
    const elMid = elTop + elHeight / 2
    if (elMid >= currPosTop && elMid <= currPosBottom) {
      isEverInSight = true
      setTimeout(() => {
        if (isEverViewed) { return }
        if (isEverInSight) {
          isEverViewed = true
          window.removeEventListener('scroll', handler)
          handler = null
          window.ga && window.ga('send', 'event', 'ad', 'visible', slot, {
              location: document.location.href,
              nonInteraction: false
            })
          debug(`##${position}# SEND TRACK TICKET.`, {
            slot,
          })
        }
      }, 1000)
      
    } else {
      isEverInSight = false
    }
  }
  if (!isAdEmpty) {
    window.addEventListener('scroll', handler)
    handler()
  } else {
    debug(`##${position}# AD IS EMPTY.`)
  }
}