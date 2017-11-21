import DfpCover from 'src/components/DfpCover.vue'
import Vue from 'vue'

describe('DfpCpver.vue', () => {
  it('DfpCpver should display close btns', () => {
    const Constructor = Vue.extend(DfpCover)
    const DfpCoverComponent = new Constructor().$mount()
    const btnClose = DfpCoverComponent.$el.querySelector('.ad-cover--wrapper_close')
    expect(btnClose.className).to.contain('ad-cover--wrapper_close')
  })
})
