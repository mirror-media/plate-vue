import verge from 'verge'
import { currentYPosition, elmYPosition, } from 'kc-scroll'
const debug = require('debug')('CLIENT:ADTRACKER')
export const adtracker = async ({ el, slot, position, isAdEmpty }) => {
  // debug('REGISTER ADTRACKER:', slot)
  let isEverInSight = false
  let handler = () => {
    if (isEverInSight) { return }
    const deviceHeight = verge.viewportH()
    const currPosBottom = currentYPosition() + deviceHeight
    const elTop = elmYPosition(`#${slot}`)
    const elHeight = el.clientHeight || 0
    const elBottom = elTop + elHeight
    if (elBottom <= currPosBottom) {
      debug(`##${position}# SEND TRACK TICKET.`, {
        slot,
      })
      isEverInSight = true
      window.removeEventListener('scroll', handler)
      handler = null

      window.ga && window.ga('send', 'event', 'ad', 'visible', slot, {
        location: document.location.href,
        nonInteraction: false
      })
    }
  }
  if (!isAdEmpty) {
    window.addEventListener('scroll', handler)
    handler()
  } else {
    debug(`##${position}# AD IS EMPTY.`)
  }
}