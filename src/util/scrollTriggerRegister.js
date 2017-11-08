import { currentYPosition, elmYPosition } from 'kc-scroll'
import verge from 'verge'

export class ScrollTriggerRegister {
  constructor (triggerSet = []) {
    this.triggerSet = triggerSet.map((t) => (Object.assign({}, t)))
    this.broswer = typeof window !== 'undefined'
    this._init = this._init.bind(this)
    this.init = this.init.bind(this)
    this._destroy = this._destroy.bind(this)
    this.register = this.register.bind(this)
    this.shouldBeTrigger = this.shouldBeTrigger.bind(this)
  }
  init () {
    Promise.all([
      this._destroy().then(() => this._init())
    ])
  }
  _init () {
    return new Promise((resolve) => {
      window.addEventListener('scroll', this.register)
      resolve()
    })
  }
  _destroy () {
    return new Promise((resolve) => {
      window.removeEventListener('scroll', this.register)
      resolve()
    })
  }
  register () {
    const currTopY = currentYPosition()
    const winHeight = verge.viewportH()
    this.triggerSet.map((o, i) => {
      if (!o.isTriggered) {
        this.shouldBeTrigger(o.target, currTopY + winHeight, o.offset).then((shouldBeTrigger) => {
          this.triggerSet[i].isTriggered = shouldBeTrigger
          if (shouldBeTrigger) {
            o.cb && o.cb()
          }
        })
      }
    })
  }
  shouldBeTrigger (targ, currBtmY, offset) {
    return new Promise((resolve) => {
      const targPosY = elmYPosition(targ, () => {
        return resolve(false)
      })
      if (targPosY <= currBtmY + offset) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }
}
